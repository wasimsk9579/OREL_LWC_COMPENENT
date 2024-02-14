import { LightningElement, wire } from 'lwc';
import retailStoreData from '@salesforce/apex/orlRetailStoreTableController.fetchRetailStoreData';

export default class retailStore extends LightningElement {
    // columns = columns;
    // data = [];
    // saveDraftValue = [];
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Location', fieldName: 'LocationId' },
        { label: 'DeliveryMethod', fieldName: 'DeliveryMethod' },
        { label: 'StoreType', fieldName: 'StoreType' },
    ];
    allData=[];

    @wire(retailStoreData)
    wiredRetailStoreData({ error, data }) {
        if (data) {
            console.log('retailStoreData:', data);
            this.allData = data;
        } else if (error) {
            console.error('Error fetching data:', error);
        }
    }
}