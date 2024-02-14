import { LightningElement,api } from 'lwc';
//import generatePDF from '@salesforce/apex/orelvfcontroller.generatePDF';
export default class orelvfdatalwc extends LightningElement {
    @api orderId;
    error;
    ispdf=true;

    get iframeSrc() {

        console.log('hiiii',this.orderId )
        return '/apex/returnordervfpage?Id=' + this.orderId;
   
    }
    handleCancel()
    {
    this.ispdf=false;
}
}