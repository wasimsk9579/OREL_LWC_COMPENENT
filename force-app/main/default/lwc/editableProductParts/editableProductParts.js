import { LightningElement, api,wire } from "lwc";
import { NavigationMixin} from "lightning/navigation";
import {encodeDefaultFieldValues} from 'lightning/pageReferenceUtils';

export default class EditableProductParts extends NavigationMixin( LightningElement) {
  @api recordId;
  handlebuttonclick(){
    const stateValues = encodeDefaultFieldValues({
        Name : 'Centimeter'
    });
    console.log('### record id from nav component--->',this.recordId)
    this[NavigationMixin.Navigate]({
        type : 'standard__navItemPage',
        attributes :{
            apiName : 'Search_bundle',
            recordId:this.recordId
        }
    })
}
}