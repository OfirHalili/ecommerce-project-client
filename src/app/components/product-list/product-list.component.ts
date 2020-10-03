import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[];
  categoryName: String;
  currentCategoryId: number;
  searchMode: boolean;
  constructor(private productService:  ProductService, 
    private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>
    this.listProducts()
    );
  }

  listProducts(){
   this.searchMode = this.route.snapshot.paramMap.has('keyword');
   if(this.searchMode){
     this.handleSearchProduct();
   }else{
     debugger;
     this.handleListProduct();
   }
  }
  handleSearchProduct() {
    const theKeyWork: string = this.route.snapshot.paramMap.get('keyword');  
    this.categoryName = "All";
    this.productService.searchProducts(theKeyWork).subscribe(data => this.products = data);
  }
  handleListProduct(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
    if(hasCategoryId){
      this.currentCategoryId= +this.route.snapshot.paramMap.get('id');
      this.categoryName = this.route.snapshot.paramMap.get("categoryName");

    }else{
      this.currentCategoryId = 1;
      this.categoryName = "Books";
    }
  
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => 
        //debugger; //debug here!
        this.products = data
    );
  }
  
}
