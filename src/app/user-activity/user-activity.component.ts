import {
  afterNextRender,
  afterRender,
  AfterRenderPhase,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input
} from '@angular/core';
import {NgForOf} from "@angular/common";
import {interval, map} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-user-activity',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './user-activity.component.html',
  styleUrl: './user-activity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserActivityComponent {
  private readonly destroyRef = inject(DestroyRef);

  @Input({
    // required: true,
    transform: (value: number | Date) => new Date(value),
    alias: 'time'
  })
  currentTime!: Date;

  headers: string[] = ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5', 'Column 6', 'Column 7', 'Column 8'];
  data: string[][] = this.generateDummyData(50, 8);

  private interval$ = interval(1000);

  constructor(private readonly cdr: ChangeDetectorRef) {
    afterNextRender(() => {
      console.log('afterNextRender >> ');
    });
    afterRender(() => {
      // console.log('afterRender >> ');
    }, {phase: AfterRenderPhase.Read});
  }

  ngOnInit() {
    this.interval$.pipe(takeUntilDestroyed(this.destroyRef),
      map(x => (x || 0) + 1)
    ).subscribe(nextVal => {
      this.headers[0] = this.headers[0].split(' ')[0] + ' ' + nextVal;
      // this.cdr.markForCheck();
    });
  }

  ngAfterViewChecked() {
    console.log(new Date().getSeconds());
  }

  private generateDummyData(rows: number, columns: number): string[][] {
    const data: string[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < columns; j++) {
        row.push(`Activity ${i + 1}:${j + 1}`);
      }
      data.push(row);
    }
    return data;
  }

  onUpdate() {
    this.cdr.markForCheck();
  }
}
