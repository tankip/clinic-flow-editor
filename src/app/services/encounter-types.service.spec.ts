import { TestBed, inject } from '@angular/core/testing';

import { EncounterTypesService } from './encounter-types.service';

describe('EncounterTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncounterTypesService]
    });
  });

  it('should be created', inject([EncounterTypesService], (service: EncounterTypesService) => {
    expect(service).toBeTruthy();
  }));
});
