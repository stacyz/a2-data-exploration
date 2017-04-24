$(function() {
	var width = 960,
		height = 700,
		region = 'Africa Region';

	var margin = {
		left: 70,
		bottom: 100,
		top: 100,
		right: 50,
	};

	var drawHeight = height - margin.bottom - margin.top,
		drawWidth = width - margin.left - margin.right;

	var svg = d3.select('#vis')
		.append('svg')
		.attr('height', height)
		.attr('width', width);

	var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('height', drawHeight)
        .attr('width', drawWidth);

    var x = d3.scaleBand()
		.rangeRound([0, drawWidth])
		.paddingInner(0.05)
		.align(0.1);

	svg.append('text')
        .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
        .attr('class', 'title')
        .text('Year');

	var y = d3.scaleLinear()
		.rangeRound([drawHeight, 0]);

	var color = d3.scaleOrdinal()
		.range(['#868fb6', '#526492', '#36455c']);

	d3.csv('data/child-death-of-prematurity.csv', function(d, i, columns) {
		for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
			d.total = t;
		//console.log(d);
		return d;
	},	function(error, allData) {


		//var regions = allData.map(function(d) { return(d['Region']); });
		//var uniqueRegion = regions.filter(function(elem, pos) { return regions.indexOf(elem) == pos; });
		var years = allData.map(function(d) { return(d['Year']); });
		uniqueYear = years.filter(function(elem, pos) { return years.indexOf(elem) == pos; });
		//console.log(uniqueRegion);
		//console.log(uniqueYear);
		/*uniqueRegion.forEach(function(d) {
			$('section').append('<option></option>');
			$(this).attr('value', d).attr('text', d);
		});*/


		/*uniqueYear.map(function(d) { 
			var option = $('section').append('<option></option>');
			$('option').attr('value', d);
		});*/
		


		var keys = allData.columns.slice(2);
		//console.log(keys);


		

        /*var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
            .attr('class', 'axis');

        // Append a yaxis label to your SVG, specifying the 'transform' attribute to position it (don't call the axis function yet)
        var yAxisLabel = svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top) + ')');

        // Append text to label the y axis (don't specify the text yet)
        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
            .attr('class', 'title');

        // Append text to label the y axis (don't specify the text yet)
        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight / 2) + ') rotate(-90)')
            .attr('class', 'title');

        //var xAxis = d3.axisBottom();

        var yAxis = d3.axisLeft();

		var xScale = d3.scaleBand();

		var y = d3.scaleLinear();*/

		//var color = d3.scaleOrdinal(d3.schemeCategory20c);

		

		var filterData = function() {
			var currentData = allData.filter(function(d) {
				return d.Region == region;
			});
			return currentData;
		};

		var draw = function(data) {
			//data.sort(function(a,b) { return b.total - a.total; });
			x.domain(uniqueYear.reverse());
			y.domain([0, d3.max(data, function(d) {return d.total; })]).nice();
			color.domain(keys);

			svg.append('text')
				.attr('transform', 'translate(' + (20 + drawWidth/4 ) + ',' + (margin.top - 40) + ')')
				.attr('class', 'title')
				.attr('font-size', 18)
				.attr('font-weight', 'bold')
				.text('Child Mortality Rate Caused by Prematurity in ' + region);

			//console.log(data);
			g.append('g')
			 .selectAll('g')
			 .data(d3.stack().keys(keys)(data))
			 .enter().append('g')
			 	.attr('fill', function(d) { return color(d.key); })
			 .selectAll('rect')
			 .data(function(d) { return d; })
			 .enter().append('rect')
			 	.attr('x', function(d) { return x(d.data.Year); })
			 	.attr('y', function(d) { return y(d[1]); })
			 	.attr('height', function(d) { return y(d[0]) - y(d[1]); })
			 	.attr('width', x.bandwidth());
			//console.log(data);

			g.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(0,' + drawHeight + ')')
				.call(d3.axisBottom(x));

			g.append('g')
				.attr('class', 'axis')
				.call(d3.axisLeft(y).ticks(null, 's'))
			 .append('text')
			 	.attr('x', 2)
			 	.attr('y', y(y.ticks().pop()) + 0.5)
			 	.attr('dy', '0.32em')
			 	.attr('fill', '#000')
			 	.attr('font-size', 11)
			 	.attr('font-weight', 'bold')
			 	.attr('text-anchor', 'start')
			 	.text('Deaths per 1 000 live births');

			var legend = g.append('g')
				.attr('font-size', 10)
				.attr('text-anchor', 'end')
			  .selectAll('g')
			  .data(keys.slice().reverse())
			  .enter().append('g')
			  	.attr('transform', function(d, i) { return 'translate(0,' + i*20 + ')'; });

			legend.append('rect')
				.attr('x', drawWidth - 19)
				.attr('width', 20)
				.attr('height', 20)
				.attr('fill', color);

			legend.append('text')
				.attr('x', drawWidth - 24)
				.attr('y', 9.5)
				.attr('dy', '0.32em')
				.text(function(d) {return d; });
		}
		




		

		$('input').on('change', function() {
			yr = $(this).val();

			var currentData = filterData();
			draw(currentData);
		});

		var currentData = filterData();
		//console.log(currentData);
		draw(currentData);









	});

});