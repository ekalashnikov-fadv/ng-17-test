import {ComponentFixture, DeferBlockState, TestBed} from '@angular/core/testing';
import {ActivatedRouteSnapshot} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {signal} from "@angular/core";

import {UserComponent} from './user.component';
import {TimeStore} from "../../app.store";
import {UsersStore} from "../users-management.store";
import {UserActivityComponent} from "../../user-activity/user-activity.component";

const route = {
  params: { id: '1' },
};

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let activatedRoute: ActivatedRouteSnapshot;

  const timeStore = jasmine.createSpyObj('TimeStore', ['time']);
  timeStore.time = {currentTime: signal(new Date())};

  const usersStore = jasmine.createSpyObj('UsersStore',
    ['entities', 'loading', 'loaded', 'selectedUser', 'selectedId']
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent, RouterTestingModule],
      providers: [
        { provide: ActivatedRouteSnapshot, useValue: route },
        {provide: TimeStore, useValue: timeStore},
        {provide: UsersStore, useValue: usersStore}
      ],
      teardown: {destroyAfterEach: false},
    }).overrideComponent(UserActivityComponent, {
      set: {
        selector: 'app-user-activity',
        template: `<h6>app-user-activity</h6>`
      }
    })
    .compileComponents();

    activatedRoute = TestBed.inject(ActivatedRouteSnapshot);
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Deferrable view', () => {
    it('loading', async () => {
      const deferBlockFixture = (await fixture.getDeferBlocks())[0];
      await deferBlockFixture.render(DeferBlockState.Loading);
      expect(fixture.nativeElement.innerHTML).toContain('User activity loading...');
    });
    it('error', async () => {
      const deferBlockFixture = (await fixture.getDeferBlocks())[0];
      await deferBlockFixture.render(DeferBlockState.Error);
      expect(fixture.nativeElement.innerHTML).toContain('Failed to load user activity');
    });
    it('placeholder', async () => {
      const deferBlockFixture = (await fixture.getDeferBlocks())[0];
      await deferBlockFixture.render(DeferBlockState.Placeholder);
      expect(fixture.nativeElement.innerHTML).toContain('User activity placeholder...');
    });
    // Revisit and learn how to test complete defer block state with timeout
    xit('complete', async () => {
      const deferBlockFixture = (await fixture.getDeferBlocks())[0];
      await deferBlockFixture.render(DeferBlockState.Complete);
      expect(fixture.nativeElement.innerHTML).toContain('app-user-activity');
    });
  })
});

