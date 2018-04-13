// (C) 2007-2018 GoodData Corporation
import cloneDeep from 'lodash/cloneDeep';

const AREA_LINE_WIDTH = 3;

const AREA_TEMPLATE = {
    chart: {
        type: 'area'
    },
    plotOptions: {
        area: {
            lineWidth: 1,
            stacking: 'normal'
        },
        series: {
            marker: {
                symbol: 'circle',
                radius: 4.5
            },
            lineWidth: AREA_LINE_WIDTH,
            fillOpacity: 0.6,
            states: {
                hover: {
                    lineWidth: AREA_LINE_WIDTH + 1
                }
            },
            dataLabels: {
                style: {
                    fontWeight: 'normal'
                }
            }
        },
        column: {
            dataLabels: {}
        }
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        stackLabels: {
            enabled: false
        }
    }
};

export function getAreaConfiguration() {
    return cloneDeep(AREA_TEMPLATE);
}
