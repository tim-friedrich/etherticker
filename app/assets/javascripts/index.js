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
  var chart;
  var chartData;

  function drawChart(data){
    nv.addGraph(function() {

      chart = nv.models.lineChart()
          //.useInteractiveGuideline(true)
          .margin({top: 0, bottom: 25, left: 35, right: 35})
          //.showLegend(false)
          .color([
              '#6294c9', '#59bc79'
          ]);
      chart.legend.margin({top: 3});

      chart.yAxis
          .showMaxMin(false)
          .tickFormat(d3.format(',.f'));

      chart.xAxis
          .showMaxMin(false)
          .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d*1000)) });
      chartData = d3.select('#visits-chart svg')
          .datum(data);

      chartData.transition().duration(500)
          .call(chart);

      $(window).on('resize', chart.update);
      return chart;
    });
  }
  function updateChart(data){
    chartData = d3.select('#visits-chart svg')
        .datum(data);    //
    chartData.transition().duration(500)
        .call(chart);
    chart.update();

  }
  function fetchChartData(url){
    $.get( url, function( data ) {
      console.log(data);
      if(typeof(chart) === 'undefined'){
        drawChart(parseData(data));

      } else{
        updateChart(parseData(data))
      }
    });
  }

  function initChart(){
    fetchChartData("https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=30&aggregate=1");
    $('#range-picker a').click(function(e){
      var range = $(e.target).data('range');
      fetchChartData(chartDataPaths[range])
    });
  }

  function parseData(rawData){
    var parsedData = [
      {
        'key': 'USD',
        'values': []
      }
    ];
    $(rawData.Data).each(function(_, dataPoint){
      parsedData[0].values.push({
        'x': dataPoint.time,
        'y': dataPoint.close
      });
    });
    console.log(parsedData);
    return parsedData;
  }

  initChart();
});
