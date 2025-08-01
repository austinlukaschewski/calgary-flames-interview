import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { TeamNamePipe } from '../../pipes/team-name.pipe';
import type { GameBoxscore as TGameBoxscore } from '../../types/game';

@Component({
    selector: 'app-game-boxscore',
    imports: [CommonModule, TeamNamePipe],
    templateUrl: './game-boxscore.html',
    styleUrl: './game-boxscore.scss',
})
export class GameBoxscore {
    boxscore = input.required<TGameBoxscore[]>();
}
