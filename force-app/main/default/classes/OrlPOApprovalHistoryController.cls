public with sharing class OrlPOApprovalHistoryController {
    @AuraEnabled(cacheable=true)
    public static List<ProcessInstance> getPOApprovalHistory(String oppoId){
        try {
            List<ProcessInstance> oppInstanceList = [SELECT Id, Status, CompletedDate, CreatedDate 
                                                        FROM ProcessInstance
                                                        WHERE TargetObjectId =: oppoId
                                                        ORDER BY CreatedDate DESC];
                                                        
            return oppInstanceList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
