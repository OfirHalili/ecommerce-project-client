import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api/products";
   
  constructor(private httpClient: HttpClient) { }
//Map the JSON data from Spring data rest to poduct array
  getProductList(): Observable<Product[]>{
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}
//unwraps the json from spring data rest _embedded entry
interface GetResponse{
  _embedded: {
    products: Product[]
  }
}
