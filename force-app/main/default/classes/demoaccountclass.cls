public with sharing class demoaccountclass {
    @AuraEnabled( cacheable = true )
    public static List< Account > fetchAccounts() {
     
        return [ SELECT Id, Name, Industry, ParentId, RecordTypeId FROM Account LIMIT 10 ];
         
    }
     
}
