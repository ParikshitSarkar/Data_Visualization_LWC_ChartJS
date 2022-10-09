public class DataProvider {
    
    @AuraEnabled(Cacheable=true)
    public static List<DataSet> getClosedOppsByMonth(){
        
        List<AggregateResult> allRec = [SELECT count(id) cnt, CALENDAR_MONTH( CloseDate) month from Opportunity where IsClosed = true group by CALENDAR_MONTH( CloseDate) order by CALENDAR_MONTH( CloseDate)  ];
        List<DataSet> dataset = new List<DataSet>(); 
        for(AggregateResult aggr : allRec){
            dataset.add( new DataSet( 
                			string.valueOf(aggr.get('month')), Integer.valueOf( aggr.get('cnt') ) 
            			) 
                       ); 
        }
        system.debug('dataset  -- '+ dataset);
        return dataset; 
    }
    
    
    @AuraEnabled(Cacheable=true)
    public static List<DataSet> getOppsExpRevByStage(){
        
        List<AggregateResult> allRec = [SELECT count(id) cnt, sum(ExpectedRevenue) rev , StageName from Opportunity where StageName Not In ('Closed Won', 'Prospecting', 'Qualification') group by StageName ];
        List<DataSet> dataset = new List<DataSet>(); 
        for(AggregateResult aggr : allRec){
            dataset.add( new DataSet( 
                			(String)aggr.get('StageName'), Integer.valueOf( aggr.get('rev') ) 
            			) 
                       ); 
        }
        system.debug('dataset  -- '+ dataset);
        return dataset; 
    }
    
    @AuraEnabled(Cacheable=true)
    public static List<DataSet> getOppsStageAmt(){
        
        List<AggregateResult> allRec = [Select Count(Id) cnt, sum(Amount) amt, StageName from Opportunity  Group By StageName Limit 100];
        List<DataSet> dataset = new List<DataSet>(); 
        for(AggregateResult aggr : allRec){
            dataset.add( new DataSet( 
                			(String)aggr.get('StageName'), Integer.valueOf( aggr.get('amt') ) 
            			) 
                       ); 
        }
        system.debug('dataset  -- '+ dataset);
        return dataset; 
    }
    
    @AuraEnabled(Cacheable=true)
    public static List<DataSet> getOppsByStage(){
        
        List<AggregateResult> allRec = [Select Count(Id) cnt, StageName from Opportunity  Group By StageName Limit 100];
        List<DataSet> dataset = new List<DataSet>(); 
        for(AggregateResult aggr : allRec){
            dataset.add( new DataSet( (String)aggr.get('StageName'), (Integer)aggr.get('cnt') ) ); 
        }
        system.debug('dataset  -- '+ dataset);
        return dataset; 
    }
    

    @AuraEnabled(Cacheable=true)
    public static List<DataSet> getLeadsByStatus(){
        
        List<AggregateResult> allRec = [Select Count(Id) cnt, Rating from Lead Group By Rating Limit 100];
        List<DataSet> dataset = new List<DataSet>(); 
        for(AggregateResult aggr : allRec){
            dataset.add( new DataSet( (String)aggr.get('Rating'), (Integer)aggr.get('cnt') ) ); 
        }
        system.debug('dataset  -- '+ dataset);
        return dataset; 
    }
    
    @AuraEnabled(Cacheable=true)
    public static List<DataSet> getAccountsByRating(){
        List<AggregateResult> result =  [Select Count(Id) cnt, Rating from Account  Group By Rating Limit 100];
        List<DataSet> dataSet = new List<DataSet>();
        for(AggregateResult ar:result){
        String status =  (String)ar.get('Rating') ;
        Integer total =(Integer)ar.get('cnt');
        dataSet.add(new DataSet(status ,total));
        }
        System.debug('dataSet'+dataSet);
        return dataSet ;
    }
    
    public class DataSet {
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled
        public Integer  count {get;set;}
        
        DataSet(String label ,Integer count){
            this.label  = label ;
            this.count = count ;
		}
    }
    
}