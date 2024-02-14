import { LightningElement, api, track, wire } from 'lwc';
import getProducts from '@salesforce/apex/Productnproductcontroller.getProducts';

export default class Childproducts extends LightningElement {
    @api Product2Id;
    @track products;

    connectedCallback() {
        this.loadProducts();
    }

    loadProducts() {
        // Call an Apex method to retrieve Products for the search term
        getProducts({ searchTerm: this.searchTerm })
            .then(result => {
                this.products = result;
            })
            .catch(error => {
                console.error('Error fetching products', error);
            });
    }
    
    handleSearchChange(event) {
        // Handle search term change
        this.searchTerm = event.target.value;
        this.loadProducts();
    }
    
    handleProductClick(event) {
        // Handle product click
        this.selectedProductId = event.currentTarget.dataset.productId;
    }
}