$(function() {
	d3.csv('data/child-death-rate-by-causes.csv', function(error, allData) {

		var width = 960,
			height = 500,
			yr = '2015';



		var years = allData.map(function(d) { return(d['Year']); });
		var uniqueYear = years.filter(function(elem, pos) { return years.indexOf(elem) == pos; });
		//console.log(uniqueYear);
		uniqueYear.map(function(d) { 
			var option = $('section').append('<option></option>');
			$('option').attr('value', d);
		});
		
		var filterData = function() {
			var currentData = allData.filter(function(d) {
				return d.Year == yr;
			});
			return currentData;
		};

		var nestData = function(data) {
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
		//console.log(root);

		var partition = d3.partition()
			.size([width, height])

		var draw = function(data) {
			var nestedData = nestData(data);
			var root = getRoot(data);
			
			root.sum(data);

			partition(root);

		}









	});

});