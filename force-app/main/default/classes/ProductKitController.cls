/**
* @description       : ProductKitController is for returning the Products data for drop down search and creation of product Kit
* @author            : Chinmay
* @team              : OREL
* @created On        : 315-11-2023
* @last modified on  : 
* @last modified by  :     
**/
public class ProductKitController {
    
    @AuraEnabled( cacheable = true )
    public static List<Product2> getProducts() { //String searchString
        List<Product2> productList;
        try{
            productList = [SELECT Id,Name, ProductCode,Description 
                           FROM Product2];
            system.debug('prodList------>'+productList.size()+'=='+productList);  
        }catch(exception e){
            productList = null;
            system.debug('prodList-error----->'+e);   
        }
        
        return productList;
    }
    @AuraEnabled( cacheable = true )
    public static List<Product2> getSelectedProducts(list<id> selProdsIdList) {
        system.debug('### selProdsIdList---->'+selProdsIdList);
        List<Product2> selProductList;
        try{
            selProductList = [SELECT Id,Name, ProductCode,Description
                              FROM Product2
                              WHERE Id IN : selProdsIdList order by Id DESC];
            system.debug('# sel prodList------>'+selProductList.size()+'=='+selProductList);  
        }catch(exception e){
            selProductList = null;
            system.debug('# sel prodList-error----->'+e);   
        }
        
        return selProductList;
    }
    @AuraEnabled
    public static Id createProductKit (List<ProductPartDetailsWrapper> selProdList ){ //,List<Id> removeContactIds
        system.debug('selProdList--->'+selProdList); 
        system.debug('selProdList sizeee--->'+selProdList.size()); 
        Id insertedKitId;

        List<cgcloud__Product_Part__c> kitPartsList = new List<cgcloud__Product_Part__c>();
        // Kit creation
        Product2 prod = new Product2();
        Prod.Name = 'Product Kit';
        prod.Description = 'Kit description here';
        prod.IsActive = true;
        prod.cgcloud__Description_1_Language_1__c = 'English';
        prod.cgcloud__Product_Level__c = 'Product'; //hard coded
        prod.cgcloud__Product_Template__c = 'a411m000000KyzYAAS';
        prod.cgcloud__Consumer_Goods_Product_Code__c = '0040';
        insert prod;
        system.debug('inserted prod--->'+prod);
        
        if(prod.Id != null){
            insertedKitId = prod.Id ; 
            system.debug('insertedKitId--->'+insertedKitId);
            try{
                
                //insert kit parts 
                for(ProductPartDetailsWrapper kitProd : selProdList){
                    cgcloud__Product_Part__c  kitPart =  new cgcloud__Product_Part__c();
                    kitPart.cgcloud__Parent_Product__c = insertedKitId;
                    kitPart.cgcloud__Child_Product__c = kitProd.Id;
                    KitPart.cgcloud__Quantity__c = kitProd.Qty;
             //       KitPart.Price_Ex_Tax__c = kitProd.PriceExTax;
             //       kitPart.Price_Inc_Tax__c = kitProd.PriceIncTax;
             //       kitPart.Total_Inc_Tax__c = kitProd.TotalIncTax;
             //       kitPart.Tax__c = kitProd.TaxRate; 
             //       kitPart.Total_Ex_Tax__c = kitProd.TotalExTax;
                    //kitPart.Tax_Rate__c = kitProd.TaxRate; 
                    // kitPart.Sale_Price__c = 0;
                    kitPartsList.add(kitPart);
                    
                }
                system.debug('kitPartsList size--->'+kitPartsList.size()+'----->'+kitPartsList);
                if(!kitPartsList.isEmpty()){
                    Insert kitPartsList;
                    system.debug('kit parts are inserted');
                }
            }catch(exception e){  
                system.debug('# kit parts are insertion-error----->'+e);   
            }
            
        } 
       return  insertedKitId;
        //system.debug('removeContactIds--->'+removeContactIds); 
    }
 
    public class ProductPartDetailsWrapper{
        @AuraEnabled public Id Id {get;set;}
        @AuraEnabled public String ItemCode {get;set;}
        @AuraEnabled public String ItemName {get;set;}
        @AuraEnabled public integer Qty {get;set;}
     //   @AuraEnabled public decimal PriceIncTax {get;set;}
      //  @AuraEnabled public decimal PriceExTax {get;set;}
     //   @AuraEnabled public string TaxRate {get;set;}
     //   @AuraEnabled public decimal TotalIncTax {get;set;}
     //   @AuraEnabled public decimal TotalExTax {get;set;}
    }
    
    // dummy method for testing purpose
    @AuraEnabled( cacheable = true )
    public static List<Product2> getSelectedProducts2(list<id> selProdsIdList) {
        List<Product2> selProductList;
        system.debug('### selProdsIdList888---->'+selProdsIdList);
        if(selProdsIdList != null){
          
        try{
            selProductList = [SELECT Id,Name, ProductCode,Description
                              FROM Product2
                              WHERE Id IN : selProdsIdList order by Id DESC];
            system.debug('# sel prodList------>'+selProductList.size()+'=='+selProductList);  
        }catch(exception e){
            selProductList = null;
            system.debug('# sel prodList-error----->'+e);   
        }
          
        }
        
        
        return selProductList;
    }    
    
    
}