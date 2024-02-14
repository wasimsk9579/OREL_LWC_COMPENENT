import { LightningElement,api } from 'lwc';
import getOppo from '@salesforce/apex/orelPurchseOrderPendingController.getOppo';
import Id from "@salesforce/user/Id";
export default class OrelPurchseOrderPending extends LightningElement {
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Stage Name', fieldName: 'StageName'},
        { label: 'Amount', fieldName: 'Amount', type: 'currency', cellAttributes: { alignment: 'left' } },
        { label: 'Status', fieldName: 'Status__c' },
        
        {
            label: 'Action',
            type: 'button',
            typeAttributes: {
                label: 'View More',
                title: 'Click here',
                variant: 'brand',
                name: 'view_details'
            }
        }
    ];
    
    clickedOPId;
    Opportunity;
    error;
    showTable = true;
    @api recordId;
    userId = Id;
    combinedData;
    recId;

        connectedCallback() { 
        getOppo({ userId: this.userId })
        .then(result => {
            // Create an array to store combined data
            this.combinedData =result;
            console.log('record' +JSON.stringify(this.combinedData));

            // result.forEach(item => {
            //     if (item.ProcessInstances && item.ProcessInstances.length > 0) {
            //         // Check if any ProcessInstance is pending
            //         const pendingProcessInstances = item.ProcessInstances.filter(processInstance => processInstance.Status === 'Pending');
            //         if (pendingProcessInstances.length > 0) {
            //             // Include both RetailStore data and pending ProcessInstance data
            //             pendingProcessInstances.forEach(pendingProcessInstance => {
            //                 const combinedItem = {
            //                     Opportunity: item,
            //                     ProcessInstance: pendingProcessInstance
            //                 };
            //                 this.combinedData.push(combinedItem);
            //                 console.log('record' +JSON.stringify(this.combinedData));
            //             });
            //         }
            //     }
            // });

            // Now this.combinedData contains both RetailStore and pending ProcessInstance data
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
    
   handleBackTooppoList(){
        this.showTable = true;
    }
    

    handleRowAction(event) {
        console.log('row action -- ', JSON.stringify(event.detail.row.Id));
        var recId = event.detail.row.Id;
        // this.clickedreturnId = recId;
        // this.variable = true;
        console.log('id' +recId);
        this.recId = recId;
        this.clickedOPId = recId;
        this.showTable = false;
        console.log('OUTPUT parent: ', this.clickedOPId);
    }
}