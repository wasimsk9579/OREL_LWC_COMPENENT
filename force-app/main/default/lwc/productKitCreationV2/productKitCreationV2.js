import { LightningElement, api, track, wire } from 'lwc';
//import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductsList from '@salesforce/apex/ProductKitController.getProducts';
import getSelectedProducts from '@salesforce/apex/ProductKitController.getSelectedProducts';
import getSelectedProducts2 from '@salesforce/apex/ProductKitController.getSelectedProducts2'; //createProductKitTest
import createProductKitAndItems from '@salesforce/apex/ProductKitController.createProductKit'; //createProductKitAndParts

import { refreshApex } from "@salesforce/apex";
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
 import PRODUCT_PART_OBJECT from '@salesforce/schema/cgcloud__Product_Part__c';
// import TAX_RATE from '@salesforce/schema/AcctSeed__Product_Part__c.Tax__c';

import { NavigationMixin } from 'lightning/navigation';

export default class ProductKitCreationV2 extends NavigationMixin(LightningElement) {
    @api recordId;
    @track isLoading = false; //change the value later
    @track records;
    //showTaxFiedls
 //   @track isToggleChecked = false;
 //   @track showTaxFields = false;
 //   @track showIncFields = false;
 //   @track showExFields = true;
    //boolean fields
    isSaveDisabled = true;
    //rowdata
    @track Qty;
//    @track PriceExTax;
//    @track PriceIncTax;
//    @track TaxRate;
//    @track TotalIncTax;
//    @track TotalExTax;
//    @track DeleteId;

    @track renderProdList = [];

    @track allRowData = [];
    @track additionalFields = {};

    wiredRecords;
    error;
    @track deleteConatctIds = '';

    @track autoCompleteOptions = []; // filtered list of options based on search string
    @track objectsList = []; // complete list of objects returned by the apex method
    @track objectsMap = {}; // useful to get a map

    @track productsList = [];
    @track selectedProductsList = [];
    @track selectedProductArray = [];
    @track prodSearchKey = '';

    //get object info 
    @wire(getObjectInfo, {
        objectApiName: PRODUCT_PART_OBJECT
    })
    ProductPartObjInfo;



/*    //get Door category picklist values
    @wire(getPicklistValues, {
        recordTypeId: '$ProductPartObjInfo.data.defaultRecordTypeId',
        fieldApiName: TAX_RATE
    }) taxRatePickValues;

    //Tax Toggle button
    showTaxFieldsHandler(event) {
        this.isToggleChecked = !this.isToggleChecked;
        this.showTaxFields = event.target.value;
        console.log('this.showTaxFields---->' + this.showTaxFields);

        console.log('this.isToggleChecked ---->' + this.isToggleChecked);

        if (this.isToggleChecked == true) {
            console.log('if loop this.showTaxFields---->' + this.showTaxFields);
            this.showIncFields = true;
            this.showExFields = false
        } else {
            console.log('else loop this.showTaxFields---->' + this.showTaxFields);
            this.showIncFields = false;
            this.showExFields = true;
        }

    }
*/
    // Wired Methods //dropdown product data

    @wire(getProductsList, {})
    wiredObjectsList({
        error,
        data
    }) {
        this.isLoading = false;

        if (data) {
            var resultData = data;
            this.productsList = resultData;
            console.log(' productsList--->' + this.productsList);
        }
        error && console.error("productsList", "productsList", error);
    }

    // dropdown input change
    handleInputChange(event) {
        console.log('this.selectedProduct handleInputChange--->' + this.selectedProduct);
        const inputVal = event.target.value; // gets search input value
        console.log('inputVal-->' + inputVal);
        // filters in real time the list received from the wired Apex method
        if (inputVal != null && inputVal != '') {
            console.log('in if loop');
            this.autoCompleteOptions = this.productsList.filter(item => item.Name.toLowerCase().includes(inputVal.toLowerCase()));
        }
        if (inputVal == null || inputVal == '') {
            console.log('in else loop');
            this.autoCompleteOptions = this.productsList;
        }

        // makes visible the combobox, expanding it.
        if (this.autoCompleteOptions.length && inputVal) {
            this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.classList.add('slds-is-open');
            this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.focus();
        } else if (this.autoCompleteOptions && (inputVal == null || inputVal == '')) {
            this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.classList.add('slds-is-open');
            this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.focus();
        }
    }

    handleOnBlur(event) {
        // Trickiest detail of this LWC.
        // the setTimeout is a workaround required to ensure the user click selects the record.
        setTimeout(() => {
            if (!this.selectedProduct) {
                this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.classList.remove('slds-is-open');
            }
        }, 300);
    }

