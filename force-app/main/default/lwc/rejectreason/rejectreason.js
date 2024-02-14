import { LightningElement } from 'lwc';

export default class RejectModal extends LightningElement {
    rejectReason = '';

    handleReasonChange(event) {
        this.rejectReason = event.target.value;
    }

    closeModal() {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    handleReject() {
        this.dispatchEvent(new CustomEvent('reject', { detail: { reason: this.rejectReason } }));
    }
}