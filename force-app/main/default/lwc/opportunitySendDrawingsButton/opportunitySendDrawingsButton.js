import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import sendDrawingsEmail from "@salesforce/apex/OpportunitySendDrawingEmailHelper.sendDrawingsEmail";
// import sendDrawingsEmail from '@salesforce/apex/SendDrawingtoProductionTeamHelper.updateStatus';

import { CloseActionScreenEvent } from "lightning/actions";

export default class OpportunitySendDrawingsButton extends LightningElement {
  @api recordId;
  error;
  isProcessing = false;

  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    this.recordId = urlParams.get("recordId");

    if (this.recordId) {
      console.log("Record ID:", this.recordId);
      this.sendDrawings();
    } else {
      console.error("Record ID not found in the URL");
    }
  }

  sendDrawings() {
    this.isProcessing = true;

    sendDrawingsEmail({ opportunitiesId: this.recordId, result: this.result })
    .then((result) => {
        console.log(result, "fgiop[");
        console.log("Email sent successfully");
            // Show a success message
            this.dispatchEvent(
                new ShowToastEvent({
                    title: "Success",
                    message: "Email sent successfully",
                    variant: "success",
                })
                );
        this.dispatchEvent(new CloseActionScreenEvent());
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        this.error = error.message || "Unknown error";

        // Show an error message
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: this.error,
            variant: "error",
          })
        );
      })
      .finally(() => {
        this.isProcessing = false;
        this.dispatchEvent(new CloseActionScreenEvent());
      });
  }
}