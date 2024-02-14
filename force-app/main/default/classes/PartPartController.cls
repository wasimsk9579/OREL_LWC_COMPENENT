public  class PartPartController {

    @AuraEnabled
    public static list<cgcloud__Product_Part__c>  PartPartController(Id ParentId) {

        List<cgcloud__Product_Part__c> prodlist = [select id,Dimensions__c , name from cgcloud__Product_Part__c where cgcloud__Parent_Product__c =: ParentId];
   
        Return prodlist;

    }

    @AuraEnabled
   public static string updatepartdetails(Object  partData){

    List<cgcloud__Product_Part__c> partlistlist = (List<cgcloud__Product_Part__c>) JSON.deserialize(JSON.serialize (partData), List<cgcloud__Product_Part__c>.Class);

    Update partlistlist;
    return 'success';

   }
 

}