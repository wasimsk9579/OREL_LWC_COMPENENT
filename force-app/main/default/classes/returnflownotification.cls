public class returnflownotification {
    public static void returnmethod(Id retid)
    {
        
    
    Order ord = [SELECT Id,Name,  AccountId FROM Order WHERE Id=:retid LIMIT 1];

                if (ord != null) {

                    String accId = ord.AccountId;

                    Contact primaryContact;

                    List<Contact> contactList = [SELECT Id, AccountId, Is_primary_Contact__c FROM Contact WHERE AccountId = :accId AND Is_primary_Contact__c = true LIMIT 1];
                    if (!contactList.isEmpty()) {

                        primaryContact = contactList[0];
                       User user;

                        List<User> userList = [SELECT Id, Username, Email, IsActive, ContactId FROM User WHERE ContactId = :primaryContact.Id AND IsActive = true LIMIT 1];
                              user = userList[0];
                    
                    
                 List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage>();
                       // String retailstoreURL = 'https://business-customization-1646--oreldev.sandbox.lightning.force.com/lightning/r/Task//view';

                        string body = 'Dear Sir,\n' +
              'I hope this message finds you well.\n' +
              'Your return has been approved.\n' +
              'Your prompt attention to this matter is highly appreciated.\n\n' +
              'For more details, click the following link:\n\n'+'\n\n' +
              'Feel free to reach out if you have any questions or need further clarification.\n\n' +
              'Thanks & Regards\n';


                       
                        // You can use either Template ID or Developer Name, but make sure it's valid
                        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                        message.setToAddresses(new String[]{user.Email});
                        //message.add('subbusubbu1852@gmail.com');
                      //  message.setTargetObjectId(ord.Owner.Id);
                        message.setSaveAsActivity(false);
                        message.setSubject('You have been Reassigned a task');
                        message.setPlainTextBody(body);
                        messages.add(message);
                        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
                    }
                }
            }
}