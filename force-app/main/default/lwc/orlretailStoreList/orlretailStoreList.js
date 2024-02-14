import { LightningElement, wire, api } from 'lwc';
import getRest from '@salesforce/apex/OrlretailStoreListController.getRest';
import Id from "@salesforce/user/Id";
const columns = [
    { label: 'Retailer Name', fieldName: 'Name' },
    { label: 'Delivery Method', fieldName: 'DeliveryMethod' },
    { label: 'Priority', fieldName: 'Priority' },
    { label: 'Store Type', fieldName: 'StoreType' },
    { label: 'Approval Status', fieldName: 'Status' },
    {
        label: 'Action',
        type: 'button',
        typeAttributes: {
            label: 'View More',
            title: 'View More',
            variant: 'brand',
            name: 'view_details'
        }
    }
];
export default class OrlretailStoreList extends LightningElement {
    combinedData = [];
    columns = columns;
    RetailStore;
    error;
    clickedRetailerId;
    showTable = true;
    recordId;
    userId = Id;
    combineddataitems;
    @wire(getRest, { userId: Id })
    wiredData({ error, data }) {
        if (data) {
            this.processData(data);
        } else if (error) {
            console.error('Error:', error);
        }
    }

    processData(data) {
        data.forEach(item => {
            if (item.ProcessInstances && item.ProcessInstances.length > 0) {
                const pendingProcessInstances = item.ProcessInstances.filter(processInstance => processInstance.Status === 'Pending');
                if (pendingProcessInstances.length > 0) {
                    pendingProcessInstances.forEach(pendingProcessInstance => {
                        this.combinedData.push({
                            
                            Id: item.Id, // Ensure you have an Id field or change accordingly
                            RetailStore: {
                                Name: item.Retail_Store__r.Name,
                                DeliveryMethod: item.Retail_Store__r.DeliveryMethod,
                                Priority: item.Retail_Store__r.Priority,
                                StoreType: item.Retail_Store__r.StoreType
                            },
                            ProcessInstance: {
                                Status: pendingProcessInstance.Status
                            }
                        
                        });
                        this.combineddataitems=this.combinedData.map((item, index) => ({ ...item, 
                            DeliveryMethod: item.RetailStore.DeliveryMethod,
                            StoreType: item.RetailStore.StoreType ,
                            Priority: item.RetailStore.Priority ,
                            Name:item.RetailStore.Name,
                            Status:item.ProcessInstance.Status
                        }));
                        console.log('map data' +JSON.stringify(this.combineddataitems));
                    });
                }
            }
        });
    }

    handleRowAction(event) {
        console.log('row action -- ', JSON.stringify(event.detail.row.Id));
        var recId = event.detail.row.Id;
        this.clickedRetailerId = recId;
        this.showTable = false;
        console.log('id' +recId);
    }

    handleBackToRetailerList() {
        this.showTable = true;
    }

    // handleEdit(event) {
    //     var recId = event.target.dataset.id;
    //     this.clickedRetailerId = recId;
    //     this.showTable = false;
    // }
}