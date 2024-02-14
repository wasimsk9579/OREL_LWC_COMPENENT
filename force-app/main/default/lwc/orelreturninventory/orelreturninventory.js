import { LightningElement,api,track } from 'lwc';
import getInventory from '@salesforce/apex/orelreturninventorycontroller.getInventory';
import Id from "@salesforce/user/Id";
const DEFAULT_PAGE_SIZE = 5; 
export default class Orelreturninventory extends LightningElement {


    userId =Id; // A property to store the current user's Id retrieved from @salesforce/user/Id.
    allData = []; // An array to store the retrieved data from the Apex method.
    initialData = []; // A copy of allData to store the initial data for filtering purposes.
    @track currentPage = 1; 
    totalPages = 1;
    @track pageSize = DEFAULT_PAGE_SIZE;
    @track isLastPage = false; // A boolean variable to determine if the current page is the last page.
    @track variable = false; // A boole

    columns = [
        {label: 'Name', fieldName: 'Name', type: 'text', sortable: true},
       // {label: 'Inventory Type', fieldName: 'inventorytype', type: 'text', sortable: true },
       //{label: 'Customer', fieldName: 'customerName', type: 'text', sortable: true },
       // {label: 'Inventory Template', fieldName: 'InventoryTemplate', type: 'text', sortable: true },
       // {label: 'Inventory Control Template Type', fieldName: 'InventoryControlTemplateType', type: 'text', sortable: true },
       // {label: 'Phase', fieldName: 'Phase', type: 'text', sortable: true },
        {label: 'Product', fieldName: 'Product', type: 'text', sortable: true },
       // {label: 'Initial Inventory', fieldName: 'InitialInventory', type: 'text', sortable: true },
        {label: 'Balance', fieldName: 'Balance', type: 'text', sortable: true },
       // {label: 'Total Return Quantity', fieldName: 'TotalReturnQuantity', type: 'text', sortable: true},
        {label: 'Valid From', fieldName: 'ValidFrom', type: 'text', sortable: true },
        {label: 'Valid Thru', fieldName: 'ValidThru', type: 'text', sortable: true }    
    ];

   
 
    connectedCallback() {
        this.userId = Id;
        this.callApexMethod();
        console.log('users', this.userId);
    }

    callApexMethod() {
        getInventory({ userId: this.userId })
            .then(result => { 
                this.allData = result.map((item,ind)=>({
                    
                    ...item,
                    Name:item.Name,
                   // customerName:item.cgcloud__Account__r.Name,
                    //InventoryTemplate:item.cgcloud__Inventory_Template__r.Name,
                    // InventoryControlTemplateType:item.Inventory_Control_Template_Type__c,
                    // Phase:item.cgcloud__Phase__c,
                    Product:item?.cgcloud__Product__r?.Name,
                    //inventorytype:item?.Orl_Inventory_type__c,
                    // InitialInventory:item.cgcloud__Initial_Inventory__c,
                    Balance:item.cgcloud__Balance__c,
                    // TotalReturnQuantity:item.Total_Return_Quantity__c,
                    ValidFrom:item.cgcloud__Valid_From__c,
                    ValidThru:item.cgcloud__Valid_Thru__c,
    

                }));
              this.variable=false;
                console.log('resultt' +JSON.stringify(result));
                this.initialData = [...this.allData];
                this.updateTotalPages();
                this.paginateData();
            })
            .catch(error => {
                console.error('Error fetching data:', JSON.stringify(error));            
            });
    }

  //  onHandleSort: A method to handle sorting of the data based on column headers.

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
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
