public with sharing class orelPurchseOrderPendingController {
    @AuraEnabled
    public static List<Opportunity> getOppo(string userId) {
        
       string useraccId =[SELECT Id,AccountId FROM User where Id=:userId].AccountId;
         system.System.debug('id' +useraccId);
        // list<Opportunity> oppolist = [SELECT Id, Name, StageName, Amount, Status__c, (SELECT Id, Status, TargetObjectId, CreatedDate FROM ProcessInstances WHERE Status = 'Pending' ORDER BY CreatedDate DESC LIMIT 1) 
        // FROM Opportunity WHERE AccountId =:useraccId order by LastModifiedDate DESC];
          list<Opportunity> oppolist =[SELECT Id, Name, StageName, Amount, Status__c FROM Opportunity WHERE AccountId =:useraccId and Status__c = 'Pending' 
          ORDER BY LastModifiedDate DESC];

        system.debug('oppo pending data'+oppolist);
        
        return oppolist;
        
    }
                    
        }