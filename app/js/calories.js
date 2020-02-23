// d3.json('/js/data/forecast.json', function(d) {
d3.json('/js/data/out3.json', function(error, d) {
  console.log("this is calories.js");
  if (error) throw error;

  var path = window.location.pathname;
  // console.log(path);

  var re = /\/user\/([0-9]+)/;
  var match = re.exec(path);
  var id = match[1];
  // console.log(id);
  var p = d.filter(d => d.PatientId === 'Patient/'+id)[0];
  console.log(p);
  d3.select("#username").text(p.DisplayName);
  var temperatures = [],
      dates = [],
      margin = { top: 0, right: 0, bottom: 30, left: 40 }
      height = 400 - margin.top - margin.bottom,
      width = 600 - margin.left - margin.right;

  var   tempColor,
        yScale,
        yAxisValues,
        yAxisTicks,
        yGuide,
        xScale,
        xAxisValues,
        xAxisTicks,
        xGuide,
        colors,
        tooltip,
        myChart;
  temperatures = p.Calories;
  console.log(p.Calories);
  for (var i = 0; i<p.Days.length; i++) {
    // temperatures.push(p.Caleries[i]);
    dates.push( new Date(p.Days[i]));
  }

  yScale = d3.scaleLinear()
    .domain([0, d3.max(temperatures)])
    .range([0,height]);

  yAxisValues = d3.scaleLinear()
    .domain([0, d3.max(temperatures)])
    .range([height,0]);

  yAxisTicks = d3.axisLeft(yAxisValues)
  .ticks(10)

  xScale = d3.scaleBand()
    .domain(temperatures)
    .paddingInner(.1)
    .paddingOuter(.1)
    .range([0, width])

  xAxisValues = d3.scaleTime()
    .domain([dates[0],dates[(dates.length-1)]])
    .range([0, width])

  xAxisTicks = d3.axisBottom(xAxisValues)
    .ticks(d3.timeDay.every(10))

  colors = d3.scaleLinear()
    .domain([0, 1500, d3.max(temperatures)])
    .range(['#FFFFFF', '#2D8BCF', '#DA3637'])

  tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0);

  myChart = d3.select('#viz').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.right +')')
    .selectAll('rect').data(temperatures)
    .enter().append('rect')
      .attr('fill', colors)
      .attr('width', function(d) {
        return xScale.bandwidth();
      })
      .attr('height', 0)
      .attr('x', function(d) {
        return xScale(d);
      })
      .attr('y', height)

      .on('mouseover', function(d) {
        tooltip.transition().duration(200)
          .style('opacity', .9)
        tooltip.html(
          '<div style="font-size: 2rem; font-weight: bold">' +
            d + ' kcal</div>'
        )
          .style('left', (d3.event.pageX -35) + 'px')
          .style('top', (d3.event.pageY -30) + 'px')
        tempColor = this.style.fill;
        d3.select(this)
          .style('fill', 'yellow')
      })

      .on('mouseout', function(d) {
        tooltip.html('')
        d3.select(this)
          .style('fill', tempColor)
      });

  yGuide = d3.select('#viz svg').append('g')
            .attr('transform', 'translate(40,0)')
            .call(yAxisTicks)

  xGuide = d3.select('#viz svg').append('g')
            .attr('transform', 'translate(40,'+ height + ')')
            .call(xAxisTicks)

  var clinicalCutOffValue = 2480;
  var guideScale = d3.scaleLinear()
                .domain([0, d3.max(temperatures)])
                .range([height,0]);
  var clinicalCutOffLineAndText = d3.select('#viz svg').append("g")
  .attr('transform', 'translate(40,0)')
  .append("line")
      .attr("class", "clinical-cut-off-line")
      .attr("x1", 0)
      .attr("y1", guideScale(clinicalCutOffValue))
      .attr("x2", width)
      .attr("y2", guideScale(clinicalCutOffValue))
      .on('mouseover', function(d) {
          tooltip.transition().duration(200)
            .style('opacity', .9)
          tooltip.html(
              '<div style="font-size: 2rem; font-weight: bold">' +
                clinicalCutOffValue + ' kcal</div>'
          )
          .style('left', (d3.event.pageX -35) + 'px')
          .style('top', (d3.event.pageY -30) + 'px')
      })
      .on('mouseout', function(d) {
          tooltip.html('')
      });

  myChart.transition()
    .attr('height', function(d) {
      return yScale(d);
    })
    .attr('y', function(d) {
      return height - yScale(d);
    })
    // .delay(function(d, i) {
      // return i * 20;
    // })
    // .duration(1000)
    // .ease(d3.easeBounceOut)

}); // json import
