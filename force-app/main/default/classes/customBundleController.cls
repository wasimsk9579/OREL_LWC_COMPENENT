public class customBundleController {

     @Auraenabled
     public static void handleAfterInsert(Id parentId) {
        List<OpportunityLineItem> opportunityLineItems = new List<OpportunityLineItem>();
          // Query for the Pricebook named 'srilankan PB'
        Pricebook2 pricebook = [SELECT Id FROM Pricebook2 WHERE Name = 'DPL_3' LIMIT 1];
         system.debug(' the pricebook = '+pricebook);
// Check if the Product is associated with an Opportunity (assuming OpportunityId__c is a custom field on Product2)
    Custom_Product__c product = [SELECT Id, Name, C_Opportunity__c FROM Custom_Product__c WHERE Id = :parentId  LIMIT 1];
         system.debug('Product Id  = '+product.Id);

            // Check if the Product is associated with an Opportunity (assuming OpportunityId__c is a custom field on Product2)
            if (product.Id != null) {
                // Query PricebookEntry based on Product2 and Pricebook2
                List<PricebookEntry> pricebookEntries = [
                    SELECT Id
                    FROM PricebookEntry
                   // WHERE Product2Id = :product.Id
                    WHERE Pricebook2Id = :pricebook.Id
                    LIMIT 1
                ];

                if (!pricebookEntries.isEmpty()) {
                    OpportunityLineItem oli = new OpportunityLineItem();
                    oli.OpportunityId = '0061m00000BRWUTAA5';
                    system.debug(' opp iD = '+ oli.OpportunityId );
                    oli.PricebookEntryId = pricebookEntries[0].Id;
                  //  oli.Final_Price__c = product.total_bundle_price__c;
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