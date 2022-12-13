import { TypeOfProduct } from 'src/app/models/TypeOfProduct.inteface';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './localstorage.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AddCartItemService {
  data: TypeOfProduct[] =
    this.localStorageService.getData<TypeOfProduct[]>('CartDataCount') || [];
  private result: [TypeOfProduct, number][] = [];
  arrSubject$ = new Subject<TypeOfProduct>();
  constructor(private localStorageService: LocalStorageService) {}
  setData(elem: TypeOfProduct) {
    this.data.push(elem);
    this.transformData();
    this.getTotal();
    this.localStorageService.setData<TypeOfProduct[]>(
      'CartDataCount',
      this.data
    );
  }
  transformData() {
    let collection = new Map();
    this.data.forEach((item) => {
      let count = this.data.filter((elem) => elem.id == item.id).length;
      collection.set(item, count);
    });
    const changeData: [TypeOfProduct, number][] = Array.from(collection);
    this.result = [...new Set(changeData.map((el) => JSON.stringify(el)))].map(
      (el) => JSON.parse(el)
    );
  }
  reloadData() {
    this.transformData();
    this.result.forEach((item) => {
      this.arrSubject$.next(item[0]);
    });
  }
  getData(): [TypeOfProduct, number][] {
    this.transformData();
    this.getTotal();
    return this.result;
  }
  getTotal() {
    let totalSum = this.result.reduce(
      (acc, item) => (acc = acc + item[0].price * item[1]),
      0
    );
    return totalSum;
  }
  checkButton(elem: TypeOfProduct) {
    let counter: number = 0;
    this.data.forEach((item) => {
      if (JSON.stringify(item) === JSON.stringify(elem)) {
        counter += 1;
      }
    });
    return counter;
  }
  removeSetOfProduct(elem: TypeOfProduct) {
    this.data.forEach((item, i) => {
      if (JSON.stringify(item) === JSON.stringify(elem)) {
        this.data.splice(i, 1);
      }
    });
    this.transformData();

    this.localStorageService.setData<TypeOfProduct[]>(
      'CartDataCount',
      this.data
    );
  }
  plusCounter(elem: TypeOfProduct) {
    this.setData(elem);
  }

  minusCounter(elem: TypeOfProduct) {
    let index: number = 0;
    this.data.forEach((item, i) => {
      if (JSON.stringify(item) === JSON.stringify(elem)) {
        index = i;
      }
    });
    this.data.splice(index, 1);
    this.transformData();

    this.localStorageService.setData<TypeOfProduct[]>(
      'CartDataCount',
      this.data
    );
  }
}
