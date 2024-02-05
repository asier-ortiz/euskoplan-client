import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "orderBy"
})
export class OrderByPipe implements PipeTransform {
  transform(array: Array<any>, field: string | null, sort: string = 'asc'): any[] {
    const tempList = array.sort((a: any, b: any) => {
      if (field) {
        if (a[field] < b[field]) {
          return -1;
        } else if (a[field] > b[field]) {
          return 1;
        } else if (a[field] === b[field]) {
          return 0;
        }
        return 1;
      } else {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else if (a === b) {
          return 0;
        }
        return 1;
      }
    });
    return (sort === 'asc') ? tempList : tempList.reverse();
  }
}
