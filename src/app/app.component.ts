
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Select, Store } from '@ngxs/store';
import { fromEvent, Observable} from 'rxjs';
import { GetImagesCat } from './store/actions/cat.actions';
import { GetCategoryListCats } from './store/actions/list.actions';
import { SerchRes } from './store/actions/serch.actions';
import { CatImage, CatList } from './store/interface/cat';
import { CatService } from './store/services/cat.service';
import { CatState } from './store/states/cat-state';
import { ListCategoryState } from './store/states/category-cat-list';
import { SerchState } from './store/states/search-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, AfterViewInit {

  title = 'cat-search-app';

  constructor(private store:Store, private serviceCat:CatService) {}

  @ViewChildren("matSelect") matSelect:MatSelect | undefined;
  @ViewChild("inputSerch") inputSerch:ElementRef | undefined;

  qtyImages:number[] = [10,25,50];
  selectedPageQty:number = 10;

  catagoryArr:CatList[]=[];
  catImages:CatImage[]=[];
  originalCatImages:CatImage[]=[];
  searchArr:CatList[]=[];
  p:number | undefined;
  forSerch:FormGroup | undefined;

  @Select(CatState.catImages) catImages$:Observable<CatImage[]> | undefined;
  @Select(ListCategoryState.categoryCat) catagorycat$:Observable<CatList[]> | undefined;
  @Select(SerchState.serchState) search$:Observable<CatList[]> | undefined;

  ngOnInit(){
    this.loadForm()
    this.store.dispatch(new GetCategoryListCats())
    this.store.dispatch(new GetImagesCat(this.selectedPageQty));
    this.catImages$?.subscribe((res:CatImage[])=>{
      this.originalCatImages = res;
      this.catImages = res;
    } );
    this.catagorycat$?.subscribe((res:CatList[])=> this.catagoryArr = res);
    this.search$?.subscribe((res:CatList[])=> {this.searchArr = res
    console.log(res)});
  }

  serchText(){
    this.store.dispatch(new SerchRes())
    let arr:string[] = []
    this.searchArr.forEach((el:CatList)=> arr.push(el.name))
    setTimeout(() => {
      this.choiceBreed(arr)
    }, 2);

  }

  ngAfterViewInit() {
    let obsInput:Observable<any> = fromEvent((this.inputSerch as ElementRef).nativeElement, 'input');
    this.serviceCat.giveObservble(obsInput);
  }


  choiceBreed (choice:string[]){
    if(choice.length) this.catImages  = this.originalCatImages.filter((el:CatImage)=>choice.includes(el.name));
    else this.catImages = this.originalCatImages;
  }

  loadForm(){
    this.forSerch= new FormGroup({
      inputcontorl: new FormControl('', [Validators.pattern("[a-zA-Zа]{3,15}")])
    })
  }





}
