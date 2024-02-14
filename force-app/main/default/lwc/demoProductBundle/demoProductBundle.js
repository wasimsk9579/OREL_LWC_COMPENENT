import { LightningElement, track } from 'lwc';

import searchProducts from "@salesforce/apex/demoProductBundleController.searchProducts";
import getProductParts from "@salesforce/apex/demoProductBundleController.getProductParts";

const columns = [
    // Define your columns based on the fields you want to display
    { label: 'Name', fieldName: 'Name', type: 'text' },
   
];

const Addedcolumns = [
    // Define your columns based on the fields you want to display
    { label: 'Name', fieldName: 'Name', type: 'text',  },
    { label: 'Description', fieldName: 'C_Product_Dimension__c', type: 'text',editable: true },
    { label: 'Bundle Name', fieldName: 'C_Product_Bundle_Name__c', type: 'text' },
    { label: 'Quantity', fieldName: 'C_Quantity__c', type: 'Number',editable: true },

    // Add more columns as needed
];

export default class DemoProductBundle extends LightningElement {
    
    @track searchTerm = '';
    @track searchProducts;
    @track getProductParts;

    handleInputChange(event) {
        this.searchTerm = event.target.value;
    }

    handleSearchProduct() {
        searchProducts({ searchTerm: this.searchTerm })
            .then(result => {
                this.searchProducts = result;
            })
            .catch(error => {
                // Handle errors
            });
    }

    handleSearchCustomObject() {
        getProductParts({ searchTerm: this.searchTerm })
            .then(result => {
                this.getProductParts = result;
            })
            .catch(error => {
                // Handle errors
            });
    }

    get columns() {
        return columns;
    }

    get Addedcolumns() {
        return Addedcolumns;
    }

   

}