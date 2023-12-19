import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpRequest} from "@angular/common/http";

import {UsersStore} from "./users-management.store";
import {UsersService} from "./users.service";
import {APP_CONFIG} from "../app.config";
import {User} from "./users-management.interface";

const httpError = {error: 'error message'};
const mockUserId = '1';
const mockUser: User = {
  createdAt: "2023-12-17T22:36:52.349Z",
  name: "Betty King1111",
  avatar: "https://loremflickr.com/640/480/business",
  id: "1"
};

describe('UsersStore', () => {
  let store: UsersStore
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UsersStore,
        UsersService,
        {provide: APP_CONFIG, useValue: {baseUrl: 'http://localhost:3000'}}
      ],
      teardown: {destroyAfterEach: false}
    })

    store = TestBed.inject(UsersStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(store).toBeTruthy();
  });
  it('intial state', () => {
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeFalsy();
    expect(store.entities()).toEqual([]);
    expect(store.ids()).toEqual([]);
    expect(store.selectedUser()).toBeFalsy();
    expect(store.selectedId()).toBeFalsy();
  });

  describe('loadUser$', () => {
    const urlPart = `/users/${mockUserId}`;

    it('success case', () => {
      // Act
      store.loadUser$(mockUserId);

      // Assert
      expect(store.loading()).toBe(true);
      expect(store.error()).toBeFalsy();

      httpMock
        .expectOne((request: HttpRequest<void>) =>
          request.url.includes(urlPart)
        )
        .flush(mockUser);

      // Assert
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeFalsy();
      expect(store.entities()).toEqual([mockUser]);
    });
    it('error case', () => {
      // Act
      store.loadUser$(mockUserId);

      // Assert
      expect(store.loading()).toBe(true);
      expect(store.error()).toBeFalsy();

      httpMock
        .expectOne((request: HttpRequest<void>) =>
          request.url.includes(urlPart)
        )
        .flush(httpError.error, {status: 405, statusText: 'Wrong payload'});

      // Assert
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeTruthy();
      expect(store.error()?.message).toContain('Wrong payload')
    });
  });
});
