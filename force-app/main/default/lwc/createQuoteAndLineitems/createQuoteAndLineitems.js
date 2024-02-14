import { LightningElement , wire  } from 'lwc';
import createStandardQuote from '@salesforce/apex/createQuote.createStandardQuote';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

export default class CreateQuoteAndLineitems extends LightningElement {

    recordId;

    @wire(CurrentPageReference)
    wiredPageReference;

    connectedCallback() {
        if (this.wiredPageReference.data) {
            this.recordId = this.wiredPageReference.data.attributes.recordId;
            this.createQuoteAndLineItems();
        }
    }

    createQuoteAndLineItems() {
        if (this.recordId) {
            createStandardQuote({ opportunityId: this.recordId })
                .then(result => {
                    this.showSuccessToast('Quote and Quote Line Items have been created.');
                })
                .catch(error => {
                    this.showErrorToast('Error -', error.body.message);
                });
        }
    }

      showSuccessToast(title, message) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: 'success'
        });
        this.dispatchEvent(evt);
      }

     showErrorToast(title, message) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: 'error'
        });
        this.dispatchEvent(evt);

  

    }
}