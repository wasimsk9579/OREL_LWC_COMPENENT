public class ApprovalCommentHandler {
    public static void handleApprovalComments(List<Quote> quotes) {
        Set<Id> quoteIds = new Set<Id>();
        for (Quote quote : quotes) {
            quoteIds.add(quote.Id);
            System.debug(quote.Description);
        }

        Map<Id, ProcessInstance> mapQuote = new Map<Id, ProcessInstance>();

        List<ProcessInstance> processInstances = [
            SELECT Id, TargetObjectId, Status, CreatedDate,
                   (SELECT Id, ProcessInstanceId, Comments
                    FROM Steps ORDER BY CreatedDate DESC LIMIT 1)
            FROM ProcessInstance
            WHERE TargetObjectId IN :quoteIds ORDER BY CreatedDate DESC LIMIT 1
        ];

        for (ProcessInstance record : processInstances) {
            mapQuote.put(record.TargetObjectId, record);
        }

        if (mapQuote.keySet().size() > 0) {
            for (Quote quoteRecord : quotes) {
                if (mapQuote.containsKey(quoteRecord.Id)) {
                    ProcessInstance processRecord = mapQuote.get(quoteRecord.Id);
                    for (ProcessInstanceStep stepRecord : processRecord.Steps) {
                        if (String.isEmpty(quoteRecord.Description)) {
                            quoteRecord.Description = stepRecord.Comments;
                            System.debug(quoteRecord.Description);
                        } else {
                            quoteRecord.Description = '';
                            quoteRecord.Description += stepRecord.Comments;
                            System.debug(quoteRecord.Description);
                        }
                    }
                }
            }
        }
    }
}