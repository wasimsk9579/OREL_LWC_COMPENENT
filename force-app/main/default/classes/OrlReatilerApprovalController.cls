public without sharing class OrlReatilerApprovalController {
   @AuraEnabled
   public static string getApprovalStatus(String recId){
    try {
        String processInstancesStatus = [SELECT Id, TargetObjectId, Status, LastModifiedDate 
                                            FROM ProcessInstance
                                            WHERE TargetObjectId =: recId
                                            ORDER BY LastModifiedDate
                                            DESC
                                            LIMIT 1].Status;
    return processInstancesStatus;
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
   }

   @AuraEnabled
   public static Account_Retail_Store__c getRetailInformation(String retailId){
       system.debug('retail id' +retailId);
        try {
            
            Account_Retail_Store__c retailer = [Select Retail_Store__c,Retail_Store__r.PaymentMethod,Retail_Store__r.Description, Retail_Store__r.Name,Retail_Store__r.DeliveryMethod,Retail_Store__r.Address,Retail_Store__r.Orl_Status__c,
                Retail_Store__r.Priority,Retail_Store__r.StoreType,Account__c, Id, Name FROM Account_Retail_Store__c where Id=:retailId
                                    LIMIT 1];

            return retailer;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
   }

   @AuraEnabled
   public static string approveOrRejectRetailerRecord(String reatilerId, String approvalStatus, String comment){
    try {
        // System.debug('reatilerId -' + reatilerId + '; approvalStatus - ' + approvalStatus + '; comment - ' + comment);
        schema.Account_Retail_Store__c rtStore = [SELECT Id,OwnerId, Name, Status__c,Description__c,Active__c
                                FROM Account_Retail_Store__c
                                WHERE Id =: reatilerId
                                LIMIT 1];
        ProcessInstanceWorkitem workItem = [SELECT Id, ProcessInstanceId FROM ProcessInstanceWorkitem WHERE ProcessInstance.TargetObjectId = :reatilerId];

        Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
        system.debug('Work Id' +workItem.Id);
        req.setWorkitemId(workItem.Id);
        if(approvalStatus == 'Approve'){
            req.setAction('Approve');
            req.setComments('Approved');

            // update retailer record
            rtStore.Status__c = 'Distributor-Approve';
            rtStore.Active__c=true;
           
            update rtStore;
            
            CustomNotificationType CustomNotificationId = [SELECT Id,DeveloperName FROM CustomNotificationType where DeveloperName ='Retailer_Notification_to_Sales_team' limit 1];
                Messaging.CustomNotification Notification = new Messaging.CustomNotification(); 
                Notification.setNotificationTypeId(CustomNotificationId.Id);
                Notification.setBody('Account Retail Store has been Approved'); 
                Notification.setTitle('Account Retail Store' + rtStore.Name + 'is Approved'); 
                Notification.setTargetId(rtStore.Id);
                Notification.send(new Set<String> {rtStore.OwnerId});

        }else{
            req.setAction('Reject');
            req.setComments('Rejected');

            // update retailer record
            rtStore.Status__c = 'Distributor-Reject';
            rtStore.Active__c=false;
            rtStore.Description__c = comment;
            update rtStore;
            
                CustomNotificationType CustomNotificationId = [SELECT Id,DeveloperName FROM CustomNotificationType where DeveloperName ='Retailer_Notification_to_Sales_team' limit 1];
                Messaging.CustomNotification Notification = new Messaging.CustomNotification(); 
                Notification.setNotificationTypeId(CustomNotificationId.Id);
                Notification.setBody('Account Retail Store has been Rejected'); 
                Notification.setTitle('Account Retail Store' + rtStore.Name + 'is Rejected'); 
                Notification.setTargetId(rtStore.Id);
                Notification.send(new Set<String> {rtStore.OwnerId});
        }
       
        Approval.ProcessResult result = Approval.process(req);
        string Status = result.getInstanceStatus();
        system.debug('status' +Status);
        return 'Success';
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
   }
}