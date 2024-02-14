import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import Id from '@salesforce/user/Id';
import getOrder from '@salesforce/apex/orlOrderListController.getOrder';

export default class OrderListLWC extends LightningElement {
  
    orderData;
    userId;

    connectedCallback(){
        this.userId = Id;
        console.log(this.userId);
        this.getOrder();
    }
    columns = [
        { label: 'Sl No', fieldName: 'index', type: 'text', sortable: false, initialWidth: 80 },
        
        {label: 'Order Number', fieldName: 'orderId', type: 'number', sortable: true },
        {label: 'ProductName', fieldName: 'productName', type: 'text', sortable: true },
        {label: 'Quantity', fieldName: 'Quantity', type: 'Number', sortable: true },
        {label: 'Return Type', fieldName: 'ReturnType', type: 'picklist', sortable: true },
        {label: 'Return Status', fieldName: 'ReturnStatus', type: 'picklist', sortable: true }
    ];


    getOrder(){
        getOrder({userId:this.userId}).then(result => {
            console.log('result:',result);
            // this.orderData=result;
             this.orderData=  result.map((item, index) => ({ ...item, 
                index: index + 1,
                Quantity:  item.quantity,   
                orderId:  item.orderNumber,
                productName: item.product2Name,
                ReturnType:  item.returnType,
                ReturnStatus: item.ReturnStatus
                      }));
         })
         .catch(error => {
             this.error = error.body.message; 
             console.error('Error:', this.error);
         })
    }
}