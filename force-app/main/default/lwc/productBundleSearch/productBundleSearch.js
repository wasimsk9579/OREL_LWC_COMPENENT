import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ProductName_FIELD from "@salesforce/schema/Product2.Name";
import ConsumerGoodsProductCode_FIELD from "@salesforce/schema/Product2.cgcloud__Consumer_Goods_Product_Code__c";
import Description1Language1_FIELD from "@salesforce/schema/Product2.cgcloud__Description_1_Language_1__c";
import ProductTemplate_FIELD from "@salesforce/schema/Product2.cgcloud__Product_Template__c";
import ProductBundle_FIELD from "@salesforce/schema/Product2.Product_Bundle__c";
import PRODUCT_OBJECT from "@salesforce/schema/Product2";
import searchProducts from "@salesforce/apex/ProductBundleSearchController.searchProducts";
import getProductParts from "@salesforce/apex/ProductBundleSearchController.getProductParts";
import handleAfterInsert from "@salesforce/apex/ProductBundleSearchController.handleAfterInsert";
import createProductParts from "@salesforce/apex/ProductBundleSearchController.createProductParts";

import { CurrentPageReference } from "lightning/navigation";

const DEFAULT_PAGE_SIZE = 5;

export default class ProductSearchLWC extends LightningElement {
  @wire(CurrentPageReference)
  pageRefData;

  @track totalPages = 1;
  @track currentPage = 1;
  @track pageSize = DEFAULT_PAGE_SIZE;
  @track isLastPage = false; // A boolean variable to determine if the current page is the last page.
  @track variable = false;
  @track isSelected = false;
  @track selectedProductParts = [];
  productBundleData = [];
  productBundlePartsData = [];
  initialData = [];
  gridData = [];
  productId;
  parentParentId;
  objectName = PRODUCT_OBJECT;
  selectedProductsPartsData;
  draftValues;
  recordTypeId = "0121m000001gaKoAAI";
  objectFields = [
    ProductName_FIELD,
    ConsumerGoodsProductCode_FIELD,
    ProductTemplate_FIELD,
    Description1Language1_FIELD,
    ProductBundle_FIELD,
  ];
  opportunityRecordId;

  connectedCallback() {
    this.callApexMethod();
    this.opportunityRecordId = this.pageRefData.attributes.recordId;
    console.log(
      "opportunity id from create bundle button received ---->",
      this.opportunityRecordId
    );
  }

  productBundleColumn = [
    {
      label: "Product Bundle Name",
      fieldName: "productBundleName",
      type: "text",
    },
  ];
  productBundlePartsColumn = [
    {
      label: "Product Bundle Part Name",
      fieldName: "productBundlePartName",
      type: "text",
    },
    {
      label: "Product Description",
      fieldName: "PartDescription",
      type: "text",
    },
    {
      label: "Product Dimension",
      fieldName: "dimension",
      type: "text",
    },
    {
      label: "Price Factor",
      fieldName: "pricefactor",
      type: "Number",
      editable: true,
      typeAttributes: {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      },
    },
  ];

  selectedChildPartRowsColumn = [
    {
      label: "Product Bundle Part Name",
      fieldName: "productBundlePartName",
      type: "text",
    },
    {
      label: "Product Description",
      fieldName: "PartDescription",
      type: "text",
      editable: true,
    },
    {
      label: "Product Dimension",
      fieldName: "dimension",
      type: "text",
      editable: true,
    },
    {
      label: "Quantity",
      fieldName: "quantity",
      type: "Number",
      editable: true,
    },
    {
      label: "List price",
      fieldName: "listprice",
      type: "Currency",
      editable: true,
    },
    {
      label: "Price Factor",
      fieldName: "pricefactor",
      type: "Number",
      editable: true,
      typeAttributes: {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      },
    },
    {
      label: "Final Price",
      fieldName: "finalpricer",
      type: "Currency",
      // editable: true,
    },
  ];

  // connected callback to invoke apex class method

  //   handle form data saving

  handleSuccess(event) {
    this.productId = event.detail.id;
    console.log("productId fetching------>", event.detail);
    this.parentParentId = this.productId;
    console.log("Record created with ID---->", this.productId);
    this.handleinsidemwthod();
  }

  // insert the product as opportunity line item to the given opportunity
  handleinsidemwthod() {
    handleAfterInsert({
      parentId: this.parentParentId,
      opportunityRecordId: this.opportunityRecordId,
    })
      .then((result) => {
        console.log(" result -----> " + result);
      })
      .catch((error) => {
        this.error = error;
      });
  }

  ////////

