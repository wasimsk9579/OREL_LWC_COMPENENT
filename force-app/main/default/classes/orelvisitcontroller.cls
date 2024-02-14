public with sharing class orelvisitcontroller {
    @AuraEnabled
    public static List<Visit> getvisit(string userId) {
       string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
         system.System.debug('id' +useraccId);
         List<Visit> retvisitlist =  [SELECT Id, Name, Status, VisitPriority,(select id,Name from Visitors), ActualVisitStartTime,AccountId, ActualVisitEndTime FROM Visit where AccountId=:useraccId];
       
         system.debug('inventry record' +retvisitlist);

        
         return retvisitlist;
    

    }
}