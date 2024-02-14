public with sharing class GetProductOfReturnOrder {
    @AuraEnabled(cacheable=true)
public static List<cgcloud__Order_Item__c> getProductInfor(String orderId) {
    system.debug('product id' +orderId);
    List<cgcloud__Order_Item__c> returnproduct = [select Id,Name,cgcloud__Order__r.Name,cgcloud__Product__r.Name,cgcloud__Quantity__c from cgcloud__Order_Item__c where cgcloud__Order__c=:orderId];

    return returnproduct;

   

}
}