import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { assign, cloneDeep, find, forEach, isArray, isNil, isPlainObject, isString } from 'lodash';
import { Data, InitSignal, parse, Renderers, Signal, Spec, View } from 'vega';

function updateData(data: Data[], name: string, valuesOrUrl: any[] | string) {
    const item = find(data, { name });
    const values = isArray(valuesOrUrl) ? valuesOrUrl : undefined;
    const url = isString(valuesOrUrl) ? valuesOrUrl : undefined;

    if (isNil(item)) {
        data.unshift({
            name,
            values,
            url,
        });
    } else {
        assign(item, { url, values });
    }
}

function updateSignal(signals: Signal[], name: string, value: any): void {
    const signal = find(signals, { name });
    if (isNil(signal)) {
        signals.unshift({ name, value });
    } else {
        (signal as InitSignal).value = value;
    }
}

@Component({
    selector: 'app-vega-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './vega-chart.component.html',
    styleUrls: ['./vega-chart.component.scss'],
})
export class VegaChartComponent implements OnChanges {
    @ViewChild('chart', { static: true })
    chart: ElementRef;

    @Input()
    data: any[] | null = [];

    @Input()
    spec: Spec;

    @Input()
    signals: { [key: string]: any } = {};

    @Input()
    renderer: Renderers = 'canvas';

    // @HostListener('window:resize', [])
    // onResize = throttle(() => {
    //     this.resize();
    // });

    view?: View;
    private clonedSpec?: Spec;
    private clonedSignals?: { [key: string]: any };
    private width?: number;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['signals'] || changes['spec']) {
            const data = cloneDeep(this.data);
            const signals = cloneDeep(this.signals);
            const spec = cloneDeep(this.spec);
            this.clonedSpec = spec;
            this.clonedSignals = signals;

            if (isNil(spec.data)) {
                spec.data = [];
            }

            if (isArray(data) || isString(data)) {
                updateData(spec.data, 'data', data);
            } else {
                forEach(data, (valuesOrUrl: Data[], name: string) => {
                    updateData(spec.data ?? [], name, valuesOrUrl);
                });
            }

            if (isNil(spec.signals)) {
                spec.signals = [];
            }

            if (isPlainObject(this.clonedSignals)) {
                forEach(this.clonedSignals, (value: any, name: string) => {
                    updateSignal(spec.signals ?? [], name, value);
                });
            }

            this.render(spec);
        }
    }

    private render(spec: Spec): void {
        this.view = new View(parse(spec))
            .renderer(this.renderer || 'svg')
            .initialize(this.chart.nativeElement)
            .hover();

        this.view.runAsync().then((view) => {
            // Listeners?
            // this.resize();
        });
    }

    private resize(padding = 0): Promise<void | View> {
        if (!this.view) {
            return Promise.resolve();
        }

        const newWidth = this.chart.nativeElement.parentNode.parentNode.offsetWidth * 0.95 - padding;

        if (newWidth === this.width) {
            return Promise.resolve();
        }

        this.width = newWidth;

        return this.view.resize().width(this.width).runAsync();
    }
}
