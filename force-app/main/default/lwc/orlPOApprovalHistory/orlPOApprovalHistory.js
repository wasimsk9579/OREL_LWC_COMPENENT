import { LightningElement,api,wire } from 'lwc';
import getPOApprovalHistory from '@salesforce/apex/OrlPOApprovalHistoryController.getPOApprovalHistory';
export default class OrlPOApprovalHistory extends LightningElement {
columns = [
        { label: 'Initiated Date', fieldName: 'CreatedDate', type:'date-local' },
        { label: 'Action Date', fieldName: 'CompletedDate', type:'date-local' },
        { label: 'Status', fieldName: 'Status' },
    ];
    @api oppoId;
    POApprovalData;

    @wire(getPOApprovalHistory, {oppoId : '$oppoId'})
    approvalData({error, data}) {
        if (error) {
            console.log('Error - ', error);
        } else if (data) {
            this.POApprovalData = data;
            console.log('Data - ', data);
        }
    }
}
