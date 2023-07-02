import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  // transform(value: any, searchTerm: any): any {
  //   return value.filter(function(search: any){
  //     return search.designDescription.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
  //   });
  // }
  transform(value: any[], filterString: string, propName: string) {
    const result: any = [];

    if (!value || filterString === '' || propName === '') {
      return value;
    }
    value.forEach((a:any)=>{
      if(a[propName].trim().toLowerCase().includes(filterString.toLowerCase())){
        result.push(a)
      }
    });
    return result;
  }


}
