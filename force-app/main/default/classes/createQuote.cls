public with sharing class createQuote {
    
    // Change return type to List<Id> to match the InvocableMethod signature
    @InvocableMethod(label='Create Standard Quote')
    public static List<Id> createStandardQuote(List<Id> opportunityIds) {
        List<Id> createdQuoteIds = new List<Id>();
        
        for (Id opportunityId : opportunityIds) {
            Opportunity opp = [SELECT Id, AccountId,CloseDate, Name, RecordTypeId,Amount,Orl_Additional_Cost__c,Orl_Commissioning_Cost__c,
                                  Orl_Labour_Cost__c, Orl_Transport_Cost__c,VAT_Percentage__c, VAT__c,Colour__c, (SELECT Id, Product2Id, Quantity, UnitPrice, Product2.Name,
                                    Final_Price__c FROM OpportunityLineItems) 
                                FROM Opportunity WHERE Id = :opportunityId];
            if(opp.amount<= 0){
                opp.amount.addError('Please add the products first');
            }
            else{
         Account oppAccount = [SELECT Id, Name, (SELECT Id, Name, Email, phone FROM Contacts) 
                                  FROM Account WHERE Id = :opp.AccountId];
            
            Contact relatedContact = new Contact(); // Initialize a Contact object
            if (oppAccount.Contacts != null && !oppAccount.Contacts.isEmpty()) {
                // Retrieving the first contact related to the account, you might refine this logic as per your use case
                relatedContact = oppAccount.Contacts[0];
            }
            
            
            // Determine the Pricebook based on the Opportunity's Record Type Name
            String recordTypeName = [SELECT Name FROM RecordType WHERE Id = :opp.RecordTypeId].Name;  
            Pricebook2 selectedPricebook = [SELECT Id FROM Pricebook2 WHERE Name = 'SriLankan Currency PB' LIMIT 1];
            
            Quote newQuote = new Quote(
                OpportunityId = opp.Id,
             //   Additional_Cost__c = opp.Orl_Additional_Cost__c,
             //   Commissioning_Cost__c= opp.Orl_Commissioning_Cost__c,
             //   Labour_Cost__c= opp.Orl_Labour_Cost__c,
             //   Transport_Cost__c=opp.Orl_Transport_Cost__c,
                Name = opp.Name + ' Quote',
                Pricebook2Id = selectedPricebook.Id,
                 ContactId = relatedContact.Id,
                Email = relatedContact.Email,
                Phone = relatedContact.Phone,
                VAT__c = opp.VAT__c,
                VAT_Percentage__c = opp.VAT_Percentage__c,
                Colour__c = opp.Colour__c,
                Standard__c = opp.Standards__c,
                Protection__c = opp.Protection__c,
                Validity__c = opp.Validity__c,
                AFP__c = opp.AFP__c,
                PFP__c = opp.PFP__c,
                TPC__c = opp.TPC__c,
                Currency__c = opp.Currency__c,
                Exchange_Rate__c = opp.Exchange_Rate__c,
                Freight__c = opp.Freight__c,
                Insurance__c = opp.Insurance__c,
                Tax=0
            );
            insert newQuote; 
            
            List<QuoteLineItem> lineItems = new List<QuoteLineItem>();
            for (OpportunityLineItem oli : opp.OpportunityLineItems) {
                // Query the Price Book Entry for this OpportunityLineItem
                PricebookEntry pricebookEntry = [SELECT Id, UnitPrice, Product2Id FROM PricebookEntry 
                                                WHERE Product2Id = :oli.Product2Id AND Pricebook2Id = :selectedPricebook.Id LIMIT 1];
                
                QuoteLineItem lineItem = new QuoteLineItem(
                    QuoteId = newQuote.Id, 
                    Product2Id = oli.Product2Id,
                    Quantity = oli.Quantity,
                    UnitPrice = oli.UnitPrice,
                    PricebookEntryId = pricebookEntry.Id,
                    Final_Price__c = oli.Final_Price__c
                   
                );
                lineItems.add(lineItem);
            } 
            insert lineItems; 
            
            // Add the ID of the created Quote to the list
            createdQuoteIds.add(newQuote.Id);
        }
        }
        return createdQuoteIds;
    }
}