import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import ORELREQUESTTRACKING_OBJECT from '@salesforce/schema/OrelRequestTracking__c';
import OREL_INITIATED_BY_FIELD from '@salesforce/schema/OrelRequestTracking__c.Orel_Initiated_By__c';
import OREL_REASON_FIELD from '@salesforce/schema/OrelRequestTracking__c.Orel_Reason__c';
import OREL_STATUS_FIELD from '@salesforce/schema/OrelRequestTracking__c.OrelStatus__c';
import ACCOUNT_FIELD from '@salesforce/schema/OrelRequestTracking__c.Account__c';

export default class OrelDeboardingNonDist extends LightningElement {
    @api recordId; 
    @track showModal = false;
    @track reason = '';

    handleDeboard() {
        this.showModal = true;
    }

    handleReasonChange(event) {
        this.reason = event.target.value;
    }

    handleSubmit() {
        console.log('Account id is this ',this.recordId);    
        const fields = {};
        fields[ACCOUNT_FIELD.fieldApiName] = this.recordId;
        fields[OREL_REASON_FIELD.fieldApiName] = this.reason;
        fields[OREL_STATUS_FIELD.fieldApiName] = 'Deboard initiated';
        fields[OREL_INITIATED_BY_FIELD.fieldApiName] = 'Initiated by Non-Distributor';

            
            console.log('Fields:', JSON.stringify(fields));
    
            const recordInput = { apiName: ORELREQUESTTRACKING_OBJECT.objectApiName, fields };
            createRecord(recordInput)
                .then((data) => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success!',
                            message: 'Deboarding submitted successfully.',
                            variant: 'success',
                        })
                    );
                    this.showModal = false;
                })
                .catch(error => {
                    console.error('Error updating Account: ', JSON.stringify(error));
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Deboarding submission failed.',
                            variant: 'error',
                        })
                    );
                    this.showModal = false;
                });
        } 

    handleCancel() {
        this.showModal = false;
    }
}