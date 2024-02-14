// orlDeboardingProcess.js
import { LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import submitDeboardingRequest from '@salesforce/apex/orlDeboardingController.submitDeboardingRequest';

// Fields to retrieve from the User record
const USER_FIELDS = ['Id', 'Contact.AccountId'];

export default class OrlDeboardingProcess extends LightningElement {
    @track comments = '';
    @track accountId;
    @track isCancelButtonVisible = true;

    // Wire service to get the current user's information
    @wire(getRecord, { recordId: '$userId', fields: USER_FIELDS })
    wiredUser({ error, data }) {
        if (data) {
            // Extract the Account Id from the User's Contact
            this.accountId = data.fields.Contact.value.fields.AccountId.value;
        } else if (error) {
            console.error('Error retrieving user information:', error);
        }
    }

    handleCommentChange(event) {
        this.comments = event.target.value;
    }

    submitDeboardingRequest() {
        if (this.comments.trim() !== '') {
            submitDeboardingRequest({ accountId: this.accountId, comments: this.comments })
                .then(() => {
                    // Add any additional logic after submitting the deboarding request if needed
                    // For example, show a confirmation message or navigate to another page
                })
                .catch(error => {
                    console.error('Error submitting deboarding request:', error.body.message);
                    // Handle the error as needed
                });
        } else {
            // Show an error message or take appropriate action if comments are empty
        }
    }

    cancelDeboarding() {
        // Implement logic to cancel the deboarding process
        // For example, navigate to another page or clear the comments
        this.comments = '';
        this.isCancelButtonVisible = false; // Hide the Cancel button
    }
}