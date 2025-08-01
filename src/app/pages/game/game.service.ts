import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { chain, filter, find, groupBy } from 'lodash';
import { combineLatest, map, shareReplay, tap } from 'rxjs';

@Injectable()
export class GameService {
    private readonly _route = inject(ActivatedRoute);

    showHeatmap = signal<boolean>(true);
    specSignals = computed(() => ({ showHeatmap: this.showHeatmap() }));

    selectedTeam = signal<string>('');
    selectedTeam$ = toObservable(this.selectedTeam);

    eventOptions = [
        { label: 'Goals', filter: { event: 'Goal' } },
        { label: 'Shots', filter: { event: 'Shot' } },
        { label: 'Shots On Goal', filter: { event: 'Shot', detail2: 'On Net' } },
        { label: 'Missed Shots', filter: { event: 'Shot', detail2: 'Missed' } },
        { label: 'Blocked Shots', filter: { event: 'Shot', detail2: 'Blocked' } },
        { label: 'Wristshots', filter: { event: 'Shot', detail1: 'Wristshot' } },
        { label: 'Snapshots', filter: { event: 'Shot', detail1: 'Snapshot' } },
        { label: 'Slapshots', filter: { event: 'Shot', detail1: 'Slapshot' } },
        { label: 'One-timers', filter: { event: 'Shot', detail4: 't' } },
        { label: 'Shots with Traffic', filter: { event: 'Shot', detail3: 't' } },
        { label: 'Faceoff Wins', filter: { event: 'Faceoff Win' } },
        { label: 'Zone Entries', filter: { event: 'Zone Entry' } },
        { label: 'Dump Ins', filter: { event: 'Zone Entry', detail1: 'Dumped' } },
        { label: 'Carry Ins', filter: { event: 'Zone Entry', detail1: 'Carried' } },
        { label: 'Penalties', filter: { event: 'Penalty Taken' } },
        { label: 'Takeaways', filter: { event: 'Takeaway' } },
    ];

    selectedEvent = signal(this.eventOptions[0].label);
    selectedEventFilter = computed(() => find(this.eventOptions, { label: this.selectedEvent() })?.filter ?? {});
    selectedEventFilter$ = toObservable(this.selectedEventFilter);

    readonly game$ = this._route.data.pipe(
        map((data) => data['game']),
        tap((game) => {
            if (this.selectedTeam() === '') this.selectedTeam.set(game.homeTeam);
        }),
        shareReplay(1),
    );

    private readonly events$ = this.game$.pipe(
        map((game) => game.events),
        shareReplay(1),
    );

    readonly teamComparison$ = this.events$.pipe(
        map((events) => {
            const home = events[0].homeTeam;
            const away = events[0].awayTeam;

            const faceoffs = filter(events, { event: 'Faceoff Win' });

            return [home, away].reduce((acc, team) => {
                const eventsByGroupMap = chain(events).filter({ team }).groupBy('event').valueOf();
                const sogs = chain(eventsByGroupMap['Shot']).filter({ detail2: 'On Net' }).size().valueOf();

                acc.push({
                    team,
                    sogs,
                    sogRate: Math.round(100 * (sogs / eventsByGroupMap['Shot'].length)),
                    passingRate: Math.round(
                        100 *
                            (chain(eventsByGroupMap['Play'].concat(eventsByGroupMap['Incomplete Play']))
                                .filter({ event: 'Play' })
                                .size()
                                .valueOf() /
                                eventsByGroupMap['Play'].concat(eventsByGroupMap['Incomplete Play']).length),
                    ),
                    zoneEntryDumpRate: Math.round(
                        100 *
                            (chain(eventsByGroupMap['Zone Entry']).filter({ detail1: 'Dumped' }).size().valueOf() /
                                eventsByGroupMap['Zone Entry'].length),
                    ),
                    zoneEntryCarryRate: Math.round(
                        100 *
                            (chain(eventsByGroupMap['Zone Entry']).filter({ detail1: 'Carried' }).size().valueOf() /
                                eventsByGroupMap['Zone Entry'].length),
                    ),
                    pims: `${(eventsByGroupMap['Penalty Taken'] || []).length * 2}:00`,
                    faceoffWinRate: Math.round(100 * (eventsByGroupMap['Faceoff Win'].length / faceoffs.length)),
                });

                return acc;
            }, []);
        }),
        shareReplay(1),
    );

    readonly selectedTeamPlayerStats$ = combineLatest([this.events$, this.selectedTeam$]).pipe(
        map(([events, selectedTeam]) => {
            const faceoffs = filter(events, { event: 'Faceoff Win' });

            const teamEvents = filter(events, { team: selectedTeam });
            const playerEventMap = groupBy(teamEvents, 'player');

            return Object.entries(playerEventMap)
                .map(([player, events]) => {
                    const eventMap = groupBy(events, 'event');

                    const shotAttempts = eventMap['Shot'] ?? [];
                    const sogs = filter(shotAttempts, { detail2: 'On Net' });

                    const goals = eventMap['Goal'] ?? [];
                    const takeaways = eventMap['Takeaway'] ?? [];

                    const successfulPasses = eventMap['Play'] ?? [];
                    const passes = successfulPasses.concat(eventMap['Incomplete Play'] ?? []);

                    const faceoffWins = eventMap['Faceoff Win'] ?? [];

                    const pims = (eventMap['Penalty Taken'] ?? []).length * 2;

                    const zoneEntries = eventMap['Zone Entry'] ?? [];
                    const zoneEntryCarries = filter(zoneEntries, { detail1: 'Carried' });
                    const zoneEntryDumps = filter(zoneEntries, { detail1: 'Dumped' });

                    const zoneEntryCarryRate = zoneEntryCarries.length / zoneEntries.length;
                    const zoneEntryDumpRate = zoneEntryDumps.length / zoneEntries.length;
                    const faceoffWinRate = faceoffWins.length / faceoffs.length;
                    const passingRate = successfulPasses.length / passes.length;

                    return {
                        player,
                        shotAttempts: shotAttempts.length,
                        sogs: sogs.length,
                        goals: goals.length,
                        passingRate: `${isFinite(passingRate) ? Math.round(100 * passingRate) : 0}%`,
                        faceoffWinRate: `${isFinite(faceoffWinRate) ? Math.round(100 * faceoffWinRate) : 0}%`,
                        pims: `${pims}:00`,
                        zoneEntryCarryRate: `${isFinite(zoneEntryCarryRate) ? Math.round(100 * zoneEntryCarryRate) : 0}%`,
                        zoneEntryDumpRate: `${isFinite(zoneEntryDumpRate) ? Math.round(100 * zoneEntryDumpRate) : 0}%`,
                        takeaways: takeaways.length,
                    };
                })
                .sort((a, b) => a.player.localeCompare(b.player));
        }),
        shareReplay(1),
    );

    readonly heatmapData$ = combineLatest([this.events$, this.selectedEventFilter$, this.selectedTeam$]).pipe(
        map(([events, selectedEventFilter, selectedTeam]) =>
            filter(events, { team: selectedTeam, ...selectedEventFilter }),
        ),
        shareReplay(1),
    );
}
