public without sharing class orelapprovalprocessclass {
      @AuraEnabled
        public static String submitForApproval(String oppId,string location) {
            System.debug('oppId - ' + oppId);
            String res = '';
            try {
                Opportunity opp = [SELECT Id, Name,HasOpportunityLineItem, OwnerId, AccountId, Status__c, CloseDate, StageName FROM Opportunity WHERE Id = :oppId LIMIT 1];
      
                if (opp != null) {
                    String accId = opp.AccountId;
    
                    Contact primaryContact;
                    List<Contact> contactList = [SELECT Id, AccountId, Is_primary_Contact__c FROM Contact WHERE AccountId = :accId AND Is_primary_Contact__c = true LIMIT 1];
    
                    if (!contactList.isEmpty()) {
                        primaryContact = contactList[0];
    
                        User user;
                        List<User> userList = [SELECT Id,Name, Username, Email, IsActive, ContactId FROM User WHERE ContactId = :primaryContact.Id AND IsActive = true LIMIT 1];
    
                        if (!userList.isEmpty()) {
                            user = userList[0];
                            if(opp.HasOpportunityLineItem==true)
                            {
    
                    Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
                    req.setComments('Submitting approval request To Distributor');
                    req.setProcessDefinitionNameOrId('PO_approval_request'); 
                    req.setObjectId(oppId);
                    req.setNextApproverIds(new Id[] { user.Id });
                    Approval.lock(opp.id);

                    // Submit the approval request for the Opportunity
                    Approval.ProcessResult result = Approval.process(req);
                    System.debug('Result' + result);
                    
                    opp.Status__c='Pending';
                    update opp;
                    res = 'success';
                   

                    // Create a new SingleEmailMessage object
                    List<Messaging.SingleEmailMessage> messages = new List<Messaging.SingleEmailMessage>();
                    String opportunityURL = location+'my.site.com/s/purchase-order';
                    // String body = opp.Name + ' Has Requested your Approval for the following item:' +
                    //               '\nTo approve or reject this item, ' + opportunityURL +
                    //               '\n\nThank you' + opp.Name;

                                 String body= 'Dear ' +user.Name+
 
                                  '\n\nThis is to inform you that new Purchase Order '+opp.Name+ ' has been created and is currently waiting for your approval.'+
                                  '\nYour prompt attention to this matter is highly appreciated.'+
                                   
                                  '\n\nPlease link on the link to approve or reject the purchase order.'+
                                  '\n'+opportunityURL+
                                
                                   
                                  '\n\n\nThanks,'+
                                  '\nOREL Corporation.';



                    // You can use either Template ID or Developer Name, but make sure it's valid
                    Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
                    message.setToAddresses(new String[] { user.Email });
                    message.setTargetObjectId(user.Id);
                    message.setSaveAsActivity(false);
                    message.setSubject('Requesting for Purchase Order Approval ');
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
                }
                else {
                    System.debug('Please add atleast one product before the approval request.');
                    throw new AuraHandledException('Please add atleast one product before the approval request.');
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
                    System.debug('Opportunity not found.');
                    throw new AuraHandledException('Opportunity not found.');
                }
            } catch (QueryException e) {
                String errorMessage = e.getMessage();
                throw new AuraHandledException(errorMessage);
            }
            return res;
        }
    
      
    @AuraEnabled(cacheable=true)
    public static string returnOppId(String oppId){
        try {
            System.debug('oppId' + oppId);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return oppId;
    }
 
    @AuraEnabled
    public static Opportunity getoppdata(String oppId){
        try {
            System.debug('oppId' +oppId);
            return [SELECT Id, AccountId,Name,CloseDate,StageName , Status__c,Amount FROM Opportunity WHERE Id = :oppId LIMIT 1];
           // system.debug('oportunityrecord' + opprecord);
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
       
    }
    @AuraEnabled
    public static List<OpportunityLineItem> getopplineitemdata(String oppId){
        try {
            System.debug('oppId' +oppId);
            return [SELECT Id,OpportunityId,Name,Product2.Name,Quantity,UnitPrice,ListPrice,TotalPrice FROM OpportunityLineItem WHERE OpportunityId = :oppId];
           // system.debug('oportunityrecord' + opprecord);
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
       
    }

    @AuraEnabled
    public static void approverecord(String oppId) {
 
        Id recId = oppId;
        // Find the approval work item associated with the record
        ProcessInstanceWorkitem workItem = [SELECT Id, ProcessInstanceId FROM ProcessInstanceWorkitem WHERE ProcessInstance.TargetObjectId = :recId];
        
        if (workItem != null) {
            Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
            system.debug('Work Id' +workItem.Id);
            req.setWorkitemId(workItem.Id);
            req.setAction('Approve');
            req.setComments('Your Record Is Approved');
            
            // Submit the approval request
            Approval.ProcessResult result = Approval.process(req);
            string Status = result.getInstanceStatus();
            system.debug('status' +Status);
            
            if (result.isSuccess()) {
                System.debug('Record approved successfully');
                Opportunity opp = [SELECT Id,Name,OwnerId, AccountId,Status__c,CloseDate,StageName FROM Opportunity WHERE Id = :oppId LIMIT 1];
                system.debug(' the opp is == '+opp);
                opp.Status__c ='Approved';
                opp.StageName ='Closed Won';
                update opp;
     
                CustomNotificationType CustomNotificationId = [SELECT Id,DeveloperName FROM CustomNotificationType where DeveloperName ='PO_APPROVAL_NOTIFICATION' limit 1];
                Messaging.CustomNotification Notification = new Messaging.CustomNotification(); 
                Notification.setNotificationTypeId(CustomNotificationId.Id);
                Notification.setBody('Purchase Order has been Approved'); 
                Notification.setTitle('Purchase Order ' + opp.Name + '  is Approved'); 
                Notification.setTargetId(opp.Id);
                Notification.send(new Set<String> {opp.OwnerId}); 

            } else {
                System.debug('Error approving record: ' + result.getErrors()[0].getMessage());
            }
        } else {
            System.debug('No approval work item found for the record');
        }
    }
    
    @AuraEnabled
    public static void rejectrecord(String oppId, string data) {
        system.debug('reason' +data);
        Id recId = oppId;
        List<ProcessInstanceWorkitem> workItems = [SELECT Id, ProcessInstanceId FROM ProcessInstanceWorkitem WHERE ProcessInstance.TargetObjectId =:recId];
        List<Approval.ProcessWorkitemRequest> requests = new List<Approval.ProcessWorkitemRequest>();
        
        for (ProcessInstanceWorkitem workItem : workItems) {
            Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
            system.debug('Work Id' +workItem.Id);
            req.setWorkitemId(workItem.Id);
            req.setAction('Reject');
            req.setComments(data);
            requests.add(req);
        }
        
        // Submit the rejection requests
        List<Approval.ProcessResult> results = Approval.process(requests);
        
        for (Approval.ProcessResult result : results) {
            if (result.isSuccess()) {
                
                System.debug('Record rejected successfully');
                Opportunity opp = [SELECT Id,Name,OwnerId, AccountId,Status__c,CloseDate,StageName FROM Opportunity WHERE Id = :oppId LIMIT 1];
                opp.Status__c ='Rejected';
                update opp;

                CustomNotificationType CustomNotiId = [SELECT Id,DeveloperName FROM CustomNotificationType where DeveloperName ='PO_Rejection_Notification' limit 1];
                Messaging.CustomNotification Notification = new Messaging.CustomNotification(); 
                Notification.setNotificationTypeId(CustomNotiId.Id); 
                Notification.setBody('Purchase Order has been Rejected'); 
                Notification.setTitle('Purchase Order ' + opp.Name + '  is Rejected'); 
                Notification.setTargetId(opp.Id);
                Notification.send(new Set<String> {opp.OwnerId}); 
 
            
                    } 
            
               
            }
            } 
        
    
    
    @AuraEnabled
    public static string getstatus(String oppId)
    {
        Id recId = oppId;
        ProcessInstance processInstances = [SELECT Id, TargetObjectId, Status, CompletedDate, CreatedDate, LastModifiedDate FROM ProcessInstance where TargetObjectId= :recId order by LastModifiedDate desc limit 1];
        String approvalStatus = processInstances.Status;
        system.debug ('status =' +approvalStatus);
        return approvalStatus;
    }
   


}