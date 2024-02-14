import { LightningElement, api, wire, track } from "lwc";
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import getFilteredProducts from '@salesforce/apex/productFilterController.getFilteredProducts';
import createProductParts from  '@salesforce/apex/productFilterController.createProductParts';
import getInsertedProductParts from '@salesforce/apex/productFilterController.getInsertedProductParts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createMessageContext, APPLICATION_SCOPE } from 'lightning/messageService';

// import FILTERS_UPDATED_MESSAGE from '@salesforce/messageChannel/FiltersUpdated__c';
import ProductName_FIELD from "@salesforce/schema/Product2.Name";
import ConsumerGoodsProductCode_FIELD from "@salesforce/schema/Product2.cgcloud__Consumer_Goods_Product_Code__c";
import Description1Language1_FIELD from "@salesforce/schema/Product2.cgcloud__Description_1_Language_1__c";
import ProductTemplate_FIELD from "@salesforce/schema/Product2.cgcloud__Product_Template__c";
import ProductBundle_FIELD from "@salesforce/schema/Product2.Product_Bundle__c";
import ITEMTYPE_FIELD from "@salesforce/schema/Product2.Item_Type__c";
import SHEETTYPE_FIELD from "@salesforce/schema/Product2.Sheet_Type__c";
import CATEGORY_FIELD from "@salesforce/schema/Product2.cgcloud__Category__c";
import WIDTH_FIELD from "@salesforce/schema/Product2.Sheet_Width__c";

import PRODUCT_OBJECT from "@salesforce/schema/Product2";



 const columns = [
    { label: 'Product Name', fieldName: 'Name', type: 'text' },
    
 ];

 const Addcolumns = [
    { label: 'Product Name', fieldName: 'Name', type: 'text' },
    { label: 'Part Description', fieldName: 'Part_Description__c', type: 'text', editable:true},
    { label: 'Dimension', fieldName: 'Dimensions__c', type: 'text', editable:true},
 ];


export default class productCreationForm extends LightningElement {
    products = [];
    Addedproducts = [];
    insertedproductparts =[];
    updatedvalues = '';
    updatevalue = '';
    updatedval='';
    error;
    
    
    @api recordId;
    // for the inserted parts
   
    // this is for - after click on nect button
    @track selectedProducts = [];

    
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedProducts = selectedRows;
    }


    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        this.recordId = urlParams.get('recordId');

        if (this.recordId) {
            console.log('Record ID:', this.recordId);
            this.sendDrawings();
        } else {
            console.error('Record ID not found in the URL');
        }
    }
   


  objectName = PRODUCT_OBJECT;
  recordTypeId = '0121m000001gaKoAAI';
  createdRecordId;
  
  items=[];
  sheets=[];
  categories=[];
  widths=[];

  Recordtype;

  objectFields = [
    ProductName_FIELD,
    ConsumerGoodsProductCode_FIELD,
    ProductTemplate_FIELD,
    Description1Language1_FIELD,
    ProductBundle_FIELD, 
  ];

 

  handleCancel(event) {
    console.log(event.type);
    console.log(JSON.stringify(event.detail));
  }

//   handleSuccess(event) {
//     const evt = new ShowToastEvent({
//         title: "Product created",
//         message: "Record ID: " + event.detail.id,
//         variant: "success"
//     });
//     this.dispatchEvent(evt);
// }
handleSuccess(event) {
    // Capture the ID of the created record
    this.createdRecordId = event.detail.id; 
    console.log('Record created with ID:', this.createdRecordId);
}

 

/*objectInfo*/

@wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })

objectInfo({ data, error }) {

    if (data) {

        const rtis = data.recordTypeInfos;

        this.Recordtype = data.defaultRecordTypeId;

        console.log('sample------------>' + this.Recordtype);

    }

    if (error) {

        console.log('error' + error);

    }

}



@wire(getPicklistValues, {

    recordTypeId: '$Recordtype',

    fieldApiName: ITEMTYPE_FIELD

}) wiredItems({ data ,error}) {

    console.log('datacountries1' + JSON.stringify(data));
    if (data) {
        if (data.values) {
            this.items = data.values.map(itemss => ({
                label: itemss.label,
                value: itemss.value
            }));
            console.log('datacountries', this.items);
        } else {
            console.error('Picklist values are undefined or not in the expected structure.');
        }
    } else if (error) {
        console.error('Error fetching picklist values', error);
    }
}
handleChange(event) {
   this.updatedvalues = event.target.value;
    console.log('Selected Item Type:', this.updatedvalues);
}


