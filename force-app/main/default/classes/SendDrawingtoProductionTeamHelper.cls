public class SendDrawingtoProductionTeamHelper {
    
    public static void updateStatus(List<Task> taskdata) {
        List<Opportunity> optoUpdate = new List<Opportunity>();
        Set<Id> whatIds = new Set<Id>();
        
        for (Task tsk : [SELECT Id, Status, WhatId FROM Task WHERE Id IN :taskdata AND Status = 'Completed']) {
            whatIds.add(tsk.WhatId);
            System.debug('opp id ===> ' + tsk.WhatId);
        
        
        for (Opportunity opp : [SELECT Id, Name, (SELECT id from tasks),
                                (SELECT Id, Name FROM Quotes), 
                                Account.Name, 
                                AccountId, 
                                ContactId, Task_Close__c,
                                (SELECT ContentDocumentId, ContentDocument.Title FROM ContentDocumentLinks) 
                                FROM Opportunity WHERE Id IN :whatIds AND Task_Close__c = false]) {
                                    
                                    System.debug('opp query data ===> ' + opp);
                                    opp.Task_Close__c = true;
                                    optoUpdate.add(opp);
                                    System.debug('optoUpdate data ===> ' + optoUpdate);

        
        if (!optoUpdate.isEmpty()) {
            update optoUpdate;
        }

            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            email.setToAddresses(new List<String>{'pratikshaagresfdc@gmail.com'});
          
            String emailBody = 'Dear Production Team,\n'+
                	'I trust this message finds you well.\n'+
                'The mentioned opportunity ' +opp.Name+ ' has been closed.\n '+
                'Attached are drawings detailing the product implementation. Kindly review and proceed accordingly.\n'+
                '\n Thank you for your continued dedication.\n'+
                
                '\n Best regards,'+
                '\n Sales Team'+
                '\n OREL';

                            
            
            // Include ContentDocument details
            if (!opp.ContentDocumentLinks.isEmpty()) {
                emailBody += 'Attachments:<br>';
                for (ContentDocumentLink docLink : opp.ContentDocumentLinks) {
                    // Retrieve the file content
                    ContentVersion content = [SELECT VersionData FROM ContentVersion WHERE ContentDocumentId = :docLink.ContentDocumentId LIMIT 1];
                    
                    // Attach the file to the email
                    Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
                     
                    attachment.setFileName(docLink.ContentDocument.Title);
                    attachment.setBody(content.VersionData);
                    email.setFileAttachments(new Messaging.EmailFileAttachment[]{attachment});
                }
            }
            
            // Set email properties
            email.setSubject('Drawings for Opportunity: ' + opp.Name);
            email.setHtmlBody(emailBody);
            
            // Send email using the Messaging.SingleEmailMessage class
            Messaging.sendEmail(new Messaging.SingleEmailMessage[]{email});
        }
        }
    }
}