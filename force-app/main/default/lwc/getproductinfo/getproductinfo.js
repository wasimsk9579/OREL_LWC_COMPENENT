import { LightningElement,api } from 'lwc';
import getProductInfor from '@salesforce/apex/GetProductOfReturnOrder.getProductInfor';

export default class Getproductinfo extends LightningElement {
    @api orderId;
    productData;
    error;
    columns = [
        { label: 'Order Item Number', fieldName: 'Name' },
        { label: 'Product', fieldName: 'productName'},
        { label: 'Quantity', fieldName: 'quantity'}
    ];
    
    connectedCallback(){
        console.log('OUTPUT child - : ' , this.orderId);
        this.loadproductDetails();
       
    }
    loadproductDetails() {
        console.log('orderId', this.orderId);
        getProductInfor({ orderId: this.orderId})
            .then(result => {
                
                this.productData = result.map((item,ind)=>({
                    ...item,
                    productName:item.cgcloud__Product__r.Name,
                    quantity:item.cgcloud__Quantity__c,
                   
                }))
                console.log('result'+JSON.stringify(result))
            })
            .catch(error => {
                this.error = error;
                console.log('error', error);
            });
    }
}