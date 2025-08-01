import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TeamLogoPipe } from '../../pipes/team-logo.pipe';

@Component({
    selector: 'app-layout',
    imports: [RouterModule, TeamLogoPipe],
    templateUrl: './layout.html',
    styleUrl: './layout.scss',
})
export class Layout {}
