import { LightningElement, wire, track } from 'lwc';
import Id from '@salesforce/user/Id';
import getoppordata from '@salesforce/apex/OrelPurchaseOrderTableController.getoppordata';
const DEFAULT_PAGE_SIZE = 10; 
export default class OrelPurchaseOrderTable extends LightningElement {
    
    userId; // A property to store the current user's Id retrieved from @salesforce/user/Id.
    allData = []; // An array to store the retrieved data from the Apex method.
    initialData = []; // A copy of allData to store the initial data for filtering purposes.
    @track currentPage = 1; 
    totalPages = 1;
    @track pageSize = DEFAULT_PAGE_SIZE;
    @track isLastPage = false; // A boolean variable to determine if the current page is the last page.
    @track variable = false; 
    accountstatus = true
    showLoader = true;
    isShowModal = false;
    isNew = false;
    
    columns = [
       
        { label: 'Name', fieldName: 'Name' },
        { label: 'Amount', fieldName: 'Amount', type: 'currency', cellAttributes: { alignment: 'left' } },
        { label: 'Description', fieldName: 'Description' },
        { label: 'Status', fieldName: 'Status__c' },
        { label: 'Ordered Date', fieldName: 'CreatedDate', type: 'date', sortable: true },
        {
            label: 'Action',
            type: 'button',
            typeAttributes: {
                label: 'View More',
                title: 'Click here',
                variant: 'brand',
                name: 'view_details'
            },
        }
    ];
    

    connectedCallback() {
        this.userId = Id;
        this.callApexMethod();
      
    }

    callApexMethod() {
        getoppordata({ userIds: this.userId })
            .then(result => { 
                console.log('result data',result);
                console.log('record' +JSON.stringify(result));   
                this.allData=result;
                this.allData.forEach(item => {
                    if (item.Account && item.Account.Deboarding_process_status__c === 'In Process - Working with Reconciliation & Full and Final Settlement') {
                        this.isNew = true;
                    }
                    console.log('Deboarding_process_status__c:', item.Account ? item.Account.Deboarding_process_status__c : 'N/A');
                    this.isNew = item.Account ? item.Account.Deboarding_process_status__c === 'In Process - Working with Reconciliation & Full and Final Settlement' : false; 
                });

                
                console.log('56',this.isNew);
                this.initialData = [...this.allData];
                this.updateTotalPages();
                this.paginateData();
                this.showLoader = false;
                this.variable = false;
            })
            .catch(error => {
                console.error('Error fetching data:', error);            
            });
    }
    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;p
        const cloneData = [...this.allData];
        cloneData.sort((a, b) => {
            return this.sortBy(a, b, sortedBy, sortDirection);
        });
        this.allData = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
// sortBy: A helper method used in sorting the data.
        sortBy(a, b, fieldName, sortDirection) {
            const valueA = a[fieldName];
            const valueB = b[fieldName];
            let comparison = 0;   

            if (valueA === valueB) {
                comparison = a.index > b.index ? 1 : a.index < b.index ? -1 : 0;
            } else if (typeof valueA === 'string' && typeof valueB === 'string') {
                comparison = valueA.toLowerCase().localeCompare(valueB.toLowerCase());
            } else if (!isNaN(valueA) && !isNaN(valueB)) {
                comparison = parseFloat(valueA) - parseFloat(valueB);
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        }

// handleSearch: A method to handle searching/filtering of the data based on user input.

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

    handleRowAction(event) {
        console.log('row action -- ', JSON.stringify(event.detail.row.Id));
        var recId = event.detail.row.Id;
        console.log('id' +recId);
        this.clickedoppId = recId;
        this.variable = true;
        console.log('OUTPUT parent: ', this.clickedoppId);
    }
    handleBackToReturnList()
    {
        this.variable = false;

    }

    handleOpenPopup(){
        if (!this.isNew){
            this.isShowModal = true;
        }
    }

    closeModalPopup() {
        this.isShowModal = false;
        // this.refreshData();
    }

    

}