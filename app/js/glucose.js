d3.json('/js/data/glucose.json', function(error, data) {
    if (error) throw error;
    var parseTime = d3.timeParse("%d/%m/%y");
    var dates = [];
    var values = [];

    data.forEach(function(d) {
      d.date = parseTime(d.date);
      dates.push(d.date);
      values.push(d.value);
    });

    var margin = { top: 10, right: 0, bottom: 30, left: 30 },
        height = 400 - margin.top - margin.bottom,
        width = 600 - margin.left - margin.right;

    d3.select('#viz').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)

    var xAxisValues = d3.scaleTime()
        .domain([dates[0],dates[(dates.length-1)]])
        .range([0, width-(margin.right+margin.left)]);

    var xAxisTicks = d3.axisBottom(xAxisValues)
        .ticks(d3.timeWeek.every(1));
    // console.log(d3.max(values));
    var yAxisValues = d3.scaleLinear()
        // .domain([0, d3.max(values)])
        .domain([0, 300])
        .range([height,0]);

    var yAxisTicks = d3.axisLeft(yAxisValues)
        .ticks(10)
    var svg = d3.select("svg");


    var x = d3.scaleLinear().range([0, width - (margin.left + margin.right)]);
    // var y = d3.scaleLinear().range([height - (margin.top * 2), 0]);
    var y = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
        .attr("id", "plot")
        .attr("transform", "translate(" + margin.left+ "," + margin.top+ ")");

    // x.domain(d3.extent(data, function(d) { return d.module; }));
    x.domain(d3.extent(data, function(d) { return d.date; }));
    // y.domain([
    //   (Math.floor(d3.min(data, function(d) { return d.value; }) / 10) * 10),
    //   (Math.ceil(d3.max(data, function(d) { return d.value; }) / 10) * 10)
    // ]);
    y.domain([0, 300]);
    // add the Y gridlines
    g.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
          // .tickSize(-width-margin.right)
          .tickSize(-width+margin.left)
          .tickFormat("")
        );
    var Dots = g.append("g")
        // .attr("transform", "translate(" + ((margin.left + margin.right) / 2) + "," + 0 + ")")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .selectAll("circle")
    	.data(data).enter()
        .append("circle")
            .attr("class", "data-circle")
            .attr("r", 5)
        // .attr("cx", function(d) { return x(d.module); })
            .attr("cx", function(d) { return x(d.date); })
            .attr("cy", function(d) { return y(d.value); });

    var xGuide = d3.select('#viz svg').append('g')
                .attr('class', 'xAxis')
                .attr('transform', 'translate('+ margin.left +','+ (height + margin.top)+ ')')
                // .attr('transform', 'translate(20,'+ 370 + ')')
                .call(xAxisTicks)

    var yGuide = d3.select('#viz svg').append('g')
                .attr('class', 'yAxis')
                .attr('transform', 'translate('+ margin.left +','+ margin.top +')')
                .call(yAxisTicks)
    var clinicalCutOffLineAndText = g.append("g")
        // .attr("class", "clinical-cut-off-line-and-text")
        // Clinicial cut off line
    var clinicalCutOffValue = 70;
    clinicalCutOffLineAndText.append("line")
        .attr("class", "clinical-cut-off-line")
        .attr("x1", 0)
        .attr("y1", y(clinicalCutOffValue))
        .attr("x2", width-margin.left)
        .attr("y2", y(clinicalCutOffValue));
}); // json import
