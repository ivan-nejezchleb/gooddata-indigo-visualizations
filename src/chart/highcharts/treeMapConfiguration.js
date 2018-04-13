// (C) 2007-2018 GoodData Corporation
import cloneDeep from 'lodash/cloneDeep';

const TREEMAP_TEMPLATE = {
    chart: {
        type: "treemap",
    },
    plotOptions: {
        treemap: {
            dataLabels: {
                enabled: true
            },
            showInLegend: true
        }
    },
    legend: {
        enabled: false
    }
};

export function getTreeMapConfiguration() {
    return cloneDeep(TREEMAP_TEMPLATE);
}
