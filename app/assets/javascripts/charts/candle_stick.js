(function($){
  CandleStickChart = function(element, options){
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
      path,
      yMin,
      yMax,
      rect;

    // public functions

    base.update = function(newData){
      data = newData;
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
      $(element).find('.axis').remove();
      addAxis();
    }

    function addAxis(){
      // use format map for time format/resolution
      xAxis = d3.axisBottom(x).ticks(9);

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

      rect = chart.selectAll("rect").data(data)

      initScale();
      addAxis();
      drawLine();
    }

    function initScale(){
      yMin = d3.min(data, function(d){ return Math.min(d.low); });
      yMax = d3.max(data, function(d){ return Math.max(d.high); });
      // x.rangeRound([0, width]);
      x.domain(d3.extent(data, function(d) { return d.time; }));
      x.range([0, width]);

      y = d3.scaleLinear()
      	.domain([yMin, yMax])
      	.range([height, 0]);
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
      line.x(function(d) { return x(d.time); })
          .y(function(d) { return y(d.close); });

      var X = width/data.length*0.25;

      chart.selectAll("line")
        .data(data.slice(1))
        .enter()
        .append("svg:line")
        .attr('x1', function(d,i) { return x(d.time) - X*0.5; })
        .attr('x2', function(d,i) { return x(d.time) - X*0.5; })
        .attr('y1', function(d,i) { return y(d.high); })
        .attr('y2', function(d,i) { return y(d.low); })
        .attr('stroke', 'black')
        .exit()
        .remove()
        .transition()
        .duration(pathAnimationDuration)

      rect
        .data(data.slice(1))
        .enter()
        .append("svg:rect")
        .attr("width", function(d){ return X})
        // .attr("x", function(d,i) { return x(d.time) - X; })
        .attr("x", function(d,i) { return x(d.time) - X; })
        .attr("y", function(d,i) { return y(Math.max(d.open, d.close)); })
        .attr("height", function(d,i) { return y(Math.min(d.open, d.close)) - y(Math.max(d.open, d.close)); })
        .attr("fill", function (d) { return d.open > d.close ? "red" : "green" })
        .attr("stroke", "black")
        .transition()
        .duration(pathAnimationDuration);
      rect.exit().remove();
    }

    function drawLine(){
      line.x(function(d) { return x(d.time); })
          .y(function(d) { return y(d.close); });

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

  $.fn.candleStickChart = function(options){
    var result = [];

    this.each(function(_, el){
      result.push(new CandleStickChart(el, options));
    });
    return result[0];
  };

})(jQuery)
