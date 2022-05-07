import { TestBed } from '@angular/core/testing';

import { AutMetaService } from './aut-meta.service';

describe('AutMetaService', () => {
  let service: AutMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutMetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
