import { LightningElement, wire, track } from 'lwc';
//importing the Chart library from Static resources
import chartjs from '@salesforce/resourceUrl/ChartJS';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//importing the apex method.
import getAccountsByRating from '@salesforce/apex/DataProvider.getAccountsByRating';

export default class DoughnutChart extends LightningElement {

    chart;
    chartjsInitialized = false;

    @wire(getAccountsByRating)
    getAccounts({ error, data }) {
        if (data) {
            for (var key in data) {
                this.updateChart(data[key].count, data[key].label);
            }
            this.error = undefined;
        }
        else if (error) {
            this.error = error;
        }
    }


    config = {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    data: [
                    ],
                    backgroundColor: [
                        'rgb(255,99,132)',
                        'rgb(255,159,64)',
                        'rgb(255,205,86)',
                        'rgb(75,192,192)',
                    ]
                }
            ],
            labels: []
        },
        options: {
            responsive: true,
            legend: {
                position: 'left',
                labels: {
                    fontColor: 'black',
                    fontSize: 12,
                    fontStyle: 'bold'
                }
            }
        }
    };

    renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;
        Promise.all([
            loadScript(this, chartjs)
        ]).then(() => {
            const ctx = this.template.querySelector('canvas.doughnut')
                .getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading ChartJS',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }

    updateChart(count, label) {

        label = label != null ? label : 'Unspecified';
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dt) => {
            dt.data.push(count);
        });
        this.chart.update();
    }

}