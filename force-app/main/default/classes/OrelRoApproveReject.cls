public with sharing class OrelRoApproveReject {

    @AuraEnabled
    public static RetailStore getretsdata(String retailerId){
        try {
            System.debug('retailer Id' +retailerId);
            return [SELECT Id,Name, AccountId,Orl_Status__c FROM RetailStore WHERE Id = :retailerId LIMIT 1];
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void roapprove(String retailerId) {
 
        Id recId = retailerId;
        system.debug('recId = ' +recId);
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
                RetailStore rets = [SELECT Id, AccountId,Orl_Status__c FROM RetailStore WHERE Id = :retailerId LIMIT 1];
                system.debug(' the opp is == '+rets);
               

                Messaging.CustomNotification Notification = new Messaging.CustomNotification(); 
                Notification.setNotificationTypeId('0ML1m0000000896GAA'); 
                Notification.setBody('Retail Store has been Approved'); 
                Notification.setTitle('Retail Store' + rets.Name + 'is Approved'); 
                Notification.setTargetId(rets.Id);
                Notification.send(new Set<String> {rets.OwnerId}); 

            } else {
                System.debug('Error approving record: ' + result.getErrors()[0].getMessage());
            }
        } else {
            System.debug('No approval work item found for the record');
        }
    }
    
    @AuraEnabled
    public static void roreject(String retailerId, string data) {
        system.debug('reason' +data);
        Id recId = retailerId;
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
                RetailStore rets = [SELECT Id, AccountId,Orl_Status__c FROM RetailStore WHERE Id = :retailerId LIMIT 1];
               

                Messaging.CustomNotification Notification = new Messaging.CustomNotification(); 
                Notification.setNotificationTypeId('0ML1m0000000896GAA'); 
                Notification.setBody('Retail Store has been Rejected'); 
                Notification.setTitle('Retail Store' + rets.Name + 'is Rejected'); 
                Notification.setTargetId(rets.Id);
                Notification.send(new Set<String> {rets.OwnerId}); 
 
            
                    } 
            
               
            }
            } 
        
    
    
    @AuraEnabled
    public static string getstatus(String retailerId)
    {
        Id recId = retailerId;
        ProcessInstance processInstances = [SELECT Id, TargetObjectId, Status, CompletedDate, CreatedDate, LastModifiedDate FROM ProcessInstance where TargetObjectId= :recId order by LastModifiedDate desc limit 1];
        String approvalStatus = processInstances.Status;
        system.debug ('status =' +approvalStatus);
        return approvalStatus;
    }
   
}