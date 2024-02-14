import { LightningElement, api, wire } from 'lwc';
import getRetailerApprovalHistory from '@salesforce/apex/OrlRetailerApprovalHistoryController.getRetailerApprovalHistory';

const columns = [
    { label: 'Initiated Date', fieldName: 'CreatedDate', type:'date-local' },
    { label: 'Action Date', fieldName: 'CompletedDate', type:'date-local' },
    { label: 'Status', fieldName: 'Status' },
];
export default class OrlRetailerApprovalHistory extends LightningElement {
    @api reatilerRecordId;
    reatilerApprovalData;
    columns = columns;

    @wire(getRetailerApprovalHistory, {retailerId : '$reatilerRecordId'})
    approvalData({error, data}) {
        if (error) {
            console.log('Error - ', error);
        } else if (data) {
            this.reatilerApprovalData = data;
            console.log('Data - ', data);
        }
    }
}