public without sharing class OrlDistributorCreatePOController {
    @AuraEnabled
    public static List<Product2> getProductsForDistributor(String currentUserId){
        try {
            System.debug('currentUserId -- ' + currentUserId);
            String priceBookId =  OrlDistributorCreatePOController.getUserPriceBookId(currentUserId);
            system.debug('pricebookId' +priceBookId);
            List<String> categoryList =  OrlDistributorCreatePOController.getProductCategories(currentUserId);
            System.debug('categoryList -- ' + categoryList);
            

            List<Product2> productList = [Select Id, Name, ProductCode, 
                                            (SELECT Id, Pricebook2Id, UnitPrice 
                                            FROM PricebookEntries 
                                            WHERE Pricebook2Id =: priceBookId), 
                                            (SELECT Id, Name, ProductCategory.Name 
                                            FROM ProductCategoryProducts
                                            WHERE ProductCategory.Name =: categoryList) 
                                            FROM Product2 
                                            WHERE Id 
                                            IN (
                                                SELECT productId 
                                                FROM ProductCategoryProduct 
                                                WHERE ProductCategory.Name =: categoryList
                                                AND ProductCategory.Name != null 
                                                AND ProductCategory.Name != ''
                                                ) 
                                        ];

            // List<PricebookEntry> prEntryList = [SELECT Id, Name, Product2Id, Pricebook2Id, UnitPrice, ProductCode, IsActive
            //                                      FROM PricebookEntry
            //                                      WHERE IsActive = true 
            //                                      AND Pricebook2Id ='01s5h00000LNNVyAAP'
            //                                     ];
            System.debug('productList -- ' + productList);
           
            return productList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string createPurchaseOrder(String userId, String poLineItemsData){
        try {
            System.debug('Data - ' + poLineItemsData);
            System.debug('UserId - ' + userId);
            User us = [SELECT Id, FirstName, LastName, AccountId, Account.Name, ContactId FROM User WHERE Id =: userId LIMIT 1];
            RecordType recordId = [SELECT Id, Name FROM RecordType where Name = 'Purchase'];
            Pricebook2 pbid = [SELECT Id, Name FROM Pricebook2 where Name= 'Standard Price Book'];
            // Create Opportunity for account
            Opportunity opp = new Opportunity();
            opp.Name = us.Account.Name + ' ';
            opp.AccountId = us.AccountId;
            opp.CloseDate = System.today();
            opp.StageName = 'Qualification';
            opp.RecordTypeId = recordId.Id;
            insert opp;
            
            List<object> productList = (List<object>) JSON.deserializeUntyped(poLineItemsData);
            Map<Id,object> prIdObjMap = new Map<Id,object>();
            Set<Id> prodIdSet = new Set<Id>();

            for(object pr: productList){
                System.debug('pr - ' + pr);
                Map<String,object> prMap = (Map<String,object>)pr;
                prIdObjMap.put(String.valueOf(prMap.get('Id')), prMap);
                prodIdSet.add(String.valueOf(prMap.get('Id')));
            }
            
            // Set<Id> prodIdSet = prIdObjMap.keySet();
            System.debug('prodIdSet -' + prodIdSet);
            List<PricebookEntry> prodPriceList = [SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice
                                                    FROM PricebookEntry 
                                                    WHERE Product2Id =: prodIdSet
                                                    AND Pricebook2Id =:pbid.Id];

            // System.debug('prodPriceList - ', prodPriceList);
            List<OpportunityLineItem> oppLineItems = new  List<OpportunityLineItem>();
            for(PricebookEntry pre: prodPriceList){
                System.debug(prIdObjMap.get(pre.Id));
                Map<String,object> singleProductMap = (Map<String,object>)prIdObjMap.get(pre.Id);

                OpportunityLineItem lineItem = new OpportunityLineItem();
                lineItem.Product2Id = pre.Product2Id;
                lineItem.Quantity = Integer.valueOf(singleProductMap.get('AskedQuantity'));
                lineItem.OpportunityId = opp.Id;
                lineItem.PricebookEntryId = pre.Id;
                lineItem.UnitPrice = pre.UnitPrice;

                oppLineItems.add(lineItem);
            }
            if(oppLineItems.size() > 0){
                insert oppLineItems;
            }

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return 'Success';
    }

    public static String getUserPriceBookId(String userId) {
        try {
            String userAccountPriceBook = [SELECT 
                                            Id, Name, Account.Price_Book__c 
                                            FROM User
                                            WHERE Id =: userId].Account.Price_Book__c;

           System.debug('userAccountPriceBook -- ' + userAccountPriceBook);
           return userAccountPriceBook;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public static List<String> getProductCategories(String userId) {
        try {
            String categoryString = [SELECT Id, Name, Account.Categories__c 
                                    FROM User
                                    WHERE Id =: userId].Account.Categories__c;

            List<String> categoryList = categoryString.split(',');
        return categoryList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string createOppAndOppLineItems(String userId, String poLineItemsData){
        try {
            List<OrlDistributorCreatePOWrapper> lineItemWrappers = (List<OrlDistributorCreatePOWrapper>)JSON.deserialize(poLineItemsData, List<OrlDistributorCreatePOWrapper>.class);
            String OppRecordTypeId = [SELECT Id, Name 
                                        FROM RecordType 
                                        WHERE sObjectType='opportunity' 
                                        AND Name = 'Purchase'
                                     ].Id;

            User us = [SELECT Id, FirstName, LastName, AccountId, Account.Name, Account.Price_Book__c, ContactId
                                FROM User 
                                WHERE Id =: userId 
                                LIMIT 1
                            ];

            Set<String> productIdSet = new Set<String>();
            for(OrlDistributorCreatePOWrapper ltw : lineItemWrappers){
                productIdSet.add(ltw.Id);
            }

            Map<String, PricebookEntry> productPriceBookEntryMap = new Map<String, PricebookEntry>();
            for(PricebookEntry prEntry : [SELECT Id, Pricebook2Id, Product2Id, UnitPrice FROM PricebookEntry WHERE Product2Id =: productIdSet AND Pricebook2Id =: us.Account.Price_Book__c]){
                productPriceBookEntryMap.put(prEntry.Product2Id, prEntry);
            }
            
            Opportunity opp = new Opportunity();
            opp.Name = us.Account.Name + ' ';
            opp.AccountId = us.AccountId;
            opp.CloseDate = System.today();
            opp.StageName = 'Qualification';
            opp.RecordTypeId = OppRecordTypeId;
            insert opp;
            
            System.debug('lineItemWrappers -- ' + lineItemWrappers);
            List<OpportunityLineItem> oppLineItems = new  List<OpportunityLineItem>();
            for(OrlDistributorCreatePOWrapper prdt : lineItemWrappers){
                System.debug('prdt -- ' + prdt.Id);
                OpportunityLineItem lineItem = new OpportunityLineItem();
                lineItem.Product2Id = prdt.Id;
                lineItem.Quantity = prdt.AskedQuantity;
                lineItem.OpportunityId = opp.Id;
                lineItem.PricebookEntryId = productPriceBookEntryMap.get(prdt.Id).Id;
                lineItem.UnitPrice = prdt.productPrice;

                oppLineItems.add(lineItem);
            }

            insert oppLineItems;

            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}