import { inject, Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { map, switchMap, tap, toArray } from "rxjs";
import { GetCategoryListCats } from "../actions/list.actions";
import { CatService } from "../services/cat.service";
import { BeforeCatImage, CatImage, CatList } from '../interface/cat';

export interface CatListStateModel {
  categoryLists: CatList[],
  isLoading: boolean

}

@State<CatListStateModel>({
  name: "CatList",
  defaults: {
    categoryLists: [],
    isLoading: false
  }
})

@Injectable()
export class ListCategoryState {
  private catImageService = inject(CatService);



@Selector()
  static categoryCat(state: CatListStateModel) {
    return state.categoryLists

}
//switchMap працює також з масивами:)
@Action(GetCategoryListCats)
  getlistCategory(ctx: StateContext<CatListStateModel>) {
    return this.catImageService.cat.pipe(
      switchMap((res: BeforeCatImage[]) => res),
      map((res: BeforeCatImage) => {
        return {
          name: res.name,
        }
      }),
      toArray(),
      tap((categoryLists: CatList[]) => ctx.patchState({ categoryLists })
      ))
}
}
