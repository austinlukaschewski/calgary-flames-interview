import { Spec } from 'vega';

export const rinkSpec: Spec = {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    width: 800,
    padding: 4,

    signals: [
        { name: 'rinkHeight', value: 85 },
        { name: 'rinkWidth', value: 200 },
        { name: 'width', value: 800 },
        { name: 'height', update: 'width * (85 / 200)' },
        { name: 'showHeatmap', value: true },
    ],

    data: [
        {
            name: 'data',
            values: [],
            transform: [
                {
                    type: 'project',
                    fields: ['xCoordinate', 'yCoordinate'],
                    as: ['x', 'y'],
                },
            ],
        },
        {
            name: 'densityData',
            source: 'data',
            transform: [
                {
                    type: 'kde2d',
                    size: [
                        {
                            signal: 'width',
                        },
                        {
                            signal: 'height',
                        },
                    ],
                    x: {
                        expr: "scale('x', datum.x)",
                    },
                    y: {
                        expr: "scale('y', datum.y)",
                    },
                    cellSize: 2,
                    bandwidth: [10, 10],
                    counts: true,
                },
            ],
        },
    ],

    scales: [
        {
            name: 'x',
            type: 'linear',
            domain: { signal: '[0, rinkWidth]' },
            range: 'width',
        },
        {
            name: 'y',
            type: 'linear',
            domain: { signal: '[0, rinkHeight]' },
            range: 'height',
        },
        {
            name: 'heatmapColor',
            type: 'linear',
            domain: [-1, 1],
            range: { scheme: 'redyellowblue' },
            reverse: true,
        },
    ],

    marks: [
        {
            type: 'symbol',
            from: { data: 'data' },
            encode: {
                enter: {
                    x: { scale: 'x', field: 'x' },
                    y: { scale: 'y', field: 'y' },
                },
                update: {
                    opacity: { signal: 'showHeatmap ? 0 : 1' },
                },
            },
        },
        {
            type: 'image',
            from: {
                data: 'densityData',
            },
            encode: {
                enter: {
                    x: {
                        value: 0,
                    },
                    y: {
                        value: 0,
                    },
                    aspect: {
                        value: false,
                    },
                    smooth: {
                        value: true,
                    },
                },
                update: {
                    width: {
                        signal: 'width',
                    },
                    height: {
                        signal: 'height',
                    },
                    opacity: { signal: 'showHeatmap ? 1 : 0' },
                },
            },
            transform: [
                {
                    type: 'heatmap',
                    field: 'datum.grid',
                    color: {
                        expr: "scale('heatmapColor', datum.$value / datum.$max)",
                    },
                },
            ],
        },
        {
            type: 'group',
            name: 'rink',
            marks: [
                {
                    type: 'rule',
                    encode: {
                        enter: {
                            stroke: { value: 'red' },
                            strokeWidth: { value: 1.5 },
                            strokeDash: { value: [6, 8] },
                        },
                        update: {
                            x: { scale: 'x', signal: 'rinkWidth / 2' },
                            y: { scale: 'y', value: 0 },
                            y2: { scale: 'y', signal: 'rinkHeight' },
                        },
                    },
                },
                {
                    type: 'rule',
                    encode: {
                        enter: {
                            stroke: { value: 'blue' },
                            strokeWidth: { value: 1.5 },
                        },
                        update: {
                            x: { scale: 'x', signal: 'rinkWidth - 75' },
                            y: { scale: 'y', value: 0 },
                            y2: { scale: 'y', signal: 'rinkHeight' },
                        },
                    },
                },
                {
                    type: 'rule',
                    encode: {
                        enter: {
                            stroke: { value: 'blue' },
                            strokeWidth: { value: 1.5 },
                        },
                        update: {
                            x: { scale: 'x', value: '75' },
                            y: { scale: 'y', value: 0 },
                            y2: { scale: 'y', signal: 'rinkHeight' },
                        },
                    },
                },
                {
                    type: 'rule',
                    encode: {
                        enter: {
                            stroke: { value: 'red' },
                        },
                        update: {
                            x: { scale: 'x', signal: 'rinkWidth - 11' },
                            y: { scale: 'y', value: 1.5 },
                            y2: { scale: 'y', signal: 'rinkHeight - 1.5' },
                        },
                    },
                },
                {
                    type: 'rule',
                    encode: {
                        enter: {
                            stroke: { value: 'red' },
                        },
                        update: {
                            x: { scale: 'x', value: 11 },
                            y: { scale: 'y', value: 1.5 },
                            y2: { scale: 'y', signal: 'rinkHeight - 1.5' },
                        },
                    },
                },
                {
                    type: 'text',
                    encode: {
                        enter: {
                            fontSize: { value: 12 },
                            fill: { value: '#A9A9A9' },
                            fillOpacity: { value: 0.8 },
                            text: { value: 'Offensive Zone' },
                        },
                        update: {
                            align: { value: 'center' },
                            baseline: { value: 'middle' },
                            xc: { scale: 'x', signal: '200 - (75 / 2)' },
                            yc: { scale: 'y', signal: 'rinkHeight / 2' },
                        },
                    },
                },
                {
                    type: 'text',
                    encode: {
                        enter: {
                            fontSize: { value: 12 },
                            fill: { value: '#A9A9A9' },
                            fillOpacity: { value: 0.8 },
                            text: { value: 'Defensive Zone' },
                        },
                        update: {
                            xc: { scale: 'x', signal: '75 / 2' },
                            yc: { scale: 'y', signal: 'rinkHeight / 2' },
                        },
                    },
                },
                {
                    type: 'rect',
                    encode: {
                        enter: {
                            stroke: { value: '#e1e1e1' },
                        },
                        update: {
                            x: { scale: 'x', value: 0 },
                            y: { scale: 'y', value: 0 },
                            x2: { scale: 'x', signal: 'rinkWidth' },
                            y2: { scale: 'y', signal: 'rinkHeight' },
                            cornerRadius: { signal: '30 * (200 / 85)' },
                        },
                    },
                },
                {
                    type: 'rect',
                    encode: {
                        update: {
                            x: { scale: 'x', signal: 'rinkWidth - 15' },
                            yc: { scale: 'y', signal: 'rinkHeight / 2' },
                            width: { scale: 'x', value: 4 },
                            height: { scale: 'x', value: 8 },
                            fill: { value: 'lightblue' },
                            opacity: { value: 0.5 },
                        },
                    },
                },
                {
                    type: 'rect',
                    encode: {
                        update: {
                            x: { scale: 'x', value: 11 },
                            yc: { scale: 'y', signal: 'rinkHeight / 2' },
                            width: { scale: 'x', value: 4 },
                            height: { scale: 'x', value: 8 },
                            fill: { value: 'lightblue' },
                            opacity: { value: 0.5 },
                        },
                    },
                },
            ],
        },
    ],
};
