public class productFilterController {

    @AuraEnabled(cacheable=true)
    public static List<Product2> getFilteredProducts(String itemType, String sheetType, string category) {
        // Query to fetch products based on the selected picklist values
        String queryString = 'SELECT Id, Name, Description, cgcloud__Description_1__c FROM Product2 WHERE';
        
        if (!String.isBlank(itemType)) {
            queryString += ' Item_Type__c = :itemType';
        }

        if (!String.isBlank(sheetType)) {
            if (!String.isBlank(itemType)) {
                queryString += ' AND';
            }
            queryString += ' Sheet_Type__c = :sheetType';
        }

        if (!String.isBlank(category)) {
            if (!String.isBlank(itemType) || !String.isBlank(sheetType)) {
                queryString += ' AND';
            }
            queryString += ' cgcloud__Category__c = :category';
        }

        List<Product2> prod = Database.query(queryString);
        return prod;
    }
    
    @AuraEnabled
    public static List<cgcloud__Product_Part__c> createProductParts(Id parentId, List<Product2> selectedProducts) {
        List<cgcloud__Product_Part__c> productParts = new List<cgcloud__Product_Part__c>();
    
        for (Product2 selectedProduct : selectedProducts) {
            cgcloud__Product_Part__c part = new cgcloud__Product_Part__c();
            part.cgcloud__Parent_Product__c = parentId;
            part.cgcloud__Child_Product__c = selectedProduct.Id; 
            part.cgcloud__Valid_From__c = System.today();
            part.cgcloud__Valid_Thru__c = System.today().addDays(100);
            productParts.add(part);
        }
    
        if (!productParts.isEmpty()) {
            insert productParts;
        }
    
        // Query the inserted product parts and return them
        List<cgcloud__Product_Part__c> insertedProductParts = [SELECT Id, Name, cgcloud__Child_Product__c, Dimensions__c, cgcloud__Child_Product__r.Name FROM cgcloud__Product_Part__c WHERE cgcloud__Parent_Product__c = :parentId];
        
        return insertedProductParts;
    }

    
     @AuraEnabled
    public static List<cgcloud__Product_Part__c> getInsertedProductParts(Id parentId) {
        System.debug('method Invoking');
        // Query inserted product parts based on the parent ID
    
    List<cgcloud__Product_Part__c> productParts = [SELECT Id, Name,Part_Description__c, cgcloud__Child_Product__c, Dimensions__c, cgcloud__Child_Product__r.Name FROM cgcloud__Product_Part__c WHERE cgcloud__Parent_Product__c = :parentId];
    
    // Print the result to the debug logs
    System.debug('Product Parts: ' + productParts);

    // Return the result
    return productParts;
    }
}