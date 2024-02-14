import { LightningElement, api, wire } from 'lwc';
import getProductParts from '@salesforce/apex/ProductBundleSearchController.getProductParts';

export default class ProductPartsLWC extends LightningElement {
    @api productId;
    productParts;

    @wire(getProductParts, { productId: '$productId' })
    loadProductParts({ error, data }) {
        if (data) {
            this.productParts = data;
        } else if (error) {
            console.error('Error fetching product parts', error);
        }
    }
}