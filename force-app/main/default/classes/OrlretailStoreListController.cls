public without sharing class OrlretailStoreListController {
    @AuraEnabled(cacheable=true)
    public static List<Account_Retail_Store__c> getRest(string userId) {
       string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
         system.System.debug('id' +useraccId);
        list<Account_Retail_Store__c> retslist = [Select Retail_Store__c, Retail_Store__r.Name,Retail_Store__r.DeliveryMethod,Retail_Store__r.Address,Retail_Store__r.Orl_Status__c,Retail_Store__r.StoreType,
        Retail_Store__r.Priority,Account__c, Id, Name, (SELECT Id, Status, TargetObjectId, CreatedDate FROM ProcessInstances WHERE Status = 'Pending' ORDER BY CreatedDate DESC LIMIT 1) 
        From Account_Retail_Store__c WHERE Account__c =: useraccId];
        system.debug('retail record pending' +retslist);
        return retslist;
        
    }
   
}