public with sharing class orlReturnOrderController {
  public List<cgcloud__Order__c> getReturnorder { get; set; }
    @AuraEnabled
    public static List<cgcloud__Order__c> getReturnorder(string userId) {
       string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
         system.System.debug('id' +useraccId);
         List<cgcloud__Order__c> retorderlist =  [Select Id,Name,Bundle__c,Orl_Return_Status__c,GRNGenerated__c,Orl_Parent_Return_Order_Id__c,cgcloud__Gross_Total_Value__c,
         cgcloud__Order_Template__c,cgcloud__Order_Template__r.Name,cgcloud__Order_Account__c,cgcloud__Order_Account__r.Name,
         cgcloud__Order_Date__c,cgcloud__Delivery_Date__c,cgcloud__Initiation_Date__c,cgcloud__Delivery_Recipient__r.Name,
         cgcloud__Delivery_Recipient__c from cgcloud__Order__c WHERE cgcloud__Order_Account__c =:useraccId and 
         cgcloud__Order_Template__r.Name='Return' and Bundle__c= false and Orl_Parent_Return_Order_Id__c= null ORDER BY CreatedDate DESC];
       
         system.debug('order' +retorderlist);

        
         return retorderlist;
    }

         @AuraEnabled
         public static void updateOrderStatus(String orderId, String selectedStatus) {
          system.debug('orderiddd'+orderId);
          system.debug('selectedStatus'+selectedStatus);
             try {
                 cgcloud__Order__c orderToUpdate = [SELECT Id, Orl_Return_Status__c FROM cgcloud__Order__c WHERE Id = :orderId LIMIT 1];
                
                     orderToUpdate.Orl_Return_Status__c = selectedStatus;
                     update orderToUpdate;  
                     system.debug('update result'+orderToUpdate);
             } catch (Exception e) {
                 // Handle any exceptions or errors
                 System.debug('Error updating order status: ' + e.getMessage());
             }
         }
  
         @AuraEnabled
         public static List<cgcloud__Order__c> getsalesorder(string userId) {
            string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
              system.System.debug('id' +useraccId);
              List<cgcloud__Order__c> salesorderlist =  [Select Id,Name,Orl_Return_Status__c,GRNGenerated__c,cgcloud__Gross_Total_Value__c,cgcloud__Order_Template__c,cgcloud__Order_Template__r.Name,cgcloud__Order_Account__c,cgcloud__Order_Account__r.Name,cgcloud__Order_Date__c,cgcloud__Delivery_Date__c,cgcloud__Initiation_Date__c,cgcloud__Delivery_Recipient__r.Name,cgcloud__Delivery_Recipient__c from cgcloud__Order__c  WHERE cgcloud__Order_Account__c =:useraccId and cgcloud__Order_Template__r.Name='Sales Template'
              ORDER BY CreatedDate DESC];
            
              system.debug('order' +salesorderlist);
     
             
              return salesorderlist;
         }

         @AuraEnabled
         public static void updatesalesorder(string srecId) {
              cgcloud__Order__c updatesalesorderlist =  [Select Id,Name,Orl_Return_Status__c,GRNGenerated__c,cgcloud__Gross_Total_Value__c,cgcloud__Order_Template__c,cgcloud__Order_Template__r.Name,cgcloud__Order_Account__c,cgcloud__Order_Account__r.Name,cgcloud__Order_Date__c,cgcloud__Delivery_Date__c,cgcloud__Initiation_Date__c,cgcloud__Delivery_Recipient__r.Name,cgcloud__Delivery_Recipient__c from cgcloud__Order__c  WHERE Id=:srecId];
            
              system.debug('order' +updatesalesorderlist);
     
              updatesalesorderlist.GRNGenerated__c = 'Completed';

              update updatesalesorderlist;
              
         }

         @AuraEnabled
         public static List<cgcloud__Order__c> getReturntoorel(string userId) {
            string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
              system.System.debug('id' +useraccId);
              List<cgcloud__Order__c> retorderorellist =  [Select Id,Name,Bundle__c,Orl_Return_Status__c,cgcloud__Gross_Total_Value__c,
              cgcloud__Order_Template__c,cgcloud__Order_Template__r.Name,cgcloud__Order_Account__c,cgcloud__Order_Account__r.Name,
              cgcloud__Order_Date__c,cgcloud__Delivery_Date__c,cgcloud__Initiation_Date__c,cgcloud__Delivery_Recipient__r.Name,
              cgcloud__Delivery_Recipient__c from cgcloud__Order__c WHERE cgcloud__Order_Account__c =:useraccId and 
              cgcloud__Order_Template__r.Name='Return' and Bundle__c =true
              ORDER BY CreatedDate DESC];
            
              system.debug('order' +retorderorellist);
     
             
              return retorderorellist;
         }
    

         @AuraEnabled
         public static List<cgcloud__Order__c> getretailorder(string userId) {
            string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
              system.System.debug('id' +useraccId);
              List<cgcloud__Order__c> retailorderlist =  [Select Id,Name,Orl_Return_Status__c,GRNGenerated__c,
              cgcloud__Gross_Total_Value__c,cgcloud__Order_Template__c,cgcloud__Order_Template__r.Name,cgcloud__Order_Account__c,
              cgcloud__Order_Account__r.Name,cgcloud__Order_Date__c,cgcloud__Delivery_Date__c,cgcloud__Initiation_Date__c,
              cgcloud__Delivery_Recipient__r.Name,cgcloud__Delivery_Recipient__c from cgcloud__Order__c
                WHERE cgcloud__Order_Account__c =:useraccId and cgcloud__Order_Template__r.Name='Retailer Order Template'ORDER BY CreatedDate DESC];
            
              system.debug('order' +retailorderlist);
     
             
              return retailorderlist;
         }
    
}