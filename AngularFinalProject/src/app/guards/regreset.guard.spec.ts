import { TestBed } from '@angular/core/testing';

import { RegresetGuard } from './regreset.guard';

describe('RegresetGuard', () => {
  let guard: RegresetGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RegresetGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
