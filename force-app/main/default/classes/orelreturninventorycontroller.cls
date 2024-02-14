public with sharing class orelreturninventorycontroller {
    @AuraEnabled
    public static List<cgcloud__Inventory__c> getInventory(string userId) {
      system.debug('userId'+userId);
       string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
         System.debug('id' +useraccId);
         List<cgcloud__Inventory__c> retinvenlist =  [select id,Name,cgcloud__Balance__c,cgcloud__Initial_Inventory__c,Total_Return_Quantity__c,Inventory_Control_Template_Type__c,cgcloud__Inventory_Template__r.Name,cgcloud__Valid_From__c,cgcloud__Valid_Thru__c,
         cgcloud__Product__r.Name,cgcloud__Product__c,cgcloud__Account__r.Name,Orl_Inventory_type__c,cgcloud__Phase__c from cgcloud__Inventory__c where cgcloud__Account__c=:useraccId and Orl_Inventory_type__c='Distributor Inventory'];
       
         system.debug('inventry record' +retinvenlist);

        
         return retinvenlist;
    

    }
    
}