import { LightningElement,api,wire,track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getoppdata from '@salesforce/apex/orelapprovalprocessclass.getoppdata';
import getopplineitemdata from '@salesforce/apex/orelapprovalprocessclass.getopplineitemdata';
import approverecord from '@salesforce/apex/orelapprovalprocessclass.approverecord';
import rejectrecord from '@salesforce/apex/orelapprovalprocessclass.rejectrecord';
import getstatus from '@salesforce/apex/orelapprovalprocessclass.getstatus';
export default class OrelApproveOrRejectApprovalProcess extends LightningElement {

    @api recordId;
    @track opportunity;
    @track error;
    @track opportunitylineitem;
    @track recordstatus;
    urlId;
    data;
    openModal=false;
    @track isdisabled=false;
    @track isRejectModalOpen = false;
    @track reason;


    @track columns = [{ label: 'Product Name', fieldName: 'Name' },
                      { label: 'Quantity', fieldName: 'Quantity' },
                      { label: 'Unit Price', fieldName: 'UnitPrice',type: 'currency', cellAttributes: { alignment: 'left' } },
                      { label: 'Total Price', fieldName: 'TotalPrice',type: 'currency', cellAttributes: { alignment: 'left' } }];

    // @wire(CurrentPageReference)
    // getStateParameters(currentPageReference) {
    //    if (currentPageReference) {
    //       this.urlId = currentPageReference.state?.id;
    //    }
    //    console.log('urlid' +this.urlId);
    // }
    // Initialize oppId attribute
    @track oppId;
    

    connectedCallback() {
        if(this.recordId)
        {
            this.loadOppDetails();
            this.loadOpplineitemDetail();
           // this.getstatusdetail();
           console.log('parent rec Id'+this.recordId);
        }
        
    }
    loadOppDetails() {
        console.log('recId', this.recordId);
        getoppdata({ oppId: this.recordId })
            .then(result => {
                this.opportunity = result;
                console.log('Opportunity record', result);
            })
            .catch(error => {
                this.error = error;
                console.log('error', error);
            });
    }
    
    // Method to fetch Opportunity details
    // loadOppDetails() {
    //     console.log('recId', this.recordId);
    //     getoppdata({ oppId: this.recordId })
    //     .then(result => {   
    //         this.opportunity = result.map((item,ind)=>({
    //             ...item,
    //             Name:item.Name,
    //             StageName:item.StageName,
    //             Status:item.Status__c,
    //             Amount:item.Amount,

    //         }));
    //     })
    //     .catch(error => {
    //         this.error = error;
    //         console.log('errors', error);
    //     });
    // }
// Method to fetch OpportunityLineItem details
    loadOpplineitemDetail() {
       // console.log('recId' +this.urlId);
        getopplineitemdata({oppId: this.recordId })
            .then(result => {   
                this.opportunitylineitem = result.map((item,ind)=>({
                    ...item,
                    Name:item.Product2.Name,
                    Quantity:item.Quantity,
                    UnitPrice:item.UnitPrice,
                    TotalPrice:item.TotalPrice,
                    CloseDate:item.CloseDate,
                }));
            })
            .catch(error => {
                this.error = error;
                console.log('errors', error);
            });
    }
   
    handleApprove() 
    {
        console.log('Opportunity Id:', this.recordId);
        if (this.recordId) {
            approverecord({ oppId: this.recordId})
                .then(result => {
                    this.showToast('Success', 'Record approved successfully', 'success');
                    console.log('Record approved:', result);
                     this.isdisabled=true;
                })
                .catch(error => {
                   
                    this.error = error;
                    this.showToast('Error', 'Error approving record', 'error');
                console.log('Error approving record:', error);
        
                });
        }

    }
    closeModal()
    {
        this.openModal=false;
    }

    handleReject(){
        this.openModal = true;

    }

    textdata(event)
    {
        this.data=event.target.value; 
    }
    handleRejectSubmit() {
        console.log('reason', this.data );
        console.log('Opportunity:',this.recordId);
        if (this.recordId)
         {
            rejectrecord({ oppId: this.recordId ,data:this.data })
                .then(result => {
                    this.showToast('Success', 'Record rejected successfully', 'success');
                    console.log('Record rejected:', result);
                    this.isdisabled=true;
                })
                .catch(error => {
                    // Handle errors
                    this.error=error;
                    this.showToast('Error', 'Error rejecting record', 'error');
                    console.error('Error rejecting record:', error);
                });
        }
        setTimeout(()=>
        {
            this.openModal=false;

        },500)
    }
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
 
}