    handleOptionClick(event) {

        this.selectedProduct = event.currentTarget?.dataset?.name;
        this.selectedProductId = event.currentTarget?.dataset?.productid;

        console.log('this.selectedProduct--->' + this.selectedProduct);
        console.log('Id this.selectedProductId--->' + this.selectedProductId);
        this.template.querySelector('.slds-combobox.slds-dropdown-trigger.slds-dropdown-trigger_click')?.classList.remove('slds-is-open');

        this.addToSelectedProductsList();
        console.log('productid--->' + this.selectedProductId);

    }

    addToSelectedProductsList() {
        console.log('list addition start');
       // this.selectedProductArray = [this.selectedProductId];
        if (this.selectedProductId && !this.selectedProductsList.includes(this.selectedProductId)) {
            this.selectedProductArray = [this.selectedProductId];
            this.selectedProductsList = [...this.selectedProductsList, this.selectedProductId];
            console.log('################ selectedProds list---> '+this.selectedProductsList );
            console.log('############ wire Array---> '+this.selectedProductArray );
        }
        console.log('list addition-->' + this.selectedProductsList);
    }


    //show/hide spinner
    handleIsLoading(isLoading) {
        this.isLoading = isLoading;
    }

    updateValues(event) {
        const { name,value,dataset } = event.target;
        const updatedRecord = {...this.renderProdList.find(record => record.Id === dataset.id) };
        updatedRecord[name] = value;
       
        console.log(' name, value, dataset -->' + JSON.stringify(name) + '====' + JSON.stringify(value) + '====' + JSON.stringify(dataset));

        // Read the additional field name from the data-field attribute
        const additionalFieldName = dataset.field;

        // Set the additional field value in the updatedRecord
        updatedRecord[additionalFieldName] = value;

        // Calculate PriceExTax, TotalExTax, PriceIncTax, and TotalIncTax based on conditions
        const id = updatedRecord.Id;
        const dataId = event.target.dataset.id;

        console.log('************ const id --->' + id);
        console.log('************const dataId--->' + dataId);
        const qty = updatedRecord.Qty || 0;
        console.log('const qty --->' + qty);
        const salesPrice = updatedRecord.Sale_Price__c || 0;
   //     console.log('$$$$ before if  updatedRecord.TaxRate --->' + updatedRecord.TaxRate);
   /*     if (updatedRecord.TaxRate != null && updatedRecord.TaxRate != '') {
            console.log('taxRate if loop  entered')
            var taxRate = this.extractTaxRateFromString(updatedRecord.TaxRate);
            console.log('tax rate extracted coded--->' + taxRate);
            this.TaxRate = updatedRecord.TaxRate; // taxRate
            console.log('this.TaxRate --->' + this.TaxRate);
            updatedRecord.TaxRate = this.TaxRate;
        }
    */

        console.log('+++===Qty--->', qty);

    //    if (qty > 0 && qty != null && qty != '' && qty != undefined && salesPrice > 0 && (taxRate != 0) && (taxRate == null || taxRate == '')) { //&& (taxRate == null || taxRate == '') && dataId == id
        if (qty > 0 && qty != null && qty != '' && qty != undefined ) { //&& (taxRate == null || taxRate == '') && dataId == id
  
            console.log('w/o tax entered--->');
            this.PriceExTax = salesPrice;
        //    updatedRecord.PriceExTax = this.PriceExTax;
        //    this.TotalExTax = qty * salesPrice;
        //    updatedRecord.TotalExTax = this.TotalExTax;
        //    console.log('this.TotalExTax--->', this.TotalExTax);
        } else if (qty > 0 && qty != null && qty != '' && qty != undefined) {
    
      //  } else if (qty > 0 && qty != null && qty != '' && qty != undefined && salesPrice > 0 && (taxRate > 0 || taxRate == 0)) {
            console.log('With tax entered--->');
        //    this.PriceIncTax = salesPrice + ((taxRate / 100) * salesPrice);
        //    updatedRecord.PriceIncTax = this.PriceIncTax;
        //    this.TotalIncTax = qty * (salesPrice + ((taxRate / 100) * salesPrice));
        //    updatedRecord.TotalIncTax = this.TotalIncTax;
        //    console.log('+ this.PriceIncTax--->', this.PriceIncTax);
        }

    //    console.log('%%%%%%%% &&&&&&&&*********Tax Rate final value-------->' + this.TaxRate);


        // Find the index of the updated record and replace it in the array
        const recordIndex = this.renderProdList.findIndex(record => record.Id === dataset.id);
        this.renderProdList = [...this.renderProdList.slice(0, recordIndex), updatedRecord, ...this.renderProdList.slice(recordIndex + 1)];
        console.log('Duplicate check this.renderProdList-->'+ JSON.stringify(this.renderProdList));
        if (this.renderProdList) {
            this.isSaveDisabled = false;
        }
        // Create a new array containing all the row field data
        this.allRowData = this.renderProdList.map(record => ({
            Id: record.Id,
            ItemCode: record.ProductCode,
            ItemName: record.Name,

            Qty: record.Qty,
      //      SalePrice: record.Sale_Price__c,
      //      TaxRate: record.TaxRate,

      //      PriceExTax: record.PriceExTax,
      //      TotalExTax: record.TotalExTax,

      //      PriceIncTax: record.PriceIncTax,
      //      TotalIncTax: record.TotalIncTax,


        }));

        console.log('allRowData--->' + JSON.stringify(this.allRowData));
    }

/*    isTaxRateNumeric(taxstr) {
        console.log('isTaxRateNumeric entered--->');
        return !isNaN(parseFloat(taxstr)) && isFinite(taxstr);
    }

    extractTaxRateFromString(taxRateString) {

        console.log('%%%% extractTaxRateFromString entered--->* ' + taxRateString);
        // Using match with regEx to extract decimal numbers
        if (this.isTaxRateNumeric(taxRateString)) {
            // If the input string is already numeric, return it as a number
            return parseFloat(taxRateString);
        }
        const matches = taxRateString.match(/(\d+\.\d+)/);

        // Return numeric value if a decimal number is extracted, otherwise return 0
        if (matches) {
            return parseFloat(matches[0]);
        } else {
            return 0;
        }
    }
*/

