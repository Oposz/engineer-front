import { TestBed } from '@angular/core/testing';

import { UserFavouritesService } from './user-favourites.service';

describe('UserFavouritesService', () => {
  let service: UserFavouritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFavouritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
