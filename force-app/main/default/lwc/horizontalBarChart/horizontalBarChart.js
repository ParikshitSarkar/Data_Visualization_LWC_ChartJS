import { LightningElement,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/ChartJS'; 
import  getClosedOppsByMonth  from '@salesforce/apex/DataProvider.getClosedOppsByMonth';

export default class HorizontalBarChart extends LightningElement {

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
    months = {1 : 'jan', 2 : 'feb', 3 : 'mar', 4 : 'apr', 5 : 'may', 6 : 'jun', 7 : 'jul', 8 : 'aug', 9 : 'sep', 10 : 'oct', 
    11 : 'nov', 12 : 'dec'}; 


    @wire(getClosedOppsByMonth)
    getOpps({data,error}){
       
        if(data){
            console.log('data --- '+ JSON.stringify(data)); 
            for(var key in data){
                this.updateChart(data[key].label, data[key].count, key); 
            }
        }else if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Error occured in wire ', 
                    message: error.message, 
                    variant:'error'
                })
            )
        }
    }

    renderedCallback(){
        if(this.isChartInit){
            return; 
        }
        this.isChartInit = true; 

        Promise.all([loadScript(this,chartjs)])
        .then(()=>{
            const ctx = this.template.querySelector('canvas.horizontal').getContext('2d');
            this.chart = new window.Chart(ctx,this.config); 

        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title:'Error occured in callback  ', 
                    message: error.message, 
                    variant:'error'
                })
            )
        })
    }

    config = {
        type:'horizontalBar',
        data : {
            datasets : [{
                label : 'Sample Dataset',
                data : [],
                backgroundColor:[]
            }],
            labels : []
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    }

    updateChart(label,count, key){
        this.chart.data.labels.push(this.months[label]); 
        this.chart.data.datasets.forEach(dt => {
            dt.data.push(count); 
            dt.backgroundColor.push(this.bgColors[key]); 
        }); 
        this.chart.update(); 
    }
}