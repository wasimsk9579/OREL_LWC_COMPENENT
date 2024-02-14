import { LightningElement,api } from 'lwc';
import approveRecord from '@salesforce/apex/OrelApproveOrReject.ApproveRecord';
import rejectRecord from '@salesforce/apex/OrelApproveOrReject.RejectRecord';
export default class OrelApproveOrRejectComponent extends LightningElement {
    
    // Opportunity ID passed dynamically
    @api recordId; 
    handleApprove() 
    {
        console.log('Opportunity Id:', recordId);
        if (this.recordId) {
            approveRecord({ oppId: this.recordId })
                .then(result => {
                    // Handle success
                    console.log('Record approved:', result);
                })
                .catch(error => {
                    // Handle errors
                    console.error('Error approving record:', error);
                });
        }
    }

    handleReject() {
        console.log('Opportunity Id:', recordId);
        if (this.recordId)
         {
            rejectRecord({ oppId: this.recordId })
                .then(result => {
                    // Handle success
                    console.log('Record rejected:', result);
                })
                .catch(error => {
                    // Handle errors
                    console.error('Error rejecting record:', error);
                });
        }
    }
}