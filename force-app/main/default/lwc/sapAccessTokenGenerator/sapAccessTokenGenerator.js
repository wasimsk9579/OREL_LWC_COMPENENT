/*
* Component Name: sapAccessTokenGenerayor
* Author: Pooja V
* Date: 14-11-2023
* Description: This Lightning web component is designed to generate a SAP access token by calling the generateSapToken Apex method. 
  The access token is stored in the accessToken property. If the operation is successful, the component dispatches a CloseActionScreenEvent to close the screen. If there is an error, the error message is stored in the error property. 
  The component is designed to automatically trigger the generation of the SAP access token when it is loaded.
*/


import { LightningElement, track,api } from 'lwc';
//import generateSapToken from '@salesforce/apex/sapAccessTokenController.generateSapToken';
import updateDistributor from '@salesforce/apex/orlDistributorRecordController.updateDistributor'
import { CloseActionScreenEvent } from 'lightning/actions';

 
export default class SapAccessTokenGenerator extends LightningElement {
    @track accessToken; // A tracked property used to store the SAP access token retrieved from the Apex method.
    @track error;  // A tracked property used to store any error message encountered during the execution of the Apex method.
    @track distributorData;

    //A lifecycle hook that is called when the component is inserted into the DOM. In this component, it is used to automatically call the generateSapToken method when the component is loaded.
    connectedCallback() {
       // this.generateSapToken();
        this.updateDistributor();
    }
    
// A method that calls the generateSapToken Apex method using the @salesforce/apex module. It handles the promise returned by the Apex method. If the promise is resolved successfully, it sets the accessToken property with the result and logs it to the console. It also dispatches a CloseActionScreenEvent to close the action screen , If there is an error, it sets the error property with the error message and logs the error to the console.    
    // generateSapToken() {
    //     generateSapToken()
    //         .then(result => {
    //             this.accessToken = result;
    //             console.log('Access Token:', this.accessToken);
    //             this.dispatchEvent(new CloseActionScreenEvent());
    //         })
    //         .catch(error => {
    //             this.error = error.body.message; 
    //             console.error('Error:', this.error);
    //         })
    // }

    updateDistributor(){
        updateDistributor().then(result => {
           console.log(result);
           this.distributorData=result;
            this.dispatchEvent(new CloseActionScreenEvent());
        })
        .catch(error => {
            this.error = error.body.message; 
            console.error('Error:', this.error);
        })
    }
}