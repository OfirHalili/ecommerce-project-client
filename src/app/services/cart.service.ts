import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] =[];
  cartItem: Subject<CartItem[]> = new Subject<CartItem[]>();
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  
  constructor() { }

  addToCart(theCartItem: CartItem){
    let alreadyExist: boolean = false;
    let existingCartItem: CartItem = undefined;
    if(this.cartItems.length > 0){
      existingCartItem = this.cartItems.find(item => item.id === theCartItem.id);
    }
    alreadyExist = (existingCartItem != undefined)
    if(alreadyExist){
      existingCartItem.quantity++;
    }else{
      this.cartItems.push(theCartItem);
    }
    this.computeCartTotals();
  }
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if(theCartItem.quantity == 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    const itemIndex: number = this.cartItems.findIndex(tempItem => tempItem === theCartItem);
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
    }
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    this.cartItems.forEach(item => {
      totalPriceValue += item.unitPrice * item.quantity;
      totalQuantityValue += item.quantity;
    });

    //publish the new values to all subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
  
}
