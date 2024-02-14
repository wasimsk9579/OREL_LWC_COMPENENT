public with sharing class orelsalesvfclass {
    public Id recordId {get; set;}
    public List<cgcloud__Order__c> vfdatamethod { get; set; }
    public List<cgcloud__Order__c> retpro { get; set; }
    // public cgcloud__Order_Items__c retpro { get; set; }
    public orelsalesvfclass(ApexPages.StandardController controller)
      {
       
        recordId = ApexPages.currentPage().getParameters().get('id');
        system.debug('recrd Id'+recordId);
 
         vfdatamethod =  [select Id, Name,cgcloud__Order_Template__r.Name,cgcloud__Order_Account__r.Name,
         cgcloud__Order_Date__c,cgcloud__Delivery_Date__c,cgcloud__Initiation_Date__c,cgcloud__Delivery_Recipient__r.Name,
         (select Id,Name,cgcloud__Product__r.Name,cgcloud__Quantity__c FROM cgcloud__Order_Items__r) FROM cgcloud__Order__c Where Id=:recordId ORDER BY CreatedDate DESC limit 1];
       
         system.debug('order data' +vfdatamethod);
         loadsalesproductItems();

    }

    public void loadsalesproductItems() {

      retpro = [select Id, Name,(select Id,Name,cgcloud__Product__r.Name,cgcloud__Quantity__c,cgcloud__Value__c,cgcloud__Price__c FROM cgcloud__Order_Items__r) FROM cgcloud__Order__c WHERE Id =:recordId];
  
  system.debug('return product id' +retpro);
    }
//----------------------------------------------------------------------------------------------------------------------------------
 // Method to generate and save the PDF as an attachment
//       @AuraEnabled
//     public static void generateAndSavePDF(String recordId) {
//         system.debug('recordId'+recordId);
//         Blob b;
//         String sfdcBaseURL = URL.getOrgDomainURL().toExternalForm();
//         PageReference pdfPage = new PageReference(sfdcBaseURL + '/apex/salesordervfpage?id=' + recordId);
//         system.debug('pdfPage'+pdfPage);
//         b = pdfPage.getContent();

//         System.debug('Blob content: ' + b);

//         // Create an Attachment record and attach it to the Order
//         Attachment attachment = new Attachment();
//         attachment.Name = 'Salesorder.pdf'; // Set the desired file name
//         attachment.Body = b;
//         attachment.ParentId = recordId;
//         attachment.ContentType = 'application/pdf';

//         insert attachment;
//         system.debug('attachment'+attachment);

//     }
// }

// @AuraEnabled
//     public static void generateAndSavePDF(String recordId) {
//         try {
//             // Fetch the base URL
//             String sfdcBaseURL = URL.getOrgDomainURL().toExternalForm();

//             // Construct the PageReference
//             PageReference pdfPage = new PageReference(sfdcBaseURL + '/apex/salesordervfpage?id=' + recordId);

//             // Ensure the page is set to render as PDF
//             pdfPage.getParameters().put('renderAs', 'pdf');

//             // Fetch the content of the PDF
//             Blob pdfBlob = pdfPage.getContentAsPDF();
//             System.debug('PDF Blob size: ' + pdfBlob.size());

//             // Create an Attachment record and attach it to the Order
//             Attachment attachment = new Attachment();
//             attachment.Name = 'Salesorder.pdf'; // Set the desired file name
//             attachment.Body = pdfBlob;
//             attachment.ParentId = recordId;
//             attachment.ContentType = 'application/pdf';

//             // Insert the attachment
//             insert attachment;

//             // Debug statements
//             System.debug('Attachment created successfully: ' + attachment.Id);
//         } catch (Exception e) {
//             // Handle exceptions and log error details
//             System.debug('Error generating and saving PDF: ' + e.getMessage());
//         }
//     }
// }

}

