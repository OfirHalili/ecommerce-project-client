import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CreditCardControl } from 'src/app/controls/credit-card-control';
import { CustomerControls } from 'src/app/controls/customer-controls';
import { ShippingAddressControls } from 'src/app/controls/shipping-address-controls';
import { CartService } from 'src/app/services/cart.service';
import { Luv2ShopeFormService } from 'src/app/services/luv2-shope-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

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
              private luv2ShopFormService: Luv2ShopeFormService,
              private cartService: CartService) { }

  ngOnInit(): void {
    this.initializeCheckoutFormGroup();
    this.initializeCreditCardDates();

    this.updateCartStatus();
  }
  updateCartStatus() {
    this.cartService.totalPrice.subscribe(data=> this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data=> this.totalQuantity = data);
    this.cartService.computeCartTotals();
  }

  initializeCreditCardDates() {
    this.luv2ShopFormService.getCreditCardYears().subscribe(data=> this.creditCardYears = data);
    const startMonth = new Date().getMonth() + 1;
    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(data=> this.creditCardMonths = data);
  }
  initializeCheckoutFormGroup() {
    const validatorsArray = [Validators.required, Luv2ShopValidators.notOnlyWhiteSpace, Validators.minLength(2)];
  
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({...new CustomerControls(validatorsArray)}),
      shippingAddress: this.formBuilder.group({...new ShippingAddressControls(validatorsArray)}),
      billingAddress: this.formBuilder.group({...new ShippingAddressControls(validatorsArray)}),
      creditCard: this.formBuilder.group({... new CreditCardControl(validatorsArray)})
    }); 
    this.getCountryList();
   }
   get firstName(){  return this.checkoutFormGroup.get('customer.firstName');  }
   get lastName(){  return this.checkoutFormGroup.get('customer.lastName');  }
   get email(){  return this.checkoutFormGroup.get('customer.email');  }

   get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
   get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
   get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
   get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
   get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}

   get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
   get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
   get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
   get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
   get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}

   get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
   get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
   get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
   get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}

  onSubmit(){
    console.log("Handling the submit button");
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }
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
