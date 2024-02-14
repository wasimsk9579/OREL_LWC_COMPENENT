public class QuotePDFController {

    
    public String MstrId{GET;SET;}   // we are fetching the OpportunityID as a MstrId from the current Record Page
  public Quote QuoteObj{GET;SET;}
public String baseURL{GET;SET;}
    public Integer rowNumber { get; set; }
  public String ProdId{get;set;}
  public List<QuoteLineItem> QuoteLineItems { get;  set; }
  
public static blob b;
    
    // Setting up the MstrId and the Base Url; also selecting the opportunity Fields from the current opportunity    
  public QuotePDFController(ApexPages.StandardController Controller){
      baseURL = URL.getSalesforceBaseUrl().toExternalForm();
    MstrId = controller.getId();  
      rowNumber = 1;
       loadQuoteLineItems();
      QuoteObj =  [SELECT Id, opportunityId,Name,  QuoteNumber,Subtotal,Tax, Discount, 
                          (SELECT Id,Product2Id, Quantity, UnitPrice, Product2.Name,PricebookEntry.Product2.Name,
                            Discount,LineNumber,TotalPrice, Subtotal FROM Quotelineitems) 
                               FROM Quote WHERE Id = : MstrId ];
      //
      system.debug('The Master id =' +MstrId);
  }
    
 private void loadQuoteLineItems() {
        rowNumber = 1;
      QuoteLineItems =[SELECT Id,Product2Id, Quantity, UnitPrice, Product2.Name,PricebookEntry.Product2.Name,
                           Discount,LineNumber,TotalPrice, Subtotal 
                             FROM Quotelineitem  WHERE QuoteId = :MstrId];
      //
      system.debug('The Master id 2 =' +MstrId);
  }
      
  }