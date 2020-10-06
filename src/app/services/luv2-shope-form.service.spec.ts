import { TestBed } from '@angular/core/testing';

import { Luv2ShopeFormService } from './luv2-shope-form.service';

describe('Luv2ShopeFormService', () => {
  let service: Luv2ShopeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Luv2ShopeFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
