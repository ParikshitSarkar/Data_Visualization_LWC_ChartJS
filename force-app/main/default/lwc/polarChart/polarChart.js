import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/ChartJS'; 
import getOppsExpRevByStage from '@salesforce/apex/DataProvider.getOppsExpRevByStage';

export default class PolarChart extends LightningElement {

    chart; 
    isChartInit; 
    bgColors = ['rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'lightred',
                'lightgreen',
                'lightblue'
                ]

    @wire(getOppsExpRevByStage)
    getOpps({data,error}){
        if(data){
           for(var key in data){
                this.updateChart(data[key].label, data[key].count, key); 
           } 
        }else if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error occured while loading lib ',
                    message: error.message,
                    variant : 'error'
                })
            )
        }
    }

    renderedCallback(){
        if(this.isChartInit){
            return ; 
        }
        this.isChartInit = true; 

        Promise.all([loadScript(this,chartjs)])
        .then(()=>{
            const ctx = this.template.querySelector('canvas.polar').getContext('2d');
            this.chart = new window.Chart(ctx, this.config); 
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error occured while loading lib ',
                    message: error.message,
                    variant : 'error'
                })
            )
        })
    }

    config = {
        type: 'polarArea',
        data : {
            datasets: [{
                data: [],
                backgroundColor:[]
            }],
            labels: [ ]
        },
        options : {
            responsive : true,
            legend : {
                position : 'left'
            }
        }
    }

    updateChart(label,total,key){
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach(d => {
            d.data.push(total); 
            d.backgroundColor.push(this.bgColors[key])
        }) 
        this.chart.update(); 
    }
    
}