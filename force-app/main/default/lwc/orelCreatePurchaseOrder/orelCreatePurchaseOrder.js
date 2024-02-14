import { LightningElement, track } from 'lwc';
import userId from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createOppAndOppLineItems from '@salesforce/apex/OrelCreatePurchaseOrderController.createOppAndOppLineItems';
export default class OrelCreatePurchaseOrder extends LightningElement {
    @track placeOrderList = [
        {
            ProductName : '',
            ProductQuantity : 0
        },
    ];
    showLoading = false;

    handleAddNewRow(){
        var newRowObj = {
            ProductName : '',
            ProductQuantity : 0
        }
        this.placeOrderList = this.placeOrderList.concat(newRowObj);
        console.log('OUTPUT list: ',JSON.stringify(this.placeOrderList));
    }

    handleDeleteRow(event){
        this.placeOrderList.splice(event.target.dataset.id,1);
        console.log("array lenght",this.placeOrderList.length);
    }

    handleNameChange(event){
        this.placeOrderList[event.target.dataset.id].ProductName = event.target.value;
        console.log('OUTPUT product Name: ', JSON.stringify(this.placeOrderList));
    }

    handleQuantityChange(event){
        this.placeOrderList[event.target.dataset.id].ProductQuantity = event.target.value;
        console.log('OUTPUT product Name: ', JSON.stringify(this.placeOrderList));
    }

    handleSaveData(){
        this.showLoading = true;
        createOppAndOppLineItems({oppData : JSON.stringify(this.placeOrderList), userId: userId})
        .then((result) => {
            console.log('OUTPUT : Success');
            const evt = new ShowToastEvent({
                message: 'Purchase Order created Successfully!',
                title: 'Success',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
            this.handleReset();
            this.showLoading = false;

            const closeModelEvent = new CustomEvent("submitform");
            this.dispatchEvent(closeModelEvent);
        })
        .catch((error) => {
            this.showLoading = false;
            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Unexpeced error occured please try again!',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
            this.handleReset();
            console.log('OUTPUT : Error' , error);
        });
    }

    handleReset(){
        this.placeOrderList = [{
            ProductName : '',
            ProductQuantity : 0
        }];
    }
}