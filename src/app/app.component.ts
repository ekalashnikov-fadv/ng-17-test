import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TimeStore} from "./app.store";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly store = inject(TimeStore);

  readonly $krakowTime: Signal<Date> = this.store.time.currentTime;
  readonly $newYorkTime: Signal<Date> = this.store.newYorkTime;

  title = 'users-management-test';
}
