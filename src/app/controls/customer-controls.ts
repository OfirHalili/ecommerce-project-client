import { FormControl, Validators } from '@angular/forms'

export class CustomerControls {
    firstName: FormControl;
    lastName: FormControl;
    email: FormControl;
    constructor(validatorsArray){
        this.firstName = new FormControl('', [...validatorsArray]);
        this.lastName =  new FormControl('', [...validatorsArray]);
        this.email = new FormControl('',  [Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]);
    
    }
}
