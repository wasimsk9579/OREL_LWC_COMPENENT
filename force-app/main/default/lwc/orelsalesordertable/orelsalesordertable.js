// import { LightningElement, track,api} from 'lwc';
// import getsalesorder from "@salesforce/apex/orlReturnOrderController.getsalesorder";
// import updatesalesorder from "@salesforce/apex/orlReturnOrderController.updatesalesorder";
// import Id from '@salesforce/user/Id';
// const DEFAULT_PAGE_SIZE = 5; 
// export default class orelsalesordertable extends LightningElement {
//     userId =Id; // A property to store the current user's Id retrieved from @salesforce/user/Id.
//     allData = []; // An array to store the retrieved data from the Apex method.
//     initialData = []; // A copy of allData to store the initial data for filtering purposes.
//     @track currentPage = 1; 
//     totalPages = 1;
//     @track pageSize = DEFAULT_PAGE_SIZE;
//     @track isLastPage = false; // A boolean variable to determine if the current page is the last page.
//     @track  showTable=true;; // A boole
//     clickedorderId;
//     recId;
//     isvariable;
//     disabledRowButtons = {};
    

// // An array defining the columns for the data table.    
// columns = [
//    { label: "Name", fieldName: "Name", type: "text", sortable: true },
//    {label: "Customer",fieldName: "customerName",type: "text",sortable: true},
//    {label: "Order Template",fieldName: "OrderTemplate",type: "text"},
//     {label: 'Total Value', fieldName: 'totalvalue', type: 'text', sortable: true },
//     {label: "Order Date",fieldName: "Orderdate",type: "text",sortable: true},
//     {label: "Initiate Date",fieldName: "InitiateDate",type: "text",sortable: true},
//     {label: "Delivery Date",fieldName: "DeliveryDate",type: "text",sortable: true},
//    {label: "Delivery Recipient",fieldName: "deliveryrecipient",type: "text"},
//    {label: "GRN Generated",fieldName: "grngenerated",type: "text"},
//     {
//         label: 'View Products',
//         type: 'button',
//         typeAttributes: {
//             label: 'View Products',
//             title: 'Click here',
//             variant: 'brand',
//             name: 'view_details'
//         }
//     },
//     {
//         label: "Generate GRN",
//         type: "button",
//         typeAttributes: {
//           label: "Generate GRN",
//           variant: "brand",
//           name: "open_vf_page",
//           title: "Click to Open VF Page",
//             },
//         },
//       ];
    

//     connectedCallback() {
//         this.userId = Id;
//         this.callApexMethod();
//         console.log('users', this.userId);
//     }

//     callApexMethod() {
//         getsalesorder({ userId: this.userId })
//             .then(result => { 
//                 this.allData = result.map((item,ind)=>({
                    
//                     ...item,
//                     Name: item.Name || '',
//                                     OrderTemplate:item.cgcloud__Order_Template__r.Name,
//                                     totalvalue:item.cgcloud__Gross_Total_Value__c,
//                                     customerName: item.cgcloud__Order_Account__r?.Name || "  ",
//                                     deliveryrecipient: item.cgcloud__Delivery_Recipient__r?.Name || "  ",
//                                     Orderdate: item.cgcloud__Order_Date__c,
//                                     InitiateDate: item.cgcloud__Initiation_Date__c,
//                                     DeliveryDate: item.cgcloud__Delivery_Date__c,
//                                     grngenerated: item.GRNGenerated__c,
    

//                 }));
//                 console.log('resultt' +JSON.stringify(result));
//                 this.initialData = [...this.allData];
//                 this.updateTotalPages();
//                 this.paginateData();
//             })
//             .catch(error => {
//                 console.error('Error fetching data:', error);            
//             });
//     }

//   //  onHandleSort: A method to handle sorting of the data based on column headers.

//     onHandleSort(event) {
//         const { fieldName: sortedBy, sortDirection } = event.detail;
//         const cloneData = [...this.allData];
//         cloneData.sort((a, b) => {
//             return this.sortBy(a, b, sortedBy, sortDirection);
//         });
//         this.allData = cloneData;
//         this.sortDirection = sortDirection;
//         this.sortedBy = sortedBy;
//     }
// // sortBy: A helper method used in sorting the data.
//         sortBy(a, b, fieldName, sortDirection) {
//             const valueA = a[fieldName];
//             const valueB = b[fieldName];
//             let comparison = 0;   

//             if (valueA === valueB) {
//                 comparison = a.index > b.index ? 1 : a.index < b.index ? -1 : 0;
//             } else if (typeof valueA === 'string' && typeof valueB === 'string') {
//                 comparison = valueA.toLowerCase().localeCompare(valueB.toLowerCase());
//             } else if (!isNaN(valueA) && !isNaN(valueB)) {
//                 comparison = parseFloat(valueA) - parseFloat(valueB);
//             }
//             return sortDirection === 'asc' ? comparison : -comparison;
//         }

