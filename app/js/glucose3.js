
function updateData() {
    d3.select("#viz").html("");
    // d3.select("viz").selectAll("*").remove();
    d3.json('/js/data/out3.json', function(error, data) {
        if (error) throw error;
        console.log("this is glucose3");
        var path = window.location.pathname;
        // console.log(path);

        var re = /\/user\/([0-9]+)/;
        var match = re.exec(path);
        var id = match[1];
        // console.log(id);
        var p = data.filter(d => d.PatientId === 'Patient/'+id)[0];
        // console.log(p);
        d3.select("#username").text(p.DisplayName);

        // console.log(p.EffectiveTimes);
        var pTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
        var dates = p.EffectiveTimes.map(t => pTime(t.slice(13, 32)));
        // var dates_array = dates.map(d =>  d.toISOString().slice(0,10)   );
        var dates_array = dates.map(d =>  d.toDateString()   );
        var unique_dates = Array.from(new Set(dates_array))
        var dates_obj = [];
        for (var i = 0; i < unique_dates.length; i++) {
            var o = new Object();
            o[unique_dates[i]] = [];
            // o.values = [];
            dates_obj.push(o);
        }
        // console.log(p.Values);
        // console.log(unique_dates);
        // console.log(dates_array);

        for (var i = 0; i < dates.length; i++) {
            for (var j = 0; j < dates_obj.length; j++) {
                // console.log(Object.keys(dates_obj[j])[0]);
                var k = Object.keys(dates_obj[j])[0];
                if (dates_array[i] === k) {
                    var o = new Object();
                    o.date = dates[i];
                    o.date_string = p.EffectiveTimes[i].slice(13, 32);
                    o.value = p.Values[i];
                    dates_obj[j][k].push(o);
                    // dates_obj[j].values.push(p.Values[i]);
                }
            }
        }
        // console.log(dates_obj);
        // <option value="">--Please choose an option--</option>
        // <option value="dog">Dog</option>
        // <option value="cat">Cat</option>
        // <option value="hamster">Hamster</option>
        // <option value="parrot">Parrot</option>
        // <option value="spider">Spider</option>
        // <option value="goldfish">Goldfish</option>
         // console.log(dates[0].toISOString().slice(0,10));
        d3.select("#date-select")
          .selectAll("option")
          .data(unique_dates)
          .enter()
          .append("option")
          .attr("value", function(d, i) {return i;})
          .text(function(d) {return d;});
        var date_idx = parseInt($('#date-select').val());
        // console.log(date_idx);
        // console.log(dates);
        // console.log(pTime("2104-11-17T07:44:00"));
        var values = p.Values;
        // console.log(p.Values);
        // console.log(data[0].PatientId === 'Patient/'+id);
        // var records = [];
        // for (var i = 0; i < p.Values.length; i++) {
        //     records.push({date: dates[i], value: values[i]});
        // }
        // console.log(records);

        var margin = { top: 10, right: 0, bottom: 30, left: 30 },
            height = 400 - margin.top - margin.bottom,
            width = 600 - margin.left - margin.right;

        d3.select('#viz').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
        // console.log(dates[0]);
        // console.log(p.EffectiveTimes);
        // console.log(dates_obj[date_idx][unique_dates[date_idx]][0].date_string);
        // var start_time = dates_obj[date_idx][unique_dates[date_idx]][0].date_string.slice(0,11)+"00:00:00";
        var start_time = dates_obj[date_idx][unique_dates[date_idx]][0].date;
        // var end_time = dates_obj[date_idx][unique_dates[date_idx]][dates_obj[date_idx][unique_dates[date_idx]].length-1].date_string.slice(0,11)+"23:59:59"
        var end_time = dates_obj[date_idx][unique_dates[date_idx]][dates_obj[date_idx][unique_dates[date_idx]].length-1].date;
        // console.log(d3.timeHour.offset(start_time, -4));
        // console.log(start_time);
        // console.log(d3.timeHour.offset(start_time, +4));
        var time_range = [d3.timeHour.offset(start_time, -4),
        d3.timeHour.offset(end_time, +4)];
        // console.log(dates_obj[date_idx][unique_dates[date_idx]][dates_obj[date_idx][unique_dates[date_idx]].length-1]);
        var xAxisValues = d3.scaleTime()
            .domain([
                d3.timeHour.offset(start_time, -4),
                d3.timeHour.offset(end_time, +4)
            ])
            .range([0, width-(margin.right+margin.left)]);

        var xAxisTicks = d3.axisBottom(xAxisValues)
            // .ticks(d3.timeWeek.every(1));
            .ticks(d3.timeHour.every(2))
            ;
        // console.log(d3.max(values));
        var yAxisValues = d3.scaleLinear()
            // .domain([0, d3.max(values)])
            .domain([0, 350])
            .range([height,0]);

        var yAxisTicks = d3.axisLeft(yAxisValues)
            .ticks(10)
        var svg = d3.select("svg");

        var tooltip = d3.select('body')
                      .append('div')
                      .style('position', 'absolute')
                      .style('padding', '0 10px')
                      .style('background', 'white')
                      .style('opacity', 0);
        var x = d3.scaleLinear()
                   // .domain(time_range)
                   .range([0, width - (margin.left + margin.right)]);
        // var y = d3.scaleLinear().range([height - (margin.top * 2), 0]);
        var y = d3.scaleLinear().range([height, 0]);

        var fillColor = function(v) {
            if (v > 180) {
                return "#FF5733";
            } else if (v > 120) {
                return "#FFC300";
            } else if (v > 70) {
                return "#DAF7A6";
            } else if (v > 50) {
                return "#FFC300";
            } else {
                return "#000000";
            }
        }
        var g = svg.append("g")
            .attr("id", "plot")
            .attr("transform", "translate(" + margin.left+ "," + margin.top+ ")");

        // x.domain(d3.extent(data, function(d) { return d.module; }));
        // console.log("here");
        // x.domain(d3.extent(dates_obj[date_idx][unique_dates[date_idx]], function(d) { return d.date; }));
        x.domain(time_range);
        // y.domain([
        //   (Math.floor(d3.min(data, function(d) { return d.value; }) / 10) * 10),
        //   (Math.ceil(d3.max(data, function(d) { return d.value; }) / 10) * 10)
        // ]);
        y.domain([0, 350]);
        // add the Y gridlines
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
              // .tickSize(-width-margin.right)
              .tickSize(-width+margin.left)
              .tickFormat("")
            );
        // console.log(dates_obj[date_idx][unique_dates[date_idx]]);
        // console.log(records);
        var Dots = g.append("g")
            // .attr("transform", "translate(" + ((margin.left + margin.right) / 2) + "," + 0 + ")")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .selectAll("circle")
        	// .data(records).enter()
        	.data(dates_obj[date_idx][unique_dates[date_idx]]).enter()
            .append("circle")
                .attr("class", "data-circle")
                .attr("r", 5)
                .attr("cx", function(d) { return x(d.date); })
                // .attr("cx", function(d) { return d.date; })
                .attr("cy", function(d) { return y(d.value); })
                .attr("fill", function(d) { return fillColor(d.value);})
                .on('mouseover', function(d) {
                    tooltip.transition().duration(200)
                      .style('opacity', .9)
                    tooltip.html(
                        '<div style="font-size: 2rem; font-weight: bold">' +
                          d.value + ' mg/dL</div>'
                    )
                    .style('left', (d3.event.pageX -35) + 'px')
                    .style('top', (d3.event.pageY -30) + 'px')
                })
                .on('mouseout', function(d) {
                    tooltip.html('')
                });

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
            .attr("y2", y(clinicalCutOffValue))
            .on('mouseover', function(d) {
                tooltip.transition().duration(200)
                  .style('opacity', .9)
                tooltip.html(
                    '<div style="font-size: 2rem; font-weight: bold">' +
                      clinicalCutOffValue + ' mg/dL</div>'
                )
                .style('left', (d3.event.pageX -35) + 'px')
                .style('top', (d3.event.pageY -30) + 'px')
            })
            .on('mouseout', function(d) {
                tooltip.html('')
            });
        var clinicalCutOffValue2 = 120;
        clinicalCutOffLineAndText.append("line")
            .attr("class", "clinical-cut-off-line")
            .attr("x1", 0)
            .attr("y1", y(clinicalCutOffValue2))
            .attr("x2", width-margin.left)
            .attr("y2", y(clinicalCutOffValue2))
            .on('mouseover', function(d) {
                tooltip.transition().duration(200)
                  .style('opacity', .9)
                tooltip.html(
                    '<div style="font-size: 2rem; font-weight: bold">' +
                      clinicalCutOffValue2 + ' mg/dL</div>'
                )
                .style('left', (d3.event.pageX -35) + 'px')
                .style('top', (d3.event.pageY -30) + 'px')
            })
            .on('mouseout', function(d) {
                tooltip.html('')
            });
    }); // json import
}

