$(function(){
  function drawChart(data){
    nv.addGraph(function() {
      //data = testData(['Unique', 'Visits'], 30)
      var chart = nv.models.lineChart()
          // .useInteractiveGuideline(true)
          .margin({top: 0, bottom: 25, left: 25, right: 0})
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
      d3.select('#visits-chart svg')
          .datum(data)
          .transition().duration(500)
          .call(chart);

      // PjaxApp.onResize(chart.update);

      return chart;
    });
  }
  function initChart(){

    $.get( "https://min-api.cryptocompare.com/data/histoday?fsym=ETH&tsym=USD&limit=60&aggregate=1", function( data ) {
      drawChart(parseData(data));
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
