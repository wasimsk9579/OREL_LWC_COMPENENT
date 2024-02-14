public with sharing class Productnproductcontroller {
    @AuraEnabled
    public static List<Product2> getProducts(String Product2Id) {
        // Implement your logic to fetch products based on the provided Product2Id
        // For example: SELECT Id, Name FROM Product2 WHERE Id = :Product2Id
        List<Product2> productList = [SELECT Id, Name FROM Product2 WHERE Id = :Product2Id];
        return productList;
    }
}