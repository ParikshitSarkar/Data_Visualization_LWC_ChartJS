import { LightningElement,wire } from 'lwc';
import { ShowToastEvent }  from 'lightning/platformShowToastEvent'; 
import chartjs from '@salesforce/resourceUrl/ChartJS'; 
import { loadScript } from 'lightning/platformResourceLoader'; 
import getOppsStageAmt from '@salesforce/apex/DataProvider.getOppsStageAmt'; 

export default class RadarChart extends LightningElement {

    chart; 
    isChartInit; 

    @wire(getOppsStageAmt)
    getOpps({data,error}){
        console.log('data --- '+ JSON.stringify(data) ); 
        if(data){
            for(var key in data){
                this.updateOpps(data[key].label, data[key].count); 
            }   
        }else if(error){
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Error occured in getOppsStageAmt ',
                    message : error.message, 
                    variant : 'error'
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
            const ctx = this.template.querySelector('canvas.radar').getContext('2d');
            this.chart = new window.Chart(ctx, this.config); 
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title : 'Error occured in renderedCallback ',
                    message : error.message, 
                    variant : 'error'
                })
            )
        })
    }

    config = {
        type: 'radar',
          data: {
            labels: [],
            datasets: [{
                label : 'Sample Dataset',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                pointBackgroundColor: 'rgb(255, 99, 132)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(255, 99, 132)',
                pointStyle : 'circle',
                pointRadius : 2          
            }]
        },
        options: {
            responsive : true,
        }
    }

    updateOpps(label,count ){
        this.chart.data.labels.push(label); 
        this.chart.data.datasets.forEach(dt => {
            dt.data.push(count); 
        });
        this.chart.update(); 
    }
}