import { FormControl, Validators } from '@angular/forms'

export class CreditCardControl {
    cardType: FormControl;
    nameOnCard: FormControl;
    cardNumber: FormControl;
    securityCode: FormControl;
    expirationMonth: FormControl;
    expirationYear: FormControl;
    constructor(validatorsArray){
        this.cardType = new FormControl('', Validators.required);
        this.nameOnCard = new FormControl('', validatorsArray);
        this.cardNumber = new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]);
        this.securityCode = new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]);
        this.expirationMonth = new FormControl('', Validators.required);
        this.expirationYear = new FormControl('', Validators.required);
    }
}
