public with sharing class RetailerInitialApprovalSubController {
     
        @AuraEnabled
        public static String submitForApproval(String retailerId,string location) {
        System.debug('retailerId - ' + retailerId);
        String res = '';
        try {
            Account_Retail_Store__c rets = [SELECT Id,Name, Account__c FROM Account_Retail_Store__c WHERE Id = :retailerId LIMIT 1];
  
        if (rets != null ) {
            String accId = rets.Account__c;

            Contact primaryContact;
            List<Contact> contactList = [SELECT Id, AccountId, Is_primary_Contact__c FROM Contact WHERE AccountId = :accId AND Is_primary_Contact__c = true LIMIT 1];

            if (!contactList.isEmpty()) {
                primaryContact = contactList[0];

                User user;
                List<User> userList = [SELECT Id,Name, Username, Email, IsActive, ContactId FROM User WHERE ContactId = :primaryContact.Id AND IsActive = true LIMIT 1];

                if (!userList.isEmpty()) {
                    user = userList[0];

                    
                        Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
                        req.setComments('Submitting approval request To Distributor');
                        req.setProcessDefinitionNameOrId('account_retail_store_approval'); 
                        req.setObjectId(retailerId);
                        req.setNextApproverIds(new Id[] { user.Id });
                        Approval.lock(rets.id);

                        // Submit the approval request for the retal store
                        Approval.ProcessResult result = Approval.process(req);
                        System.debug('Result' + result);
                                res = 'success';
                    

                        // Create a new SingleEmailMessage object
                        List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage>();
                        String retailStoreURL = location+'my.site.com/s/retailer-approval';
                        String body = 'Dear ' +user.Name +
 
                        '\n\nI hope this message finds you well. We kindly request your assistance in tagging the following retailer under your distributorship:'+ 'Retailer Name: '+rets.Name+
                         '\n\nPlease click on the link to approve or reject the Retailer Request. '+retailStoreURL+
                        '\n\nYour prompt action on this matter is greatly appreciated. If you have any questions or require further information, please dont hesitate to reach out.'+
                         
                        '\n\nThank you for your cooperation.'+
                         
                        '\n\nBest Regards,'+
                        '\nOrel Cooperation.';
                        // You can use either Template ID or Developer Name, but make sure it's valid
                        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                        message.setToAddresses(new String[] { user.Email });
                        message.setTargetObjectId(user.Id);
                        message.setSaveAsActivity(false);
                        message.setSubject('Request to Tag Retailer to Distributor');
                        message.setPlainTextBody(body);
                        messages.add(message);
                        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);   
                        
                        if (results.size() > 0) {
                            if (results[0].success) {
                                System.debug('The email was sent successfully.');
                            } else {
                                System.debug('The email failed to send: ' + results[0].errors[0].message);
                            }
                        } else {
                            System.debug('No email results found.'); // Handle this case as needed
                        }
                    

                } else {
                    System.debug('User not found for primary contact.');
                    throw new AuraHandledException('User not found for primary contact.');
                }
                } else {
                    System.debug('Primary contact not found for the account.');
                    throw new AuraHandledException('Primary contact not found for the account.');
                }
            } else {
                System.debug('Account Retail Store not found.');
                throw new AuraHandledException('Account Retail Store not found.');
            }
        } catch (QueryException e) {
            String errorMessage = e.getMessage();
            throw new AuraHandledException(errorMessage);
        }
        return res;
    }


    @AuraEnabled(cacheable=true)
    public static string returnretailerId(String retailerId){
        try {
            System.debug('retailerId' + retailerId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return retailerId;
    }
 
}