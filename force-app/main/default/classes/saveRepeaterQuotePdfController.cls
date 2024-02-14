public class saveRepeaterQuotePdfController {
    
    
    private ApexPages.StandardController stdController;
    public String qutName {get; set;}
    @TestVisible private Id quoteId;
    public string  QuoId;
    public String MstrId {get; set;}
    public String PDFNo {get; set;}
    public blob b {get; set;}
    public Quote quote1 {get; set;} 
    public Boolean showSuccessMessage {get; set;}
    
    public saveRepeaterQuotePdfController(ApexPages.StandardController controller) {
        MstrId = controller.getId();     
        system.debug('mstr id = ' +MstrId);
        Quote qt = [SELECT Id, Name, email FROM Quote WHERE Id = :MstrId];
        system.debug(' quote  = ' +qt);
        qutName = qt.Name;
        quote1 = qt; 
        System.debug('All info = '+quote1);
        QuoId = qt.Id;
        system.debug('quote id = ' +QuoId);
    }
    
    public PageReference pdfAction() {   
        
        
        PageReference pdfPage = new PageReference('/apex/repeaterQuotePDF?id=' + QuoId);
        if(Test.isRunningTest() == false){
            b = pdfPage.getContent();
            System.debug('bo: ' +b); 
        } else {
            b = Blob.valueOf('Test PDF Content');
        }
        
        // Check existing attachments for the quote
        Integer versionNumber = [SELECT count() FROM Attachment WHERE ParentId = :QuoId];
        
        // Increment the version number for the new attachment
        versionNumber++;
        
        // Create the attachment name with the incremented version number
        String attachmentName = 'Quote_V' + versionNumber;
        
        
        System.debug('body: ' +b);       
        
        Attachment attachment = new Attachment();
        attachment.Body = b;
        attachment.Name = attachmentName; 
        attachment.ContentType = 'application/pdf';
        attachment.ParentId = QuoId;
        insert attachment;
        System.debug('Attachment inserted: ' + attachment.body);
        
        Quote quote1 = [SELECT Id, Name, email,OpportunityId,  QuoteNumber FROM Quote WHERE Id = :MstrId];
        
        Id oppId = quote1.OpportunityId;
        Opportunity opp = [SELECT Id, Name, AccountId from opportunity where id=: oppId];
        
        Id accId =opp.AccountId;
        Account accList = [SELECT Id, Name, (SELECT Id, Email FROM Contacts) FROM Account WHERE Id = :accId];
        
        List<String> toAddresses = new List<String>();
        
        if (accList.Contacts != null && !accList.Contacts.isEmpty()) {
            for (Contact con : accList.Contacts) {
                if (con.Email != null) {
                    toAddresses.add(con.Email);
                }
            }
        }
        
        //String emailAddr = quote1.Email;
        
        
        Messaging.SingleEmailMessage semail = new Messaging.SingleEmailMessage();
        //String emailAdd = quote1.Email;
        
        semail.setTargetObjectId(UserInfo.getUserId());
        semail.setwhatId(quote1.id);
        semail.setSaveAsActivity(false);
        semail.setUseSignature(false);
        semail.setToAddresses(toAddresses);
        semail.setCcAddresses(new String[]{'emailquotestatus@9-2yqi23dyxk0ktpbdngpm2ibckdlvcvtk2efcjm860b86u8amyd.1m-mtieae.cs117.apex.sandbox.salesforce.com'});
        
        //	String[] sendingTocAdd = new String[]{'EmailService unique code'};
        //	semail.setCcAddresses(sendingTocAdd);
        semail.setSubject('Quote Approval Request: '+quote1.QuoteNumber);
      semail.setHTMLBody('Dear Customer,<br>This is to inform you that a new Quote ' + quote1.QuoteNumber + ' has been created, as per your requirement.<br> Please verify the Quote and respond accordingly.<br>Thanks,<br>Sales Team.');
        
        List<Messaging.SingleEmailMessage> allmsg = new List<Messaging.SingleEmailMessage>();
        allmsg.add(semail);
        
        Messaging.EmailFileAttachment attachmentFile = new Messaging.EmailFileAttachment();
        attachmentFile.setFileName(+quote1.Name  + '.pdf');
        attachmentFile.setBody(b);
        attachmentFile.setContentType('application/pdf');
        semail.setFileAttachments(new List<Messaging.EmailFileAttachment>{attachmentFile});
        
        //      // Send the email message
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{semail});
        
               
PageReference recordPage = new ApexPages.StandardController(quote1).view();
    recordPage.setRedirect(true);

    return recordPage;
    }
    
    public PageReference cancel() {
        PageReference pdf = new PageReference('/' + MstrId);
        pdf.setRedirect(true);
        return pdf;
    }
}