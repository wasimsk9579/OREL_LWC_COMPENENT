import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, createRecord , getFieldValue} from 'lightning/uiRecordApi';
import ORELREQUESTTRACKING_OBJECT from '@salesforce/schema/OrelRequestTracking__c';
import sendRequest from '@salesforce/apex/DeBoardDistributorController.sendRequest';
import OREL_INITIATED_BY_FIELD from '@salesforce/schema/OrelRequestTracking__c.Orel_Initiated_By__c';
import OREL_REASON_FIELD from '@salesforce/schema/OrelRequestTracking__c.Orel_Reason__c';
import OREL_DEBOARDING_STATUS_FIELD from '@salesforce/schema/OrelRequestTracking__c.orelDeboardingStatus__c';
import ACCOUNT_FIELD from '@salesforce/schema/OrelRequestTracking__c.Account__c';
import deboardProcessStatus from "@salesforce/schema/User.Contact.Account.Deboarding_process_status__c";

import USER_ID from '@salesforce/user/Id';

export default class DeBoardDistributor extends LightningElement {
    @api userId = USER_ID;
    @track showModal = false;
    @track reason = '';
    @track accountId;
    @track showSpinner = false;
    @track deboardingProcessStatus = '';
    @wire(getRecord, { recordId: '$userId', fields: ['User.Id', 'User.Contact.AccountId','User.Contact.Account.Deboarding_process_status__c'] })
    getUserDetails({ error, data }) {
        console.log('User id is  ', this.userId);
        console.log('user>>',data)
        if (data) {
            this.deboardingProcessStatus = getFieldValue(data, deboardProcessStatus);
            this.accountId = data.fields.Contact.value.fields.AccountId.value;
            console.log('Account id is ', this.accountId);
        } else if (error) {
            console.error('Could not fetch the user data', JSON.stringify(error));
        }
    }

    handleDeboard() {
        this.showModal = true;
    }

    handleReasonChange(event) {
        this.reason = event.target.value;
    }

    handleSubmit() {
        console.log('Account id is ', this.accountId);
        const fields = {};
        fields[ACCOUNT_FIELD.fieldApiName] = this.accountId;
        fields[OREL_REASON_FIELD.fieldApiName] = this.reason;
        fields[OREL_DEBOARDING_STATUS_FIELD.fieldApiName] = 'Deboarding Initiated';
        fields[OREL_INITIATED_BY_FIELD.fieldApiName] = 'Initiated by Distributor';

        const recordInput = { apiName: ORELREQUESTTRACKING_OBJECT.objectApiName, fields };
        this.showSpinner = true

        createRecord(recordInput)
            .then(data => {
                var recId = data.id;

                let accountObj = [{Id: this.accountId , Deboarding_process_status__c : 'Deboarding Initiated'}]
                sendRequest({ data:recId , Userid:this.userId , accountJSON : JSON.stringify(accountObj)}).then(result => {
                    this.showModal = false;
                    if(result){
                        this.deboardingProcessStatus = 'Deboarding Initiated';
                        this.showToast('Deboarding submitted successfully.' , 'Success' , 'success' , 'dismissable')
                    }
                    else{
                        this.showToast('Unable to submit request for deboarding' , 'Error' , 'error' , 'dismissable')
                    }
                    this.showSpinner = false
                  }).catch(error => {
                        this.showSpinner = false
                       console.error('Error calling sendRequest: ', JSON.stringify(error));
                       this.showToast((error.body && error.body.message ? error.body.message : 'Something went wrong please contact system administration...') , 'Error' , 'error' , 'dismisssable')
                    });  

            })
            .catch(error => {
                this.showSpinner = false
                console.error('Error creating Request record: ', JSON.stringify(error));
                this.showToast((error.body && error.body.message ? error.body.message : 'Something went wrong please contact system administration...') , 'Error' , 'error' , 'dismisssable')
            });
    }

    showToast(message , title , variant , mode){
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message ,
                variant: variant,
                mode : mode
            })
        );
    }

    handleCancel() {
        this.showModal = false;
    }

    get disableDeboardButton(){
        return (this.deboardingProcessStatus && this.deboardingProcessStatus != '' ? true : false)
    }
}