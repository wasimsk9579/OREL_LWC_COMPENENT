import { LightningElement, wire, api , track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getApprovalStatus from '@salesforce/apex/OrlReatilerApprovalController.getApprovalStatus';
import getRetailInfo from '@salesforce/apex/OrlReatilerApprovalController.getRetailInformation';
import retailerApproval from '@salesforce/apex/OrlReatilerApprovalController.approveOrRejectRetailerRecord';

export default class OrlReatilerApproval extends LightningElement {
    @api reatilerId;
    @track retailerRecord = {};
    @track reatilerAddress = {};
    disableApprovalButtons = false;
    openModal = false;
    comments = '';
    enableSpinner = false;
    retailStoredata;

    connectedCallback(){
        console.log('OUTPUT child - : ' , this.reatilerId);
        this.getReatilerRecord();
       
    }

    

    getReatilerRecord(){

        getRetailInfo({retailId : this.reatilerId})

        .then(result => {
            this.retailerRecord = result;
            console.log('this.retailerRecord --67 ' , JSON.stringify(this.retailerRecord));
            this.retailStoredata = this.retailerRecord.Retail_Store__r;
            console.log('this.retailerRecord --69 ' , JSON.stringify(this.retailStoredata));
            
          
           
           
            

            if(this.retailStoredata == undefined || null || ''){

                this.enableSpinner = false;

               

                this.retailStoredata.Name = '';

                this.retailStoredata.DeliveryMethod = '';

                this.retailStoredata.PaymentMethod= '';

                this.retailStoredata.Priority = '';

                this.retailStoredata.Orl_Status__c= ''; 

                console.log('this.retailerRecord  92-- ' , JSON.stringify(this.retailerRecord));

            } else{

                console.log('this.reatilerAddress 96-- ' , JSON.stringify(this.retailerRecord.Retail_Store__r));

                this.retailStoredata = this.retailerRecord.Retail_Store__r;

            }

 

           

            this.getReatilerApprovalStatus();

        })

        .catch(error => {

            console.log('Error getRetailInfo-- ', JSON.stringify(error));

            this.disableApprovalButtons = true;

            this.enableSpinner = false;

            const event = new ShowToastEvent({

                title: 'Error',

                message: error,

                variant: 'error',

                mode: 'dismissable'

            });

            this.dispatchEvent(event);

        });

    }
    getReatilerApprovalStatus(){
        getApprovalStatus({recId : this.reatilerId})
        .then(result => {
            console.log('Approval Status -- ',JSON.stringify(result));
            if(result == 'Pending'){
                this.disableApprovalButtons = false;
                console.log('Status is pending');
            }else{
                this.disableApprovalButtons = true;
                console.log('Status is approved or rejected');
            }
            this.enableSpinner = false;
        })
        .catch(error => {
            this.disableApprovalButtons = true;
            console.error('Error retailer approval status -- ', error);
            this.enableSpinner = false;
            const event = new ShowToastEvent({
                title: 'Error',
                message: error,
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
        });
    }

    handleReject(){
        this.openModal = true;
    }

    closeModal(){
        this.openModal = false;
    }

    handleRejectionReason(event){
        this.comments = event.target.value;
    }

    // call apex for rejecting retailer record.
    handleSubmit(){
        this.openModal = false;
        this.enableSpinner = true;
        console.log('this.comments - ', this.comments);
        retailerApproval({reatilerId : this.reatilerId, approvalStatus : 'Reject', comment : this.comments})
        .then(result => {
            this.enableSpinner = false;
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'Record is rejected successfully!',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
            location.reload();
            console.log('Record is successfully Rejected --- ', result);
        })
        .catch(error => {
            this.enableSpinner = false;
            console.log('Error -- ', error);
            const event = new ShowToastEvent({
                title: 'Error',
                message: 'Error, please try again.',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
        });
    }

    // Call apex for approving retailer record.
    handleApprove(){
        this.enableSpinner = true;
        console.log('Apex call for approval');
        retailerApproval({reatilerId : this.reatilerId, approvalStatus : 'Approve', comment : 'record is approved!'})
        .then(result => {
            console.log('Record is successfully approved --- ', result);
            this.enableSpinner = false;
            const event = new ShowToastEvent({
                title: 'Success',
                message: 'Reatiler record is approved successfully!',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
            location.reload();
        })
        .catch(error => {
            console.log('Error -- ', error);
        });
    }
}