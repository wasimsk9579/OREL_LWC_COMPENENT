public with sharing class orelAddCategorytoAccountcontroller {
   
        @AuraEnabled(cacheable=true)
        public static List<ProductCategory> getCategoryProducts() {
    return [SELECT Id, Name FROM ProductCategory];
    
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