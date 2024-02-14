import { LightningElement } from 'lwc';
import Name_field from '@salesforce/schema/Custom_Product__c.Name';
import Code_field from '@salesforce/schema/Custom_Product__c.C_Product_Code__c';
import Description_field from '@salesforce/schema/Custom_Product__c.C_Product_Description__c';
import Bundle_Field from '@salesforce/schema/Custom_Product__c.C_Product_Bundle__c';
import PRODUCT_OBJECT from "@salesforce/schema/Custom_Product__c";

import handleAfterInsert from "@salesforce/apex/customBundleController.handleAfterInsert";

export default class CustomProductBundle extends LightningElement {

    productId;
    parentParentId;
    objectName = PRODUCT_OBJECT;
    objectFields = [
        Name_field,
        Code_field,
        Description_field,
        Bundle_Field,
      ];


      
  handleSuccess(event) {
    this.productId = event.detail.id;
    console.log("productId fetching------>", event.detail);
    this.parentParentId = this.productId;
    console.log("Record created with ID---->", this.productId);
    this.handleinsidemwthod();

  }


  // insert the product as opportunity line item to the given opportunity
handleinsidemwthod(){
    handleAfterInsert({parentId:this.parentParentId})
        .then((result) => {
          console.log(' result -----> '+result);
        })
        .catch((error) => {
          this.error = error;
        });
    }

}