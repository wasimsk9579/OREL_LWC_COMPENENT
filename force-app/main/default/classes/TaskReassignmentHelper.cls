public class TaskReassignmentHelper {
    /*public static void reassignTaskToProjectTeam(List<Opportunity> opportunityIds) {
         Profile projectTeamProfile = [SELECT Id FROM Profile WHERE Name = 'Project Team Profile' LIMIT 1];
         User projectTeamUser = [SELECT Id, Name FROM User WHERE ProfileId = :projectTeamProfile.Id LIMIT 1];
        List<Task> tasksToUpdate = new List<Task>();
        List<Messaging.SingleEmailMessage> emailMessages = new List<Messaging.SingleEmailMessage>();
        set<id> oppoid = new set<Id>();
        for(Opportunity op:opportunityIds)
        {
            oppoid.add(op.Id);
        System.debug('oppoid op==> ' +oppoid);
        // Fetch Tasks related to Opportunities
       // Map<Id, Id> opportunityToTaskMap = new Map<Id, Id>();
        for (Task task : [SELECT Id,OwnerId, WhatId FROM Task WHERE WhatId IN :oppoid]) {
            System.debug('task query data===' +task);
           if (op.Design_Status__c == 'Drawings Rejected')
           {
               task.OwnerId=projectTeamUser.Id;
           }
            update task;
            System.debug('task id===' +task);
        }
            
        
        System.debug('opportunityToTaskMap===>' +task.OwnerId);*/
        
        
        // Update the OwnerId of tasks
        // Update the OwnerId of tasks and send emails
       /* for (Opportunity opp : [SELECT Id, Name, Design_Status__c FROM Opportunity WHERE Id IN :opportunityIds]) {
            
            System.debug('opp id query===>' +opp);
            if (opp.Design_Status__c == 'Drawings Rejected') {
                Id opportunityId = opp.Id;
                Id taskId = opportunityToTaskMap.get(opportunityId);
                System.debug('taskId' +taskId);
                
                
               
                
                System.debug('projectTeamUser id' +projectTeamUser);
                // Update the OwnerId of the task
                Task taskToUpdate = new Task(
                    Id = taskId,
                    OwnerId = projectTeamUser.Id
                );
                
                tasksToUpdate.add(taskToUpdate);
                System.debug('taskToUpdate pt user===:' +taskToUpdate);
                //send email alert to project team
                Update tasksToUpdate;*/
                
               /* Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setToAddresses(new String[] {projectTeamUser.Email});
                email.setSaveAsActivity(False);
                email.setSubject('Task has been reassigned as drawings are rejected by customer.');
                email.setPlainTextBody('Dear ' + projectTeamUser.Name + ',\n\n'
                                       + 'The task related to Opportunity with Id ' + opportunityId + ' has been reassigned to you. '
                                       + 'Please rework on the drawings, as it has been rejected by the customer.\n\n'
                                       + 'Opportunity Details:\n'
                                       + 'Opportunity Name: ' + opp.Name + '\n'
                                       + 'Opportunity Id: ' + opportunityId + '\n\n'
                                       + 'Best regards,\n');
                
                emailMessages.add(email);
            }
        }*/
        }