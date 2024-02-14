import { LightningElement, api, wire ,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import getOppData from '@salesforce/apex/OrlUpdateQuoteLineItemsController.getOppData';
import getbalancedata from '@salesforce/apex/OrlUpdateQuoteLineItemsController.getbalancedata';
import createOrderAndInvoice from '@salesforce/apex/OrlUpdateQuoteLineItemsController.createOrderAndInvoice';
export default class Orelallocatedstock extends LightningElement {



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
  combinedData;
 

  
  // @wire(getOppData, { oppId: '$recordId' })
  // getQuoteLineItems({ error, data }) {
  //     if (error) {
  //         console.log('Error -- ', error);
  //     } else if (data) {
  //         this.QuoteLineItemsData = JSON.parse(JSON.stringify(data));
  //         this.getbaladata();
  //     }
  // }

  // @wire(getbalancedata, { oppId: '$recordId' })
  // getbaladata({ error, data }) {
  //     if (error) {
  //         console.error('Error in getbaladata -- ', error);
  //     } else if (data) {
  //         this.probalanceDatas = JSON.parse(JSON.stringify(data));
  //         this.combineData();
  //     }
  // }

  @wire(getOppData, { oppId: '$recordId' })
getQuoteLineItems(result) {
    const { error, data } = result || {}; // Check if result is defined
    if (error) {
        console.error('Error -- ', error);
    } else if (data) {
        this.QuoteLineItemsData = JSON.parse(JSON.stringify(data));
        this.getbaladata();
    }
}

@wire(getbalancedata, { oppId: '$recordId' })
getbaladata(result) {
    const { error, data } = result || {}; // Check if result is defined
    if (error) {
        console.error('Error in getbaladata -- ', error);
    } else if (data) {
        this.probalanceDatas = JSON.parse(JSON.stringify(data));
        this.combineData();
    }
}


  combineData() {
    this.combinedData = this.QuoteLineItemsData.map(quoteItem => {
      console.log('ProductData:', this.QuoteLineItemsData);
      const inventoryItem = this.probalanceDatas.find(invItem => invItem.cgcloud__Product__c === quoteItem.Product2Id);
      console.log('inventoryItem',inventoryItem)
   
      return {
          Id: quoteItem.id, 
          ProductName: quoteItem.Product2.Name,
          InventoryBalance: inventoryItem ? inventoryItem.cgcloud__Balance__c : '0',
          RequestedQuantity: quoteItem.Quantity,
          ListPrice: quoteItem.ListPrice,
          // Add more fields as needed from both QuoteLineItem and InventoryData
      };
     
   
  });
  this.allocatevalue = this.combinedData.map(item => item.InventoryBalance);
  console.log(' this.allocatevalue ', this.allocatevalue)
  this.showLoading = false;
}

    handleQuantityChange(event){
       // debugger;
              const lineItemIndex = event.target.dataset.id;
            console.log('lineItemIndex',lineItemIndex);
            const allocatevalue = this.allocatevalue[lineItemIndex];
            var temp = this.QuoteLineItemsData;
            console.log('this.allocatevalue 115',this.allocatevalue)
          if(event.target.value <= allocatevalue){ 
            console.log('allocatevalue',allocatevalue)
            temp[lineItemIndex]['Orl_Allocated_Quantity__c']=event.target.value;
            console.log('event.target.value',event.target.value);
            console.log('after change',JSON.stringify(temp));
            temp[lineItemIndex]['quantityExceeded']=false;  
          }else{
            temp[lineItemIndex]['quantityExceeded']=true;
          }
      }
      handleSubmit(){
        console.log('Data -149 ', JSON.stringify(this.QuoteLineItemsData));
        let showerror = false;
        this.QuoteLineItemsData.forEach(function(obj) {
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
            setTimeout(() => location.reload(), 1000);
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
  
  
    //   handleReset(){
    //     console.log('47',this.QuoteLineItemsData)
    //     this.QuoteLineItemsData.forEach(function(obj) {
    //       obj.Orl_Allocated_Quantity__c = 0
    //     });
    //     console.log('this.QuoteLineItemsData after reset - ', JSON.stringify(this.QuoteLineItemsData));
    //   }
  
    //   handleSubmit() {
    //     let showerror = false;
    //     this.QuoteLineItemsData.forEach(function (obj) {
    //         if (obj.quantityExceeded) {
    //             showerror = true;
    //         }
    //     });
    
    //     if (showerror) {
    //         const evt = new ShowToastEvent({
    //             title: 'Error',
    //             message: 'Allocate stock cannot be more than the inventory available.',
    //             variant: 'error',
    //             mode: 'dismissable'
    //         });
    //         this.dispatchEvent(evt);
    //     } else {
    //         this.showLoading = true;
    //         console.log('Data - ', JSON.stringify(this.QuoteLineItemsData));
    //         createOrderAndInvoice({ qtLineItemsData: this.QuoteLineItemsData })
    //             .then(result => {
    //                 console.log(result);
    //                 this.showLoading = false;
    //                 const evt = new ShowToastEvent({
    //                     title: 'Success',
    //                     message: 'Order created successfully!',
    //                     variant: 'success',
    //                     mode: 'dismissable'
    //                 });
    //                 this.dispatchEvent(evt);
    
    //                 // Refresh the page after a delay (e.g., 5000 milliseconds = 5 seconds)
    //                 setTimeout(() => location.reload(), 2000);
    //             })
    //             .catch(error => {
    //                 console.log(error);
    //                 const evt = new ShowToastEvent({
    //                     title: 'Error',
    //                     message: 'Please try again!',
    //                     variant: 'error',
    //                     mode: 'dismissable'
    //                 });
    //                 this.dispatchEvent(evt);
    //             });
    //     }
    // }
  
    
  