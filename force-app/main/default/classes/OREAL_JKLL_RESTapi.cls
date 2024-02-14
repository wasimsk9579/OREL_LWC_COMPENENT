@RestResource(urlMapping='/orderJKLL/*')
global with sharing class OREAL_JKLL_RESTapi {
    @HttpPost
    global static String receivedOrderPDF(){
        try {
            RestRequest req = RestContext.request;
            String contentType = req.headers.get('Content-Type');

            if(contentType!= null && contentType.equalsIgnoreCase('application/pdf')){
                String fileName = req.params.get('fileName');
                String parentId = req.params.get('parentId');
                Blob pdfBlob = req.requestBody;
                Order ore = [Select id,JKLL_OrderNumber__c from Order where JKLL_OrderNumber__c ='parentId'];
				
                if(pdfBlob!=null){
                    Attachment attch = new Attachment();
                    attch.ParentId = ore.id;
                    attch.name = fileName + '.pdf';
                    attch.Body = pdfBlob;
                    system.debug('Received the file '+attch);
                    insert attch;
                    return 'PDF attached to the order record';
                }
                else{
                    return 'File not attached';
                }
            } 
            else {
                return 'Invalid content type';
            }
        } catch (Exception e) {
            return 'An error occurred: ' + e.getMessage();
        }
    }
}