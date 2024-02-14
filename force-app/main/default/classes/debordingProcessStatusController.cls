public class debordingProcessStatusController {

    @InvocableMethod
    public static List<Account> inactiveDebaordDistributor(List<Id> userIds) {
        List<Account> statusValue = new List<Account>();
        try {
            if (userIds != null && !userIds.isEmpty()) {
                Id userId = userIds[0];
                Id accountId = [SELECT AccountId FROM User WHERE Id = :userId].AccountId;
                
                String debordingProcessStatus = [
                    SELECT Id, Name, Deboarding_process_status__c 
                    FROM Account
                    WHERE Id = :accountId
                ].Deboarding_process_status__c;
                
                System.debug(debordingProcessStatus);
                
                if (debordingProcessStatus == 'Completed') {
                    Account accountToUpdate = new Account(Id = accountId, Active__c = false);
                    update accountToUpdate;
                }
                
            } else {
                throw new AuraHandledException('UserIds list is null or empty.');
            }
        } catch (Exception e) {
            throw new AuraHandledException('An error occurred: ' + e.getMessage());
        }
        return statusValue;
    }
}