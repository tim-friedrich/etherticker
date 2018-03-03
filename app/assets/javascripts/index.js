$(function(){
  var dataRootUrl = "https://min-api.cryptocompare.com/data/"
  var today = new Date();
  var chartDataPaths = {
    "1h": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=60&aggregate=1",
    "24h": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=60&aggregate=1",
    "48h": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=60&aggregate=1",
    "30d": "/price/day?limit=30&start="+daysAgo(30),
    "3M": "/price/day?limit=30&start="+daysAgo(90),
    "6M": "/price/day?limit=30&start="+daysAgo(180),
    "12M": "/price/day?limit=30&start="+daysAgo(365),
    "all": "/price/day?limit=30&start=-1"
  }
  var chart,
      candleChart;

  function daysAgo(days){
    return parseInt(new Date().setDate(today.getDate()-days)/1000);
  }

  function fetchChartData(url){
    $.get( url, function( data ) {
      //chart.update(parseDataForLine(data));
      candleChart.update(parseDataForCandle(data));
    });
  }

  function initChart(){
    var options = {
      'data': [{ 'values': [] }]
    };
    //chart = $("#line-chart").lineChart(options);
    candleChart = $("#candle-chart").candleStickChart(options);

    $("#range-picker").on("click", function(e){
      fetchChartData(chartDataPaths[$(e.target).data('range')]);
    });
    fetchChartData("https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=30&aggregate=1");
  }

  function parseDataForCandle(rawData){
    var parsedData = [];
    $(rawData).each(function(_, dataPoint){
      dataPoint.time = new Date(dataPoint.time*1000)
      parsedData.push(dataPoint);
    })
    return parsedData;
  }
  function parseDataForLine(rawData){
    var parsedData = [
      {
        'key': 'USD',
        'values': []
      }
    ];

    $(rawData.Data).each(function(_, dataPoint){
      parsedData[0].values.push({
        'x': new Date(dataPoint.time*1000),
        'y': dataPoint.close
      });
    });
    return parsedData;
  }

  initChart();
});
