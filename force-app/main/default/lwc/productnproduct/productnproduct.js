import { LightningElement, track } from 'lwc';
import searchProductBundle from '@salesforce/apex/Productnproductcontroller.getProducts';

export default class Productnproduct extends LightningElement {
    @track products;
    @track selectedProductId;

    handleSearchChange(event) {
        const searchTerm = event.target.value;
        // Call an Apex method to retrieve matching product2
        searchProductBundle({ searchTerm })
            .then(result => {
                this.products = result;
            })
            .catch(error => {
                console.error('Error fetching product2', error);
            });
    }

    handleProductClick(event) {
        const productId = event.currentTarget.dataset.productId;
        this.selectedProductId = productId;
    }
}