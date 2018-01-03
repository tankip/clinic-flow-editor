import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs/Rx';
import { LocalStorageService } from './local-storage.service';
import { SchemaService } from './schema.service';
import { Constants } from './constants';

@Injectable()
export class NavigatorService {

    public schema;
    public schemaSubject: Subject<Object> = new Subject();
    public schemaInfoSubject: Subject<Object> = new Subject();
    public newSchemaSubject: Subject<Object> = new Subject();
    public schemaEditorSubject: Subject<Object> = new Subject();

    constructor( private schemaService: SchemaService ) {
    }

    setSchema(schema) {
        this.schemaSubject.next(schema);
    }

    getSchema() {
        return this.schemaSubject.asObservable();
    }

    setClickedElementSchema(schema) {
        this.schemaEditorSubject.next(schema);
    }

    setNewSchema(schema, newP) {
        this.schemaSubject.next(Object.assign(schema, newP));
    }

    getClickedElementSchema(): Observable<Object> {
        return this.schemaEditorSubject.asObservable();
    }

    setSchemaInfo(info) {
        this.schemaInfoSubject.next(info);
    }

    getSchemaInfo() {
        return this.schemaInfoSubject.asObservable();
    }

}
