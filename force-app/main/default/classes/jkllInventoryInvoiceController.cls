/*
 * ClassName: jkllInventoryInvoiceController
 * Author: Pooja V
 * Date: 09-11-2023
 * Description: This class handles the upload PDF and map it to the particular orderIds for JKLL inventory invoices.
 */

@RestResource(urlMapping='/uploadPDF/*')
global with sharing class jkllInventoryInvoiceController {
    
/* 
 * An HTTP POST method decorated with @HttpPost to handle PDF file uploads.
 * It retrieves the request, checks for the presence of a request body, and fetches parameters.
*/
    @HttpPost
    global static String uploadPDF() {
        RestRequest req = RestContext.request;
        if (req.requestBody == null) {
            return 'No file found in the request body';
        }
        String orderId = req.params.get('orderId');
        String pdfName = req.params.get('pdfName');
        Blob pdfBody = req.requestBody;        
      		System.debug(pdfBody);
/*
 * It queries the Salesforce database to find an Orl_invoice__c record based on the provided order ID
*/
        Orl_invoice__c invoiceRecord = [SELECT Id, Name, Orl_Invoice_No__c FROM Orl_invoice__c WHERE Orl_Invoice_No__c = :orderId LIMIT 1];        
        if (invoiceRecord == null) {
            return 'Invoice record not found';
        }
        
/*
 * The filename is formatted using the order ID, PDF name, and the current timestamp.
 * The PDF is inserted as an Attachment associated with the found invoice record.
 * If successful, a success message is returned. If there's an error, an error message is returned.
*/
        String fileName = orderId + '_' + pdfName + '_' + Datetime.now().format('dd-MM-yyyy HH:mm:ss') + '.pdf';
        try {
            insert new Attachment(
                Body = pdfBody,
                Name = fileName,
                ParentId = invoiceRecord.Id
            );
            return 'PDF uploaded successfully as Attachment';
        } catch(Exception e) {
            return 'Error uploading PDF: ' + e.getMessage();
        }
    }
}