import { LightningElement,api } from 'lwc';
import getinvoice from '@salesforce/apex/orelinvoicecontroller.getinvoice';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Orelinvoicetable extends LightningElement {

    @api orderId;
    invoiceData;
    error;
    Invoiceid;
    isvariable=false;
  

    connectedCallback() {
        this.loadinvoiceDetails();
    }

    loadinvoiceDetails() {
        getinvoice({ orderId: this.orderId })
            .then(result => {
                
                this.invoiceData = result.map(item => ({
                
                    Id: item.Id,
                    Name: item.Name,
                    RetailerOrder: item.Advanced_Order__r.Name,
                    invoiceno: item.Orl_Invoice_No__c,
                    Phone: item.Orl_Tel__c,
                    Address: item.Orl_Invoice_Bill_To__c,
                    quantity: item.Orl_Units_Qty__c,
                    TotalValue: item.Gross_Total_Value__c,
                    
                }));
              console.log('this.invoiceData.Id',this.invoiceData[0].Id);
              this.Invoiceid=this.invoiceData[0].Id;
               
            })
            .catch(error => {
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading invoice data',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
    handleCustomButtonClick(event) {
     // Assuming your event provides the invoice ID
        this.isvariable = true;
        console.log('this.InvoiceId 1',this.InvoiceId);
    }

    get iframeSrc() {
        console.log("hiiii", this.Invoiceid);
            return "/apex/InvoicePdfGenerator?Id=" + this.Invoiceid;
                }

                handleCancel() {
                    this.isvariable = false;
                  }
}
