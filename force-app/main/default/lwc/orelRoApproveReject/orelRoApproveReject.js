import { LightningElement,wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getretsdata from '@salesforce/apex/OrelRoApproveReject.getretsdata';
import roreject from '@salesforce/apex/OrelRoApproveReject.roreject';
import roapprove from '@salesforce/apex/OrelRoApproveReject.roapprove';
export default class OrelRoApproveReject extends LightningElement {
    retailerId;
    urlId;
    data;
    openModal=false; 
    recordstatus;
    retailstore;

        //getting id from URL
        @wire(CurrentPageReference)
        getparameter(currentPageReference) {
           if (currentPageReference) {
              this.urlId = currentPageReference.state?.id;
           }
           console.log('url Id' +this.urlId);
        }


    connectedCallback() {
        this.loadretsDetails();
        this.getrostatusdetail();
    }

      
    // Method to fetch Opportunity details
    loadretsDetails() {
        console.log('recId' +this.urlId);
        getretsdata({ retailerId: this.urlId })
            .then(result => {
                this.retailstore = result;
               
                console.log('retailstore record' +result);
            })
            .catch(error => {
                this.error = error;
                console.log('error', error);
            });
    }

    handleRoApprove() 
    {
        console.log('retailer Id:', this.urlId);
        if (this.urlId) {
            roapprove({ retailerId: this.urlId})
                .then(result => {
                    this.showToast('Success', 'Record approved successfully', 'success');
                    console.log('Record approved:', result);
                     this.isdisabled=true;
                })
                .catch(error => {
                   
                    this.error = error;
                    this.showToast('Error', 'Error approving record', 'error');
                console.log('Error approving record:', error);
        
                });
        }

    }
    closeModal()
    {
        this.openModal=false;
    }

    handleReject(){
        this.openModal = true;

    }

    textdata(event)
    {
        this.data=event.target.value; 
    }
    handleRoRejectSubmit() {
        console.log('reason', this.data );
        console.log('Retail Store Id:', this.urlId);
        if (this.urlId)
         {
            roreject({ retailerId: this.urlId,data:this.data })
                .then(result => {
                    this.showToast('Success', 'Record rejected successfully', 'success');
                    console.log('Record rejected:', result);
                    this.isdisabled=true;
                })
                .catch(error => {
                    // Handle errors
                    this.error=error;
                    this.showToast('Error', 'Error rejecting record', 'error');
                    console.error('Error rejecting record:', error);
                });
        }
        setTimeout(()=>
        {
            this.openModal=false;

        },500)
    }
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    getrostatusdetail() {
        console.log('recordId' +this.urlId);
        getstatus({ retailerId: this.urlId })
            .then(result => {
                this.recordstatus = result;
                if(this.recordstatus == 'Pending'){
                    this.isdisabled = false;
                }
               
                console.log('record' +this.recordstatus);
            })
            .catch(error => {
                this.error = error;
                console.log('errors', error);
            });
        }
 
}