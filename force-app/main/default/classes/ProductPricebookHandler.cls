public class ProductPricebookHandler {
// Trigger to associate new products with the standard price book and set list price to 0
// Trigger to associate new products with the standard and custom price books

    // Ids of the Standard and Custom Price Books
    static final String STANDARD_PRICEBOOK_ID = '01s5h00000LNNVyAAP';
    static final String CUSTOM_PRICEBOOK_ID = '01s1m000001vfsiAAA';

    // Default List Price for new products
    static final Decimal DEFAULT_LIST_PRICE = 0;

    public static void afterInsert(List<Product2> newProducts) {
        List<PricebookEntry> pricebookEntriesToInsert = new List<PricebookEntry>();
        List<PricebookEntry> pricebookEntriesToUpdate = new List<PricebookEntry>();

        // Iterate through the new products and create PricebookEntry records
        for (Product2 newProduct : newProducts) {
              // Check if the "Product Bundle" checkbox is checked
            if (newProduct.Product_Bundle__c) {
            // Create PricebookEntry for Standard Price Book
            PricebookEntry standardPricebookEntry = new PricebookEntry(
                Pricebook2Id = STANDARD_PRICEBOOK_ID,
                Product2Id = newProduct.Id,
                UnitPrice = DEFAULT_LIST_PRICE,
                IsActive = false
            );
            pricebookEntriesToInsert.add(standardPricebookEntry);

            // Create PricebookEntry for Custom Price Book
            PricebookEntry customPricebookEntry = new PricebookEntry(
                Pricebook2Id = CUSTOM_PRICEBOOK_ID,
                Product2Id = newProduct.Id,
                UnitPrice = DEFAULT_LIST_PRICE,
                IsActive = true
            );
            pricebookEntriesToInsert.add(customPricebookEntry);
        }
     }

        // Insert the PricebookEntry records
        if (!pricebookEntriesToInsert.isEmpty()) {
            insert pricebookEntriesToInsert;
        }

        // Update existing entries in the Custom Price Book to mark them as active
        if (!pricebookEntriesToUpdate.isEmpty()) {
            update pricebookEntriesToUpdate;
        }
    }
    
    
    
        public static void afterUpdate(List<Product2> newProducts, Map<Id, Product2> oldProductsMap) {
			 List<OpportunityLineItem> oliToUpdate = new List<OpportunityLineItem>();

    // Map to store Product Ids and their updated Amounts
    Map<Id, Decimal> productAmountMap = new Map<Id, Decimal>();

   for (Product2 newProduct : newProducts) {
            // Check if the Total_Bundle_Price__c field has been updated
            if (oldProductsMap.containsKey(newProduct.Id) &&
                oldProductsMap.get(newProduct.Id).Total_Bundle_Price__c != newProduct.Total_Bundle_Price__c) {
// Query for the associated OpportunityLineItems
                List<OpportunityLineItem> opportunityLineItems = [
                    SELECT Id, Final_Price__c
                    FROM OpportunityLineItem
                    WHERE Product2Id = :newProduct.Id
                ];

                // Update the Final_Price__c field based on the new Total_Bundle_Price__c
                for (OpportunityLineItem oli : opportunityLineItems) {
                    oli.Final_Price__c = newProduct.Total_Bundle_Price__c;
                    oliToUpdate.add(oli);
                }
            }
        }

        // Update the OpportunityLineItems
        if (!oliToUpdate.isEmpty()) {
            update oliToUpdate;
        }
    }
}