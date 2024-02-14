public class AttachmentTriggerHandler {

    // Map to store Quote Ids and their corresponding version numbers
    private static Map<Id, Integer> quoteIdVersionMap = new Map<Id, Integer>();

    public static void beforeInsert(List<Attachment> newAttachments) {
        // Collect the unique Quote Ids from the attachments
        Set<Id> quoteIds = new Set<Id>();
        for (Attachment attachment : newAttachments) {
            if (attachment.ParentId.getSObjectType() == Quote.SObjectType) {
                quoteIds.add(attachment.ParentId);
            }
        }

        // Update the Counter__c field on the Quote records
        if (!quoteIds.isEmpty()) {
            for (Id quoteId : quoteIds) {
                quoteIdVersionMap.put(quoteId, getVersionNumber(quoteId) + 1);
            }
        }
    }

    public static void afterInsert(Set<Id> newAttachmentIds) {
        // Update the Counter__c field on the Quote records in an after insert context
        if (!quoteIdVersionMap.isEmpty()) {
            List<Quote> quotesToUpdate = new List<Quote>();
            for (Id quoteId : quoteIdVersionMap.keySet()) {
                Quote quote = new Quote(Id = quoteId, Version__c = quoteIdVersionMap.get(quoteId));
                quotesToUpdate.add(quote);
            }

            // Perform the update
            update quotesToUpdate;

            // Clear the map after the update
            quoteIdVersionMap.clear();
        }
    }

    private static Integer getVersionNumber(Id quoteId) {
        // Query for the number of attachments on the Quote
        return [SELECT count() FROM Attachment WHERE ParentId = :quoteId];
    }
}