public class TaskCreationonOppHelper {
    public static void createTaskOnOpportunity(List<Quote> newQuotes, Map<Id, Quote> oldMap) {
        List<Task> newTasks = new List<Task>();
        Set<Id> opportunityIds = new Set<Id>();

        for (Quote newQuote : newQuotes) {
            Quote oldQuote = oldMap.get(newQuote.Id);

            // Check if the status changed to "Accepted"
            if (newQuote.Status == 'Accepted' && (oldQuote == null || oldQuote.Status != 'Accepted')) {
                opportunityIds.add(newQuote.OpportunityId);
            }
        }

        // Create tasks for each Opportunity
        for (Id opportunityId : opportunityIds) {
            Task newTask = new Task();
            newTask.WhatId = opportunityId;
            newTask.OwnerId = getProjectTeamUserId(); // Call a method to get the project team user's Id
            newTask.Status = 'Open';
            newTask.Priority = 'Normal';
            newTask.Subject = 'Drawings';
            newTask.Description = 'Task created when Quote status changed to Accepted for design of products drawing as quotation has been accepted by customer.';
            newTasks.add(newTask);
        }

        // Insert the new tasks
        if (!newTasks.isEmpty()) {
            insert newTasks;

            // Send email alert to the project team
            List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();

            Id projectTeamUserId = getProjectTeamUserId();

            if (projectTeamUserId != null) {
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setTargetObjectId(projectTeamUserId);
                email.setSaveAsActivity(false); // 'False' should be lowercase
                email.setSubject('New Task Created ID: ' + newTasks[0].Id);
                email.setPlainTextBody('Dear Project Team,\n\n'+
                        'I trust this message finds you well.\n'+
                        'I wanted to inform you that a new task has been assigned to you. Your expertise and dedication are invaluable, and I am confident in your ability to handle this task effectively.\n'+
                         'Please review the details and take the necessary actions accordingly.\n\n' +
                        'Task ID: ' + newTasks[0].Id + '\n' + 
                        'Opportunity Name: ' + newTasks[0].What.Name+ '\n' + 
                         'Feel free to reach out if you have any questions or need further clarification.\n'+
                                       
                                       'Thanks & Regards \n'+
                                       'OREL');
                emails.add(email);

                // Send emails
                Messaging.sendEmail(emails);
            }
        }
    }

    public static Id getProjectTeamUserId() {
        String ptProfileId = [SELECT Id FROM Profile WHERE Name = 'Project Team Profile' LIMIT 1].Id;
        User projectTeamUser = [SELECT Id FROM User WHERE ProfileId = :ptProfileId LIMIT 1];

        if (projectTeamUser != null) {
            return projectTeamUser.Id;
        }
        return null;
    }

    // Trigger handler
    public void handle(List<Quote> newQuotes, Map<Id, Quote> oldMap) {
        createTaskOnOpportunity(newQuotes, oldMap);
    }
    
}