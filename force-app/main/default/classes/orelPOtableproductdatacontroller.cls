public with sharing class orelPOtableproductdatacontroller {
    @AuraEnabled
    public static List<OpportunityLineItem> getopproduct(string oppoId) {
        

        return[SELECT Id,OpportunityId,Name,Product2.Name,Quantity,UnitPrice,ListPrice,TotalPrice FROM OpportunityLineItem WHERE OpportunityId = :oppoId];

       
    }
                    
        }