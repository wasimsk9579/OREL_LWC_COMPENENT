import { LightningElement,api,wire,track} from 'lwc';
import submitForApproval from '@salesforce/apex/orelapprovalprocessclass.submitForApproval';
import returnOppId from '@salesforce/apex/orelapprovalprocessclass.returnOppId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class OrelApprovalProcessLWC extends LightningElement {
    
  
    @api recordId;
    errorMessage ='';
     
    
        @track data;
        oppid;
        @track error;

     
    @wire(returnOppId, {oppId : '$recordId'})
    getoppId({error, data}) {
        if (error) {
            console.log('Error - ', error);
        } else if (data) {
            this.oppid = data;
            this.sendApprovalRequest();
        }
    }
   
   
    sendApprovalRequest(){
        
        console.log('recId', this.oppid); 
        let url = window.location.origin;
        let modifiedUrl = url.replace("lightning.force.com", "")
        console.log('modifiedUrl----------->'+modifiedUrl);
        submitForApproval({oppId : this.oppid,location: modifiedUrl})
        
            .then(result => {
                if(result == 'success'){
                    console.log('Success');
                    this.dispatchEvent(new CloseActionScreenEvent());
                    const evt = new ShowToastEvent({
                        title: 'Success',
                        message: 'Approval request sent successfully!',
                        variant: 'success',
                        label: 'success'
                    });
                  //  this.dispatchEvent(evt);
                   
            
                }

            })
            .catch(error => {
                this.errorMessage = error.body.message; 
                console.error('Client-side error:', error);

                console.log('Error - ', error);
                const evt = new ShowToastEvent({
                    title: 'Error',
                    message: this.errorMessage,
                    variant: 'error'
                    ///label: 'error'

                });
                this.dispatchEvent(evt);
            });
    
}
}