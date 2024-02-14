public class Taskclosednotification {
public static void sendTaskAssignmentNotification(List<Task> newTasks) {
    
            for (Task task : newTasks) {
                if(task.Status=='Completed')
                {
              list<user> use = [SELECT Id, Username,Email, ProfileId FROM User where ProfileId = '0051m000006EHRYAA4'];
                for(User us:use) 	
                {
                    List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage>();
                    String body = 'The customer has confirmed the drawings and the task ' +task.Subject+ ' is closed.';               
                    // You can use either Template ID or Developer Name, but make sure it's valid
                    Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                    message.setToAddresses(new String[] {us.Email});
                    message.setTargetObjectId(task.Owner.Id);
                    message.setSaveAsActivity(false);
                    message.setSubject('Task is Closed');
                    message.setPlainTextBody(body);
                    messages.add(message);
                    Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
                    
                }
            }
        }
    }
}