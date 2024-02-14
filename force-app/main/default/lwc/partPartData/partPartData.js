import { LightningElement ,wire} from 'lwc';
import PartPartController from '@salesforce/apex/PartPartController.PartPartController';
import updatepartdetails from '@salesforce/apex/PartPartController.updatepartdetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

columns=[
    {
      label: "Product DMN Name",
      fieldName: "Dimensions__c",
      type: "text",
      editable: true,
    }];



export default class PartPartData extends LightningElement { 

    columns = columns;
    data = [];
    saveDraftValue=[];

    @wire(PartPartController, {parentId : '01t1m000003rTXBAA2'})
    partData(result){
        console.log("result:"+JSON.stringify(result))

        if(result.error){
            this.data = undefined;
        }else if( result.data){
            this.data = result.data;

            console.log("this.data:"+JSON.stringify(this.data))
        }
       
    }

    handleSave(event){

        const updatedfield = event.detail.draftValues;
        this.saveDraftValue = event.detail.draftValues;
        console.log('updatedfield:'+JSON.stringify(updatedfield))
        console.log('saveDraftValue:'+JSON.stringify(this.saveDraftValue))

        updatepartdetails({partData :  this.saveDraftValue})
        .then( result =>{
            console.log("apex result:"+JSON.stringify(result))

            this.dispatchEvent(
                new ShowToastEvent({
                    title: result,
                    message: result,
                    variant: 'success'
                })
            );
        })
        .catch(error=>{
            console.error("err:"+JSON.stringify(error))
           
        })
    }

}