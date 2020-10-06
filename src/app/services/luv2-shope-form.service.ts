import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopeFormService {
  private baseUrl: string = "http://localhost:8080/api/";
  private countriesUrl: string = `${this.baseUrl}countries`;
  private stateUrl: string = `${this.baseUrl}states/`;
  
  constructor(private httpClient: HttpClient) { }
  getCreditCardMonths(startMonth: number):Observable<number[]>{
      let months: number[] =[];
      for(let theMonth = startMonth; theMonth <= 12; theMonth++){
        months.push(theMonth);
      }
      return of(months);
  }
  getCreditCardYears():Observable<number[]>{
    let years: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear: number = startYear; theYear <= endYear; theYear ++){
        years.push(theYear);
    }
    return of(years);
  }
  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(map(response => response._embedded.countries));
  }
  getStates(countryCode: string):Observable<State[]>{
    
    const searchUrl = `${this.stateUrl}search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(map(response => response._embedded.states));
  }
  
}
interface  GetResponseStates{
  _embedded: {
    states: State[];
  }
}
interface  GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

