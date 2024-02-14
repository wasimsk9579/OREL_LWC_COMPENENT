// import { LightningElement, api, track, wire } from 'lwc';
// import { refreshApex } from '@salesforce/apex';
// import { NavigationMixin } from 'lightning/navigation';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import getCategoryProducts from '@salesforce/apex/orelAddCategorytoAccountcontroller.getCategoryProducts';
// import updateAccountCategoryField from '@salesforce/apex/orelAddCategorytoAccountcontroller.updateAccountCategoryField';
// import getAccountCustomCategoryField from '@salesforce/apex/orelAddCategorytoAccountcontroller.getAccountCustomCategoryField';

// const COLUMNS = [
//     { label: 'Category Products', fieldName: 'label', type: 'text', sortable: false },
// ];


// export default class OrelAddCategorytoAccount extends NavigationMixin(LightningElement) {
//     @api recordId; // Account record Id
//     @track categoryProductOptions = [];
//     @track selectedCategoryProducts = [];
//     @track previousSelectedCategoryProducts = [];
//     refreshTable;
    

//     // Fetch the previously selected values from the Account's custom field
//     @wire(getAccountCustomCategoryField, { accountId: '$recordId' })
//     wiredAccountCategories({ error, data }) {
        
//         if (data) {
//             this.previousSelectedCategoryProducts = data.split(',');
//             this.selectedCategoryProducts = [...this.previousSelectedCategoryProducts];
//             console.log('product' +this.selectedCategoryProducts);
//         } else if (error) {
//             // Handle error
//         }
//     }

//     connectedCallback() {
//         let url=window.location.origin;
//         console.log('URL---'+url);
//         getCategoryProducts()
//             .then(result => {
//                 this.categoryProductOptions = result.map(item => ({
//                     label: item.Name,
//                     value: item.Name,
//                 }));
//             })
//             .catch(error => {
//                 // Handle error
//             });
//     }

//     // openModal() {
//     //     // You can retain the previously selected categories in the modal
//     //     this.selectedCategoryProducts = [...this.previousSelectedCategoryProducts];
        
//     // }

//     handleCategoryProductSelection(event) {
       
//         this.selectedCategoryProducts = event.detail.value;
      
//     }

//     handleSave() {
//         const selectedCategories = this.selectedCategoryProducts.join(',');
//         this.previousSelectedCategoryProducts = [...this.selectedCategoryProducts];

//         updateAccountCategoryField({ accountId: this.recordId, selectedCategories })
//             .then(result => {
//                 // Handle success
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Success',
//                         message: 'Categories updated successfully',
//                         variant: 'success',
//                     })
//                 );
//                 return getCategoryProducts(); // Fetch updated category products
//             })
//             .then(result => {
//                 this.categoryProductOptions = result.map(item => ({
//                     label: item.Name,
//                     value: item.Name,
//                 }));
//                 return refreshApex(this.refreshTable); // Refresh the table
//             })
//             .then(() => {
//                 // Refresh the record page
//                 this[NavigationMixin.Navigate]({
//                     type: 'standard__recordPage',
//                     attributes: {
//                         recordId: this.recordId,
//                         actionName: 'view',
//                     },
//                 });
//             })
//             .catch(error => {
//                 // Handle error
//                 console.error('Error:', error);
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Error',
//                         message: 'An error occurred while updating categories',
//                         variant: 'error',
//                     })
//                 );
//             });
//     }
// }

import { LightningElement, api, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCategoryProducts from '@salesforce/apex/orelAddCategorytoAccountcontroller.getCategoryProducts';
import updateAccountCategoryField from '@salesforce/apex/orelAddCategorytoAccountcontroller.updateAccountCategoryField';
import getAccountCustomCategoryField from '@salesforce/apex/orelAddCategorytoAccountcontroller.getAccountCustomCategoryField';

export default class OrelAddCategorytoAccount extends NavigationMixin(LightningElement) {
    @api recordId; // Account record Id
    @track categoryProductOptions = [];
    @track selectedCategoryProducts = [];
    @track availableCategoryProducts = [];
    @track previousSelectedCategoryProducts = [];

    // Fetch the previously selected values from the Account's custom field
    @wire(getAccountCustomCategoryField, { accountId: '$recordId' })
    wiredAccountCategories({ error, data }) {
        if (data) {
            this.previousSelectedCategoryProducts = data.split(',');
            this.setSelectedCategories();
        } else if (error) {
            // Handle error
        }
    }

    connectedCallback() {
        this.fetchCategoryProducts();
    }

    fetchCategoryProducts() {
        getCategoryProducts()
            .then(result => {
                this.availableCategoryProducts = result.map(item => ({
                    label: item.Name,
                    value: item.Name,
                }));
                this.setSelectedCategories();
            })
            .catch(error => {
                // Handle error
            });
    }

    setSelectedCategories() {
        if (this.previousSelectedCategoryProducts.length > 0) {
            this.selectedCategoryProducts = [...this.previousSelectedCategoryProducts];
        }
    }

    handleCategoryProductSelection(event) {
        this.selectedCategoryProducts = event.detail.value;
    }

    handleSave() {
        const selectedCategories = this.selectedCategoryProducts.join(',');
        this.previousSelectedCategoryProducts = [...this.selectedCategoryProducts];
    
        updateAccountCategoryField({ accountId: this.recordId, selectedCategories })
            .then(result => {
                // Handle success
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Categories updated successfully',
                        variant: 'success',
                    })
                    
                );
    
                // Refresh the record page
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.recordId,
                        actionName: 'view',
                    },
                    state: {
                        // Refresh the page by setting the refresh parameter to true
                        // This will reload the page and reflect the changes made
                        refresh: true
                    }
                });
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'An error occurred while updating categories',
                        variant: 'error',
                    })
                );
            });
    }
    handleCancel() {
        // Using the Lightning Navigation service to close the tab
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                actionName: 'view',
            },
        })
    }

}