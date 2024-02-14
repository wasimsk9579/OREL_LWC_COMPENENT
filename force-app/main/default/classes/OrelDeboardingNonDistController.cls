public with sharing class OrelDeboardingNonDistController {
    @AuraEnabled
    public static void updateAccountNonDist(String accountId, String reason) {
        system.debug('Entered apec class ' + accountId);
        Account acc = [SELECT Id, De_Boarding_Reason__c, Deboarding_process_status__c FROM Account WHERE Id = :accountId];
        system.debug('account list ' + acc);
        acc.De_Boarding_Reason__c = reason;
        acc.Deboarding_process_status__c = 'In Process - Working with Reconciliation & Full and Final Settlement';
        acc.orel_Deboard_Initiated__c ='Initiated by Non-Distributor';
        update acc;
    }
}