public class TaskReassignEmailHelper {
    public static void sendTaskAssignmentNotification(List<Task> newTasks) {
        
        for (Task task : newTasks) {
            set<Id> pid = New set<Id>();
            Profile ptProfile = [SELECT Id, Name from profile where Name ='OREL Sales Admin'];
            pid.add(ptProfile.Id);
            List<User> users = [SELECT Id, Username, Email, ProfileId FROM User WHERE ProfileId =:pid];
            for (User user : users) {
                // Check if the task has been assigned and if it's not null
                if (task.OwnerId == user.Id  ) {
                    List<Opportunity> oppo = [SELECT Id, Name FROM Opportunity WHERE Id = :task.WhatId];
                    CustomNotificationType CNotiId = [SELECT Id,DeveloperName FROM CustomNotificationType where DeveloperName ='task_creation_notification' limit 1];
                    for (Opportunity op : oppo) {
                        // Create a custom notification for the assigned user
                        Messaging.CustomNotification notification = new Messaging.CustomNotification();
                        notification.setNotificationTypeId(CNotiId.Id);
                        notification.setBody('Opportunity:  ' + op.Name + '   Subject: ' + task.Subject + '   Priority: ' + task.Priority);
                        notification.setTitle('You have been Reassigned a task');
                        notification.setTargetId(task.Id);
                        notification.setSenderId(UserInfo.getUserId());
                        Set<String> recipientIds = new Set<String>{task.OwnerId};
                            notification.send(recipientIds);
                        
                        
                        List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage>();
                        String retailstoreURL = 'https://business-customization-1646--orelqa.sandbox.lightning.force.com/lightning/r/Task/'+ task.Id+'/view';
                        
                        String body = 'Dear Sales Team, \nI hope this message finds you well. \nA task has reassigned to you by Project Team with following details:\n\nOpportunity: ' + op.Name + '\nSubject: ' + task.Subject + '\nPriority: ' + task.Priority +
                            '\n please review the opportunity as designs are added and share it with customer.' +
                            '\n Your prompt attention to this matter is highly appreciated.'+
                            '\nFor more details, click the following link:\n\n' + retailstoreURL+
                            '\n Feel free to reach out if you have any questions or need further clarification.'+
                            '\n\nThanks & Regards \n'+
                            'OREL';
                        
                        // You can use either Template ID or Developer Name, but make sure it's valid
                        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                        message.setToAddresses(new String[]{user.Email});
                        message.setTargetObjectId(task.Owner.Id);
                        message.setSaveAsActivity(false);
                        message.setSubject('You have been Reassigned a task');
                        message.setPlainTextBody(body);
                        messages.add(message);
                        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
                    }
                }
            }
        }
    }
    public static void taskReassignmentNotificationtoPT(List<Task> newTasks) {
        Set<Id> pid = new Set<Id>();
        Set<Id> oppoIds = new Set<Id>();
        Profile ptProfile = [SELECT Id, Name FROM Profile WHERE Name = 'Project Team Profile' LIMIT 1];
        pid.add(ptProfile.Id);
        
        CustomNotificationType CNotiId = [SELECT Id, DeveloperName FROM CustomNotificationType WHERE DeveloperName = 'task_creation_notification' LIMIT 1];
        
        List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage>();
        
        for (Task task : newTasks) {
            // Check for null values
            if (task.Owner != null && task.Owner.Id != null) {
                List<Opportunity> oppo = [SELECT Id, Name, Design_Status__c FROM Opportunity WHERE Id = :task.WhatId];
                
                for (Opportunity op : oppo) {
                    if (op.Design_Status__c == 'Drawings Rejected' && task.OwnerId == task.Owner.Id) {
                        // Create a custom notification for the assigned user
                        Messaging.CustomNotification notification = new Messaging.CustomNotification();
                        notification.setNotificationTypeId(CNotiId.Id);
                        notification.setBody('Opportunity:  ' + op.Name + '   Subject: ' + task.Subject + '   Priority: ' + task.Priority);
                        notification.setTitle('You have been Reassigned a task');
                        notification.setTargetId(task.Id);
                        notification.setSenderId(UserInfo.getUserId());
                        Set<String> recipientIds = new Set<String>{task.OwnerId};
                            notification.send(recipientIds);
                        
                        String retailstoreURL = 'https://business-customization-1646--orelqa.sandbox.lightning.force.com/lightning/r/Task/'+ task.Id+'/view';
                        
                        // Email body
                        String body = 'Dear Project Team, ...\n' +
                            '...\n' +
                            'Thanks & Regards \n' +
                            'OREL';
                        
                        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                        message.setToAddresses(new String[]{task.Owner.Email});
                        message.setSubject('You have been Reassigned a task');
                        message.setPlainTextBody(body);
                        messages.add(message);
                    }
                }
            }
        }
        
        // Send emails outside the loop
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
    }
    
}