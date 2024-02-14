global class CustomerDrawingResponseActivity implements Messaging.InboundEmailHandler {
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        try {
            System.debug('Test of class');
            List<Contact> contacts = new List<Contact>();

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
            String taskSubject = email.subject;
            //String quoteNumber = taskSubject.substring(taskSubject.indexOf('Request:'),taskSubject.length());
            String oppNumber = taskSubject.substringAfter('Opportunity:');
            oppNumber = oppNumber.trim();
            System.debug('oppNumber op:' +oppNumber);
            System.debug('htmlBody: ' + htmlBody);

            if (htmlBody.contains('Drawings Good')) {
                // Update the associated Quote record's status to "Drawings Good"
                Opportunity opp1 = [SELECT Id, name, Design_Status__c from Opportunity WHERE Orl_Opportunity_Number__c = :oppNumber LIMIT 1];
                if (opp1!=null) {
                    opp1.Design_Status__c = 'Drawings Good';
                    update opp1;
                }
                System.debug('opportunity op:' +opp1);
            } else if (htmlBody.contains('Drawings Rejected')) {
                // Update the associated Quote record's status to "Drawings Rejected"
                Opportunity opp = [SELECT Id, name, Design_Status__c from Opportunity WHERE Orl_Opportunity_Number__c = :oppNumber LIMIT 1];
                if (opp!=null) {
                    opp.Design_Status__c = 'Drawings Rejected';
                    update opp;
                }
                System.debug('opp line:' +opp);
            }
            System.debug('html body op: '+htmlBody);



        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage());
            System.debug('Line Number: ' + e.getLineNumber());
        }
        return null;
    }
}