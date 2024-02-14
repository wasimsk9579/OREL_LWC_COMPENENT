import LightningDatatable  from 'lightning/datatable';
import custompicklist from './custompicklist.html';
export default class Customtypeglobal extends LightningElement {
    static customType ={
        returnpicklist:
        {
            template: customPicklist,
            standardCellLayout : true,
            typeAttributes: ['label','value','placeholder','options']
        }
    }
}