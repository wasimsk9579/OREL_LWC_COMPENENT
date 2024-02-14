public class DeBoardDistributorController {
    @AuraEnabled
    public static Boolean sendRequest(String data, String Userid , String accountJSON){
        try {
            if(!String.isBlank(accountJSON)){
                List<Account> accountList = (List<Account>) JSON.deserializeStrict(accountJSON, List<Account>.class);
                
                if(!accountList.isEmpty()){
                    
                    Approval.ProcessSubmitRequest approvalRequest = new Approval.ProcessSubmitRequest();
                    approvalRequest.setComments('Submitting request for approval.');
                    approvalRequest.setObjectId(data);
                    approvalRequest.setSubmitterId(Userid); 
                    approvalRequest.setProcessDefinitionNameOrId('Orel_Request_Approval');
                    approvalRequest.setSkipEntryCriteria(true);
                    Approval.ProcessResult result = Approval.process(approvalRequest);

                    update accountList;
                    return true;
                }
            }
            return false;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
}