    //handle save and process dml
    handleSaveAction() {
        console.log('$$$updated allRowData List--->' + this.allRowData);
        console.log('$$$&&stringify updated allRowData List--->' + JSON.stringify(this.allRowData));
        this.handleIsLoading(true);

        createProductKitAndItems({
                selProdList: this.allRowData
            }) //, removeContactIds : this.deleteConatctIds
            .then(result => {
                this.handleIsLoading(false);
                var resultdata = result;
                this.recordId = resultdata;
                console.log('############# this.recordId ' + this.recordId);
                this.showToast('Success', 'Kit Created Successfully', 'Success', 'dismissable');
                if (this.recordId) {
                    console.log('this.recordId------>' + this.recordId);
                    this.navigateToViewProductKitPage(this.recordId);
                }


            }).catch(error => {
                this.handleIsLoading(false);
                console.log(error);
                this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');
            });
    }

    handleCancelButton() {
        
         this.renderProdList = null;
         this.allRowData = null;
         this.selectedProductArray= [];
         this.selectedProductsList = [];
         this.isSaveDisabled = true;
         console.log('cancel this.wiredRecords---->' + JSON.stringify(this.wiredRecords)); // this.renderProdList 
         console.log('cancel this.renderProdList ---->' + this.renderProdList ); // this.renderProdList 
    }

    //remove records from table
    handleDeleteAction(event) {
        this.renderProdList.splice(this.renderProdList.findIndex(row => row.Id === event.target.dataset.id), 1);
        console.log('after delete this.renderProdList-->' + JSON.stringify(this.renderProdList));
        this.allRowData = this.renderProdList;
    }

    //fetch account contact records
    @wire(getSelectedProducts2, {
        selProdsIdList: '$selectedProductArray'
    })
    wiredProduct(result) {
        console.log('this.wiredRecords---->' + this.wiredRecords);
        this.wiredRecords = result; // track the provisioned value
        const {
            data,
            error
        } = result;

        if (data) {
            const newProducts = JSON.parse(JSON.stringify(data));
            console.log(' const newProducts-->' + JSON.stringify(newProducts));
            console.error('!*!*!*!!!!!!! this.renderProdList---->',this.renderProdList );
            
            this.renderProdList = this.renderProdList || []; 
                  
                   if(this.renderProdList.length >0 ){
                    console.error('!!!!!!!!!! entered If ---->' );
                    this.renderProdList = this.renderProdList.concat(newProducts);
                   }else{
                    console.error('!!!!!! entered 2nd if---->' );
                    this.renderProdList = newProducts;
                   }
                    
            

            console.log('else loop this.renderProdList ' + this.renderProdList);
            console.log('this.records---->' + this.records);
            this.error = undefined;
            this.handleIsLoading(false);
        } else if (error) {
            this.error = error;
            console.error('this.error---->' + this.error);
            this.records = undefined;
            this.handleIsLoading(false);
        }
    }

    showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }

    // Navigate to Product Kit Page Page
    navigateToViewProductKitPage(recId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recId,
                objectApiName: 'Product2',
                actionName: 'view'
            },
        });
    }

    
}