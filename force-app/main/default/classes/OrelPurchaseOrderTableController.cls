public class OrelPurchaseOrderTableController {
    @AuraEnabled
    public static List<Opportunity> getoppordata(string userIds) {
        
       string useraccId =[SELECT Id,AccountId FROM User where Id=:userIds].AccountId;
         system.System.debug('id' +useraccId);
        // list<Opportunity> oppolist = [SELECT Id, Name, StageName, Amount, Status__c, (SELECT Id, Status, TargetObjectId, CreatedDate FROM ProcessInstances WHERE Status = 'Pending' ORDER BY CreatedDate DESC LIMIT 1) 
        // FROM Opportunity WHERE AccountId =:useraccId order by LastModifiedDate DESC];
           
          list<Opportunity> oppolist =[SELECT Id, Name,Description,CreatedDate, StageName, Amount, Status__c, Account.Deboarding_process_status__c FROM Opportunity WHERE AccountId =:useraccId ORDER BY LastModifiedDate DESC];
        system.debug('oppo pending data'+oppolist);
        
        return oppolist;
        
    }
                    
        }