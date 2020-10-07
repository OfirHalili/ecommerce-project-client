import { FormControl, ValidationErrors, Validators } from '@angular/forms';

export class ShippingAddressControls {
    street: FormControl;
    city : FormControl ;
    state: FormControl ;
    country:  FormControl;
    zipCode: FormControl ;
    
    constructor( validatorsArray){
        this.street = new FormControl('', [...validatorsArray]);
        this.city = new FormControl('', [...validatorsArray]);
        this.state = new FormControl('', [Validators.required]);
        this.country =new FormControl('', [Validators.required]);
        this.zipCode = new FormControl('', [...validatorsArray]);
    }
    
}
