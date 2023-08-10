import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {

    const type = args[0];
    if(type === 'date-time'){

    } else {
      value = (new Date(value as string)).toLocaleTimeString(undefined, {timeStyle: 'short'})
    }
    return value;
  }

}
