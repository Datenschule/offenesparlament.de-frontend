import { keys,values, reverse, sum } from "lodash";

const BASE_URL = API_BASE_URL;

const subject_viz = {
	template: require("./subject-viz.html"),
	controller: function ($location, $anchorScroll, $timeout, $http, $q) {
		this.$onInit = () => {
			this.data = {
				labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
				series: [
					[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
				]
			};

			this.years = ['alle', '2017', '2016', '2015', '2014', '2013'];

			this.selectedYear = this.years[0];

			this.options = {
				horizontalBars: true,
				height: "100px",
				axisY: {
					offset: 110,
					showLabel: true
				},
				axisX: {
					showGrid: false,
					showLabel: false
				},
				showLine: true,
				seriesBarDistance: 20,
				labelOffset: [{
					x: 40,
					y: 5
				},{
					x: 45,
					y: 5
				}],
				textAnchor: 'middle',
				chartPadding: {
					top: 15,
					right: 85,
					bottom: 5,
					left: 10
				},
			};

			let self = this;
			
			this.events = {
				draw: function eventHandler(data) {
					if(data.type === 'bar' && self.items) {
						let current_item = self.items[data.index];
						let value = data.seriesIndex == 1 ? current_item[1].sum : current_item[1].count;
						value = Math.round(Math.ceil(value * self.sums[data.seriesIndex] / 100))
						if (data.seriesIndex == 1) {
							value = Math.round((value / 60)) * 100 / 100;
						}
						let text = data.seriesIndex == 1 ? " Stunden" : " TOPs";
						data.group.elem('text', {
							x: data.x2 + self.options.labelOffset[data.seriesIndex].x,
							y: data.value.y > 0 ? data.y2 + self.options.labelOffset[data.seriesIndex].y : data.y1 + self.options.labelOffset[data.seriesIndex].y,
							style: 'text-anchor: ' + self.options.textAnchor
						}, self.options.labelClass).text(value + text);
					}
				}
			};

			let requests = [];
			requests.push($http.get(BASE_URL + '/api/tops/category_sum'));
			requests.push($http.get(BASE_URL + '/api/tops/category_count'));

			$q.all(requests).then((data) => {
				let keys = Object.keys(data[0].data);

				let result = {};

				let sum_sum = sum(Object.values(data[0].data));
				let sum_count = sum(Object.values(data[1].data));

				this.sums = [sum_count, sum_sum];

				keys.map((key) => {
					result[key] = { sum: data[0]['data'][key] * 100 / sum_sum, count: data[1]['data'][key] * 100 / sum_count }
				});


				this.items = Object.keys(result).map(function(key) {
					return [key, result[key]];
				});

				this.items.sort(function(first, second) {
					return first[1].count - second[1].count;
				});

				this.data.labels = this.items.map((item) => item[0]);
				this.data.series = [this.items.map((item) => item[1].count), this.items.map((item) => item[1].sum)];

				this.options.height = this.data.series[0].length * 70 + 'px';

				console.log(sum_count);

				console.log(result);
			})
		}

		function merge_data(data) {

		}
	}
};
export default subject_viz;