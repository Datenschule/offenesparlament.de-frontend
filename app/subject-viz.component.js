import { keys, values, reverse, sum, uniq, values } from "lodash";

const BASE_URL = API_BASE_URL;

const subject_viz = {
	template: require("./subject-viz.html"),
	controller: function ($anchorScroll, $timeout, $http, $q) {
		this.$onInit = () => {
			this.data = {
				labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
				series: [
					[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
				]
			};

			this.loading = true;

			this.years = ['alle', '2017', '2016', '2015', '2014', '2013'];

			this.selectedYear = this.years[0];

			this.options = {
				horizontalBars: true,
				height: "100px",
				axisY: {
					offset: 120,
					showLabel: true
				},
				axisX: {
					showGrid: false,
					showLabel: false
				},
				showLine: true,
				seriesBarDistance: 20,
				labelOffset: [{
					x: 50,
					y: 5
				},{
					x: 45,
					y: 5
				}],
				textAnchor: 'start',
				chartPadding: {
					top: 15,
					right: 70,
					bottom: 5,
					left: 65
				},
			};

			let self = this;
			
			this.events = {
				draw: function eventHandler(data) {
					if(data.type === 'bar') {
						// console.log(data);
						let curr_key = self.keys[data.index];

						let value = data.seriesIndex == 1 ? self.current_sum[curr_key] : self.current_count[curr_key];
						if (data.seriesIndex == 1) {
							value = Math.round((value / 60)) * 100 / 100;
						}
						let text = data.seriesIndex == 1 ? " Stunden" : " TOPs";
						data.group.elem('text', {
							x: data.chartRect.x2,
							y: data.value.y > 0 ? data.y2 + self.options.labelOffset[data.seriesIndex].y : data.y1 + self.options.labelOffset[data.seriesIndex].y,
							style: 'text-anchor: ' + self.options.textAnchor
						}, self.options.labelClass).text(value + text);

						// let average = self.medians[data.seriesIndex][curr_key];
						// // console.log(average);
						// let average_x = data.x1 + (average * (data.x2 - data.x1) / data.value.x);
						// // console.log(curr_key);
						// data.group.elem('line', {
						// 	x1: average_x,
						// 	y1: data.y1 - 8,
						// 	x2: average_x,
						// 	y2: data.y1 + 8,
						// 	style: 'stroke: black; stroke-width:3px'
						// }, self.options.labelClass).text('*');
					}
				}
			};

			let requests = [];
			requests.push($http.get(BASE_URL + '/api/tops/category_sum'));
			requests.push($http.get(BASE_URL + '/api/tops/category_count'));

			$q.all(requests).then((data) => {

				this.counts = data[1].data;
				this.sums = data[0].data;
				// console.log(data)
				this.loading = false;


				this.medians = data.map((item) => this.calculateMedians(item.data));
				console.log(this.medians);

				this.select();
				this.years = ['alle'].concat(keys(this.counts));
			})
		};

		this.calculateMedians = function (data) {
			let result = {}
			console.log(data);
			values(data).map((item) => {
				// console.log(item);
				let sum = values(item).reduce((prev, curr) => { return prev + curr }, 0);
				// console.log(sum);
				keys(item).map((cat) => {
					if (!result[cat]) {
						result[cat] = [];
					}
					result[cat].push(item[cat] * 100 / sum)
				} )
			});
			let tmp = result;
			// console.log(tmp);

			keys(result).map((item_key) => {
				let item = result[item_key];
				item.sort((a, b) => a - b);
				let lowMiddle = Math.floor((item.length - 1) / 2);
				let highMiddle = Math.ceil((item.length - 1) / 2);
				let median = (item[lowMiddle] + item[highMiddle]) / 2;
				// console.log(average);
				console.log(median);
				result[item_key] = median;
			});
			console.log(result);
			return result;
		}

		this.select = function(year) {

			this.keys = reverse(collect_keys(this.counts));
			this.data.labels = this.keys;

			let count_sum = 0;
			let sum_sum = 0;
			this.current_count = {};
			this.current_sum = {};

			if (!year || year == 'alle') {
				this.current_count = values(this.counts).reduce((prev, item) => {
					keys(item).map((key) => {  if (key in prev) {prev[key] += item[key]} else {prev[key] = item[key]} });
					return prev;
				}, {});
				this.current_sum = values(this.sums).reduce((prev, item) => {
					keys(item).map((key) => { if (key in prev) {prev[key] += item[key]} else {prev[key] = item[key]} });
					return prev;
				}, {});
				
			} else {
				this.current_count = this.counts[year];
				this.current_sum = this.sums[year];

			}
			count_sum = sum(values(this.current_count));
			sum_sum = sum(values(this.current_sum));
			this.data.series = [this.keys.map((key) => this.current_count[key] * 100 / count_sum),
				this.keys.map((key) => this.current_sum[key] * 100 / sum_sum)];
			this.options.height = this.data.series[0].length * 70 + 'px';
		};

		function collect_keys(data) {
			let collected_keys = values(data).map((year) => keys(year))
			let single_keys = collected_keys.reduce((prev, curr) => { return prev.concat(curr) }, []);
			return uniq(single_keys);
		}
	}
};
export default subject_viz;