// // handleSearch: A method to handle searching/filtering of the data based on user input.

// handleSearch(event) {
//     const searchTerm = event.target.value.toLowerCase();
//     this.currentPage = 1;
//     if (searchTerm) {
//         this.allData = this.initialData.filter(item =>
//             Object.values(item).some(value =>
//                 value && value.toString().toLowerCase().includes(searchTerm)
//             )
//         );
//         const searchResultSize = this.allData.length;
//         this.pageSize = searchResultSize <= DEFAULT_PAGE_SIZE ? searchResultSize : DEFAULT_PAGE_SIZE;
//         this.allData = this.allData.slice(0, this.pageSize);

//     } else {
//          this.variable = false;       
//          this.paginateData();
//     }    
// }

// // updateTotalPages: A method to calculate the total number of pages based on the data size and page size.

//     updateTotalPages() {
//               this.totalPages = Math.ceil(this.initialData.length / DEFAULT_PAGE_SIZE);
//     }
// // paginateData: A method to slice and display the data based on the current page and page size
//     paginateData() {
//         const startIndex = (this.currentPage - 1) * DEFAULT_PAGE_SIZE;
//         const endIndex = startIndex + DEFAULT_PAGE_SIZE;
//         this.allData = this.initialData.slice(startIndex, endIndex).map((item, index) => ({
//             ...item,
//             index: startIndex + index + 1,
//         }));
//     }
// // handlePrevious and handleNext: Methods to navigate to the previous and next pages.    
//     handlePrevious() {
//         if (this.currentPage > 1) {
//             this.currentPage--;
//             this.paginateData();
//         }
//     }    
//     handleNext() {
//         if (this.currentPage < this.totalPages) {
//             this.currentPage++;
//             this.paginateData();
//         }
//     }
// // isFirstPage and isLastPage: Computed properties to check if the current page is the first or last page.    
//     get isFirstPage() {
//         return this.currentPage === 1;
//     }

//     get isLastPage() {
//         return this.currentPage === this.totalPages;
//     }


// handleRowAction(event) {
//     console.log('row action -- ', JSON.stringify(event.detail.row.Id));
//     var orderId = event.detail.row.Id;
//     console.log('id' +orderId);
//     this.orderId = orderId;
//     this.clickedorderId = orderId;
   
//     const actionName = event.detail.action.name;
//     console.log('Action Name: ' + actionName);

//     if (actionName === 'view_details') {
//         // If the action is 'View More' (assumed for the 'Product' button)
//         this.showTable = false;
//     } else if (actionName === 'open_vf_page') {
       
     
//         this.isvariable = true;
//      console.log('this.orderId',this.orderId);
      
//         updatesalesorder({ srecId:this.orderId })
//         .then(result => {
//             // Handle the result if needed
//             console.log('updatesalesorder result:', result);

//         })
//         .catch(error => {
//             // Handle any errors
//             console.error('Error calling updatesalesorder:',error);
//         });
// }

    

//     console.log('OUTPUT parent: ', this.clickedorderId);
//     this.recId = orderId;
// }

// handleBacktoorderList()
// {
//     this.showTable = true;
// }

// get iframeSrc() {
//     console.log("hiiii", this.recId);
//     return "/apex/salesordervfpage?Id=" + this.recId;
//   }

//   handleCancel() {
//     this.isvariable = false;
//   }
// }

// //   handlepdfsave() 
// //   {
// //     generateAndSavePDF({recordId:this.recId})
// //         .then(result => {
// //             // Handle success
// //             this.showToast('Success', 'PDF generated and saved successfully!', 'success');
// //             this.isvariable = false;
// //         })
// //         .catch(error => {
// //             // Handle the error
// //             this.showToast('Error', 'Error generating or saving PDF: ' + error.body.message, 'error');
// //         });
// // }

// // showToast(title, message, variant) {
// //     const event = new ShowToastEvent({
// //         title: title,
// //         message: message,
// //         variant: variant
// //     });
// //     this.dispatchEvent(event);
// // }
  


  
import { LightningElement, track,api} from 'lwc';
import getsalesorder from "@salesforce/apex/orlReturnOrderController.getsalesorder";
import updatesalesorder from "@salesforce/apex/orlReturnOrderController.updatesalesorder";
import Id from '@salesforce/user/Id';
const DEFAULT_PAGE_SIZE = 10; 
const STORAGE_KEY = 'attendanceState';
export default class orelsalesordertable extends LightningElement {
    isLoggedIn = false;  
    userId;
    totalPages = 1;
    prvariable = false;
  @track isLastPage = false; //
    pageSize = DEFAULT_PAGE_SIZE;
    @track currentPage = 1;
    @api tableData=[];
    @api columnData;
    @track orderId;
    variable=false;
    isvariable=false;
    clickedorderId;
    originalTableData;
    iframeOrderId;
    clickedButtons = {};
    value;
        allData = []; // An array to store the retrieved data from the Apex method.
        initialData = []; // A copy of allData to store the initial data for filtering purposes.
        @track currentPage = 1; 
        totalPages = 1;
        @track pageSize = DEFAULT_PAGE_SIZE;
        @track isLastPage = false; // A boolean variable to determine if the current page is the last page.
    @track tableData = [];
    @track variable = false;

