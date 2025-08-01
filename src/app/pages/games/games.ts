import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { map, shareReplay } from 'rxjs';

import { TeamNamePipe } from '../../pipes/team-name.pipe';

@Component({
    selector: 'app-games',
    imports: [CommonModule, RouterModule, TeamNamePipe],
    templateUrl: './games.html',
    styleUrl: './games.scss',
})
export class Games {
    private readonly _route = inject(ActivatedRoute);

    games$ = this._route.data.pipe(
        map((data) => data['games']),
        shareReplay(1),
    );
}
