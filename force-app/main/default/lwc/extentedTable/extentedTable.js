import LightningDatatable from 'lightning/datatable';
import picklistTemplate from './templates/picklist.html';
export default class ExtentedTable extends LightningDatatable {
    //Let's create the Custom Type for the different types
    static customTypes = {
        picklist: {
            template: picklistTemplate,
            typeAttributes: ['name', 'label', 'value', 'placeholder', 'options', 'index', 'variant']
        }
    };
}