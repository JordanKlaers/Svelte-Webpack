<div ref="chart-container" id="chart" class="chart-container"></div>
<!-- <button on:click={animate}>animate</button> -->
<script>
	const d3 = require('d3');
	import { onMount } from 'svelte';
	
	'use strict';

	onMount(() => {
		underlyingFundsBarChart({
			chartId: "#chart",
			datapoints: [
				{ shape: "triangle",	color: "orange",	return: 85,	volatility: 1 },
				{ shape: "square",		color: "orange",	return: 73,	volatility: 2 },
				{ shape: "circle",		color: "orange",	return: 52,	volatility: 3 },
				{ shape: "triangle",	color: "green",		return: 18, volatility: 14 },
				{ shape: "square",		color: "green",		return: 16, volatility: 13 },
				{ shape: "circle",		color: "green",		return: 13, volatility: 16 },
				{ shape: "triangle",	color: "purple",	return: 85, volatility: 27 },
				{ shape: "square",		color: "purple",	return: 82, volatility: 32 },
				{ shape: "circle",		color: "purple",	return: 71, volatility: 43 },
				{ shape: "triangle",	color: "blue",		return: 90, volatility: 60 },
				{ shape: "square",		color: "blue",		return: 88, volatility: 56 },
				{ shape: "circle",		color: "blue",		return: 85, volatility: 43 },
				{ shape: "triangle",	color: "pink",		return: 30, volatility: 30 },
				{ shape: "square",		color: "pink",		return: 40, volatility: 40 },
				{ shape: "circle",		color: "pink",		return: 50, volatility: 50 }
			]
		});
	})

	var underlyingFundsBarChart = function (config) {
		
		/*-----------------------
			variables
		-----------------------*/
		var svgVBHeight = 1000;
		var svgVBWidth = 1000;

		var tickStep = 10;
		var yTicks = 10;
		var xTicks = 10;
		var tickStrokeThickness = 4;

		var yAxisXPosition = svgVBWidth * 0.14;
		var xAxisYPosition = svgVBHeight - (svgVBHeight * 0.16);

		var xScale = d3.scaleLinear()
			.domain([0, 100])
			.range([yAxisXPosition, svgVBWidth]);
		var yScale = d3.scaleLinear()
			.domain([0, 100])
			.range([xAxisYPosition, 0]);

		// Styles
		var axisBGColor = "#f3f3f3";
		var axisTickColor = "#f3f3f3";
		var axisTickColorInverse = "white";
		var chartBGColor = "white";
		var chartFavorableBGColor = axisBGColor;
		var axisTicksFontSize = 20;
		var axisTickGap = 10;
		var axisLabelGap = 20;
		var axisLabelFontSize = 23;

		/*-----------------------
			Data
		-----------------------*/



		/*-----------------------
			render svg, axies, background
		-----------------------*/
		var svg = d3.select(config.chartId)
			.append("svg")
			.attr("viewBox", "0 0 " + svgVBWidth + " " + svgVBHeight)
			.attr("preserveAspectRatio", "xMidYMid meet");

		svg.append("rect")
			.attr("width", yAxisXPosition)
			.attr("height", svgVBHeight)
			.attr("fill", axisBGColor)
		svg.append("rect")
			.attr("width", svgVBWidth)
			.attr("height", svgVBHeight - xAxisYPosition)
			.attr("y", xAxisYPosition)
			.attr("fill", axisBGColor)
		
		//add axies and style
		var horizontalGradient = svg.append('defs')
			.append('linearGradient')
			.attr('id', 'y-line-gradient')
		horizontalGradient.append('stop')
			//This offst is half the width of the graph + half the width of the tick, so that the white does not render over the gray of the other tick
			//The vertical axis does not need this because it is renderd under the horizontal ticks so it cant be seen
			.attr("offset", `${(50 + (tickStrokeThickness / (svgVBWidth - yAxisXPosition) * 100) / 2)}%`)
			.attr('stop-color', axisTickColor);
		horizontalGradient.append('stop')
			.attr("offset", `${((50 + (tickStrokeThickness / (svgVBWidth - yAxisXPosition) * 100) / 2)) + 0.0000001}%`)
			.attr('stop-color', axisTickColorInverse);

		var verticalGradient = svg.append('defs')
			.append('linearGradient')
			.attr('id', 'x-line-gradient')
			.attr("x1", "0%")
			.attr("x2", "0%")
			.attr("y1", "0%")
			.attr("y2", "100%")
		verticalGradient.append('stop')
			.attr("offset", "49.9999%")
			.attr('stop-color', axisTickColorInverse);
		verticalGradient.append('stop')
			.attr("offset", "50%")
			.attr('stop-color', axisTickColor);

		svg.append("rect")
			.attr("x", yAxisXPosition + ((svgVBWidth - yAxisXPosition) / 2))
			.attr("width", (svgVBWidth - yAxisXPosition) / 2)
			.attr("y", "0")
			.attr("height", xAxisYPosition / 2)
			.attr("fill", chartFavorableBGColor);

		var xAxis = d3.axisBottom()
			.scale(xScale)
			.tickFormat(value => `${value}%`);
		var yAxis = d3.axisLeft()
			.scale(yScale)
			.tickFormat(value => `${value}%`);
		svg.append("g")
			.attr("class", "x-axis")
			.attr("style", `font-size: ${axisTicksFontSize}`)
			.attr("transform", "translate(0, " + xAxisYPosition + ")")
			.call(xAxis)
			.call(a => {
				a.select(".domain").remove();
			});
		svg.append("g")
			.attr("class", "y-axis")
			.attr("style", `font-size: ${axisTicksFontSize}`)
			.attr("transform", "translate(" + yAxisXPosition + ", 0)")
			.call(yAxis)
			.call(a => {
				a.select(".domain").remove();
			});

		d3.selectAll('.y-axis .tick line')
			.each(function (d, i) {
				d3.select(this)
					.attr("y1", "0")
					.attr("y2", "0.000000000000000000000001")
					.attr("x1", "0")
					.attr("x2", svgVBWidth - yAxisXPosition)
					.attr("stroke-width", tickStrokeThickness)
					.attr("stroke", axisTickColor);
				if (i > (yTicks / 2) && i < yTicks) d3.select(this).attr("stroke", "url(#y-line-gradient)");
			})
		d3.selectAll('.x-axis .tick line')
			.each(function (d, i) {
				d3.select(this)
					.attr("y1", "0")
					.attr("y2", -xAxisYPosition)
					.attr("x1", "0")
					.attr("x2", "0.000000000000000000000001")
					.attr("stroke-width", tickStrokeThickness)
					.attr("stroke", axisTickColor);
				if (i > (xTicks / 2) && i < xTicks) d3.select(this).attr("stroke", "url(#x-line-gradient)");
			})
		d3.select(".y-axis .tick:last-of-type text")
			.attr("transform", function() {
				return `translate(0 ${this.getBBox().height / 2})`;
			});
		d3.selectAll(".x-axis .tick text")
			.attr("transform", function(d, i) {
				return i == xTicks
					? `translate(-${this.getBBox().width / 2} ${axisTickGap})`
					: `translate(0 ${axisTickGap})`;
			});
		
		svg.append('text')
			.attr("class", "x-label")
			.attr("text-anchor", "middle")
			.attr("x", ((svgVBWidth - yAxisXPosition) / 2) + yAxisXPosition)
			// .attr("y", 0)
			.attr("y", xAxisYPosition + axisLabelFontSize + axisTicksFontSize + axisTickGap + axisLabelGap)
			.attr("style", `font-size: ${axisLabelFontSize}`)
			.text("Volatility Success vs. Morningstar Peer Averages");

		svg.append('text')
			.attr("class", "y-label")
			.attr("text-anchor", "middle")
			.attr("x", yAxisXPosition / 3)
			.attr("y", xAxisYPosition / 2)
			.attr("style", `font-size: ${axisLabelFontSize};`)
			.attr("transform", `rotate(-90 ${yAxisXPosition / 3} ${xAxisYPosition / 2})`)
			.text("Volatility Success vs. Morningstar Peer Averages");

		svg.append("text")
			.attr("text-anchor", "end")
			.attr("x", svgVBWidth - 30)
			.attr("y", 30)
			.attr("style", `font-size: ${axisLabelFontSize};`)
			.text("Higher Success of Returns and Volatility");

		/*-----------------------
			Render data points
		-----------------------*/
		var shapeScale = 30;
		//point to pixel. call ".invert" for pixel to pt
		var verticalConversion = d3.scaleLinear()
			.domain([0, svgVBHeight])
			.range([0, document.querySelector("#chart").clientHeight]);
		var horizontalConversion = d3.scaleLinear()
			.domain([0, svgVBWidth])
			.range([0, document.querySelector("#chart").clientWidth]);

		svg.selectAll('.data-point')
			.data(config.datapoints)
			.enter()
			.append("path")
			.attr("class", "data-point")
			.attr("d", function (d) {
				if (d.shape == 'triangle') return `M0,0 L${1 * shapeScale},0 L${0.5 * shapeScale},${0.866 * shapeScale} L0,0`;
				if (d.shape == 'square') return `M0,0 L${0.866 * shapeScale},0 L${0.866 * shapeScale},${0.866 * shapeScale} L0,${0.866 * shapeScale} L0,0`;
				if (d.shape == "circle") return `M0,${0.433 * shapeScale} a${0.433 * shapeScale},${0.433 * shapeScale} 0 1,1 ${0.866 * shapeScale},${0 * shapeScale} a${0.433 * shapeScale},${0.433 * shapeScale} 0 1,1 ${0.866 * -shapeScale},${0 * shapeScale}`;
			})
			.attr("transform", function (d) {
				//return is y value

				var position = `translate(${xScale(d.volatility - 1.5)}, ${yScale(d.return + 1.299)})`
				// if (d.shape == "triangle") position += `rotate(60 ${xScale(d.volatility - 1.5)}, ${yScale(d.return + 1.299)})`;
				return position;
			})
			.attr("fill", function (d) {
				return d.color;
			})
			.attr("stroke-width", "5")
			.on("mouseover", function(d, i) {
				d3.select(`#data-point-hover-${i}`)
					.classed("visible", true);
			})
			.on("mouseout", function(d, i) {
				d3.select(`#data-point-hover-${i}`)
					.classed("visible", false);
			});

		d3.select("#chart")
			.selectAll('.chart-hover')
			.data(config.datapoints)
			.enter()
			.append("div")
			.attr("class", "chart-hover")
			.attr("id", function(d,i) { return `data-point-hover-${i}` })
			.attr("style", function (d) {
				return `top: ${verticalConversion(yScale(d.return))}px; left: ${horizontalConversion(xScale(d.volatility))}px; transform: translateY(-33%) translateX(20px)`;
			})
			.html(`
				<div>T. Rowe Price Retirement Series</div>
				<div>2020 Vintage</div>
				<dl>
					<div><dd>72%</dd><dt>Return Success</dt></div>
					<div><dd>41%</dd><dt>Volatility Success</dt></div>
				</dl>
			`);
			
		window.addEventListener('resize', function () {
			verticalConversion = d3.scaleLinear()
				.domain([0, svgVBHeight])
				.range([0, document.querySelector("#chart").clientHeight]);
			horizontalConversion = d3.scaleLinear()
				.domain([0, svgVBWidth])
				.range([0, document.querySelector("#chart").clientWidth]);
			d3.selectAll('.chart-hover')
				.attr("style", function (d) {
					return `top: ${verticalConversion(yScale(d.return))}px; left: ${horizontalConversion(xScale(d.volatility))}px; transform: translateY(-33%) translateX(20px)`;
				});
		})
	};

</script>

<style type="text/scss">
:global(.chart-container) {
	position: relative;
	width: 100%;

	&:before {
		display: block;
		content: " ";
		width: 100%;
		padding-top: 100%;
	}
	svg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		.stop-left {
			stop-color: #3f51b5;  /* Indigo */
		}

		.stop-right {
			stop-color: #009688;  /* Teal */
		}

		.filled {
			fill: url(#mainGradient);
			stroke: url(#mainGradient);
		}
		.data-point:hover {
			cursor: pointer;
		}
	}
	.chart-hover {
		visibility: hidden;
		position: absolute;
		border: 1px solid gray;
		background-color: white;
		padding: 7px;
		width: 170px;
		&.visible {
			visibility: visible;
		}
		& > :global(div:first-of-type ) {
			font-weight: bold;
		}
		& > :global(div) {
			margin-bottom: 10px;
		}
		dl {
			margin: 0;
			dd {
				display: inline-block;
				margin: 0 10px 0 0;
			}
			dt {
				display: inline-block;
			}
		}
	}
}

</style>