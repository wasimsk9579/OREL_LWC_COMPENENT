// import { LightningElement,api } from 'lwc';
// import submitForApproval from '@salesforce/apex/orelapprovalprocessclass.submitForApproval';
// import returnOppId from '@salesforce/apex/orelapprovalprocessclass.returnOppId';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// export default class Orelpurchaseapprovalprocess extends LightningElement {

//     @api recordId;
//     errorMessage ='';
//      data;
//      oppId;
//      error;

     
//     // @wire(returnOppId, {oppId : '$recordId'})
//     // getoppId({error, data}) {
//     //     if (error) {
//     //         console.log('Error - ', error);
//     //     } else if (data) {
//     //         this.oppid = data;
//     //         this.sendApprovalRequest();
//     //     }
//     // }
   
//  @api invoke() {
//         this.fetchOppId();
//     }

//     fetchOppId() {
//         returnOppId({ oppId: this.recordId })
//             .then(result => {
//                 if (result) {
//                     this.oppId = result;
//                     this.sendApprovalRequest();
//                 }
//             })
//             .catch(error => {
//                 console.error('Error - ', error);
//             });
//     }
   
//     sendApprovalRequest(){
        
//         console.log('recId', this.oppid); 
//         let url = window.location.origin;
//         let modifiedUrl = url.replace("lightning.force.com", "")
//         console.log('modifiedUrl----------->'+modifiedUrl);
//         submitForApproval({oppId : this.oppid,location: modifiedUrl})
        
//             .then(result => {
//                 if(result == 'success'){
//                     console.log('Success');
//                     this.dispatchEvent(new CloseActionScreenEvent());
//                     const evt = new ShowToastEvent({
//                         title: 'Success',
//                         message: 'Approval request sent successfully!',
//                         variant: 'success',
//                         label: 'success'
//                     });
//                   //  this.dispatchEvent(evt);
                   
            
//                 }

//             })
//             .catch(error => {
//                 this.errorMessage = error.body.message; 
//                 console.error('Client-side error:', error);

//                 console.log('Error - ', error);
//                 const evt = new ShowToastEvent({
//                     title: 'Error',
//                     message: this.errorMessage,
//                     variant: 'error'
//                     ///label: 'error'

//                 });
//                 this.dispatchEvent(evt);
//             });
    
// }
// }

import { LightningElement, api } from 'lwc';
import submitForApproval from '@salesforce/apex/orelapprovalprocessclass.submitForApproval';
import returnOppId from '@salesforce/apex/orelapprovalprocessclass.returnOppId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Orelpurchaseapprovalprocess extends LightningElement {
    @api recordId;
    errorMessage = '';
    data;
    oppId;
    error;

    @api invoke() {
        this.fetchOppId();
    }

    fetchOppId() {
        returnOppId({ oppId: this.recordId })
            .then(result => {
                if (result) {
                    this.oppId = result;
                    this.sendApprovalRequest();
                }
            })
            .catch(error => {
                console.error('Error - ', error);
            });
    }

    sendApprovalRequest() {
        console.log('recId', this.oppId); // Correct variable name

        let url = window.location.origin;
        let modifiedUrl = url.replace('lightning.force.com', '');
        console.log('modifiedUrl----------->' + modifiedUrl);

        submitForApproval({ oppId: this.oppId, location: modifiedUrl }) // Correct variable name
            .then(result => {
                if (result === 'success') {
                    console.log('Success');
                    this.showToast('Success', 'Approval request sent successfully!', 'success');
                    this.refreshPage();
                }
            })
            .catch(error => {
                this.errorMessage = error.body.message;
                console.error('Client-side error:', error);
                console.log('Error - ', error);
                this.showToast('Error', this.errorMessage, 'error');
            });
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }

    refreshPage() {
        location.reload();
    }
}
