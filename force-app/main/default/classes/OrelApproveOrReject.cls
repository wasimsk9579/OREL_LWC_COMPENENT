public without sharing class OrelApproveOrReject {

  @AuraEnabled
  public static Opportunity getoppdata(String oppId){
      try {
          System.debug('oppId' +oppId);
          return [SELECT Id, AccountId,Name,Amount FROM Opportunity WHERE Id = :oppId LIMIT 1];
         // system.debug('oportunityrecord' + opprecord);
         
      } catch (Exception e) {
          throw new AuraHandledException(e.getMessage());
      }
     
  }
  @AuraEnabled
  public static OpportunityLineItem getopplineitemdata(String oppId){
      try {
          System.debug('oppId' +oppId);
          return [SELECT Id,OpportunityId,Name,Product2Id,ProductCode,Quantity,UnitPrice,ListPrice,TotalPrice FROM OpportunityLineItem WHERE OpportunityId = :oppId LIMIT 1];
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
          
          if (result.isSuccess()) {
              System.debug('Record approved successfully');
          } else {
              System.debug('Error approving record: ' + result.getErrors()[0].getMessage());
          }
      } else {
          System.debug('No approval work item found for the record');
      }
  }
  
  @AuraEnabled
  public static void rejectrecord(String oppId) {
      List<ProcessInstanceWorkitem> workItems = [SELECT Id, ProcessInstanceId FROM ProcessInstanceWorkitem WHERE ProcessInstance.TargetObjectId = '0061m00000B9wtaAAB' ];
      List<Approval.ProcessWorkitemRequest> requests = new List<Approval.ProcessWorkitemRequest>();
      
      for (ProcessInstanceWorkitem workItem : workItems) {
          Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
          system.debug('Work Id' +workItem.Id);
          req.setWorkitemId(workItem.Id);
          req.setAction('Reject');
          req.setComments('Your Record Is Rejected');
          requests.add(req);
      }
      
      // Submit the rejection requests
      List<Approval.ProcessResult> results = Approval.process(requests);
      
      for (Approval.ProcessResult result : results) {
          if (result.isSuccess()) {
              System.debug('Record rejected successfully');
          } else {
              System.debug('Error rejecting record: ' + result.getErrors()[0].getMessage());
          }
      }
  }
  

}