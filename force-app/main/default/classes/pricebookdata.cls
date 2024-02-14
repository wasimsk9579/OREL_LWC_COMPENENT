public class pricebookdata {
  
        @AuraEnabled(cacheable=true)
        public static List<ProductCategory> getCategoryProducts() {
    //         //return [SELECT Id, Name FROM ProductCategory];
    //         set <Product2> proid = [ SELECT Id, Name FROM Product2 WHERE Id IN (SELECT Product2Id FROM PricebookEntry 
    //            WHERE Pricebook2.Name = 'SriLankan Currency PB' AND Pricebook2.IsActive = TRUE)].Id;
 
    //    return [SELECT Id, Name,Product2 FROM ProductCategory
    //                          WHERE Id IN (SELECT Id, ProductCategory FROM Product2 WHERE Id =:proid)];


    Set<Id> proIdSet = new Set<Id>();
    list<Account> priid= [select Price_Book__c from Account];
       
    // Query for Product2 records and populate proIdSet with their Ids
    List<PricebookEntry> pricebookEntries = [SELECT Product2Id FROM PricebookEntry 
                                             WHERE Pricebook2.Name = 'SriLankan Currency PB' AND Pricebook2.IsActive = TRUE];

    for (PricebookEntry entry : pricebookEntries) {
        proIdSet.add(entry.Product2Id);
    }

    // Query for ProductCategory records where Product2 Id is in proIdSet
    return [SELECT Id, Name, Description
    FROM ProductCategory
    WHERE Id IN (
        SELECT ProductCategoryId
        FROM ProductCategoryProduct
        WHERE ProductId =:proIdSet)];
}


    
        @AuraEnabled
        public static void updateAccountCategoryField(Id accountId, String selectedCategories) {
            Account acc = [SELECT Id, Categories__c FROM Account WHERE Id = :accountId];
            acc.Categories__c = selectedCategories;
            update acc;
        }
    
        @AuraEnabled(cacheable=true)
        public static String getAccountCustomCategoryField(Id accountId) {
            Account acc = [SELECT Categories__c FROM Account WHERE Id = :accountId];
            return acc.Categories__c;
        }
    }