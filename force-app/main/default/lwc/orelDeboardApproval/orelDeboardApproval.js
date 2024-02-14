import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord, getRecord } from 'lightning/uiRecordApi';
import OREL_REQUEST_OBJECT from '@salesforce/schema/OrelRequestTracking__c';
import ID_FIELD from '@salesforce/schema/OrelRequestTracking__c.Id';
import OREL_REASON_FIELD from '@salesforce/schema/OrelRequestTracking__c.Orel_Reason__c';
import OREL_STATUS_FIELD from '@salesforce/schema/OrelRequestTracking__c.OrelStatus__c';

import { refreshApex } from '@salesforce/apex';

export default class OrelDeboardingNonDist extends LightningElement {
    @api recordId;
    @track showRejectModal = false;
    @track reason = '';
    @track showbuttons = true;

    handleReject() {
        this.showRejectModal = true;
    }

    handleReasonChange(event) {
        this.reason = event.target.value;
    }


    handleRejectSubmit() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[OREL_REASON_FIELD.fieldApiName] = this.reason;
        fields[OREL_STATUS_FIELD.fieldApiName] = 'Request Rejected';

        const recordInput = {fields};

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Request Rejected',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredRequest);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error rejecting the request',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

        this.showRejectModal = false;
        this.reason = '';
    }

    handleCancel() {
        this.showRejectModal = false;
        this.reason = '';
    }

    handleApprove() {
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[OREL_STATUS_FIELD.fieldApiName] = 'Request Approved';
        console.log('Fields are ', JSON.stringify(fields));
        const recordInput = { fields };
        console.log('Request input are ', JSON.stringify(recordInput));
        updateRecord(recordInput)
            .then((data) => {
                console.log(JSON.stringify(data));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Request Approved',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredRequest);
            })
            .then(() => {
                // Check if status is 'Request Approved' or 'Request Rejected' to hide buttons
                console.log('Record updated successfully!');
                // Add any other specific logs or actions after the update here
            })
    
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error approving the request',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}