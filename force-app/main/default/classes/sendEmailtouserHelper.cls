public class sendEmailtouserHelper {
    /*public static void sendNotificationtoUser(List<Id> OppourtinityIds){
        List<Id> notificationTargets = new List<notificationTargets>();
        notificationTargets.addAll([SELECT id, username from user where username = 'project.head@cloud.com']);
        notificationTargets.addAll([SELECT is, username from user where username = 'project.team@cloud.com']);
        
        List<Id> customNotificationIds = new List<customNotificationIds>();
        for (Id targetId : notificationTargets) {
            CustomNotification notification = new CustomNotification();
            notification.Id = '0ML1m00000008AqGAI';
            notification.TargetId = targetId;
            notification.Title = 'Opportunity Closed Won';
            notification.Body = 'An opportunity has been closed won.';
            customNotificationIds.add(Database.insert(notification));
        }
    }*/
        
    
    
    
    
    
    
    
    /*public static void sendemailtoProjectHead(List<Opportunity> opdata){
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        
        //String projectHead = System.Label.Project_Team;
        //String projectTeam = System.Label.Project_Head;
        
        for (Opportunity opp : opdata) {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            
            email.setSubject('An opportunity has been closed');
            email.setToAddresses(new String[] {System.Label.Project_Head});
            
            String opportunityUrl = 'https://test.salesforce.com';
            String emailBody = 'Hello Project Head,' + '<br/>';
            emailBody += 'An opportunity ' + opp.Name + ' has been closed.' + '<br/>';
            emailBody += '<a href="' + opportunityUrl + '">Click here to view the Opportunity.</a>' + '<br/>';
            emailBody += 'Thank you!';
            
            email.setHtmlBody(emailBody);
            emails.add(email);
        }
        System.debug(emails);
        
        Messaging.sendEmail(emails);
    }
    
    
    public static void sendemailtoProjectTeam(List<Opportunity> opdata){
        List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
        
        for (Opportunity opp : opdata) {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
            
            email.setSubject('An opportunity has been closed');
            email.setToAddresses(new String[] { System.Label.Project_Team});
            
            String opportunityUrl = 'https://test.salesforce.com';
            String emailBody = 'Hi Project team,' + '<br/>';
            emailBody += 'An opportunity ' + opp.Name + ' has been closed.' + '<br/>';
            emailBody += '<a href="' + opportunityUrl + '">Click here to view the Opportunity.</a>' + '<br/>';
            emailBody += 'Thank you!';
            
            email.setHtmlBody(emailBody);
            emails.add(email);
        }
        System.debug(emails);
        
        Messaging.sendEmail(emails);
    }*/
    
    //send a custom notification to user on salesforce org
    public static void notificationtoUsers(Set<Id> setOpportunityIds) {
        
        // Get the Id for our custom notification type
        CustomNotificationType notificationType = [SELECT Id, DeveloperName 
                                                   FROM CustomNotificationType 
                                                   WHERE DeveloperName='A_opportunity_has_been_closed'];
        
        List<Opportunity> opplist = [SELECT Id,Name,OwnerId, AccountId,Status__c,CloseDate,StageName FROM Opportunity 
                                     WHERE id in: setOpportunityIds and StageName= 'Closed Won'];
        
        System.debug('closed won opp line 39:' + opplist);
        User usern = [SELECT id, username from user where Username = 'project.team@cloud.com'];
        for(Opportunity opp: opplist){
            if(opp.StageName== 'Closed Won'){
                
                // Create a new custom notification
                Messaging.CustomNotification notification = new Messaging.CustomNotification();
                
                // Set the contents for the notification
                notification.setTitle('A opportunity has been closed');
                notification.setBody('A opportunity has been closed! Apex!!!');
                
                // Set the notification type and target
                notification.setNotificationTypeId(notificationType.Id);
                notification.setTargetId(opp.Id);
                
                String projectHead = System.Label.Project_Team;
                notification.send(new Set<String> {usern.username}); 
                
                set<String> address = new set<String>();
                address.add(opp.Id);
                // Actually send the notification
                try {
                    notification.send(address);
                }
                catch (Exception e) {
                    System.debug('Problem sending notification: ' + e.getMessage());
                }
            }
        }
    }
    
}