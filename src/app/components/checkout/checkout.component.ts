import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopeFormService } from 'src/app/services/luv2-shope-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private luv2ShopFormService: Luv2ShopeFormService) { }

  ngOnInit(): void {
    this.initializeCheckoutFormGroup();
    this.initializeCreditCardDates();
    
  }
  initializeCreditCardDates() {
    this.luv2ShopFormService.getCreditCardYears().subscribe(data=> this.creditCardYears = data);
    const startMonth = new Date().getMonth() + 1;
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(data=> this.creditCardMonths = data);
  }
  initializeCheckoutFormGroup() {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state:[''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state:[''],
        country: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber:[''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    }); 
    this.getCountryList();
   }
  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log(this.checkoutFormGroup.get('customer').value.email);
  }
  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
          .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
          this.billingAddressStates = this.shippingAddressStates;
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
    }
  }

  handleMonthAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
    const currentYear: number = new Date().getFullYear();
    let startMonth: number;
    if(currentYear === selectedYear){
        startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(data => this.creditCardMonths = data );

  }
  getCountryList(){
    this.luv2ShopFormService.getCountries().subscribe(data => this.countries = data);
  }
  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup.value.country.code;
    this.luv2ShopFormService.getStates(countryCode).subscribe(data => {
      debugger;
      if(formGroupName === "shippingAddress"){
        this.shippingAddressStates = data;
      }else{
        this.billingAddressStates = data;
      }
      formGroup.get('state').setValue(data[0]);
    });

  }
}
