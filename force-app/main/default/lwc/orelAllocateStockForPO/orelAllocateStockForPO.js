import { LightningElement, api, wire ,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
// import getOppData from '@salesforce/apex/OrlUpdateQuoteLineItemsController.getOppData';
// import getbalancedata from '@salesforce/apex/OrlUpdateQuoteLineItemsController.getbalancedata';
import getQuoteAndInventoryData from '@salesforce/apex/OrlUpdateQuoteLineItemsController.getQuoteAndInventoryData';
import createOrderAndInvoice from '@salesforce/apex/OrlUpdateQuoteLineItemsController.createOrderAndInvoice';

export default class OrelAllocateStockForPO extends LightningElement {
  @api recordId;
  @track QuoteLineItemsData;
  QuoteLineItemsDataaa;
  showLoading = true;
  showQuantityError = false;
  probalanceDatas;
  productInventoryData = [];
  @track initialQuoteLineItemsData = [];
  quoteLineItems;
  allocatevalue;
  currentQLI;
  qliList;
  temp = [];

    // @wire(getOppData, {oppId:'$recordId'})
    // getQuoteLineItems({error, data}) {
    //     if (error) {
    //         console.log('Error -- ', error);
    //     } else if (data) {
    //       this.QuoteLineItemsDataaa = JSON.parse(JSON.stringify(data));
    //       console.log(JSON.stringify(this.QuoteLineItemsData));
    //       this.showLoading = false;
    //     }
    // }

    // @wire(getbalancedata, {oppId:'$recordId'})
    // getbaladata({error, data}) {
    //     if (error) {
    //         console.log('Error -- ', error);
    //     } else if (data) {
    //       data.forEach((item) => {
    //         // Assuming probalanceData has fields like Id (product ID) and cgcloud__Balance__c (inventory)
    //         this.probalanceDatas[item.Id] = item.cgcloud__Balance__c;
    //     });

    //     console.log('balance data', JSON.stringify(this.probalanceDatas));
    //     this.showLoading = false;
    //     }
    // }

    // @wire(getQuoteAndInventoryData, { oppId: '$recordId' })
    // retrieveQuoteAndInventoryData({ error, data }) {
    //     if (data) {
    //         console.log('QuoteLineItems:', data.quoteLineItems);
    //         console.log('InventoryData:', data.inventoryData);
    //         this.showLoading = false;

    //         // Assuming you have fetched both quoteLineItems and inventoryData
    //         const quoteLineItems = data.quoteLineItems;
    //         const inventoryData = data.inventoryData;

    //         // Mapping inventory data with QuoteLineItems based on Product Id
    //         this.QuoteLineItemsData = quoteLineItems.map(quoteItem => {
    //           console.log('ProductData:', this.QuoteLineItemsData);
    //             const inventoryItem = inventoryData.find(invItem => invItem.cgcloud__Product__c === quoteItem.Product2Id);
              
    //             return {
    //                 ProductName: quoteItem.Product2.Name,
    //                 InventoryBalance: inventoryItem ? inventoryItem.cgcloud__Balance__c : '0',
    //                 RequestedQuantity: quoteItem.Quantity,
    //                 ListPrice: quoteItem.ListPrice,
    //                 allocatedquantity:quoteItem.Orl_Allocated_Quantity__c,
                 
    //                 // Add more fields as needed from both QuoteLineItem and InventoryData
    //             };
    //             this.initialQuoteLineItemsData = [...this.QuoteLineItemsData];
    //             console.log('ProductData:', this.initialQuoteLineItemsData);
    //         });

           
    //     } else if (error) {
    //         this.showLoading = false;
    //         console.error('Error fetching data:', error);
    //     }
    // }

// Assuming the component has a property 'temp'
// Initialize it in your component class.
// Example: this.temp = [];




    @wire(getQuoteAndInventoryData, { oppId: '$recordId' })
    retrieveQuoteAndInventoryData({ error, data }) {
        if (data) {
            console.log('QuoteLineItems:', data.quoteLineItems);
            console.log('InventoryData:', data.inventoryData);
            this.showLoading = false;
    
            // Assuming you have fetched both quoteLineItems and inventoryData
            const quoteLineItems = data.quoteLineItems;
            const inventoryData = data.inventoryData;
    
            // Mapping inventory data with QuoteLineItems based on Product Id
            this.QuoteLineItemsData = quoteLineItems.map(quoteItem => {
                console.log('ProductData:', this.QuoteLineItemsData);
                const inventoryItem = inventoryData.find(invItem => invItem.cgcloud__Product__c === quoteItem.Product2Id);
              this.allocatevalue=inventoryItem ? inventoryItem.cgcloud__Balance__c : '0';
                return {
                    Id: quoteItem.id, 
                    ProductName: quoteItem.Product2.Name,
                    InventoryBalance: inventoryItem ? inventoryItem.cgcloud__Balance__c : '0',
                    RequestedQuantity: quoteItem.Quantity,
                    ListPrice: quoteItem.ListPrice,
                    // Add more fields as needed from both QuoteLineItem and InventoryData
                };
            });
    
            // Storing the initial state of QuoteLineItemsData outside the map function
           this.initialQuoteLineItemsData = data.quoteLineItems;
            console.log('Initial ProductData:', JSON.stringify(quoteLineItems));
        }
    }

  
  
  
    handleQuantityChange(event){
      // debugger;
      const lineItemIn = event.target.dataset.id;
      console.log('lineItemIndex',lineItemIn);
        console.log('quoyte data',this.initialQuoteLineItemsData);
        // const lineItemIndex = event.currentTarget.dataset.id;  
        const lineItemIndex = event.currentTarget.dataset.index;
        console.log('rec index',lineItemIndex);
        const recId = this.initialQuoteLineItemsData[lineItemIndex].Id;
        console.log('rec ids',recId);
        const temp = [...this.initialQuoteLineItemsData];
        console.log('temp',JSON.stringify(temp));
      // var temp = this.initialQuoteLineItemsData;
       this.currentQLI = {
        Id : recId,
        Orl_Allocated_Quantity__c : event.detail.value
      }
      this.qliList.push(this.currentQLI);
    }



    
    //   handleReset() {
      
    //     this.initialQuoteLineItemsData = this.initialQuoteLineItemsData.map(item => {
    //         item.Orl_Allocated_Quantity__c = '';
    //         return item;
    //     });
    //     // Trigger UI refresh
    //     this.initialQuoteLineItemsData = [...this.initialQuoteLineItemsData];

    // }
    
  
  
      // Trigger UI refresh (assuming this is necessary in your framework)
      // You might not need to create a new copy if the object references are already maintained correctly
    
  
  
  

    handleSubmit(){
      console.log('Data -149 ', JSON.stringify(this.QuoteLineItemsData));
      let showerror = false;
      this.initialQuoteLineItemsData.forEach(function(obj) {
        if(obj.quantityExceeded){
          showerror = true;
        }
      });

      if(showerror){
        const evt = new ShowToastEvent({
          title: 'Error',
          message: 'Allocate stock cannot be more than the inventory available.',
          variant: 'error',
          mode: 'dismissable'
        });
        this.dispatchEvent(evt);
      }else{
        this.showLoading = true;
      console.log('Data -200 ', JSON.stringify(this.QuoteLineItemsData));
       // console.log('Data -203 ', JSON.stringify(temp));
        createOrderAndInvoice({ qtLineItemsData: this.QuoteLineItemsData})
          .then(result => {
            console.log(result);
            this.dispatchEvent(new CloseActionScreenEvent());
            this.showLoading = false;
            const evt = new ShowToastEvent({
              title: 'Success',
              message: 'Order created successfully!',
              variant: 'success',
              mode: 'dismissable'
          });
          this.dispatchEvent(evt);
          })
          .catch(error => {
              console.log(error);
              const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Please try again!',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
          });
      }
      
        // setTimeout(dilayRefresh(), 5000);
    }
    dilayRefresh(){
      location.reload();
    }

}