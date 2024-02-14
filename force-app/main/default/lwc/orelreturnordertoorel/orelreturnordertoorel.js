import { LightningElement,api,track,wire } from 'lwc';
import getReturntoorel from "@salesforce/apex/orlReturnOrderController.getReturntoorel";
import Id from "@salesforce/user/Id";
import { NavigationMixin } from "lightning/navigation";
const DEFAULT_PAGE_SIZE = 5;
export default class orelreturnordertoorel extends LightningElement {

  @api recordId; // An API property to accept record Ids from the parent component.
  userId = Id; // A property to store the current user's Id retrieved from @salesforce/user/Id. 
  allData = []; // An array to store the retrieved data from the Apex method.
  initialData = []; // A copy of allData to store the initial data for filtering purposes.
  @track currentPage = 1;
  totalPages = 1;
  @track pageSize = DEFAULT_PAGE_SIZE;
  @track isLastPage = false; // A boolean variable to determine if the current page is the last page.
 // A boole
  isvariable = false;
  clickedreturnId;
  @track vfPageUrl = ""; // Initialize with empty string
  @track iframeKey = 0; // To force the iframe to refresh
  isvariable = false;
  showTable=true;
  advancereturn;
  loading;
  data;
  orderId;
  recId;

  columns = [
    { label: "Name", fieldName: "Name", type: "text", sortable: true },
    {label: "Customer",fieldName: "customerName",type: "text",sortable: true,},
    {label: "Order Date",fieldName: "Orderdate",type: "text",sortable: true,},
    {label: "Initiate Date",fieldName: "InitiateDate",type: "text",sortable: true,},
    {label: "Delivery Date",fieldName: "DeliveryDate",type: "text",sortable: true,},
    {label: "Delivery Recipient",fieldName: "deliveryrecipient",type: "text",},
    {label: 'Return Status', fieldName: 'returnstatus', type: 'text', sortable: true },
    {
      label: "View PDF",
      type: "button",
      typeAttributes: {
        label: "View PDF",
        variant: "brand",
        name: "open_vf_page",
        title: "Click to Open VF Page",
      },
    },
    {
      label: "View Products",
      type: "button",
      typeAttributes: {
        label: "View Products",
        title: "Click here",
        variant: "brand",
        name: "view_details",
      },
    },
 
  ];

  connectedCallback() {
    this.userId = Id;
    this.callApexMethod();
    console.log("userid---->", this.userId);
  }
//  fetching return orders data
  callApexMethod() {
    getReturntoorel({ userId: this.userId })
      .then((result) => {
        var alldata = result.map((item, ind) => ({
          ...item,
          Name: item.Name,
          customerName: item.cgcloud__Order_Account__r.Name,
          deliveryrecipient: item.cgcloud__Delivery_Recipient__r?.Name || "  ",
          Orderdate: item.cgcloud__Order_Date__c,
          InitiateDate: item.cgcloud__Initiation_Date__c,
          DeliveryDate: item.cgcloud__Delivery_Date__c,
          returnstatus: item.Orl_Return_Status__c,
        }));

        this.allData = alldata;
        this.showTable=true;
        console.log("apex data coming--->", this.allData);
        this.initialData = [...this.allData];
        this.updateTotalPages();
        this.paginateData();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.log("erorrrrrrrrrrrrr");
      });
  }
//  handler to Search return orders based on name
  handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    this.currentPage = 1;
    if (searchTerm) {
      this.allData = this.initialData.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && value.toString().toLowerCase().includes(searchTerm)
        )
      );
      const searchResultSize = this.allData.length;
      this.pageSize =
        searchResultSize <= DEFAULT_PAGE_SIZE
          ? searchResultSize
          : DEFAULT_PAGE_SIZE;
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
    this.allData = this.initialData
      .slice(startIndex, endIndex)
      .map((item, index) => ({
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


  handleBackToReturnList() {
    this.showTable = true;
  }
  handleCancel() {
    this.isvariable = false;
  }

  handleRowAction(event) {
    console.log('row action -- ', JSON.stringify(event.detail.row.Id));
    var orderId = event.detail.row.Id;
    console.log('id' +orderId);
    this.orderId = orderId;
    this.clickedreturnId = orderId;
   
    const actionName = event.detail.action.name;
    console.log('Action Name: ' + actionName);

    if (actionName === 'view_details') {
        // If the action is 'View More' (assumed for the 'Product' button)
        this.showTable = false;
    } else if (actionName === 'open_vf_page') {
       
        // If the action is 'Generate GRN' (assumed for the 'Generate GRN' button)
        this.isvariable = true;
}

    this.recId = orderId;
}
get iframeSrc() {
    console.log("hiiii", this.recId);
    return "/apex/returnordervfpage?Id=" + this.recId;
  }
}