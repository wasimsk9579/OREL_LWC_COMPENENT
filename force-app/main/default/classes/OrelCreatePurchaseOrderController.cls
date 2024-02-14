public class OrelCreatePurchaseOrderController {
    @AuraEnabled
    Public static void createOppAndOppLineItems(String oppData, String userId){
        try{
            System.debug('oppData -- ' + oppData);
            User us = [SELECT Id, FirstName, LastName, AccountId, Account.Name, ContactId FROM User WHERE Id =: userId LIMIT 1];
            
            // Create Opportunity for account
            Opportunity opp = new Opportunity();
            opp.Name = us.Account.Name + ' ';
            opp.AccountId = us.AccountId;
            opp.CloseDate = System.today();
            opp.StageName = 'Qualification';
            opp.RecordTypeId = '0121m000001qlp3AAA';
            insert opp;

            // Desearilizing the oppData
            List<object> productList = (List<object>) JSON.deserializeUntyped(oppData);
            // System.debug('productList - ' + productList);
            Set<string> productNameSet = new Set<string>();
            Map<String,Map<String,object>> oppDataFromCusMap = new Map<String,Map<String,object>>();

            for(object pr: productList){
                System.debug('pr - ' + pr);
                Map<String,object> prMap = (Map<String,object>)pr;
                productNameSet.add(String.valueOf(prMap.get('ProductName')));
                oppDataFromCusMap.put(String.valueOf(prMap.get('ProductName')), prMap);
            }


            // Opportunity products
            List<Product2> productListFromNames = [SELECT Id, Name FROM Product2 WHERE Name =: productNameSet];
            Set<Id> productIdsFromName = new Set<Id>();
            for(Product2 prod: productListFromNames){
                productIdsFromName.add(prod.Id);
            }
            
            List<PricebookEntry> prodPriceList = [SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice, IsActive, ProductCode, Product2.Name
                                                     FROM PricebookEntry 
                                                     WHERE Product2Id =: productIdsFromName
                                                     AND Pricebook2Id = '01s5h00000LNNVyAAP'];

            //Create Opportunity Products
            List<OpportunityLineItem> oppLineItems = new  List<OpportunityLineItem>();
            for(PricebookEntry priEnt : prodPriceList){
                Map<String, object> singleProduct = (Map<String, object>)oppDataFromCusMap.get(priEnt.Product2.Name);
                String stringProductQuantity = (String)singleProduct.get('ProductQuantity');
                // System.debug('testObjField - ' + singleProduct.get('ProductQuantity'));

                OpportunityLineItem lineItem = new OpportunityLineItem();
                lineItem.Product2Id = priEnt.Id;
                lineItem.Quantity = Decimal.valueOf(stringProductQuantity);
                // lineItem.TotalPrice = Decimal.valueOf(stringProductQuantity);
                lineItem.OpportunityId = opp.Id;
                lineItem.PricebookEntryId = priEnt.Id;
                lineItem.UnitPrice = priEnt.UnitPrice;

                oppLineItems.add(lineItem);
            }
            if(oppLineItems.size() > 0){
                insert oppLineItems;
            }
        }catch(Exception e){
            System.debug('Error -- ' + e.getMessage());
        }
    }
}