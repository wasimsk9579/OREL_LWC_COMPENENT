public class TaskCreationNotificationHelper {
        public static void sendTaskCreationNotification(List<Task> newTask) {
    
            for (Task task : newTask) {
                String ptProfile = [SELECT Id, name from profile where name ='Project Team Profile'].Id;
                  user us = [SELECT Id, Username, ProfileId, profile.Name FROM User where ProfileId  =:ptProfile];
                if(task.OwnerId==us.Id)
                {
                    list<Opportunity> oppo =[Select Id,Name from Opportunity Where Id=:Task.WhatId];
                   CustomNotificationType CNotiId = [SELECT Id,DeveloperName FROM CustomNotificationType where DeveloperName ='task_creation_notification' limit 1];
                    for(Opportunity op :oppo)
                     {
                         
                    Messaging.CustomNotification notification = new Messaging.CustomNotification(); 
                    notification.setNotificationTypeId(CNotiId.Id); 
                    notification.setBody('Opportunity Name: '+ op.Name+ ' ,  Task Subject : '+ task.Subject); 
                    notification.setTitle('A task has been assigned to you'); 
                    notification.setTargetId(task.Id);
                    notification.setSenderId(UserInfo.getUserId());
                    Set<String> recipientIds = new Set<String>{task.OwnerId};
                  //  notification.setRecipientIds(recipientIds);
                    notification.send(recipientIds);
                } 
                }

        }
    }
}