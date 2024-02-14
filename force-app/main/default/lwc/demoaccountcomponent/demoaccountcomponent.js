// import { LightningElement, wire } from 'lwc';
// import getReturnorder from '@salesforce/apex/orlReturnOrderController.getReturnorder';
// import Id from "@salesforce/user/Id";
// export default class demoaccountcomponent extends LightningElement {
//     records;
//     userId =Id;
//     orders;
//     fields = [
//         { label: 'Name', fieldApiName: 'Name' },
//         {label: 'Customer', fieldApiName: 'cgcloud__Order_Account__c',},
//         { label: 'Return Status', fieldApiName: 'Orl_Return_Status__c' },
//         { label: 'Order Template', fieldApiName: 'cgcloud__Order_Template__c'},
//         { label: 'Order Date', fieldApiName: 'cgcloud__Order_Date__c' },
//         { label: 'Delivery Date', fieldApiName: 'cgcloud__Delivery_Date__c' },
//         { label: 'Initiation Date', fieldApiName: 'cgcloud__Initiation_Date__c' },
//         {label: 'Delivery Recipient', fieldApiName: 'cgcloud__Delivery_Recipient__c'},
//     ];

  
  

//     connectedCallback() {
//         // Fetch data on component initialization
//         this.fetchReturnOrders();
//         this.userId = Id;
//     }

//     fetchReturnOrders() {
//         getReturnorder({ userId: this.userId })
//             .then(result => {  
//                 this.records = result;
             
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);   
//             });
//     }
// }


// 2nd

// import { LightningElement, wire, track } from 'lwc';
// import getReturnorder from '@salesforce/apex/orlReturnOrderController.getReturnorder';
// import updateOrderStatus from '@salesforce/apex/orlReturnOrderController.updateOrderStatus';
// import Id from "@salesforce/user/Id";

// export default class demoaccountcomponent extends LightningElement {
//     @track records;
//     @track userId = Id;
//     @track currentPage = 1;
//     @track totalRecords = 0;
//     @track totalPages = 0;
//     @track searchKey = '';
//     @track isLoading = false;
//     @track returnOrders;
// @track isEditing = false;
// @track returnStatusOptions = [ { label: 'Draft', value: 'Draft' },
//                                { label: 'Approved', value: 'Approved' },
//                                { label: 'Received at distributor W/H', value: 'Received at distributor W/H' },
//                                { label: 'Sent to Orel W/H	', value: 'Sent to Orel W/H' },
//                                { label: 'Received at Orel W/H	', value: 'Received at Orel W/H' },
//                                { label: 'QC InProgress', value: 'QC InProgress' },
//                                { label: 'Completed', value: 'Completed' }];


//    connectedCallback() {
//         this.fetchReturnOrders();
//     }

//     fetchReturnOrders() {
//         this.isLoading = true;
//         getReturnorder({ userId: this.userId, searchKey: this.searchKey })
//             .then(result => {  
//                 this.records = result;
//                 this.returnOrders=result;
//                 this.isLoading = false;
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);   
//                 this.isLoading = false;
//             });
//     }
//     // ... (Other methods if any)





// handleStatusChange(event) {
//     const orderId = event.target.closest('td').dataset.id;
//     const selectedStatus = event.detail.value;

//     console.log('orderiddd',orderId);
//     console.log('selectedStatus',selectedStatus);
//     updateOrderStatus({ orderId: orderId, selectedStatus: selectedStatus })
//         .then(() => {
//             // Handle successful update
//             console.log('Order Status Updated');
//             this.fetchReturnOrders(); // Refresh data after update
//         })
//         .catch(error => {
//             // Handle error
//             console.error('Error updating status:', error);
//         });

//     this.isEditing = false; // Exit editing mode after change
// }

// handleEdit(event)
//  {
//     this.isEditing = true;
//     const orderId = event.target.closest('td').dataset.id;
//     console.log('orderiddd',orderId);
//     // Logic to handle editing of specific order
//     // You might want to handle the edit functionality here
// }

// }


import { LightningElement, api, wire ,track} from 'lwc';
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import RETURN_ORDER_OBJECT from '@salesforce/schema/cgcloud__Order__c';
import RETURN_STATUS_FIELD from "@salesforce/schema/cgcloud__Order__c.Orl_Return_Status__c";
import updateOrderStatus from '@salesforce/apex/orlReturnOrderController.updateOrderStatus';

export default class demoaccountcomponent extends LightningElement {
  @api orderId;
  error;
  @api tableData;
  variable = false;
  @api columnData;
  @track orderId;
  isvariable=false;
  value;
  @track draftValues = [];
  @track optionDataVal=[ { label: 'Draft', value: 'Draft' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Received at distributor W/H', value: 'Received at distributor W/H' },
  { label: 'Sent to Orel W/H	', value: 'Sent to Orel W/H' },
  { label: 'Received at Orel W/H	', value: 'Received at Orel W/H' },
  { label: 'QC InProgress', value: 'QC InProgress' },
  { label: 'Completed', value: 'Completed' }];

  // Get object info
  @wire(getObjectInfo, {
      objectApiName: RETURN_ORDER_OBJECT
  })
  ReturnOrderPartObjInfo;

  // Get Door category picklist values
  @wire(getPicklistValues, {
      
      recordTypeId: '$ReturnOrderPartObjInfo.data.defaultRecordTypeId',
      fieldApiName: RETURN_STATUS_FIELD
  }) 
  returnStatusPickValues;

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

  handleBackToReturnList() {
    this.variable = false;
  }

  
  get iframeSrc() {

      console.log('hiiii',this.orderId )
      return '/apex/returnordervfpage?Id=' + this.orderId;
 
  }

  handleprdctclick(event) {
    this.orderId = event.target.closest('td').dataset.id;
    console.log('orders id at initial---->',this.orderId)
    this.variable=true;
    
}

handlepdfclick()
{
 this.isvariable = true;
}
}