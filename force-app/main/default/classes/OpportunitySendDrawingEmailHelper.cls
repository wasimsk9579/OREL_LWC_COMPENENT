public class OpportunitySendDrawingEmailHelper {
    @AuraEnabled
    public static void sendDrawingsEmail(Id opportunitiesId) {
        System.debug('opportunitiesId-->' + opportunitiesId);
        List<Opportunity> opplist = [SELECT Id, Name, Orl_Opportunity_Number__c, Account.Name, AccountId, ContactId, 
                                     (SELECT Id, Name FROM Quotes), 
                                     (SELECT ContentDocumentId, ContentDocument.Title FROM ContentDocumentLinks) 
                                     FROM Opportunity WHERE Id = :opportunitiesId];
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        
        for (Opportunity opp : opplist) {
            System.debug('Opportunity Id: ' + opp.Id);
            
            Account accList = [SELECT Id, Name, (SELECT Id, Email FROM Contacts) FROM Account WHERE Id = :opp.AccountId];
            
            List<String> toAddresses = new List<String>();
            
            if (accList.Contacts != null && !accList.Contacts.isEmpty()) {
                for (Contact con : accList.Contacts) {
                    if (con.Email != null) {
                        toAddresses.add(con.Email);
                    }
                }
            }
            
            if (!toAddresses.isEmpty()) {
                String emailBody = 'Dear ' + opp.Account.Name + ',<br>';
                emailBody += '<br>';
                emailBody += 'I trust this message finds you well.<br>';
                emailBody += '<br>';
                emailBody += 'We are pleased to inform you that the drawing designs for Opportunity #' + opp.Orl_Opportunity_Number__c + ' are now available for your review. Attached to this email, you will find a comprehensive representation of the envisioned opportunity.<br>';
                emailBody += '<br>';
                emailBody += 'Your prompt attention to this matter is greatly appreciated. Should you have any feedback or require further clarification, please do not hesitate to respond to this email at your earliest convenience.<br>';
                emailBody += '<br>';
                emailBody += 'Thank you for your continued partnership.<br>';
                emailBody += '<br>';
                emailBody += 'Best Regards,<br>';
                emailBody += 'Sales Team';
                
                if (!opp.ContentDocumentLinks.isEmpty()) {
                    emailBody += '<br>';
                    emailBody += 'Attachments:<br>';
                    for (ContentDocumentLink docLink : opp.ContentDocumentLinks) {
                        
                        ContentVersion content = [SELECT VersionData FROM ContentVersion WHERE ContentDocumentId = :docLink.ContentDocumentId LIMIT 1];
                        
                        Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
                        attachment.setFileName(docLink.ContentDocument.Title);
                        attachment.setBody(content.VersionData);
                        email.setFileAttachments(new Messaging.EmailFileAttachment[]{attachment});
                    }
                }
                
                // Set email properties
                email.setToAddresses(new List<String>(toAddresses));
                List<String> ccAddresses = new List<String>{'senddrawingstocustomer@2a114n07iib5rtq7eugolh0349z632t9ccgwenn0kisupegdxp.1m-mtieae.cs117.apex.sandbox.salesforce.com'};
                    email.setCcAddresses(ccAddresses);
                email.setSubject('Drawings for Opportunity: ' + opp.Orl_Opportunity_Number__c);
                email.setHtmlBody(emailBody);
                
                // Send email using the Messaging.SingleEmailMessage class
                Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
            } else {
                System.debug('No valid recipients found for Opportunity: ' + opp.Name);
            }
        }
    }
    
    
}