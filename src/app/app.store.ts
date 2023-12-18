import {computed, Injectable} from "@angular/core";
import {patchState, signalStore, withComputed, withHooks, withState} from "@ngrx/signals";

@Injectable()
export class TimeStore extends signalStore(
  withState({ time: {currentTime: new Date()} }),
  withComputed(({ time }) => ({
    newYorkTime: computed(() => new Date(time().currentTime.setHours(time().currentTime.getHours() - 6))),
  })),
  withHooks((() => {
    let interval: number | undefined;

    return {
      onInit(store) {
        console.log('CounterStore ngOnInit');
        interval = setInterval(() => patchState(store, {time: {currentTime: new Date()}}), 1000);
      },
      onDestroy() {
        console.log('CounterStore ngOnDestroy');
        interval !== undefined && clearInterval(interval);
      },
    }
  })())
) {

}
