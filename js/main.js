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

    var xScale = d3.scaleBand();

	var yScale = d3.scaleLinear();

	var xAxisLabel = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + (height - margin.top) + ')')
        .attr('class', 'axis');

    var yAxisLabel = svg.append('g')
    	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    	.attr('class', 'axis');

    var xAxis = d3.axisBottom();

	var yAxis = d3.axisLeft()
		.tickFormat(d3.format('.2s'));

	var xAxisText = svg.append('text')
		.attr('transform', 'translate(' + (margin.left + drawWidth / 2) + ',' + (drawHeight + margin.top + 40) + ')')
		.attr('font-weight', 'bold')
		.attr('font-size', 11)
		.text('Year');

	var yAxisText = svg.append('text')
		.attr('transform', 'translate(' + margin.left + ',' + (margin.top - 10) + ')')
		.attr('class', 'title');

	var title = svg.append('text')
		.attr('transform', 'translate(' + (20 + drawWidth/4 ) + ',' + (margin.top - 40) + ')')
		.attr('class', 'title')
		.attr('font-size', 18)
		.attr('font-weight', 'bold');

	var keyTitle = svg.append('text')
		.attr('transform', 'translate(' + (width - 97) + ',' + (margin.top + 10) + ')')
		.attr('font-size', 11)
		.attr('font-weight', 'bold')
		.attr('class', 'title')
		.text('Age Groups');

	var color = d3.scaleOrdinal()
		.range(['#868fb6', '#526492', '#36455c']);

	d3.csv('data/child-death-of-prematurity.csv', function(d, i, columns) {
		for (i = 2, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
			d.total = t;
		return d;
	},	function(error, allData) {

		var years = allData.map(function(d) { return(d['Year']); });
		uniqueYear = years.filter(function(elem, pos) { return years.indexOf(elem) == pos; });
		
		xScale.domain(uniqueYear.reverse())
				.rangeRound([0, drawWidth])
				.paddingInner(0.05)
				.align(0.1);


		var keys = allData.columns.slice(2);

		var legend = g.append('g')
				.attr('font-size', 10)
				.attr('text-anchor', 'end')
			  .selectAll('g')
			  .data(keys.slice())
			  .enter().append('g')
			  	.attr('transform', function(d, i) { return 'translate(0,' + (-i*20+60) + ')'; });

			legend.append('rect')
				.attr('x', drawWidth - 5)
				.attr('width', 20)
				.attr('height', 20)
				.attr('fill', color);

			legend.append('text')
				.attr('x', drawWidth - 15)
				.attr('y', 9.5)
				.attr('dy', '0.32em')
				.text(function(d) {return d; });

		
		var filterData = function() {
			var currentData = allData.filter(function(d) {
				return d.Region == region;
			});
			return currentData;
		};

		/*yScale.domain([0, d3.max(allData, function(d) {return d.total; })]).nice()
				.rangeRound([drawHeight, 0]);
			color.domain(keys);

		xAxis.scale(xScale);
		yAxis.scale(yScale);

		xAxisLabel.call(xAxis);
		yAxisLabel.call(yAxis);*/

		var draw = function(data) {
			//data.sort(function(a,b) { return b.total - a.total; });
			svg.selectAll('.stack').remove();
			
			yScale.domain([0, d3.max(data, function(d) {return d.total; })]).nice()
				.rangeRound([drawHeight, 0]);
			color.domain(keys);

			xAxis.scale(xScale);
			yAxis.scale(yScale);

			xAxisLabel.transition().duration(1000).call(xAxis);
			yAxisLabel.transition().duration(1000).call(yAxis);

			svg.append('text');
				
			title.text('Child Mortality Rate Caused by Prematurity in ' + region);

			yAxisText.attr('x', 2)
			 	.attr('y', yScale(yScale.ticks().pop()) + 0.5)
			 	.attr('dy', '0.32em')
			 	.attr('fill', '#000')
			 	.attr('font-size', 11)
			 	.attr('font-weight', 'bold')
			 	.attr('text-anchor', 'start')
			 	.text('Deaths per 1 000 live births');

			var stack = g.append('g').selectAll('g').data(d3.stack().keys(keys)(data));

			stack.enter().append('g').attr('class', 'stack')
			 	.attr('fill', function(d) { return color(d.key); })
			 .selectAll('rect')
			 .data(function(d) { return d; })
			 .enter().append('rect')
			 	.attr('x', function(d) { return xScale(d.data.Year); })
			 	.attr('y', function(d) { return drawHeight; })
			 	.attr('height', 0)
				.merge(stack)
				.transition()
			 	.duration(1500)
			 	.attr('y', function(d) { return yScale(d[1]); })
			 	.attr('height', function(d) { return yScale(d[0]) - yScale(d[1]); })
			 	.attr('width', xScale.bandwidth());
		};
		

		$('input').click(function() {
			region = $(this).val();

			var currentData = filterData();
			draw(currentData);
		});

		var currentData = filterData();
		draw(currentData);

	});

});