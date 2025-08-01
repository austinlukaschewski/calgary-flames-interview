import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

import { TeamNamePipe } from '../../pipes/team-name.pipe';
import { GameBoxscore as TGameBoxscore } from '../../types/game';
import { GameBoxscore } from '../game-boxscore/game-boxscore';

@Component({
    selector: 'app-game-score-card',
    imports: [CommonModule, GameBoxscore, TeamNamePipe],
    templateUrl: './game-score-card.html',
    styleUrl: './game-score-card.scss',
})
export class GameScoreCard {
    boxscore = input.required<TGameBoxscore[]>();

    winner = computed(() => {
        const home = this.boxscore()[0];
        const away = this.boxscore()[1];

        return home.total > away.total ? home.team : home.total < away.total ? away.team : undefined;
    });
}
