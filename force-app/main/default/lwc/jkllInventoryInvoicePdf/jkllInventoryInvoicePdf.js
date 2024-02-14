import { LightningElement } from 'lwc';

export default class jkllInventoryInvoicePdf extends LightningElement {
    ACCESS_TOKEN ='00D1m0000000Mti!AQgAQBArriN7IAppdvNMHSP2W1Sn7_8IL1ANLrSqWLev9ijQmcoWq7ERlGDWM.7ahZvUissoaP0Y4YzRA91q5L7fO2LEovkx';

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file.type === 'application/pdf') {
            this.uploadFile(file);
        } else {
            console.log('Not a PDF');
        }
    }

    uploadFile(file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const content = event.target.result.split(',')[1];
            this.sendToApex(file.name, content);
        };
        reader.readAsDataURL(file);
    }

    sendToApex(fileName, base64Content) {
        const body = {
            fileName: fileName,
            base64PDFContent: base64Content,
            title: fileName // Include the 'Title' field
        };
    
        fetch('/services/apexrest/invoicePdf', {  // Updated endpoint path to match the Apex RestResource
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.ACCESS_TOKEN  // corrected reference to ACCESS_TOKEN
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(result => {
            console.log('ContentVersion Id:', result);
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }    
}