@wire(getPicklistValues, {

    recordTypeId: '$Recordtype',

    fieldApiName: CATEGORY_FIELD

}) wirecategoriess({ data ,error}) {

    console.log('datacountries1' + JSON.stringify(data));
    if (data) {
        if (data.values) {
            this.categories = data.values.map(itememe => ({
                label: itememe.label,
                value: itememe.value
            }));
            console.log('datacountries', this.categories);
        } else {
            console.error('Picklist values are undefined or not in the expected structure.');
        }
    } else if (error) {
        console.error('Error fetching picklist values', error);
    }
}
handleCha(event){
    this.updatedval = event.detail.value;
    console.log('Selected category:', this.updatedval); 
}




@wire(getPicklistValues, {

    recordTypeId: '$Recordtype',

    fieldApiName: SHEETTYPE_FIELD

}) wiredSheets({ data ,error}) {

    
    console.log('datacountries1' + JSON.stringify(data));
    if (data) {
        if (data.values) {
            this.sheets = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('datacountries', this.sheets);
        } else {
            console.error('Picklist values are undefined or not in the expected structure.');
        }
    } else if (error) {
        console.error('Error fetching picklist values', error);
    }
}
handle(event) {
    this.updatevalue= event.detail.value;
    console.log('Selected Item Type:', this.updatevalue);
}


@wire(getPicklistValues, {

    recordTypeId: '$Recordtype',

    fieldApiName: WIDTH_FIELD

}) wiredwidths({ data ,error}) {

    
    console.log('datacountries1' + JSON.stringify(data));
    if (data) {
        if (data.values) {
            this.widths = data.values.map(item => ({
                label: item.label,
                value: item.value
            }));
            console.log('datacountries', this.widths);
        } else {
            console.error('Picklist values are undefined or not in the expected structure.');
        }
    } else if (error) {
        console.error('Error fetching picklist values', error);
    }
}

handlewidth(event) {
    const selectedValue = event.detail.value;
    console.log('Selected Item Type:', this.selectedValue);
}










@wire(getFilteredProducts, { itemType: '$itemType', category:'$category' ,  sheetType: '$sheetType' })
    wiredProd({ error, data }) {
        if (data) {
            this.products = data;
        } else if (error) {
            // Handle error
            console.error(error);
        }
    }



    handleSearch() {
        getFilteredProducts({ itemType: this.updatedvalues, category: this.updatedval , sheetType: this.updatevalue })
            .then(result => {
                this.products = result;
                this.error = undefined;
                console.log('the result is = '+this.products);
                console.log(JSON.stringify(this.products));
            })
            .catch(error => {
                this.error = error;
                this.products = [];
                console.log('error = '+ JSON.stringify(error)   );
            });
    }


    // logic on the nect button click
    handleNext() {
        if (this.selectedProducts.length === 0) {
            // Show a toast message or handle the scenario when no products are selected
           
            return;
        }

        // Pass the selected products and createdRecordId to the Apex method
        createProductParts({ parentId: this.createdRecordId, selectedProducts: this.selectedProducts })
            .then(result => {
                // Handle success, if needed
                console.log(result);
                console.log(JSON.stringify(result));
              //  this.handleinsertedparts();
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Product Parts created successfully.',
                        variant: 'success',
                    })
            })
            .catch(error => {
                // Handle error, if needed
                console.error(error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error creating Product Parts.',
                        variant: 'error',
                    })
                );
            });

        }

        handleInserted(){
        getInsertedProductParts({ parentId: this.createdRecordId })
        .then(result => {
            this.insertedproductparts =result;
            console.log('The inserted parts for PArent ---->' + this.insertedproductparts);
            console.log('type of ' +typeof(this.insertedproductparts));
            // Handle success, if needed
            console.log(result);
           
         
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Product Parts created successfully.',
                    variant: 'success',
                })
            );
    
        })
        .catch(error => {
            // Handle error, if needed
            console.error(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Error creating Product Parts.',
                    variant: 'error',
                })
            );
        });

    }
        
    get columns() {
        return columns;
    }

    get Addcolumns() {
        return Addcolumns;
    }
    
       
}