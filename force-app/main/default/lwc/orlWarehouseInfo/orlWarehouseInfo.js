//<!-- orlOrderList.js -->
import { LightningElement, wire } from 'lwc';
import getOrders from '@salesforce/apex/orlOrderListController.getOrders';
import Id from "@salesforce/user/Id";

export default class OrlOrderList extends LightningElement {
    userId = Id;
    combinedData;

    @wire(getOrders, { userId: '$userId' })
    wiredOrders({ error, data }) {
        if (data) {
            this.combinedData = data.map(orderWrapper => ({
                orderWrapper: orderWrapper,
            }));
        } else if (error) {
            console.error('Error retrieving orders:', error);
        }
    }

    // Handle additional actions as needed

    // Example of a method to handle "View More" action
    handleViewMore(event) {
        const orderId = event.target.dataset.id;
        // Handle the logic to navigate to a detailed view of the order
    }
}