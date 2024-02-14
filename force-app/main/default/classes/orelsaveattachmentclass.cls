public with sharing class orelsaveattachmentclass {
    public ApexPages.StandardController stdController;
    public String recId { get; set; }
    public String recordId { get; set; }
    public Blob pdfBlob { get; set; }
    public Boolean showSuccessMessage { get; set; }
    PageReference pdfPage;

    public orelsaveattachmentclass(ApexPages.StandardController controller) {
        stdController = controller;
        recordId = controller.getId();
        recId = ApexPages.currentPage().getParameters().get('id');
        // No need to query the record again since you already have the Id
    }

    public PageReference pdfAction() {
        System.debug('recId: ' + recId);

        String sfdcBaseURL = URL.getOrgDomainURL().toExternalForm();
        pdfPage = new PageReference(sfdcBaseURL + '/apex/salesordervfpage?id=' + recId);

        pdfBlob = pdfPage.getContent();

        try {
            // Increment the version number for the new attachment
            Integer versionNumber = [SELECT count() FROM Attachment WHERE ParentId = :recId] + 1;

            // Create the attachment name with the incremented version number
            String attachmentName = 'SalesOrder' + versionNumber;

            Attachment attachment = new Attachment();
            attachment.Body = pdfBlob;
            attachment.Name = attachmentName;
            attachment.ContentType = 'application/pdf';
            attachment.ParentId = recId;
            insert attachment;

            // Log attachment info for debugging
            System.debug('Attachment inserted: ' + attachment.Id);

            // Set showSuccessMessage to true after successful action
            showSuccessMessage = true;

        } catch (Exception e) {
            // Log any exceptions
            System.debug('Exception in pdfAction: ' + e.getMessage());
        }

        return pdfPage;
    }

    public PageReference cancel() {
        PageReference pdf = new PageReference('/' + recId);
        pdf.setRedirect(true);
        return pdf;
    }
}