updateData();



$('#legend2').hover(
    function() {

    $('#l1').text('Seek immediate medical attention');
    $('#l2').text('Seek medical attention');
    $('#l3').text('Consult your doctor');
    $('#l4').text('No action needed');
    $('#l5').text('Consult your doctor');
    $('#l6').text('Seek medical attention');
    // console.log(l1.text());
    // l1.text();

    },
    function() {
    $('#l1').text('Dangerously high');
    $('#l2').text('High');
    $('#l3').text('Borderline');
    $('#l4').text('Normal');
    $('#l5').text('Low');
    $('#l6').text('Dangerously low');
    }
);



// const original_html = '<div class="legend2"> <p><span class="key-dot danger"></span>Dangerously high</p> </div><div class="legend2"> <p><span class="key-dot high"></span>High</p> </div><div class="legend2"> <p><span class="key-dot borderline"></span>Borderline</p> </div><div class="legend2"> <p><span class="key-dot normal"></span>Normal</p> </div><div class="legend2"> <p><span class="key-dot low"></span>low</p> </div><div class="legend2"> <p><span class="key-dot danger"></span>Dangerously low</p> </div>';
//
// $('#legend2').hover(
//     function() {
//         var replace_html = '<div class="legend2"> <p><span class="key-dot danger"></span>Seek immediate medical attention</p> </div> <div class="legend2"> <p><span class="key-dot high"></span>Seek medical attention</p> </div><div class="legend2"> <p><span class="key-dot borderline"></span>Consult your doctor</p> </div><div class="legend2"> <p><span class="key-dot normal"></span>No action needed</p> </div><div class="legend2"> <p><span class="key-dot low"></span>Consult your doctor</p> </div><div class="legend2"> <p><span class="key-dot danger"></span>Seek medical attention</p> </div>';
//         var $this = $(this); // caching $(this)
//         $this.html(replace_html);
//     },
//     function() {
//         console.log('unhover');
//         // console.log(original_html);
//         var $this = $(this); // caching $(this)
//         $this.html(original_html);
//     }
// );
