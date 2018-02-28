(function($){
  LineChart = function(element, options){
    var base = this;
    // var base.element = element;
    // var base.options = options;
    var data,
      svg,
      height,
      width,
      g,
      chart,
      x,
      y,
      line,
      pathAnimationDuration = 2000,
      xAxis,
      yAxis,
      path;

    // public functions

    base.update = function(newData){
      data = newData[0].values;
      initScale();
      updateAxis();
      updateLine();
    };

    // private functions
    function init(){
      initVariables();
      drawChart();
      addAxis();
      initEventHandler();
    };

    function onLineHover(){

    };
    function initEventHandler(){
      $(svg).find("path").on("hover", onLineHover);
    };

    function initVariables(){
      data = options.data[0].values;
      svg = d3.select(element);
      svg.attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", "0 0 "+$(element).width()+" "+$(element).height()+"")
      margin = {top: 20, right: 20, bottom: 30, left: 50};
      width = +$(element).width() - margin.left - margin.right;
      height = +$(element).height() - margin.top - margin.bottom;

      x = d3.scaleTime()
      y = d3.scaleLinear()

      line = d3.line()

    }

    function updateAxis(){
      chart.select(".x .Axis");
      $(element).find('.axis').remove();
      addAxis();
    }

    function addAxis(){
      // use format map for time format/resolution
      xAxis = d3.axisBottom(x).tickPadding(10).ticks(9);

      yAxis = d3.axisLeft(y).ticks(6);

      appendAxis();
    }

    function appendAxis(){
      chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      chart.append("g")
          .attr("class", "y axis")
          .call(yAxis);
    }

    function drawChart(){
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      chart = d3.select(element)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      initScale();
      addAxis();
      drawLine();
    }

    function initScale(){
      x.rangeRound([0, width]);

      y.rangeRound([height, 0]);

      x.domain(d3.extent(data, function(d) { return d.x; }));
      y.domain(d3.extent(data, function(d) { return d.y; }));
    }

    function updateLine(){
      path.datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line)

      var totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
          .duration(pathAnimationDuration)
          .attr("stroke-dashoffset", 0);
    }

    function drawLine(){
      line.x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); });

      path = g.append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line)

      var totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
          .duration(pathAnimationDuration)
          .attr("stroke-dashoffset", 0);
    };
    init();
  };

  $.fn.lineChart = function(options){
    var result = [];

    this.each(function(_, el){
      result.push(new LineChart(el, options));
    });
    return result[0];
  };

})(jQuery)
