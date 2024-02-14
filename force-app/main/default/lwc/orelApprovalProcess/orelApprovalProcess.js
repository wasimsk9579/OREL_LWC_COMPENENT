import { LightningElement,api } from 'lwc';
import submitForApproval from '@salesforce/apex/orelapprovalprocessclass.submitForApproval';
import returnOppId from '@salesforce/apex/orelapprovalprocessclass.returnOppId';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class OrelApprovalProcess extends LightningElement {
    @api recordId;
    errorMessage;
    opportunityid;
    
        
    
    
}