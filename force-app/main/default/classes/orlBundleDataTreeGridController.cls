public class orlBundleDataTreeGridController {

     @AuraEnabled(cacheable=true)
    public static List<Product2> searchProducts(String searchTerm) {
        // Perform a SOQL query to search for products based on the provided searchTerm
        // Replace 'Product__c' with your actual object API name
       // return [SELECT Id, Name FROM Product2 WHERE Product_Bundle__C = true ];
        return [SELECT Id, Name FROM Product2 WHERE Product_Bundle__C = true AND Name LIKE :('%' + searchTerm + '%')];
    }

    @AuraEnabled(cacheable=true)
    public static List<cgcloud__Product_Part__c> getProductParts(String productId) {
         //Perform a SOQL query to retrieve related product parts based on the provided productId
         //Replace 'ProductPart__c' with your actual object API name
        List<cgcloud__Product_Part__c> childProductData= [SELECT Id, Name,Part_Description__c,Dimensions__c,cgcloud__Child_Product__c,cgcloud__Child_Product__r.Name FROM cgcloud__Product_Part__c WHERE cgcloud__Parent_Product__c = :productId];
		return childProductData;
//return [SELECT Id, Name,	cgcloud__Child_Product__c,Dimensions__c,cgcloud__Child_Product__r.Name FROM cgcloud__Product_Part__c WHERE cgcloud__Parent_Product__c = :productId];
    }
}