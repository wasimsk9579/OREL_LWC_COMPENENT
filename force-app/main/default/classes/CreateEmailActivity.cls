global class CreateEmailActivity implements Messaging.InboundEmailHandler {
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        try {
            System.debug('Test of class');
            List<Contact> contacts = new List<Contact>();
            //List<Quote> quotes = new List<Quote>();
            List<Attachment> attachments = new List<Attachment>();
            List<Messaging.EmailFileAttachment> attachmentList = new List<Messaging.EmailFileAttachment>();
            List<String> toEmailAddresses = new List<String>();
            List<String> ccEmailAddresses = new List<String>();
            System.debug('email' + email);
            Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
            String senderName = email.fromname;
            String fromEmailAddress = email.fromAddress;
            toEmailAddresses = email.toAddresses;
            ccEmailAddresses = email.ccAddresses;
            System.debug('fromEmailAddress>>>>' + fromEmailAddress);
            Messaging.InboundEmail.BinaryAttachment[] binaryAttachments = email.binaryAttachments;
            String htmlBody = email.htmlBody;
            String plainTextBody = stripHtmlTags(htmlBody); 
            String taskSubject = email.subject;
            //String quoteNumber = taskSubject.substring(taskSubject.indexOf('Request:'),taskSubject.length());
            String quoteNumber = taskSubject.substringAfter('Request:');
            quoteNumber = quoteNumber.trim();
            System.debug('quoteNumber op:' +quoteNumber);
            System.debug('htmlBody: ' + htmlBody);
            
            if (!String.isBlank(plainTextBody)) {
                // Assuming that the Quote record exists with the given QuoteNumber
                Quote quo = [SELECT Id, Name, QuoteNumber, Customer_Response__c FROM Quote WHERE QuoteNumber = :quoteNumber LIMIT 1];
                
                if (quo != null) {
                    quo.Customer_Response__c = plainTextBody;
                    
                    System.debug('Updated Customer_Response__c: ' + quo.Customer_Response__c);
                    
                    if (htmlBody.contains('Accepted')) {
                        // Update the associated Quote record's status to "Accepted"
                        quo.Status = 'Accepted';
                        update quo;
                    }
                    else if (htmlBody.contains('Denied')) {
                        quo.Status = 'Denied';
                        update quo;
                    } 
                }
            }
       
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage());
            System.debug('Line Number: ' + e.getLineNumber());
        }
        return null;
    }
    
    private String stripHtmlTags(String input) {
        return input.replaceAll('<[^>]*>', '');
    }
}