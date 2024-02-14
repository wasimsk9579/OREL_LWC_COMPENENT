import { LightningElement, track,api} from 'lwc';
import getretailorder from "@salesforce/apex/orlReturnOrderController.getretailorder";
import Id from '@salesforce/user/Id';
const DEFAULT_PAGE_SIZE = 10; 
export default class Orelretailerordertable extends LightningElement {
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
    invvariable=false;
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
    this.loadretailerdata();
 
    }
   
  

    loadretailerdata() {
    console.log('userId', this.userId);
    getretailorder({ userId: this.userId })
        .then(result => {
            this.allData = result;
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



    // handleChange(event) {
    //     this.value = event.detail.value;
    //     this.orderId = event.target.closest('td').dataset.id;
    //     console.log('orderid at initial---->',event.target)
    //     this.updateReturnOrderStatus({orderId:this.orderId, selectedStatus:this.value});
    // }


    // updateReturnOrderStatus(){
    //     console.log('orderId---->',this.orderId);
    //     console.log('values--->',this.value)
    //     updateOrderStatus({orderId:this.orderId, selectedStatus:this.value}).then((res)=>{
            
    //         console.log('Result from apex class----->',JSON.stringify(res),res);
    //     }).catch((err)=>{
    //         console.log('error on updating values----->',err);
    //     })
    // }

    handleproduct(event)
    {
        //this.variable=true;
        this.orderId = event.currentTarget.dataset.id;
        console.log('Order Id:', this.orderId);
        this.clickedorderId=this.orderId;
        this.prvariable=true;
        
    }z

    handleinvoice(event)
    {
        //this.variable=true;
        this.orderId = event.currentTarget.dataset.id;
        console.log('Order Id:', this.orderId);
        this.clickinvoiceId=this.orderId;
        this.invvariable=true;
        
    }
  
    
    handlepdf(event) {
       
        const orderId = event.currentTarget.dataset.id;
        console.log('handlepdf',orderId);
        this.orderId=orderId;
        this.isvariable = true;
        this.prvariable = false;
        
    
    }
       
         

        get iframeSrc() {
         console.log("hiiii", this.orderId);
             return "/apex/retailordervfpage?Id=" + this.orderId;
                 }

                 handleCancel() {
                    this.isvariable = false;
                    window.location.reload();
                  }

          handleVariableClose()
          {
            this.prvariable=false;
            this.invvariable =false;
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

}
