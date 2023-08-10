
import { inject, Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { map,switchMap, tap, toArray } from "rxjs";
import { GetImagesCat } from "../actions/cat.actions";
import { CatService } from "../services/cat.service";
import { BeforeCatImage, CatImage, CatList } from '../interface/cat';

export interface CatImagesStateModel {
  catImages: CatImage[],
  isLoading: boolean
}

@State<CatImagesStateModel>({
  name: "CatImages",
  defaults: {
    catImages: [],
    isLoading: false
  }
})

@Injectable()
export class CatState {
  private catImageService = inject(CatService);


@Selector()
  static catImages(state: CatImagesStateModel) {
    return state.catImages
}
//switchMap працює також з масивами:)
@Action(GetImagesCat)
  getCatImages(ctx: StateContext<CatImagesStateModel>, fields:GetImagesCat) {
        return this.catImageService.cat.pipe(
          switchMap((res: BeforeCatImage[]) => res),
          map((res: BeforeCatImage) => {
            return {
              id: res.id,
              name: res.name,
              description: res.description,
              img: "https://cdn2.thecatapi.com/images/" + res.reference_image_id + ".jpg"
            }}),
          toArray(),
          tap((catImages:any) => ctx.patchState({ catImages }))
      )}

}
