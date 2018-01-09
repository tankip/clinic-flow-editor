import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { NavigatorService } from '../services/navigator.service';
import { ProgramsService } from '../services/programs.service';
import { VisitService } from '../services/visit.service';
import { EncounterTypesService } from '../services/encounter-types.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {

  public schema;
  public schemaProgram;
  public program;
  public raw;
  public programs;
  public newProgram;
  public newVisit;
  public newEncounter;
  public programKey;
  public visitKey;
  public visitTypes;
  public encounterTypes;
  public allowedIf = false;

  public modalRef: BsModalRef;

  @Input() set _schema(schema) {
    if (schema) {
      this.schema = JSON.parse(schema);
      this.schemaProgram = {
        programUuid: this.schema.uuid,
        program: this.schema
      };
    } else {
      this.schema = {};
    }

  }

  constructor(
    private navigatorService: NavigatorService,
    private programsService: ProgramsService,
    private visitService: VisitService,
    private encounterTypesService: EncounterTypesService,
    private modalService: BsModalService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {

    this.programsService.getAllPrograms().subscribe((data) => {
      this.programs = data;
    });

    this.visitService.getAllVisitTypes().subscribe((data) => {
      this.visitTypes = data;
    });

    this.encounterTypesService.getAllEncounterTypes().subscribe((data) => {
      this.encounterTypes = data;
    });

  }

  public clickProgram(program) {
    this.navigatorService.setClickedElementSchema(this.schemaProgram.program);
  }

  public clickIncompatible(incompatible) {
    this.navigatorService.setClickedElementSchema(this.schemaProgram.program.incompatibleWith[incompatible]);
  }

  public clickVisitType(visitType, visitTypeIndex) {
    this.navigatorService.setClickedElementSchema(this.schemaProgram.program.visitTypes[visitTypeIndex]);
  }

  public clickEncounterType(encounterType, visitTypeIndex, encounterTypeIndex) {
    this.navigatorService.setClickedElementSchema(
      this.schemaProgram.program.visitTypes[visitTypeIndex].encounterTypes[encounterTypeIndex]
    );
  }

  public addrogramModal(programModal) {
    this.modalRef = this.modalService.show(programModal);
  }

  public incompatibleModal(incompatible) {
    this.modalRef = this.modalService.show(incompatible);
  }

  public addIncompatible() {
    this.modalRef.hide();
    const check = this.checkIncompatible();
    if (check) {
      this.openSnackBar('Incompatible Program Already Exists');
    } else {

      const program = {
        display: this.newProgram.display,
        uuid: this.newProgram.uuid
      };

      this.schemaProgram.program.incompatibleWith.push(program);
      this.navigatorService.setSchema(this.schema);
      this.openSnackBar('Incompatible Program Added Successfully');
    }

  }

  public checkProgram(newProgram) {
    let found;
    for (let i = 0; i < this.schemaProgram.length; i++) {
      if (this.schemaProgram[i].programUuid === newProgram.uuid) {
        found = true;
        break;
      }
    }
    if (found !== undefined) {
      return found;
    }
  }

  public createNewProgram() {
    const newP = {
      uuid: this.newProgram.uuid,
      name: this.newProgram.display,
      description: this.newProgram.description,
      dataDependencies: [],
      incompatibleWith: [],
      visitTypes: []
    };
    // const newP = {
    //   [this.newProgram.uuid] : {
    //     name: this.newProgram.display,
    //     dataDependencies: [],
    //     incompatibleWith: [],
    //     visitTypes: []
    //   }
    // };
    this.navigatorService.setNewSchema(this.schema, newP);
    this.modalRef.hide();
    this.openSnackBar('Program Added Successfully');
  }

  public submitProgram() {
    const check = this.checkProgram(this.newProgram);
    if (check) {
      this.openSnackBar('Program Already Exists');
    } else {
      const newP = {
        uuid: this.newProgram.uuid,
        name: this.newProgram.display,
        dataDependencies: [],
        incompatibleWith: [],
        visitTypes: []
      };
      this.navigatorService.setNewSchema(this.schema, newP);
      this.modalRef.hide();
      this.openSnackBar('Program Added Successfully');
    }
  }

  public openVisitModal(visitModal, program) {
    this.modalRef = this.modalService.show(visitModal);
    this.programKey = program;
  }

  public addVisitType() {
    const check = this.checkVisits();
    if (check) {
      this.openSnackBar('Visit Type Already Exists');
    } else {
      const newVisit = {
        uuid: this.newVisit.uuid,
        name: this.newVisit.display,
        encounterTypes: [],
      };
      if (this.allowedIf === true) {
        newVisit['allowedIf'] = '';
        newVisit['message'] = '';
      }

      this.schemaProgram.program.visitTypes.push(newVisit);
      this.navigatorService.setSchema(this.schema);
      this.modalRef.hide();
      this.openSnackBar('Visit Type Added Successfully');
    }
  }

  deleteVisitType(visitKey) {
    const check = window.confirm('Are you sure you want to Remove this Visit Type?');

    if (check) {
      this.schemaProgram.program.visitTypes.splice(visitKey, 1);
      this.navigatorService.setSchema(this.schema);
      this.openSnackBar('Visit Type Removed Successfully');
    }

  }

  public openEncounterModal(encounterModal, visit) {
    this.modalRef = this.modalService.show(encounterModal);
    this.visitKey = visit;
  }

  public addEncounterType() {
    const check = this.checkEncounterTypes();
    if (check) {
      this.openSnackBar('Encounter Type Exists');
    } else {
      this.schemaProgram.program.visitTypes[this.visitKey].encounterTypes.push(this.newEncounter);
      this.navigatorService.setSchema(this.schema);
      this.modalRef.hide();
      this.openSnackBar('Encounter Type Added Successfully');
    }
  }

  deleteEncounterType(visitKey, encounterKey) {
    const check = window.confirm('Are you sure you want to Remove this Encounter Type?');

    if (check) {
      this.schemaProgram.program.visitTypes[visitKey].encounterTypes.splice(encounterKey, 1);
      this.navigatorService.setSchema(this.schema);
      this.openSnackBar('Encounter Type Removed Successfully');
    }

  }

  deleteIncompatibleProgram(pKey) {
    const check = window.confirm('Are you sure you want to Remove this Program?');

    if (check) {
      this.schemaProgram.program.incompatibleWith.splice(pKey, 1);
      this.navigatorService.setSchema(this.schema);
      this.openSnackBar('Encounter Type Removed Successfully');
    }
  }

  public openSnackBar(message) {
    this.snackBar.open(message, '', { duration: 2000 });
  }

  public checkIncompatible() {
    let found;
    for (let i = 0; i < this.schemaProgram.program.incompatibleWith.length; i++) {
      if (this.schemaProgram.program.incompatibleWith[i].uuid === this.newProgram.uuid) {
        found = true;
        break;
      }
    }
    if (found !== undefined) {
      return found;
    }
  }

  public checkVisits() {
    let found;
    for (let i = 0; i < this.schemaProgram.program.visitTypes.length; i++) {
      if (this.schemaProgram.program.visitTypes[i].uuid === this.newVisit.uuid) {
        found = true;
        break;
      }
    }
    if (found !== undefined) {
      return found;
    }
  }

  public checkEncounterTypes() {
    let found;
    for (let i = 0; i < this.schemaProgram.program.visitTypes[this.visitKey].encounterTypes.length; i++) {
      if (this.schemaProgram.program.visitTypes[this.visitKey].encounterTypes[i].uuid === this.newEncounter.uuid) {
        found = true;
        break;
      }
    }
    if (found !== undefined) {
      return found;
    }
  }

}
