import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GameScoreCard } from '../../components/game-score-card/game-score-card';
import { PlayerStatsTable } from '../../components/player-stats-table/player-stats-table';
import { TeamComparisonStatTable } from '../../components/team-comparison-stat-table/team-comparison-stat-table';
import { VegaChartComponent } from '../../components/vega-chart/vega-chart.component';
import { TeamNamePipe } from '../../pipes/team-name.pipe';
import { rinkSpec } from '../../specs/rink';

import { GameService } from './game.service';

@Component({
    selector: 'app-game',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        GameScoreCard,
        TeamComparisonStatTable,
        PlayerStatsTable,
        TeamNamePipe,
        VegaChartComponent,
    ],
    providers: [GameService],
    templateUrl: './game.html',
    styleUrl: './game.scss',
})
export class Game {
    readonly service = inject(GameService);

    readonly rinkSpec = rinkSpec;

    constructor() {
        effect(() => {
            const event = this.service.selectedEvent();
            if (event === 'Goals' && this.service.showHeatmap()) this.service.showHeatmap.set(false);
        });
    }
}