  //  searching productBundle
  searchedProductBundle = [];
  handleSearchProductBundle(event) {
    const searchKey = event.target.value.toLowerCase();
    this.variable = true;
    this.currentPage = 1;
    console.log("Searckey found---->", searchKey);
    if (searchKey) {
      this.productBundleData = this.initialData.filter((item) =>
        Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(searchKey)
        )
      );

      this.searchedProductBundle = this.productBundleData;
      console.log(
        "product bundle data fetching---->",
        this.searchedProductBundle
      );
      const searchResultSize = this.productBundleData.length;
      console.log("search result size--->", searchResultSize);
      this.pageSize =
        searchResultSize <= DEFAULT_PAGE_SIZE
          ? searchResultSize
          : DEFAULT_PAGE_SIZE;
      this.productBundleData = this.productBundleData.slice(0, this.pageSize);
      // dont touch below line at any cost
      this.totalPages = Math.ceil(searchResultSize / DEFAULT_PAGE_SIZE);
      searchResultSize <= DEFAULT_PAGE_SIZE
        ? this.updateTotalPages()
        : this.totalPages;
    } else {
      this.variable = false;
      this.paginateData();
    }
  }

  // retrieving productBundaleData from Apex
  callApexMethod() {
    searchProducts()
      .then((result) => {
        if (result.length > 0) {
          this.productBundleData = result?.map((item, ind) => ({
            id: item.Id,
            productBundleName: item.Name,
          }));
          this.initialData = [...this.productBundleData];
          this.updateTotalPages();
          this.paginateData();
        }
      })
      .catch((error) => {
        console.error("Error fetching gridData", error);
      });
  }

  // selecting bundle product part on row select

  handlerowselection(event) {
    console.log("handle row event invoking----->", event.detail);
    const selectedRows = event.detail.selectedRows;
    console.log("Selected rows fetching------>", selectedRows);
    if (selectedRows.length > 0) {
      const clickedProductId = selectedRows[0].id;
      console.log("Selected row id found---->", clickedProductId);
      this.productId = clickedProductId;
      this.fetchAndDisplayChildren({ productId: this.productId });
    }
  }

  //  fetching product bundle parts from apex

  fetchAndDisplayChildren() {
    getProductParts({ productId: this.productId })
      .then((result) => {
        console.log("product bundle Ids fetching ---->", this.productId);
        console.log("Products parts coming from apex---->", result);
        this.productBundlePartsData = result?.map((item, ind) => ({
          Id: item.Id,
          productBundlePartName: item.Name,
          PartDescription: item.Part_Description__c,
          dimension: item.Dimensions__c,
          listprice: item.List_price__c,
          quantity: item.cgcloud__Quantity__c,
          pricefactor: item.Price_factor__c,
          finalprice: item.Final_Price__c,
          cData: item.cgcloud__Child_Product__c,
          cLevel: "Product",
        }));
        console.log(
          "product parts with custom fieldnames---->",
          this.productBundlePartsData
        );
      })
      .catch((error) => {
        console.error("Error fetching product parts", error);
      });
  }

  // event function select product parts

  onProductPartRowSelection(event) {
    const selectedChildPartRows = event.detail.selectedRows;
    console.log("selected product Parts Rows ----->", selectedChildPartRows);
    this.selectedProductsPartsData = event.detail.selectedRows;
  }

  // event method to save edited data table cells

  handleSave(event) {
    console.log("save event invoking");
    this.draftValues = event.detail.draftValues;
    console.log("edited cell draftvalues found------>", this.draftValues);
    this.selectedProductsPartsData = this.selectedProductsPartsData.map(
      (PartiIem) => {
        const matchingDraftValue = this.draftValues.find(
          (draftItem) => draftItem.Id === PartiIem.Id
        );

        if (
          matchingDraftValue &&
          matchingDraftValue.dimension !== PartiIem.dimension
        ) {
          PartiIem.dimension = matchingDraftValue.dimension
            ? matchingDraftValue.dimension
            : PartiIem.dimension;
          console.log("Updated dimension:", PartiIem.dimension);
        }
        if (
          matchingDraftValue &&
          matchingDraftValue.PartDescription !== PartiIem.PartDescription
        ) {
          PartiIem.PartDescription = matchingDraftValue.PartDescription
            ? matchingDraftValue.PartDescription
            : PartiIem.PartDescription;
          console.log("Updated PartDescription:", PartiIem.PartDescription);
        }
        if (
          matchingDraftValue &&
          matchingDraftValue.quantity !== PartiIem.quantity
        ) {
          PartiIem.quantity = matchingDraftValue.quantity
            ? matchingDraftValue.quantity
            : PartiIem.quantity;
          console.log("Updated quantity:", PartiIem.quantity);
        }

        if (
          matchingDraftValue &&
          matchingDraftValue.listprice !== PartiIem.listprice
        ) {
          PartiIem.listprice = matchingDraftValue.listprice
            ? matchingDraftValue.listprice
            : PartiIem.listprice;
          console.log("Updated listprice:", PartiIem.listprice);
        }
        if (
          matchingDraftValue &&
          matchingDraftValue.pricefactor !== PartiIem.pricefactor
        ) {
          PartiIem.pricefactor = matchingDraftValue.pricefactor
            ? matchingDraftValue.pricefactor
            : PartiIem.pricefactor;
          console.log("Updated pricefactor:", PartiIem.pricefactor);
        }

        return PartiIem;
      }
    );
    console.log(
      "updated selected products parts data----->",
      this.selectedProductsPartsData
    );
    this.CreateProductParts();
  }

  //  selected product parts onclick funcution

  handleOnclickProductParts() {
    this.isSelected = true;
  }

  // method to update the edited values to the newly create product bundle

  CreateProductParts() {
    console.log(
      "selected data parts for create method---->",
      this.selectedProductsPartsData
      
    );
    const selectedParts=[];
    this.selectedParts=this.selectedProductsPartsData;
    console.log('new array data--->',this.selectedParts)
    createProductParts({
      parentId: this.parentParentId,
      selectedProducts: this.selectedProductsPartsData,
    })
      .then((result) => {
        console.log("newly created products ------>", result);
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Product Parts created successfully.",
            variant: "success",
          })
        );
      })
      .catch((error) => {
        console.error(error);
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error",
            message: "Error creating Product Parts.",
            variant: "error",
          })
        );
      });
  }

  // toast message block to display user a message on successful transaction

  showToast(title, message, variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant,
    });
    this.dispatchEvent(event);
  }

  // generic pagination

  updateTotalPages() {
    this.totalPages = Math.ceil(
      this.productBundleData.length / DEFAULT_PAGE_SIZE
    );
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