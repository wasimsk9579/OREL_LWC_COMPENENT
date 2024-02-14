public class demoProductBundleController {

     @AuraEnabled(cacheable=true)
    public static List<Product2> searchProducts(String searchTerm) {
         return [SELECT Id, Name FROM Product2 WHERE Name LIKE :searchTerm];
    }
    
    
     @AuraEnabled
    public static List<Custom_Product__c> getProductParts(String searchTerm) {
        //system.debug('product id from js---->'+productId);
               return  [SELECT Id, Name, C_Product_Dimension__c, C_Product_Bundle_Name__c, C_Quantity__c FROM Custom_Product__c WHERE C_Product_Bundle_Name__c  LIKE :searchTerm];
      //  system.debug('childProductData --->'+childProductData);
        
    }

}