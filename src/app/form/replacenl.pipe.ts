import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'replacenl'})
export class ReplaceNl implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(new RegExp("\n", 'g'), "<br/>") : value;
  }
}
