import { LightningElement,api,track } from 'lwc';
import getopproduct from '@salesforce/apex/orelPOtableproductdatacontroller.getopproduct';
export default class OrelPOtableproductdata extends LightningElement {
    opproductData;
    @api oppoId;
    productData;
    error;
    @track columns = [{ label: 'Product Name', fieldName: 'Name' },
                      { label: 'Quantity', fieldName: 'Quantity' },
                      { label: 'Unit Price', fieldName: 'UnitPrice',type: 'currency', cellAttributes:  { alignment: 'left' } },
                      { label: 'Total Price', fieldName: 'TotalPrice',type: 'currency', cellAttributes: { alignment: 'left' } }];
    
    connectedCallback(){
        console.log('op product id - : ' , this.oppoId);
        this.loadproductDetails();
       
    }
    // loadproductDetails() 
    //     console.log('product Id', this.oppoId);
    //     getopproduct({ oppoId: this.oppoId})
    //         .then(result => {
    //             this.productData=result.map((item,ind)=>({
    //                 ...item,
    //                 Name=item.Product2.Name,
    //                 Quantity=item.Quantity,
    //                 UnitPrice=item.UnitPrice,
    //                 TotalPrice=item.TotalPrice,

    //             }))

    //             ));
    //             console.log('opp result',result);
    //         })
    //         .catch(error => {
    //             this.error = error;
    //             console.log('error', error);
    //         });
    // }

    loadproductDetails() 
    {
    console.log('product Id', this.oppoId);
    getopproduct({ oppoId: this.oppoId})
            .then(result => {    
                this.productData = result.map((item,ind)=>({
                    ...item,
                    Name:item.Product2.Name,
                    Quantity:item.Quantity,
                    UnitPrice:item.UnitPrice,
                    TotalPrice:item.TotalPrice,
                }));
               
            })
            .catch(error => {
                console.error('Error fetching data:', error);            
            });
    }
}