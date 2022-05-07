import { TestBed } from '@angular/core/testing';

import { Web3ConnectionsService } from './aut-meta.service';

describe('AutMetaService', () => {
  let service: Web3ConnectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Web3ConnectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
