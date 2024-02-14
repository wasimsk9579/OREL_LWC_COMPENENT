/*
* Component Name: orlRetailStoreTable
* Author: Pooja V
* Date: 26-11-2023
* Description: This LWC is a Salesforce component designed to display the Retailers list,
    The component primarily fetches data from the Apex controller (orlRetailStoreTableController) using the getRetailStoreData method. 
    It supports sorting, searching, and paginating the data in a tabular format. 
    Pagination controls (handlePrevious and handleNext) are provided, and the number of items displayed per page can be dynamically adjusted based on the search results.
*/

import { LightningElement, track,api} from 'lwc';
import getRetailStoreData from '@salesforce/apex/orlRetailStoreTableController.getRetailStoreData';
import Id from '@salesforce/user/Id';
import { NavigationMixin } from 'lightning/navigation'; 

const DEFAULT_PAGE_SIZE = 5; 

export default class OrlRetailStoreTable extends NavigationMixin(LightningElement) {

    @api recordIds; // An API property to accept record Ids from the parent component.
    userId; // A property to store the current user's Id retrieved from @salesforce/user/Id.
    allData = []; // An array to store the retrieved data from the Apex method.
    initialData = []; // A copy of allData to store the initial data for filtering purposes.
    @track currentPage = 1; 
    totalPages = 1;
    @track pageSize = DEFAULT_PAGE_SIZE;
    @track isLastPage = false; // A boolean variable to determine if the current page is the last page.
    @track variable = false; // A boolean variable, the purpose of this variable is to handle the displaying of data in datatable on clearing of search input field

// An array defining the columns for the data table.    
    columns = [
        { label: 'Sl No', fieldName: 'index', type: 'text', sortable: false, initialWidth: 80 },
        {label: 'Name', fieldName: 'rName', type: 'text', sortable: true },
        {label: 'City', fieldName: 'rAddress', type: 'text', sortable: true },
        {label: 'DeliveryMethod', fieldName: 'DeliveryMethod', type: 'text', sortable: true },
        {label: 'Priority', fieldName: 'Priority', type: 'text',sortable: true }
    ];
    
// connectedCallback: A lifecycle hook that is called when the component is inserted into the DOM. It initializes the userId and calls the callApexMethod method.

    connectedCallback() {
        this.userId = Id;
        this.callApexMethod();
    }
// formatAddress: A method to format the address based on the given address object.
    formatAddress(address) {
        if (address) {
            const street = address.street ? `${address.street}` : '';
            const city = address.city ? `, ${address.city}` : '';
            const state = address.state ? `, ${address.state}` : '';
            const pincode = address.pincode ? `- ${address.pincode}` : '';
            return `${street}${city}${state}${pincode}`;
        } else {
            return '';
        }
    }
// callApexMethod: A method using the getRetailStoreData Apex method to retrieve data and process it.
    callApexMethod() {
        getRetailStoreData({ userIds: this.userId })
            .then(result => {    
                console.log('retored data:'+ result);
                this.allData = result.map((item, index) => ({ ...item, 
                    index: index + 1,
                    DeliveryMethod: item.Retail_Store__r.DeliveryMethod,
                    StoreType: item.Retail_Store__r.StoreType ,
                    rAddress: this.formatAddress(item.Retail_Store__r.Address),
                    rName:item.Retail_Store__r.Name,
                    Priority:item.Retail_Store__r.Priority
                }));
                this.initialData = [...this.allData];
                this.updateTotalPages();
                this.paginateData();
            })
            .catch(error => {
                console.error('Error fetching data:', error);            
            });
    }

  //  onHandleSort: A method to handle sorting of the data based on column headers.

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
}