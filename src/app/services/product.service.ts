import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api/";
  private productUrl = `${this.baseUrl}products`;
  private categoryUrl = `${this.baseUrl}product-category`;
 
   
  constructor(private httpClient: HttpClient) { }
//Map the JSON data from Spring data rest to poduct array
  getProductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => {
        return response._embedded.products;
      })
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
     
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => {
       // debugger; //debug here!

        return response._embedded.productCategory;
      })
    );
  }

}



//unwraps the json from spring data rest _embedded entry
interface GetResponseProduct{
  _embedded: {
    products: Product[];
  }
}
interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}
