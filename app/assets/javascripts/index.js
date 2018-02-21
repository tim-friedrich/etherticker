$(function(){
  var dataRootUrl = "https://min-api.cryptocompare.com/data/"
  var chartDataPaths = {
    "1h": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=60&aggregate=1",
    "24h": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=60&aggregate=1",
    "48h": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=60&aggregate=1",
    "30d": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=30&aggregate=1",
    "3M": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=90&aggregate=1",
    "6M": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=180&aggregate=1",
    "12M": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=365&aggregate=1",
    "all": dataRootUrl + "histoday?fsym=ETH&tsym=USD&limit=60&aggregate=1"
  }
  var chart,
      candleChart;

  function fetchChartData(url){
    $.get( url, function( data ) {
      chart.update(parseDataForLine(data));
      candleChart.update(parseDataForCandle(data.Data));
    });
  }

  function initChart(){
    var options = {
      'data': [{ 'values': [] }]
    };
    chart = $("#line-chart").lineChart(options);
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
