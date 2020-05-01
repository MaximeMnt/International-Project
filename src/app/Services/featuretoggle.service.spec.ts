import { TestBed } from '@angular/core/testing';

import { FeaturetoggleService } from './featuretoggle.service';

describe('FeaturetoggleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FeaturetoggleService = TestBed.get(FeaturetoggleService);
    expect(service).toBeTruthy();
  });
});
