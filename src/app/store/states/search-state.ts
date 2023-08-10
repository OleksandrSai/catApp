
import { inject, Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { debounceTime, filter, map, switchMap, take, tap, toArray } from "rxjs";
import { CatService } from "../services/cat.service";
import { BeforeCatImage, CatList } from '../interface/cat';
import { SerchRes } from "../actions/serch.actions";

export interface serchStateModel {
  serchResult: CatList[],
  isLoading: boolean
}

@State<serchStateModel>({
  name: "serchState",
  defaults: {
    serchResult: [],
    isLoading: false
  }
})

@Injectable()
export class SerchState {
  private catImageService = inject(CatService);


@Selector()
  static serchState(state: serchStateModel) {
    return state.serchResult
}
//switchMap працює також з масивами:)
@Action(SerchRes)
  getCatImages(ctx: StateContext<serchStateModel>) {
      return this.catImageService.takeObservble().pipe(
          map((x: any) => (x.target as HTMLInputElement).value),
          debounceTime(200),
          switchMap((event: string) => {
            return this.catImageService.cat.pipe(
              switchMap((res: BeforeCatImage[]) => res),
              map((res: BeforeCatImage) => {
                return {
                  name: res.name
                }}),
              filter((word: any) => {
                if (word.name.toLowerCase().includes((event as string).toLocaleLowerCase())) {
                  return word;
                }
              }),
              take(6),
              toArray(),
              tap((serchResult: CatList[]) => ctx.patchState({ serchResult }))
            );
          })
        );
      }

}
