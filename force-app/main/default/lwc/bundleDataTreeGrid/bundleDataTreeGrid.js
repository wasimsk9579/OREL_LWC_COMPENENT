import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import ProductName_FIELD from '@salesforce/schema/Product2.Name';
import ConsumerGoodsProductCode_FIELD from '@salesforce/schema/Product2.cgcloud__Consumer_Goods_Product_Code__c';
import Description1Language1_FIELD from '@salesforce/schema/Product2.cgcloud__Description_1_Language_1__c';
import ProductTemplate_FIELD from '@salesforce/schema/Product2.cgcloud__Product_Template__c';
import ProductBundle_FIELD from '@salesforce/schema/Product2.Product_Bundle__c';
import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import searchProducts from '@salesforce/apex/ProductBundleSearchController.searchProducts';
import getProductParts from '@salesforce/apex/ProductBundleSearchController.getProductParts';
import insertProductParts from '@salesforce/apex/ProductBundleSearchController.insertProductParts';

export default class ProductSearchLWC extends LightningElement {
    @track gridColumns = [
        {
            type: 'text',
            fieldName: 'childProductItemName',
            label: 'Product Name',
            initialWidth: 300,
            isInEditMode: true,
        },
        {
            type: 'text',
            fieldName: 'description',
            label: 'Product Part Description',
            initialWidth: 300,
            isInEditMode: true,
        }
    ];

    searchTerm = '';
    products = [];
    @track selectedProductParts = [];
    productId;
    productParts = [];

    @track isSelected = false;

    gridData = [];

    objectName = PRODUCT_OBJECT;
    recordTypeId = '0121m000001gaKoAAI';
    objectFields = [
        ProductName_FIELD,
        ConsumerGoodsProductCode_FIELD,
        ProductTemplate_FIELD,
        Description1Language1_FIELD,
        ProductBundle_FIELD,
    ];

    handleSuccess(event) {
        this.productId = event.detail.id;
        console.log('Record created with ID:', this.productId);
        this.insertProductParts({
            parentId: this.productId,
            selectedProductParts: this.selectedProductParts,
        });
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
        this.searchProducts();
    }

    searchProducts() {
        searchProducts({ searchTerm: this.searchTerm })
            .then(result => {
                if (result.length > 0) {
                    this.productId = result[0].Id;
                    console.log(this.searchTerm, 'searchterm');
                    console.log(this.productId, 'prodsee');

                    this.products = result.map(item => ({
                        Id: item.Id,
                        childProductItemName: item.Name,
                        _children: [],
                    }));

                    this.gridData = this.products;
                } else {
                    this.showToast('Error', 'No matching products found.', 'error');
                }
            })
            .catch(error => {
                console.error('Error fetching products', error);
            });
    }

    handlerowselection(event) {
        const selectedRows = event.detail.selectedRows;
        console.log(selectedRows)
        if (selectedRows.length > 0) {
            const clickedProductId = selectedRows[0].Id;
    
            // if (this.productId !== clickedProductId) {
                this.isSelected = true;
                this.productId = clickedProductId;
                this.fetchAndDisplayChildren();
            // }
        } else {
            this.isSelected = false;
            this.selectedProduct = {}; // Reset the selected product when no child checkboxes are selected
        }
    }
    
    fetchAndDisplayChildren() {
        getProductParts({ productId: this.productId })
            .then(result => {
                console.log(this.productId, 'prodsss');
                console.log(result, 'results');
                this.productParts = result;

                const updatedGridData = this.gridData.map(item => {
                    if (item.Id === this.productId) {
                        item._children = result.map(childItem => ({
                            Id: childItem.Id,
                            childProductItemName: childItem.Name,
                            description:item.Part_Description__c
                        }));
                    }
                    return item;
                });
                this.gridData = [...updatedGridData];
                console.log('The parts = ' + JSON.stringify(result));
            })
            .catch(error => {
                console.error('Error fetching product parts', error);
            });
    }

    HandleonRowAction(event) {
        alert('123456');
        console.log(event, 'lll');
        const updatedData = event.detail.draftValues;
        console.log(updatedData, 'insertProductParts');
        // Process and save the updated data using Apex or another method
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedProductParts = selectedRows;
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }


 // paginateData: A method to slice and display the data based on the current page and page size
 paginateData() {
    const startIndex = (this.currentPage - 1) * DEFAULT_PAGE_SIZE;
    const endIndex = startIndex + DEFAULT_PAGE_SIZE;
    this.productBundleData = this.initialData
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




}