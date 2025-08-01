import { Pipe, PipeTransform } from '@angular/core';

import { isEmpty } from 'lodash';

@Pipe({
    name: 'teamLogo',
    standalone: true,
})
export class TeamLogoPipe implements PipeTransform {
    transform(team: string, bg: 'light' | 'dark' = 'light'): string {
        if (isEmpty(team)) return '/images.logos/nhl.svg';

        return `https://assets.nhle.com/logos/nhl/svg/${team}_${bg}.svg`;
    }
}
