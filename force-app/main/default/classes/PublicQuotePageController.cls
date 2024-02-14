Global without sharing class PublicQuotePageController {
    @AuraEnabled
    global static void updateQuoteStatus(String quoteId) { //updateQuoteStatus
        system.debug('quoteId---->'+quoteId);
        List<Quote> updateQuoteList = new List<Quote>();
        try{
                  
        List<Quote> quoteList = [SELECT Id,name, Status, Additional_Cost__c FROM Quote WHERE Id = :quoteId];
            system.debug('quoteList--->'+quoteList);  
        for(Quote q :quoteList){
          System.debug('quotes'+q);
        q.Status = 'Accepted';
        updateQuoteList.add(q);  
        }
            system.debug('updateQuoteList--->'+updateQuoteList);  
        if(!updateQuoteList.isEmpty()){
          update updateQuoteList;  
        }
            
        }catch(exception e){
           system.debug('updateQuoteStatus exception------->'+e); 
        }
    }
    @AuraEnabled
    global static void updateQuotedenied(String quoteId) {
        system.debug('quoteId---->'+quoteId);
        List<Quote> deniedQuoteList = new List<Quote>();
        try{
                  
        List<Quote> quoteList = [SELECT Id,name, Status, Additional_Cost__c FROM Quote WHERE Id = :quoteId];
            system.debug('quoteList--->'+quoteList);  
        for(Quote q :quoteList){
          System.debug('quotes'+q);
        q.Status = 'Denied';
        deniedQuoteList.add(q);  
        }
            system.debug('updateQuoteList--->'+deniedQuoteList);  
        if(!deniedQuoteList.isEmpty()){
          update deniedQuoteList;  
        }   
         }catch(exception e){
           system.debug('updateQuoteStatus exception------->'+e); 
        }
    }
    @AuraEnabled(cacheable=true)
    global static List<Quote> getQuoteDetails(String quoteId){
        System.debug('Fetching Quote Details for Id: ' + quoteId);
        try {
            List<Quote> qry = [SELECT Id, Name, Status, Additional_Cost__c FROM Quote WHERE Id = :quoteId LIMIT 1];
            System.debug('Query result for Quote Details: ' + qry);
            return qry;
        } catch (Exception e) {
            // Handle exceptions appropriately
            System.debug('Exception in getQuoteDetails: ' + e.getMessage());
            return null;
        }
    }
}