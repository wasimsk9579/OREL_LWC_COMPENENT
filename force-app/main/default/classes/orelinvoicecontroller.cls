public with sharing class orelinvoicecontroller {
    @AuraEnabled
    public static List<Orl_invoice__c> getinvoice(string orderId) {
         List<Orl_invoice__c> invoicelist =  [SELECT  Id, Name,Gross_Total_Value__c,Orl_Invoice_Bill_To__c,
         Orl_Invoice_No__c,Advanced_Order__r.Name,Orl_Tel__c,Orl_Units_Qty__c FROM Orl_invoice__c Where Advanced_Order__c=:orderId ORDER BY CreatedDate DESC];
       
         system.debug('order' +invoicelist);

        
         return invoicelist;
    }
}