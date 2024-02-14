public without sharing class OrlRetailerApprovalHistoryController {
    @AuraEnabled(cacheable=true)
    public static List<ProcessInstance> getRetailerApprovalHistory(String retailerId){
        try {
            List<ProcessInstance> prcInstanceList = [SELECT Id, Status, CompletedDate, CreatedDate 
                                                        FROM ProcessInstance
                                                        WHERE TargetObjectId =: retailerId
                                                        ORDER BY CreatedDate DESC];
                                                        
            return prcInstanceList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}