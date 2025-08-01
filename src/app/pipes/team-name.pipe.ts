import { Pipe, PipeTransform } from '@angular/core';

import { chain } from 'lodash';

@Pipe({
    name: 'teamName',
    standalone: true,
})
export class TeamNamePipe implements PipeTransform {
    transform(value: string): string {
        return chain(value).split('-').last().trim().valueOf();
    }
}
