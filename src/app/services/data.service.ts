import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { camelCase, chain, indexOf, last, transform } from 'lodash';
import { map, shareReplay, take } from 'rxjs';

import type { Game, GameEvent } from '../types/game';

@Injectable()
export class DataService {
    private readonly _http = inject(HttpClient);

    private readonly data$ = this._http.get<Array<{ [key: string]: any }>>('/data/data.json').pipe(
        map((data) =>
            data.map((datum) => ({
                gameKey: [datum.game_date, datum['Home Team'], datum['Away Team']].join('|'),
                ...transform(
                    datum,
                    (result, value, key) => {
                        result[camelCase(key)] = value;
                    },
                    {},
                ),
            })),
        ),
        take(1),
    );

    games$ = this.data$.pipe(
        map((data) =>
            chain(data as (GameEvent & { gameKey: string })[])
                .groupBy('gameKey')
                .transform((results: Game[], values: (GameEvent & { gameKey: string })[]) => {
                    const lastEvent = last(values);

                    results.push({
                        id: 100 + indexOf(data, lastEvent),
                        homeTeam: lastEvent.homeTeam,
                        awayTeam: lastEvent.awayTeam,
                        gameDate: lastEvent.gameDate,
                        boxscore: [lastEvent.homeTeam, lastEvent.awayTeam].map((team) => {
                            let total = 0;
                            return {
                                team,
                                values: chain(values)
                                    .groupBy('period')
                                    .reduce((acc, periodEvents, period) => {
                                        const data = {
                                            period: parseInt(period) > 3 ? 'OT' : period,
                                            goals: chain(periodEvents).filter({ team, event: 'Goal' }).size().valueOf(),
                                        };

                                        total += data.goals;

                                        acc.push(data);
                                        return acc;
                                    }, [])
                                    .orderBy('period')
                                    .valueOf(),
                                total,
                            };
                        }),
                        events: values,
                    });
                }, [])
                .valueOf(),
        ),
        shareReplay(1),
    );
}
