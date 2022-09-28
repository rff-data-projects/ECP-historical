const width_c2 = '120px; text-align: center;">';

Highcharts.setOptions({
    colors: ['#04273C',
            '#88C4F4',
            '#ff6663',
            '#50B161',
            '#74645E',
            '#755EA6',
            '#EAD367',
            '#F4A25F',
            '#96A4AD',
            '#C3E1F9',
            '#FFBFBE',
            '#B4DEBC',
            '#B9B1AE',
            '#BAAFD3',
            '#F5E9B3',
            '#FAD1B0']
});

function  LineChart(ddata, loc_juri, min_year){

    Highcharts.chart('viz', {
        chart: {
            type: 'line',
            marginLeft: 78,
            marginBottom: 100,
            marginRight: 10,
            style: {
                fontFamily: "Calibre Web Regular"
            }
        },
        responsive: {  
            rules: [
            {   
              condition: {  
                maxWidth: 610  
              },  
              chartOptions: {  
                legend: {  
                  enabled: false  
                },
                chart: {  
                    marginLeft: 40,
                }    
              }  
            }
        ]  
          },
        credits: {
            enabled: false
        },
        legend: {
            enabled: true,  
            align: 'center',
            verticalAlign: 'bottom',
            x: 0,
            y: 10,
            floating: true,
            borderWidth: 0,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
            shadow: false,
            itemStyle: {
                fontSize: '16px',
                fontFamily: 'Calibre Web Regular',
                fontWeight: 'normal',
                width: 80
            }
        },
        xAxis: {
            allowDecimals: false,
            labels: { 
                style: {
                    fontSize:'16px'
                }
              }
            },
        yAxis: {
            allowDecimals: false,
            title: {
                text: null,
                align: 'high'
            },
            labels: {
                overflow: 'justify',
                format:  '${text}',
                style: {
                    fontSize:'16px'
                }
            }
        },
        tooltip: {
            valuePrefix: '$',
            valueDecimals: 2,
            useHTML: true,
            backgroundColor: '#fff',
            headerFormat: '<span style="font-size: 16px;">{point.key}</span> </br>', // see https://www.highcharts.com/forum/viewtopic.php?t=44306 and https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/tooltip/footerformat/
            style:{
                fontSize: '16px'
            }
        },
        title: {
            text: ''
        },
        xtitle: {
            text: ''
        },
        plotOptions: {
            series: {
              label: {
                connectorAllowed: false
              },
              marker: {
                symbol: 'circle'
                },
              pointStart: min_year
            }
          },
        series: ddata
    });
}

function NoDataChart(){
    Highcharts.chart('viz', {
        chart: {
            type: 'bar',
            marginBottom: 100,
            marginLeft: 150
        },
        title: {
            text: 'No data for current selection of pricing instrument, sector, and juridictions'
        },
        credits: {
            enabled: false
        }
    });
}


