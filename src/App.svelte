<div id="chart" class="chart-container"></div>
<button on:click={animate}>animate</button>
<script>
	const d3 = require('d3');
	import { onMount } from 'svelte';
	let container;
	var dataset = [
		{ name: 'green', percent: 50 },
		{ name: 'pink', percent: 50 }
		// { date: '20', percent: 13.68 },
		// { date: '30', percent: 8.71 },
		// { date: '40', percent: 6.01 }
	];
	var animationDuration = 2000;
	var animationSliceDelay = 0;
	let width = 300;
	let height = 300;
	let radius = (width-2)/2;
	let highlightIndex = 0;
	var w=300,h=300;
	var highlightOuterRadius=w/2;
	var highlightInnerRadius=90;
	var donutOuterRadius = highlightOuterRadius - 10;
	var donutInnerRadius = highlightInnerRadius + 10
	var path;
	var highlightedPaths;
	var highlightedArc;
	var arc;

	onMount(()=> { 

		for (let entry  of dataset) {
			entry.delay = animationSliceDelay
			entry.duration = (entry.percent / 100) * animationDuration
			animationSliceDelay += (entry.percent / 100) * animationDuration
		}

	var pie=d3.pie()
		.value(function(d){return d.percent})
		.sort(null)
		.padAngle(0.01);



	arc=d3.arc()
		.outerRadius(donutOuterRadius)
		.innerRadius(donutInnerRadius);

	//commenting out the outer and inner methods requires you to set them via the each function by adding outerRadius and innerRadius to the data
	highlightedArc = d3.arc()
		.outerRadius(highlightOuterRadius)
		.innerRadius(highlightInnerRadius);


	var svg = d3.select('#chart')
		.append("svg")
		.attr('width', w)
		.attr('height', h)
		.append('g')
		.attr('transform', `translate(${w/2},${h/2})`);


	path = svg.selectAll('.donutPath')
		.data(pie(dataset))
		.enter()
		.append('path')
		.attr('class', 'donutPath')
		.attr('d', arc)
		.attr('fill', function(d,i){ return d.data.name	});

	//clicking on a donut path will have the highglight path become visible by toggling a visibility class
	//requires the highlighted radius's to be set to the ending outer/inner radius, not changed via the hover event
	path.on("click", (d,i)=> {
		highlightIndex = i;
		highlightedPaths.attr('class', 'highlightPath')
		highlightedPaths.filter((d,i)=> i === highlightIndex)
			.attr('class', 'highlightPath visible')
	})

	//on load, animate the donut
	path.transition()
		.duration(animationDuration)
		.attrTween('d', function(d) {
			const angleInterpolate = d3.interpolate(d.startAngle, d.endAngle);
			const endAng = oldT => {
				const currentDuration = oldT * animationDuration;
				const newT = Math.min(Math.max(currentDuration - d.data.delay, 0), d.data.duration) / d.data.duration;
				return angleInterpolate(newT);
			};
			//changing the start and end angle in the first object to 0 makes every slice appear to grow from the same spot
			var interpolate = d3.interpolate({startAngle: d.startAngle, endAngle: d.startAngle}, d);
			return function(t) {
				d.endAngle = endAng(t)
				return arc(d);
			};
		});


	highlightedPaths = svg.selectAll('.highlightPath')
		.data(pie(dataset))
		.enter()
		.append('path')
		//setting the radius data to match the donut radius
		.each(function(d) {
			d.outerRadius = donutOuterRadius;
			d.innerRadius = donutInnerRadius;
		})
		.attr('class', 'highlightPath visible')
		//dynamic class on load based on selected index
		//function(d,i){ return `highlightPath ${highlightIndex === i ? 'visible' : ''}` })

		//actually  draws the highlighted arcs using the same arc function that draws the main donut arcs
		.attr('d', arc)
		.attr('fill', function(d,i){ return d.data.name });
	

	highlightedPaths
		.on("click", arcTween(0))
		// .on("mouseout", arcTween(donutOuterRadius, donutInnerRadius, 150));

	highlightedPaths.transition()
		.duration(animationDuration)
		.attrTween('d', function(d) {
			const angleInterpolate = d3.interpolate(d.startAngle, d.endAngle);
			const endAng = precentageOfAnimationCompleted => {
				//convert percentage of time passed by length of total animation
				const currentDuration = precentageOfAnimationCompleted * animationDuration;
				//determin if the amount of time passed is greater than the delay of the slice (results in only one slice at a give calculation actually animating) and animate the slice 
				//so if the time passed is 1 second for a two second total animation and there are two slices both with a value of 50%
				//than the second slice (whos duration will take one second, calculated previously) will begin its portion of the animation
				const newT = Math.min(Math.max(currentDuration - d.data.delay, 0), d.data.duration) / d.data.duration;
				console.log('newT??', newT);
				return angleInterpolate(newT);
			};
			// var interpolate = d3.interpolate({startAngle: d.startAngle, endAngle: d.startAngle}, d);
			return function(t) {
				//the use of the arc (or highlightedArc function) in the transition overrides the one used in the base creation of the highlighted arcs
				d.endAngle = endAng(t)
				return arc(d);
			};
		});


	function arcTween(delay) {
		return function() {
			//set all highlighted paths to the same radius as the donut paths
			highlightedPaths.transition()
				.duration(500)
				.delay(delay)
				.attrTween("d", function(d) {
					//interpolate from the radius values on the data object, which are either the initial value that matches the main donut arc radius, which was set on creation
					// or the data value matches the greater radius set from the animation below.
					var outerInterpolate = d3.interpolate(d.outerRadius, donutOuterRadius);
					var innerInterpolate = d3.interpolate(d.innerRadius, donutInnerRadius);
					return function(t) { 
						d.outerRadius = outerInterpolate(t);
						d.innerRadius = innerInterpolate(t);
						var arc = d3.arc()
						return arc(d); };
				});
			//set the highlighted path that was clicked to have the greate radius
			// console.log('d3.select(this)', d3.select(this));
			d3.select(this)
				.transition()
				.duration(500)
				.delay(delay)
				.attrTween("d", function(d) {
					var outerInterpolate = d3.interpolate(d.outerRadius, highlightOuterRadius);
					var innerInterpolate = d3.interpolate(d.innerRadius, highlightInnerRadius);
					return function(t) { 
						d.outerRadius = outerInterpolate(t);
						d.innerRadius = innerInterpolate(t);
						var arc = d3.arc()
						return arc(d); };
				});
		};
	}

	});

	const animate = () => {
		path.transition()
			.duration(animationDuration)
			.attrTween('d', function(d) {
				//changing the start and end angle in the first object to 0 makes every slice appear to grow from the same spot
				var interpolate = d3.interpolate({startAngle: d.startAngle, endAngle: d.startAngle}, d);
				return function(t) {
					return arc(interpolate(t));
				};
			});
		highlightedPaths.each(function(d) {
			d.outerRadius = donutOuterRadius;
			d.innerRadius = donutInnerRadius;
		})
		highlightedPaths.transition()
			.duration(animationDuration)
			.attrTween('d', function(d) {
				var interpolate = d3.interpolate({startAngle: d.startAngle, endAngle: d.startAngle}, d);
				return function(t) {
					//the use of the arc (or highlightedArc function) in the transition overrides the one used in the base creation of the highlighted arcs
					return arc(interpolate(t));
				};
			});
	}


</script>

<style type="text/scss">
.chart-container{
	padding:25px;
}
:global(.highlightPath) {
	opacity: 0.3;
	visibility: hidden;
	&.visible {
		visibility: initial;
	}
}
</style>