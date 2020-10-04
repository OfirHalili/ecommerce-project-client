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
  products: Product[] =[];
  categoryName: String;
  currentCategoryId: number;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyWord: string = null;
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
    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword');  
    this.categoryName = "All";
    if(this.previousKeyWord != theKeyWord){
      this.thePageNumber = 1;
    }
    this.previousKeyWord =  theKeyWord;
    this.productService.searchProductListPaginate(this.thePageNumber-1,
                                                  this.thePageSize,
                                                  theKeyWord).subscribe(this.processResult());
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
    // check if we have different category than previous
    // Angular will reuse a component if it is currently being viewed
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    //pass page number -1 because in Spring data rest pages are based 0 and in Angular based 1
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());
  }
  processResult(){
    return data =>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }  
  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
}
