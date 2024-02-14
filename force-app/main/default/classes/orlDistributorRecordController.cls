@RestResource(urlMapping='/update/distributorRecordId/*')
global with sharing class orlDistributorRecordController {

    public class DistributorUpdateRequest {
        public String distributorId;
        public String name;
        public String title;
        public String email;
        public String description;
        public String bankGuarantee;
        public String industry;
        public Integer numberOfEmployees;
        public String bprCode;
        public String phone;
        public String orlTaxType;
        public String vatNumber;
        public String type;
    }
@AuraEnabled
    @HttpPost
    global static String updateDistributor() {
        try {
            RestRequest req = RestContext.request;

            // Access request parameters
            String distributorId = req.params.get('distributorId');

            // Access request body
            String requestBody = req.requestBody.toString();
            DistributorUpdateRequest updateRequest = (DistributorUpdateRequest)JSON.deserialize(requestBody, DistributorUpdateRequest.class);

             // Check if the provided distributorId exists in the database
            List<Account> existingRecords = [SELECT Id FROM Account WHERE Id = :distributorId LIMIT 1];
            if (existingRecords.isEmpty()) {
                return 'Distributor record with Id ' + distributorId + ' not found.';
            }

            // Retrieve the existing distributor record
            Account distributorRecord = existingRecords[0];
            
            // Update the fields
            distributorRecord.Name = updateRequest.name;
            distributorRecord.Title__c = updateRequest.title;
            distributorRecord.Email__c = updateRequest.email;
            distributorRecord.Description = updateRequest.description;
            distributorRecord.Bank_Guarantee__c = updateRequest.bankGuarantee;
            distributorRecord.Industry = updateRequest.industry;
            distributorRecord.NumberOfEmployees = updateRequest.numberOfEmployees;
            distributorRecord.BPR_code__c = updateRequest.bprCode;
            distributorRecord.Phone = updateRequest.phone;
            //distributorRecord.Orl_Tax_Type__c = updateRequest.orlTaxType;
            distributorRecord.VAT_Number__c = updateRequest.vatNumber;
            //distributorRecord.Type__c = updateRequest.type;
       
            update distributorRecord;
            return 'Distributor record updated successfully'+ JSON.serialize(distributorRecord);
        } catch (Exception e) {
            return 'Error updating distributor record: ' + e.getMessage();
        }
    }
}