import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateQuoteStatus from '@salesforce/apex/PublicQuotePageController.updateQuoteStatus';
import updateQuotedenied from '@salesforce/apex/PublicQuotePageController.updateQuotedenied';
import getQuoteDetails from '@salesforce/apex/PublicQuotePageController.getQuoteDetails';
import { NavigationMixin } from 'lightning/navigation';

export default class publicQuoteDetail extends NavigationMixin(LightningElement) {
    recordid;
    quotes;
    error;
    showDetails = true;
    isActionTaken = false;
    quoteDetails;
    additionalCost;

    connectedCallback() {
        const actionTaken = sessionStorage.getItem('actionTaken');
        if (actionTaken && actionTaken === 'true') {
            this.showDetails = false;
        } else {
            this.extractRecordIdFromUrl();
        }
        this.getQuoteDetails();
    }
    initialRender = true;
    renderedCallback() {
      
    }

    extractRecordIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        this.recordid = urlParams.get('recordid');
        if (this.recordid) {
            this.loadQuoteData();
            console.log('quote record id:====> ' + this.recordid);
        } else {
            this.showToast('Error', 'Record ID not found in the URL', 'error');
        }
    }
    getQuoteDetails(){
        console.log(
            'recordId found---->',this.recordid
        )
        getQuoteDetails({ quoteId: this.recordid }).then((res)=>{
            console.log('result found---->',res);
            this.quoteDetails=res?.map((item,ind)=>({
                ...item,
                quoteName:item.Name,
                additionalCost:item.Additional_Cost__c,
                quoteStatus:item.Status
            }));

            console.log('newquotes',this.quoteDetails)
        }).catch((err)=>{
            console.log('error--->',err)
        })
    }

    loadQuoteData() {
        // Add logic to load additional data if needed
    }

    handleApprove() {
        console.log('****record id at approve level--->', this.recordid);
        updateQuoteStatus({ quoteId: this.recordid })
            .then((result) => {
                console.log('then block-->');
                console.log('result------>'+result);
                this.showToast('Success', 'Quote Approved Successfully', 'success');
                this.handleActionTaken();
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    handleReject() {
        console.log('record id at reject level--->', this.recordid);
        updateQuotedenied({ quoteId: this.recordid })
            .then((res) => {
                console.log(res)
                this.showToast('Success', 'Quote Rejected Successfully', 'success');
                this.handleActionTaken();
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    handleActionTaken() {
        this.isActionTaken = true;
        sessionStorage.setItem('actionTaken', 'true');
        setTimeout(() => {
            this.showDetails = false;
            window.close();
        }, 2000);
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}