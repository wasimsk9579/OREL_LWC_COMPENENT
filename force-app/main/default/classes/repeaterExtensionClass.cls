public class repeaterExtensionClass {

      public String MstrId{GET;SET;}
    public List<QuoteLineItem> QuoteLineItems { get;  set; }
    public List<cgcloud__Product_Part__c> ProductsWith { get; set; }
        public List<Product2> Prod { get; set; }
    public String baseURL{GET;SET;}
     public Quote QuoteObj{GET;SET;}
    
public repeaterExtensionClass(ApexPages.StandardController Controller){
      baseURL = URL.getSalesforceBaseUrl().toExternalForm();
    MstrId = controller.getId();  
    
       QuoteObj =  [SELECT Id, opportunityId,Name,  QuoteNumber,Subtotal,Tax, Discount,CreatedBy.name,	Grand_Total_price__c,Vat_Amount__c,Price__c, 
                          (SELECT Id,Product2Id, Quantity, UnitPrice, Product2.Name,PricebookEntry.Product2.Name,
                            Discount,LineNumber,TotalPrice, Subtotal FROM Quotelineitems) 
                               FROM Quote WHERE Id = : MstrId];
        
        
       QuoteLineItems =[SELECT Id,Product2Id, Quantity, UnitPrice, Product2.Name,PricebookEntry.Product2.Name,
                             Discount,LineNumber,TotalPrice, Subtotal 
                             FROM Quotelineitem  WHERE QuoteId = :MstrId];     
    
    List<Id> productIds = new List<Id>();
        for (QuoteLineItem lineItem : QuoteLineItems) {
            productIds.add(lineItem.Product2Id);
        }

// ProductsWith=[SELECT Id, name, cgcloud__Quantity__c,cgcloud__Parent_Product__r.name from cgcloud__Product_Part__c where cgcloud__Parent_Product__c =:productIds ];
    
    Prod = [Select Id, Name,Total_Bundle_Price__c,
                (Select Id, name,cgcloud__Quantity__c,cgcloud__Child_Product__r.Name From cgcloud__Product_Parts__r  ) from Product2 where Id=: productIds];
    
 //   system.debug('the producyts are== '+ProductsWith);
    
    System.debug('The Original products are == '+Prod);
    
}
  
    
}
    
    
    
    
/*    
    // Helper method to get a list of Product Ids
    public List<Id> getProductIds() {
        List<Id> productIds = new List<Id>();
        for (QuoteLineItem lineItem : QuoteLineItems) {
            productIds.add(lineItem.Product2Id);
        }
        return productIds;
    }

    // Helper method to get a list of Product Names
    public List<String> getProductNames() {
        List<String> productNames = new List<String>();
        for (QuoteLineItem lineItem : QuoteLineItems) {
            productNames.add(lineItem.Product2.Name);
        }
        return productNames;
    }
 */