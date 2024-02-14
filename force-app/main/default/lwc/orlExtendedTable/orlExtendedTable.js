import { LightningElement, api, wire ,track} from 'lwc';
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import RETURN_ORDER_OBJECT from '@salesforce/schema/cgcloud__Order__c';
import RETURN_STATUS_FIELD from "@salesforce/schema/cgcloud__Order__c.Orl_Return_Status__c";
import Id from '@salesforce/user/Id';
import updateOrderStatus from '@salesforce/apex/orlReturnOrderController.updateOrderStatus';
import getReturnorder from '@salesforce/apex/orlReturnOrderController.getReturnorder';
const DEFAULT_PAGE_SIZE = 5;
export default class OrlExtendedTable extends LightningElement {
  userId;
    totalPages = 1;
    prvariable;
  @track isLastPage = false; //
    pageSize = DEFAULT_PAGE_SIZE;
    @track currentPage = 1;
    @api tableData=[];
    @api columnData;
    @track orderId;
    variable=false;
    isvariable=false;
    clickedreturnId;
    originalTableData;
    iframeOrderId;
    value;
    initialData;
    @track draftValues = [];
    @track optionDataVal=[ { label: 'Draft', value: 'Draft' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Received at distributor W/H', value: 'Received at distributor W/H' },
    { label: 'Sent to Orel W/H	', value: 'Sent to Orel W/H' },
    { label: 'Received at Orel W/H	', value: 'Received at Orel W/H' },
    { label: 'QC InProgress', value: 'QC InProgress' },
    { label: 'Completed', value: 'Completed' }];

  
    // Get object info
    // @wire(getObjectInfo, {
    //     objectApiName: RETURN_ORDER_OBJECT
    // })
    // ReturnOrderPartObjInfo;

    // // Get Door category picklist values
    // @wire(getPicklistValues, {
        
    //     recordTypeId: '$ReturnOrderPartObjInfo.data.defaultRecordTypeId',
    //     fieldApiName: RETURN_STATUS_FIELD
    // }) 
    // returnStatusPickValues;

    @track tableData = [];
    @track variable = false;

    connectedCallback()
{
    this.userId = Id;
    this.loadreturndata();
   
}
loadreturndata() {
    console.log('userId', this.userId);
    getReturnorder({ userId: this.userId})
        .then(result => {
            
            this.tableData = result;
            this.variable=false;
             
        })
        .catch(error => {
            this.error = error;
            console.log('error', error);
        });
}


    handleChange(event) {
        this.value = event.detail.value;
        this.orderId = event.target.closest('td').dataset.id;
        console.log('orderid at initial---->',event.target)
        this.updateReturnOrderStatus({orderId:this.orderId, selectedStatus:this.value});
    }


    updateReturnOrderStatus(){
        console.log('orderId---->',this.orderId);
        console.log('values--->',this.value)
        updateOrderStatus({orderId:this.orderId, selectedStatus:this.value}).then((res)=>{
            
            console.log('Result from apex class----->',JSON.stringify(res),res);
        }).catch((err)=>{
            console.log('error on updating values----->',err);
        })
    }

    handleproduct(event)
    {
        //this.variable=true;
        this.orderId = event.currentTarget.dataset.id;
        console.log('Order Id:', this.orderId);
        this.clickedreturnId=this.orderId;
        this.prvariable=true;
        
    }

    handlepdf(event)
        {
          this.isvariable=true;
          this.orderId = event.currentTarget.dataset.id;
          console.log('pdf id',this.orderId);
    

        }

      
        get iframeSrc() {

           
            console.log('hiiii',this.orderId);
            return '/apex/returnordervfpage?Id=' + this.orderId;
           
        }

          handleCancel() {
            this.isvariable = false;
          }

          handleVariableClose()
          {
            this.prvariable=false;
          }

}