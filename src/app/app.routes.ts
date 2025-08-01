import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router } from '@angular/router';

import { find, isNil } from 'lodash';
import { map } from 'rxjs';

import { Layout } from './components/layout/layout';
import { DataService } from './services/data.service';

export const appRoutes: Route[] = [
    {
        path: '',
        component: Layout,
        children: [
            {
                path: 'games',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        resolve: {
                            games: () => inject(DataService).games$,
                        },
                        loadComponent: () => import('./pages/games/games').then(({ Games }) => Games),
                    },
                    {
                        path: ':gameId',
                        resolve: {
                            game: (route: ActivatedRouteSnapshot) => {
                                const gameId = +route.paramMap.get('gameId');
                                if (!isFinite(gameId)) inject(Router).navigate(['/games']);

                                return inject(DataService).games$.pipe(
                                    map((games) => {
                                        const game = find(games, { id: gameId });
                                        if (isNil(game)) inject(Router).navigate(['/games']);

                                        return game;
                                    }),
                                );
                            },
                        },
                        loadComponent: () => import('./pages/game/game').then(({ Game }) => Game),
                    },
                ],
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'games',
            },
        ],
    },
];