    connectedCallback()
{
    this.userId = Id;
    this.loadsalesdata();
 // Log the allData array received from the HTML snippet
   // console.log('allData received:', this.allData);

    // Update the disabled state for each record
   // this.allData.forEach(record => {
     //   record.disableButton = record.GRNGenerated__c === 'Completed';
   // });

    // Log the updated allData array with disabledButton property
   // console.log('allData with disabledButton property:', this.allData);
    // const storedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
 
    //     if (storedState) {
    //         this.isLoggedIn = storedState.isLoggedIn;
    //     }
    }
   
  

loadsalesdata() {
    console.log('userId', this.userId);
    getsalesorder({ userId: this.userId })
        .then(result => {
            this.allData = result;
            this.allData.forEach(record => {
        record.disableButton = record.GRNGenerated__c === 'Completed';
    });
            this.variable = false;

            this.initialData = [...this.allData];
            this.updateTotalPages();
            this.paginateData();
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
        this.clickedorderId=this.orderId;
        this.prvariable=true;
        
    }
  
    
    handlepdf(event) {
       
        const orderId = event.currentTarget.dataset.id;
        console.log('handlepdf',orderId);
        this.orderId=orderId;
        this.isvariable = true;
        this.prvariable = false;
        
    
        // Check if the button has been clicked for this orderId
            // Perform the update
          
            updatesalesorder({ srecId: this.orderId })
                .then(result => {
                    // Handle the result if needed
                    console.log('updatesalesorder result:', result);
        
                    // If needed, you can update the button status after the update is successful
                    // this.clickedButtons[this.orderId] = false;
                })
                .catch(error => {
                    // Handle any errors
                    console.error('Error calling updatesalesorder:', error);
                });
            

              this.isLoggedIn = true;

                   // this.isLoggedIn = true;
                  
     
                       // Save the state to local storage
                    this.saveState();
              
        }
     
        saveState() {
            // Save the state to local storage
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ isLoggedIn: this.isLoggedIn}));
        }
    
       
        
    
    
   
        

        get iframeSrc() {
         console.log("hiiii", this.orderId);
             return "/apex/salesordervfpage?Id=" + this.orderId;
                 }

                 handleCancel() {
                    this.isvariable = false;
                    window.location.reload();
                  }

          handleVariableClose()
          {
            this.prvariable=false;
          }


          handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    this.currentPage = 1;
    if (searchTerm) {
        this.allData = this.initialData.filter(item =>
            Object.values(item).some(value =>
                value && value.toString().toLowerCase().includes(searchTerm)
            )
        );
        const searchResultSize = this.allData.length;
        this.pageSize = searchResultSize <= DEFAULT_PAGE_SIZE ? searchResultSize : DEFAULT_PAGE_SIZE;
        this.allData = this.allData.slice(0, this.pageSize);

    } else {
         this.variable = false;       
         this.paginateData();
    }    
}

// updateTotalPages: A method to calculate the total number of pages based on the data size and page size.

    updateTotalPages() {
              this.totalPages = Math.ceil(this.initialData.length / DEFAULT_PAGE_SIZE);
    }
// paginateData: A method to slice and display the data based on the current page and page size
    paginateData() {
        const startIndex = (this.currentPage - 1) * DEFAULT_PAGE_SIZE;
        const endIndex = startIndex + DEFAULT_PAGE_SIZE;
        this.allData = this.initialData.slice(startIndex, endIndex).map((item, index) => ({
            ...item,
            index: startIndex + index + 1,
        }));
    }
// handlePrevious and handleNext: Methods to navigate to the previous and next pages.    
    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.paginateData();
        }
    }    
    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.paginateData();
        }
    }
// isFirstPage and isLastPage: Computed properties to check if the current page is the first or last page.    
    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.totalPages;
    }

    /* Inside your JavaScript file
handleDisableButton = obj =>  {
    if(!obj.GRNGenerated__c)
    {
        console.log('we got some value ---> : ',obj);
    }
    return obj.GRNGenerated__c === 'Completed';
}
*/

}