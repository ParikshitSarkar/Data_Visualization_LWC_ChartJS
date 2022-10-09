import { LightningElement,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import fetchEmpCntPerIndustry from '@salesforce/apex/AccountController.fetchEmpCntPerIndustry';
import chartjs from '@salesforce/resourceUrl/ChartJS';


export default class DemoBarChart extends LightningElement {



    chartInit; 
    chart; 
    bgColor = ['rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)']; 

    @wire(fetchEmpCntPerIndustry)
    fetchData({data,error}){
        if(data){

            data = data.filter(val => Object.keys(val).length !== 0); 

            for(var key in data){
                        this.updateChart(data[key].xAxis, data[key].yAxis , key); 
                    
            }
        }else if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Error occured in wire fetchData ', 
                    message : error.message, 
                    variant : 'error'
                })
            )
        }
    }

    renderedCallback(){
        if(this.chartInit){
            return; 
        }
        this.chartInit = true; 

        Promise.all([loadScript(this,chartjs)])
        .then(()=>{
            const ctx = this.template.querySelector('canvas.demobarchart').getContext('2d');
            this.chart = new window.Chart(ctx, this.config); 
        })
        .catch(error=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title : 'Error occured in renderedCallback', 
                        message : error.message, 
                        variant : 'error'
                    })
                )
        })

    }

    config = {
        type: 'bar', 
        data : {
            labels : [], 
            datasets : [{
                label: 'employee count per industry',
                data : [],
                backgroundColor : []
            }]
        }, 
        options : {
            responsive : true,
            scales: {
                xAxes: [{
                    scaleLabel : {
                        display: true,
                        labelString: 'Industry'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'No. of Employees'
                    },
                    ticks: {
                        stepSize: 5000 
                    }
                }]
            }
        }
    }

    updateChart(xAxis,yAxis,key){
        this.chart.data.labels.push(xAxis); 
        
        this.chart.data.datasets.forEach(dt=>{
                dt.data.push(yAxis); 
                dt.backgroundColor.push(this.bgColor[key]); 
            
        })
        this.chart.update(); 
    }

    

}