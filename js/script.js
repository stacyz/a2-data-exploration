$(function() {
	d3.csv('data/child-death-rate-by-causes.csv', function(error, allData) {


		var years = allData.map(function(d) { return(d['Year']); });
		var uniqueYear = years.filter(function(elem, pos) { return years.indexOf(elem) == pos; });
		console.log(uniqueYear);
		uniqueYear.map(function(d) { 
			var option = $('section').append('<option></option>');
			$('option').attr('value', d);
		});
		
		var width = 960,
			height = 500,
			yr = '2015';

		var x = d3.scaleLinear()
			.range([0, width]);

		var y = d3.scaleLinear()
			.range([0, height]);

		var color = d3.scaleOrdinal(d3.schemeCategory20c);

		var filterData = function() {
			var currentData = allData.filter(function(d) {
				return d.Year == yr;
			});
			return currentData;
		};

		/*var nestData = function(data) {
			d3.nest()
			.key(function(d) {
				return d.Cause;
			})
			.entries(data);
		}
		//console.log(nestedData);

		var getRoot = function(data) {
			d3.hierarchy({
				values: data
			}, function(d) {
				return d.values;
			});
		}
		//console.log(root);*/

		var partition = d3.partition()
			.size([width, height])
			.padding(0)
			.round(true);

		var svg = d3.select('#vis').append('svg')
			.attr('width', width)
			.attr('height', height);

		var rects = svg.selectAll('rect');

		var draw = function(data) {
			var nestedData = d3.nest().key(function(d) {
				return d.Cause;
			})
			.entries(data);
			console.log(nestedData);

			var root = d3.hierarchy({
				values: nestedData
			}, function(d) {
				d.values;
			})
			.sum(function(d) { return d.value; });
			

			partition(root);
			console.log(root.leaves());

			/*rects = rects.data(root.descendants())
				.enter().append('rect')
				.attr('x', function(d) { return d.x0; })
				.attr('y', function(d) { return d.y0; })
				.attr('width', function(d) {return d.x1 - d.x0; })
				.attr('height', function(d) { return d.y1 - d.y0; })
				.attr('fill', function(d) { return color((d.children ? d:d.parent).data.key); })
				.on('click', clicked);*/




		}

		$('input').on('change', function() {
			yr = $(this).val();

			var currentData = filterData();
			draw(currentData);
		});

		var currentData = filterData();
		draw(currentData);









	});

});