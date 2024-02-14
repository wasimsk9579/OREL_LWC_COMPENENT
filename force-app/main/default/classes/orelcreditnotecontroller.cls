public with sharing class orelcreditnotecontroller {
    @AuraEnabled
    public static List<cgcloud__Account_Receivable__c> getCredit(string userId) {
       string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
         system.System.debug('id' +useraccId);
         List<cgcloud__Account_Receivable__c> creditlist =  [select Id,Name,cgcloud__Amount__c,cgcloud__Account__r.Name,cgcloud__Document_Type__c,cgcloud__Due_Date__c,cgcloud__Invoice_Status__c,
         cgcloud__Receipt_Date__c,cgcloud__Record_Link__c,Order_Id__c from cgcloud__Account_Receivable__c where cgcloud__Account__c=:useraccId];
       
         system.debug('inventry record' +creditlist);

        
         return creditlist;
    

    }
}