import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  public transform(workflowSchemas: any, searchText: any): any {
    if (searchText == null) {
      return workflowSchemas;
    }

    return workflowSchemas.filter((workflowSchema) => {
      return workflowSchema.name.toUpperCase().indexOf(searchText.toUpperCase()) > -1;
    });
  }

}
