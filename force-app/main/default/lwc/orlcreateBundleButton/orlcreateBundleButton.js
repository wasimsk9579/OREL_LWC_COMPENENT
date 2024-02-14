import { LightningElement,api } from 'lwc';


export default class OrlcreateBundleButton extends LightningElement {
    @api recordId;
    connectedCallback(){
        this.onclick();
    }

    onclick(){
        console.log(this.recordId)

    }
}