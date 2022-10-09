import { LightningElement, wire } from 'lwc';

import chartjs from '@salesforce/resourceUrl/ChartJS'; 
import {loadScript} from 'lightning/platformResourceLoader'; 
import getLeadsByStatus from '@salesforce/apex/DataProvider.getLeadsByStatus'; 
import {ShowToastEvent} from 'lightning/platformShowToastEvent'; 

export default class PieChart extends LightningElement {


    chart; 
    isChartInit; 

    @wire(getLeadsByStatus)
    getLeads({data,error}){

        if(data){

            for(var key in data ){
                this.updateRecords(data[key].label, data[key].count);
            }

        }else if(error){

            this.dispatchEvent(
                    new ShowToastEvent({
                        title : 'Error occured... ',
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
            const ctx = this.template.querySelector('canvas.pie').getContext('2d'); 
            this.chart = new window.Chart(ctx,this.config); 
        }).catch(error =>{
            this.dispatchEvent(
                new ShowToastEvent(
                    {
                        title: 'Error occured in Pie Chart',
                        message: error.message,
                        variant: 'error'
                    }
                )
            )
        })
    }

    config = {
        type : 'pie',
        data : {
            datasets : [{
                data : [],
                backgroundColor : [
                    'red','yellow','blue','green'
                ]

            }],
            labels : []
        },
        options:{
            responsive : true, 
            legend : {
                position : 'left', 
                labels : {
                    fontSize : 14, 
                    fontColor : 'red', 
                    fontStyle : 'normal'
                }
            }
        }

    }

    updateRecords(label,count){
        label = label != null ? label : 'Unspecified'; 
        this.chart.data.labels.push(label) ; 
        this.chart.data.datasets.forEach((dt)=>{
            dt.data.push(count); 
        }); 

        this.chart.update();
    }
}