@TestVisible
global class createEmailInbound implements Messaging.InboundEmailHandler {
    @TestVisible
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
        String inputString = email.subject;
        String reser = email.plainTextBody;
        String sub = inputString.substringAfter('Number');
        String sub2 = sub.substringBefore('has');
        sub2 = sub2.trim();
        String r1 = reser.substringAfter('is');
        String r2 = r1.substringBefore('Please');
        r2 = r2.trim();
        r2 = r2.replace('\n\n', '');
        
        Quote qc = [SELECT Id FROM Quote WHERE Id = :sub2];
        Quote qc1 = [SELECT Id, Status FROM Quote WHERE Id = :sub2];
        
        // Check if the Quote records were found
        if (qc != null && qc1 != null) {
            qc.Status = 'denied';
            qc1.Status = r2;
            
            // Update the Quote records
            update qc;
            update qc1;
            
            result.success = true;
        } else {
            // Handle the case where Quote records were not found
            result.success = false;
            result.message = 'Quote not found for ID: ' + sub2;
        }
        
        System.debug(result);
        return result;
    }
}