// (C) 2007-2018 GoodData Corporation
import cloneDeep from 'lodash/cloneDeep';

const HEATMAP_LINE_WIDTH = 3;

const HEATMAP_TEMPLATE = {
    chart: {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
    },
    colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: 'rgb(20,178,226)',
    },
    legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        categories: [],
        title: null,
        labels: {
        autoRotation: [-90]
    }
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
        }
    },
    series: [{
        borderWidth: 1,
        dataLabels: {         
            color: '#000000',           
            allowOverlap: false
        }
    }]
};

export function getHeatMapConfiguration() {
    return cloneDeep(HEATMAP_TEMPLATE);
}
