public with sharing class orelvfcontroller {
    // public Id recordId {get; set;}
    // public cgcloud__Order__c vfdatamethod { get; set; }
    // public List<cgcloud__Order_Item__c> retpro { get; private set; }
    // public orelvfcontroller(ApexPages.StandardController controller)
    //   {
       
    //     recordId = ApexPages.currentPage().getParameters().get('id');
    //     system.debug('recrd Id'+recordId);
 
    //      vfdatamethod =  [select Id, Name,cgcloud__Order_Template__r.Name,cgcloud__Order_Account__r.Name,
    //      cgcloud__Order_Date__c,cgcloud__Delivery_Date__c,cgcloud__Initiation_Date__c,cgcloud__Delivery_Recipient__r.Name,
    //      (select Id,Name,cgcloud__Product__r.Name,cgcloud__Quantity__c FROM cgcloud__Order_Items__r) FROM cgcloud__Order__c Where Id=:recordId ORDER BY CreatedDate DESC limit 1];
       
    //      system.debug('order' +vfdatamethod);

    //   }
    //      private void loadreturnproductItems() {
  
    //       retpro = [select Id,Name,cgcloud__Order__r.Name,cgcloud__Product__r.Name,cgcloud__Quantity__c 
    //                                    from cgcloud__Order_Item__c where cgcloud__Order__c=:recordId];
    //     //
    //     system.debug('return product' +retpro);
       
    // }

    
      public Id recordId {get; set;}
      public List<cgcloud__Order__c> vfdatamethod { get; set; }
      public List<cgcloud__Order__c> retpro { get; set; }
      // public cgcloud__Order_Items__c retpro { get; set; }
      public orelvfcontroller(ApexPages.StandardController controller)
        {
         
          recordId = ApexPages.currentPage().getParameters().get('id');
          system.debug('recrd Id'+recordId);
   
           vfdatamethod =  [select Id, Name,cgcloud__Order_Template__r.Name,cgcloud__Order_Account__r.Name,
           cgcloud__Order_Date__c,cgcloud__Delivery_Date__c,cgcloud__Initiation_Date__c,cgcloud__Delivery_Recipient__r.Name,
           (select Id,Name,cgcloud__Product__r.Name,cgcloud__Quantity__c FROM cgcloud__Order_Items__r) FROM cgcloud__Order__c Where Id=:recordId ORDER BY CreatedDate DESC limit 1];
         
           system.debug('order data' +vfdatamethod);
           loadreturnproductItems();
  
          //  retpro=[select Id,Name,cgcloud__Product__r.Name,cgcloud__Quantity__c FROM cgcloud__Order_Items__r];
      }

      public void loadreturnproductItems() {

        retpro = [select Id, Name,(select Id,Name,cgcloud__Product__r.Name,cgcloud__Quantity__c,cgcloud__Price__c,cgcloud__Value__c FROM cgcloud__Order_Items__r) FROM cgcloud__Order__c WHERE Id =:recordId];
    
    system.debug('return product id' +retpro);
      }
  }



//   @AuraEnabled(cacheable=true)
//   public static String generatePDF(String OrderId) {
    
//       PageReference pageRef = Page.returnordervfpage;
//       pageRef.getParameters().put('id', OrderId);
//       system.debug('order Id'+OrderId );

//       try {
//           Blob pdfBlob = pageRef.getContentAsPDF();
//           // Convert Blob to Base64 and return as String
//           return EncodingUtil.base64Encode(pdfBlob);
//       } catch(Exception e) {
//           // Log the error and handle the exception
//           // For example: System.debug('Error: ' + e.getMessage());
//           return null; // Return null or handle error in a suitable way
//       }
//   }