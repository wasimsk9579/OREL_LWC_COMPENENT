import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import sendDrawingsEmail from "@salesforce/apex/OpportunitySendDrawingEmailHelper.sendDrawingsEmail";
import { CloseActionScreenEvent } from "lightning/actions";
export default class OppoSendDrawingButton extends LightningElement {
    @api recordId;
    error;
    isProcessing = false;

    @api invoke() {
        this.sendDrawings();
    }

    sendDrawings() {
        this.isProcessing = true;

        sendDrawingsEmail({ opportunitiesId: this.recordId, result: this.result })
            .then((result) => {
                console.log(result, "fgiop[");
                console.log("Email is sent successfully");

                // Show a success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: "Success",
                        message: "Email is sent successfully",
                        variant: "success",
                    })
                );

                // Refresh the page
                this.refreshPage();
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

    refreshPage() {
        // Reload the page
        location.reload();
    }
}