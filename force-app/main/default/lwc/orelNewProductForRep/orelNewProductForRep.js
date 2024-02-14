import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrelNewProductForRep extends LightningElement {

  objectApiName='Product2'

  handleSuccess(event) {
    const evt = new ShowToastEvent({
        title: 'Account created',
        message: 'Record ID: ' + event.detail.id,
        variant: 'success',
    });
    this.dispatchEvent(evt);
}


}