public class AccountController {

@AuraEnabled(cacheable=true)
    public static List<WrapData> fetchEmpCntPerIndustry(){

        List<WrapData> dataList = new List<WrapData>(); 

        List<AggregateResult> results = [Select Industry, sum(NumberOfEmployees) EmployeeCount From Account Group By Industry ]; 

        for(AggregateResult val : results){
            dataList.add(new WrapData(string.valueOf(val.get('Industry'))  , integer.valueOf(val.get('EmployeeCount')) ) ); 
        }

        return dataList; 
    }
    public class WrapData {
        @AuraEnabled public string xAxis ; 
        @AuraEnabled public integer yAxis ; 
        WrapData(string xAxis, integer yAxis){
            this.xAxis = xAxis; 
            this.yAxis = yAxis; 
        }
    }


}