public without sharing class orlRetailStoreTableController {
    @AuraEnabled
    public static List<Account_Retail_Store__c> getRetailStoreData(Id userIds) {
        system.debug('userId' +userIds);
        String accountId = [SELECT AccountId FROM User WHERE Id = :userIds].AccountId;  
        system.debug('Account Id' +accountId);
        list<Account_Retail_Store__c> retlist = new list<Account_Retail_Store__c>(); 
        try {
            retlist = [ Select Retail_Store__c, Retail_Store__r.Name,Retail_Store__r.Description,Retail_Store__r.Orl_Description__c,Retail_Store__r.DeliveryMethod,Retail_Store__r.Address,Retail_Store__r.Orl_Status__c,
                Retail_Store__r.Priority,Account__c, Id, Name,Status__c FROM Account_Retail_Store__c where Account__c =:accountId and Status__c = 'Distributor-Approve'];
                system.debug('records' +retlist);
        } catch (Exception e) {
            throw new AuraHandledException('An error occurred: ' + e.getMessage());
        }
        return retlist;
    }
}