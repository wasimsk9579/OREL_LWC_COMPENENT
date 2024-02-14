public class ProductBundleSearchController {

     public class ProductPartWrapper {
         @AuraEnabled public Id productPartsId {get;set;}
         @AuraEnabled public Id productId {get;set;}
         @AuraEnabled public String productBundlePartName {get;set;}
         @AuraEnabled public String dimension {get;set;}
         @AuraEnabled public String PartDescription {get;set;}
         @AuraEnabled public Integer quantity {get;set;} 
         @AuraEnabled public Decimal listprice {get;set;} 
         @AuraEnabled public Integer pricefactor {get;set;} 
         @AuraEnabled public Decimal finalprice {get;set;} 
         @AuraEnabled public String cData {get;set;}
         @AuraEnabled public String cLevel {get;set;}
          @AuraEnabled public Id opportunityRecordId {get;set;}
         
    }

     @AuraEnabled(cacheable=true)
    public static List<Product2> searchProducts() {
        return [SELECT Id, Name FROM Product2 WHERE Product_Bundle__C = true ];
    }

    @AuraEnabled
    public static List<cgcloud__Product_Part__c> getProductParts(String productId) {
        //system.debug('product id from js---->'+productId);
                List<cgcloud__Product_Part__c> childProductData= [SELECT Id, Name,Dimensions__c,Part_Description__c,List_price__c,Price_factor__c,cgcloud__Quantity__c,cgcloud__Child_Product__c,cgcloud__Child_Product__r.Name FROM cgcloud__Product_Part__c WHERE cgcloud__Parent_Product__c = :productId];
      //  system.debug('childProductData --->'+childProductData);
        return childProductData;
    }

    @AuraEnabled
    public static List<cgcloud__Product_Part__c> createProductParts(Id parentId, List<ProductPartWrapper> selectedProducts) {
          System.debug('parentId----->'+ parentId);
    System.debug('fieldUpdates----->'+ JSON.serialize(selectedProducts));
        List<cgcloud__Product_Part__c> productParts = new List<cgcloud__Product_Part__c>();   
        for (ProductPartWrapper selectedProduct : selectedProducts) {
            cgcloud__Product_Part__c part = new cgcloud__Product_Part__c();
            part.cgcloud__Parent_Product__c = parentId;
            part.Dimensions__c=selectedProduct.dimension;
            part.Part_Description__c = selectedProduct.PartDescription;
            part.cgcloud__Quantity__c = selectedProduct.quantity;
            part.Price_factor__c = selectedProduct.pricefactor;
            part.List_price__c = selectedProduct.listprice;
            part.cgcloud__Child_Product__c = selectedProduct.cData; // Assuming productId is the correct property
            part.cgcloud__Valid_From__c = System.today();
            part.cgcloud__Valid_Thru__c = System.today().addDays(100);
            productParts.add(part);
        }
        if (!productParts.isEmpty()) {
            system.debug('Product pary  =  =' +productParts);
            insert productParts;
        }
        // Query the inserted product parts and return them
        List<cgcloud__Product_Part__c> insertedProductParts = [SELECT Id, Name, cgcloud__Child_Product__c, Dimensions__c, cgcloud__Child_Product__r.Name,List_price__c,
                                                               Price_factor__c, Final_Price__c FROM cgcloud__Product_Part__c WHERE cgcloud__Parent_Product__c = :parentId];
        return insertedProductParts;
    }
    
    
    @Auraenabled
     public static void handleAfterInsert(Id parentId, Id opportunityRecordId) {
        List<OpportunityLineItem> opportunityLineItems = new List<OpportunityLineItem>();
          // Query for the Pricebook named 'srilankan PB'
        Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE Name = 'SriLankan Currency PB' LIMIT 1];
         system.debug(' the pricebook = '+pricebook);
// Check if the Product is associated with an Opportunity (assuming OpportunityId__c is a custom field on Product2)
    Product2 product = [SELECT Id, Name, total_bundle_Price__c FROM Product2 WHERE Id = :parentId  LIMIT 1];

            // Check if the Product is associated with an Opportunity (assuming OpportunityId__c is a custom field on Product2)
            if (product.Id != null) {
                // Query PricebookEntry based on Product2 and Pricebook2
                List<PricebookEntry> pricebookEntries = [
                    SELECT Id
                    FROM PricebookEntry
                    WHERE Product2Id = :parentId
                    AND Pricebook2Id = :pricebook.Id
                    LIMIT 1
                ];

                if (!pricebookEntries.isEmpty()) {
                    OpportunityLineItem oli = new OpportunityLineItem();
                    oli.OpportunityId = opportunityRecordId;
                    system.debug(' opp iD = '+ oli.OpportunityId );
                    oli.PricebookEntryId = pricebookEntries[0].Id;
                    oli.Final_Price__c = product.total_bundle_price__c;
                    oli.Quantity = 1; // You may adjust the quantity as needed
                    oli.UnitPrice = 1; // Set the unit price based on your business logic
                    opportunityLineItems.add(oli);
                } else {
                    System.debug('PricebookEntry not found for Product: ' + product.Name);
                }
            }
        

        if (!opportunityLineItems.isEmpty()) {
            system.debug('Opp line items  = '+opportunityLineItems);
            insert opportunityLineItems;
        }
    }
}