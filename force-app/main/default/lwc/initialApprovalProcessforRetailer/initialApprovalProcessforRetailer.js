import { api, wire, LightningElement } from 'lwc';
import submitForApproval from '@salesforce/apex/RetailerInitialApprovalSubController.submitForApproval';
import returnRetailerId from '@salesforce/apex/RetailerInitialApprovalSubController.returnretailerId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class InitialApprovalProcessForRetailer extends LightningElement {
    @api recordId;
    retailerId;
    error;
    errorMessage='';
    data;


    @wire(returnRetailerId, {retailerId : '$recordId'})
    getrecId({error, data}) {
        if (error) {
            console.log('Error - ', error);
        } else if (data) {
            this.retailerId = data;
            this.sendROApprovalRequest();
        }
    }

    sendROApprovalRequest(){
        console.log('recId', this.retailerId);
        let url = window.location.origin;
        let modifiedUrl = url.replace("lightning.force.com", "")
        console.log('modifiedUrl----------->'+modifiedUrl);
        submitForApproval({retailerId : this.retailerId,location: modifiedUrl})
        
            .then(result => {
                if(result == 'success'){
                    console.log('Success');
                    
                    const evt = new ShowToastEvent({
                        title: 'Success',
                        message: 'Approval request sent successfully!',
                        variant: 'success',
                        label: 'success'
                    });
                    this.dispatchEvent(evt);
                }

            })
            .catch(error => {
                this.errorMessage = error.body.message; 
                console.error('Client-side error:', error);

                console.log('Error - ', error);
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: this.errorMessage,
                    variant: 'error'
                    ///label: 'error'

                });
                this.dispatchEvent(evt);
            });
    
}


}