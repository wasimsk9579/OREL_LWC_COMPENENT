public class ProductPartPriceUpdation {
    
 public static void handle(List<cgcloud__Product_Part__c> newProductParts, Map<Id, cgcloud__Product_Part__c> oldProductPartsMap, Boolean isDelete) {
        Set<Id> productIdsToUpdate = new Set<Id>();

        if (!isDelete) {
            // Check if there are Product Part records related to Products
            for (cgcloud__Product_Part__c part : newProductParts) {
                productIdsToUpdate.add(part.cgcloud__Parent_Product__c);
            }
        } else {
            // For after delete, use oldProductPartsMap to get the parent product IDs
            for (cgcloud__Product_Part__c part : oldProductPartsMap.values()) {
                productIdsToUpdate.add(part.cgcloud__Parent_Product__c);
            }
        }

        // Fetch Product records related to Product Part records
        List<Product2> productsToUpdate = [SELECT Id, (SELECT Id, Final_Price__c FROM cgcloud__Product_Parts__r) FROM Product2 WHERE Id IN :productIdsToUpdate];

        // Calculate Combined Price for each Product
        for (Product2 product : productsToUpdate) {
            Decimal totalFinalPrice = 0;

            for (cgcloud__Product_Part__c part : product.cgcloud__Product_Parts__r) {
                totalFinalPrice += part.Final_Price__c;
            }

            // Update the Combined Price on the Product record
            product.Total_Bundle_Price__c = totalFinalPrice;
        }

        // Update Product records
        update productsToUpdate;
    }
}