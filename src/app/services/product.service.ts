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

 
  private baseUrl = "http://localhost:8080/api";
  private productUrl = `${this.baseUrl}/products`;
  private categoryUrl = `${this.baseUrl}/product-category`;
  private productSearchUrl = `${this.productUrl}/search`;

 
   
  constructor(private httpClient: HttpClient) { }
//Map the JSON data from Spring data rest to poduct array
  getProductList(theCategoryId: number): Observable<Product[]>{
    const searchUrl = `${this.productSearchUrl}/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
     
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => {
       // debugger; //debug here!
        return response._embedded.productCategory;
      })
    );
  }
  // getProductsByName(productsName: string) {
  
  // }
  searchProducts(name: string):Observable<Product[]> {
    const searchUrl = `${this.productSearchUrl}/findByNameContaining?name=${name}`;
    return this.getProducts(searchUrl);  }

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(map(

      response => response._embedded.products));
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
