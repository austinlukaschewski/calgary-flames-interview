export type GameBoxscore = {
    team: string;
    values: Array<{ period: number; goals: number }>;
    total: number;
};

export type Game = {
    id: number;
    gameDate: string;
    homeTeam: string;
    awayTeam: string;
    boxscore: GameBoxscore[];
    events: GameEvent[];
};

export type GameEvent = {
    gameDate: string;
    homeTeam: string;
    awayTeam: string;
    period: number;
    clock: string;
    homeTeamSkaters: number;
    awayTeamSkaters: number;
    homeTeamGoals: number;
    awayTeamGoals: number;
    team: string;
    player: string;
    event: string;
    xCoordinate: number;
    yCoordinate: number;
    detail1?: string;
    detail2?: string;
    detail3?: string;
    detail4?: string;
    player2?: string;
    xCoordinate2?: number;
    yCoordinate2?: number;
};
