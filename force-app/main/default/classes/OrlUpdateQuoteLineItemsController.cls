// public class OrlUpdateQuoteLineItemsController {
 
 


public class OrlUpdateQuoteLineItemsController {
 
    // public class QuoteAndInventoryWrapper {
    //     @AuraEnabled
    //     public List<QuoteLineItem> quoteLineItems { get; set; }
    //     @AuraEnabled
    //     public List<cgcloud__Inventory__c> inventoryData { get; set; }
    // }
 
    // @AuraEnabled(cacheable=true)
    // public static QuoteAndInventoryWrapper getQuoteAndInventoryData(String oppId) {
    //     system.debug('iddd'+oppId);
    //     QuoteAndInventoryWrapper wrapper = new QuoteAndInventoryWrapper();
 
    //     try {
    //         String quoteId = [SELECT Id, Name, OpportunityId FROM Quote WHERE OpportunityId=:oppId LIMIT 1].Id;
    //         if (quoteId != null) {
    //             List<QuoteLineItem> lstQuotelineitems = [SELECT Id, QuoteId, Quantity, Orl_Allocated_Quantity__c, Product2Id, ListPrice, Product2.Name
    //                                                      FROM QuoteLineItem 
    //                                                      WHERE QuoteId=:quoteId];
 
    //             if (!lstQuotelineitems.isEmpty()) {
    //                 wrapper.quoteLineItems = lstQuotelineitems;
 
    //                 Set<String> productIds = new Set<String>();
 
    //                 for (QuoteLineItem item : lstQuotelineitems) {
    //                     productIds.add(item.Product2Id);
    //                 }
 
    //                 if (!productIds.isEmpty()) {
    //                     wrapper.inventoryData = [SELECT Id, Name, cgcloud__Product__c, cgcloud__Valid_From__c, cgcloud__Valid_Thru__c, Inventory_Control_Template_Type__c, Orl_Inventory_type__c, cgcloud__Balance__c
    //                                              FROM cgcloud__Inventory__c
    //                                              WHERE Inventory_Control_Template_Type__c = 'Primary Inventory'
    //                                                AND Orl_Inventory_type__c = 'Company Inventory'
    //                                                AND cgcloud__Product__c IN :productIds];
    //                 } else {
    //                     throw new AuraHandledException('No Product2Ids found for the quote line items');
    //                 }
    //             } else {
    //                 throw new AuraHandledException('No Quote line items found for the quote');
    //             }
    //         } else {
    //             throw new AuraHandledException('No quote record found related to the opportunity!');
    //         }
    //         System.debug('Wrapper Data - Quote Line Items: ' + wrapper.quoteLineItems);
    //         System.debug('Wrapper Data - Inventory Data: ' + wrapper.inventoryData);
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }

    //     return wrapper;
       
    // }

    
    @AuraEnabled
    public static string createOrderAndInvoice(List<QuoteLineItem> qtLineItemsData){
        try {
            system.debug('qtLineItemsData'+qtLineItemsData);
            String quoteId = qtLineItemsData[0].QuoteId;
            System.debug('qtLineItemsData - ' + qtLineItemsData);  
            System.debug('qtLineItemsData   Id 116 - ' + quoteId); 
            for (QuoteLineItem qtItem : qtLineItemsData) {
                qtItem.Quantity = qtItem.Orl_Allocated_Quantity__c;
                System.debug(qtItem);
            }
            update qtLineItemsData;

            Quote qt = [SELECT Id, Name, OpportunityId, Status FROM Quote WHERE Id =: quoteId];
            qt.Status = 'Accepted';
            update qt;

            String oppId = qt.OpportunityId;
            Opportunity opp = [SELECT Id, Name, StageName FROM Opportunity WHERE Id =: oppId];
            opp.StageName = 'Closed Won';
            update opp;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return 'Success';
    }

       
    @AuraEnabled(cacheable=true)
    public static list<QuoteLineItem> getOppData(string oppId){
        try {
            String quoteId = [select Id,Name,OpportunityId from Quote where OpportunityId=:oppId LIMIT 1].Id;
            if(quoteId != Null){
                list<QuoteLineItem> lstQuotelineitems = [SELECT Id, QuoteId, Quantity, Orl_Allocated_Quantity__c, Product2Id, ListPrice,  Product2.Name
                                                         FROM QuoteLineItem 
                                                         WHERE QuoteId=:quoteId
                                                        ];

                if(lstQuotelineitems.size() > 0 ){
                    return lstQuotelineitems;
                }else{
                    throw new AuraHandledException('No Quote lineitems found for the quote');
                }
            }else{
                throw new AuraHandledException('No qoute record found related to opportunity!');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled(cacheable=true)
    public static List<cgcloud__Inventory__c> getbalancedata(String oppId){
        try {
            List<QuoteLineItem> quoteLineItems = getOppData(oppId);
            Set<String> productIds = new Set<String>();
            
            // Collect Product2Ids from QuoteLineItems
            for (QuoteLineItem item : quoteLineItems) {
                productIds.add(item.Product2Id);
            }
            
            // Use Product2Ids in SOQL query for cgcloud__Inventory__c
            if (!productIds.isEmpty()) {
                List<cgcloud__Inventory__c> getbala = [SELECT Id, Name, cgcloud__Product__c, cgcloud__Valid_From__c, cgcloud__Valid_Thru__c, Inventory_Control_Template_Type__c, Orl_Inventory_type__c, cgcloud__Balance__c
                                                       FROM cgcloud__Inventory__c
                                                       WHERE Inventory_Control_Template_Type__c = 'Primary Inventory'
                                                         AND Orl_Inventory_type__c = 'Company Inventory'
                                                         AND cgcloud__Product__c IN :productIds];
                // Debugging
                System.debug('balance data: ' + getbala);
                return getbala;
            } else {
                throw new AuraHandledException('No Product2Ids found for the quote line items');
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

  
    
}