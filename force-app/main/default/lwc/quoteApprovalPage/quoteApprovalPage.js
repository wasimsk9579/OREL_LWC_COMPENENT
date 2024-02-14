import { LightningElement, api, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import updateQuoteStatus from '@salesforce/apex/PublicQuotePageController.updateQuoteStatus';

export default class quoteApprovalPage extends LightningElement {
    @api recordId; // The Quote Id passed from Visualforce

    // Load quote details using wire service
    @wire(getRecord, {
        recordId: '$recordId',
        fields: ['Quote.Name', 'Quote.Status', 'Quote.Additional_Cost__c', 'Quote.Email']
    })
    quote;

    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const quoteId = urlParams.get('quoteId');
        if (quoteId) {
            this.recordId = quoteId;
        }
    }

    handleApprove() {
        this.updateQuoteStatus('Accepted');
    }

    handleDisagree() {
        this.updateQuoteStatus('Denied');
    }

    updateQuoteStatus(newStatus) {
        if (this.quote && this.quote.data) {
            updateQuoteStatus({ quoteId: this.recordId, newStatus: newStatus })
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Quote Status Updated Successfully',
                            variant: 'success'
                        })
                    );
                })
                .catch((error) => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error',
                            message: 'Error updating Quote Status',
                            variant: 'error'
                        })
                    );
                    console.error('Error updating Quote Status', error);
                });
        } else {
            console.error('Quote data is not available.');
        }
    }
}