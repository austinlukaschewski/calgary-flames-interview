import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { TeamNamePipe } from '../../pipes/team-name.pipe';

@Component({
    selector: 'app-team-comparison-stat-table',
    imports: [CommonModule, TeamNamePipe],
    templateUrl: './team-comparison-stat-table.html',
    styleUrl: './team-comparison-stat-table.scss',
})
export class TeamComparisonStatTable {
    data = input([]);

    readonly columns = [
        { label: '', field: 'team', classes: ['sticky', 'left-0', 'z-10', 'bg-base-100'] },
        { label: 'Shots', field: 'sogs' },
        { label: 'SOG', field: 'sogRate' },
        { label: 'Passing', field: 'passingRate' },
        { label: 'Faceoffs', field: 'faceoffWinRate' },
        { label: 'PIMs', field: 'pims' },
        { label: 'Dump Ins', field: 'zoneEntryDumpRate', classes: ['border-l border-gray-200'] },
        { label: 'Carried In', field: 'zoneEntryCarryRate' },
    ];
}
