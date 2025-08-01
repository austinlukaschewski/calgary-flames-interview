import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
    selector: 'app-player-stats-table',
    imports: [CommonModule],
    templateUrl: './player-stats-table.html',
    styleUrl: './player-stats-table.scss',
})
export class PlayerStatsTable {
    data = input([]);

    readonly columns = [
        { label: 'Player', field: 'player' /* classes: ['sticky', 'left-0', 'z-10', 'bg-base-100'] */ },
        { label: 'Shot Att.', field: 'shotAttempts' },
        { label: 'SOG', field: 'sogs' },
        { label: 'Goals', field: 'goals' },
        { label: 'Passing', field: 'passingRate', classes: ['border-l border-gray-200'] },
        { label: 'Faceoffs', field: 'faceoffWinRate' },
        { label: 'PIMs', field: 'pims' },
        { label: 'Takeaways', field: 'takeaways', classes: ['border-l border-gray-200'] },
        { label: 'Carried In', field: 'zoneEntryCarryRate' },
        { label: 'Dumped In', field: 'zoneEntryDumpRate' },
    ];
}
