import { LightningElement } from 'lwc';

export default class ProductBundleProgressIndicator extends LightningElement {
    step = 1;
    currentStep = "1";
    showSpinner;
    showFirstPage = true;
    showSecondPage = false;
    showThirdPage = false;
   
   

    nextPage(event) {
        if (this.step != 3) {
            this.step++;
        }

        this.handleSetUpSteps();
    }

    previousPage(event) {
        if (this.step != 1) {
            this.step--;
        }

        this.handleSetUpSteps();
    }

    handleSetUpSteps() {
        this.showFirstPage = this.step == 1;
        this.showSecondPage = this.step == 2;
        this.showThirdPage = this.step == 3;
        this.currentStep = "" + this.step;
    }
}