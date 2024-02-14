// DeboardingController.apxc
public with sharing class orlDeboardingController {
    @AuraEnabled
    public static void submitDeboardingRequest(String accountId, String comments) {
        try {
            // Retrieve the Account record
            Account acc = [SELECT Id, De_Boarding_Reason__c FROM Account WHERE Id = :accountId LIMIT 1];

            // Update the Deboarding Reason field
            acc.De_Boarding_Reason__c = comments;

            // Update the Account record
            update acc;

            // You can implement additional logic here, such as sending notifications to the sales team

        } catch (Exception e) {
            // Handle exceptions as needed
            throw new AuraHandledException('Error submitting deboarding request: ' + e.getMessage());
        }
    }
}