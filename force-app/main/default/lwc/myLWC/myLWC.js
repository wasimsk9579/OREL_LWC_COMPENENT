import { LightningElement, api } from 'lwc';
import { APPLICATION_SCOPE, createMessageContext, publish, subscribe, unsubscribe } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import inputChannel from '@salesforce/messageChannel/lightning__industries_componentTaskInput';
import outputChannel from '@salesforce/messageChannel/lightning__industries_componentTaskOutput';
export default class myLWC extends LightningElement {
 @api assessmentTaskId;
 @api visitId;
 messageContext = createMessageContext();
 outputSubscription = null;

 handleClickProgress() {
   this.changeStatus("InProgress");
 }

 handleClickCompleted() {
   this.changeStatus("Completed");
 }

 changeStatus(status) {
   var message = {
     assessmentTaskId: this.assessmentTaskId,
     requestedStatus: status,
     };
   publish(this.messageContext, inputChannel, message);
 }

 connectedCallback() {
   this.subscribeOutputChannel();
 }

 disconnectedCallback() {
   unsubscribe(this.outputSubscription);
   this.outputSubscription = null;
 }

 subscribeOutputChannel() {
   if (this.subscription) {
     return;
   }
   this.outputSubscription = subscribe(
     this.messageContext,
     outputChannel,
     (message) => this.handleOutputMessage(message),
     { scope: APPLICATION_SCOPE }
   );
 }

 handleOutputMessage(message) {
   // Check if the response message is meant for the current task.
   if(message.assessmentTaskId !== this.assessmentTaskId)return;
   if(message.result === "Success") {
     this.showToast("Success","Status updated","success");
   } else if(message.result === "Failure") {
     this.showToast("Failure",message.errorMessage,"error");
   }
 }


 showToast(title, message, variant) {
   const event = new ShowToastEvent({
       title,
       message,
       variant
   });
   this.dispatchEvent(event);
 }
}
m