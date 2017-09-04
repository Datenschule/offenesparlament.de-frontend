import { keys,values, reverse, sum, uniq } from "lodash";

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

			this.loading = true;

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
					if(data.type === 'bar') {
						console.log(data);
						let curr_key = self.keys[data.index];

						let value = data.seriesIndex == 1 ? self.current_sum[curr_key] : self.current_count[curr_key];
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

				this.counts = data[1].data;
				this.sums = data[0].data;
				this.loading = false;

				this.select();
				this.years = ['alle'].concat(Object.keys(this.counts));
			})
		};

		this.select = function(year) {

			this.keys = reverse(collect_keys(this.counts));
			this.data.labels = this.keys;

			let count_sum = 0;
			let sum_sum = 0;
			this.current_count = {};
			this.current_sum = {};

			if (!year || year == 'alle') {
				this.current_count = Object.values(this.counts).reduce((prev, item) => {
					Object.keys(item).map((key) => {  if (key in prev) {prev[key] += item[key]} else {prev[key] = item[key]} });
					return prev;
				}, {});
				this.current_sum = Object.values(this.sums).reduce((prev, item) => {
					Object.keys(item).map((key) => { if (key in prev) {prev[key] += item[key]} else {prev[key] = item[key]} });
					return prev;
				}, {});
				
			} else {
				this.current_count = this.counts[year];
				this.current_sum = this.sums[year];

			}
			count_sum = sum(Object.values(this.current_count));
			sum_sum = sum(Object.values(this.current_sum));
			this.data.series = [this.keys.map((key) => this.current_count[key] * 100 / count_sum),
				this.keys.map((key) => this.current_sum[key] * 100 / sum_sum)];
			this.options.height = this.data.series[0].length * 70 + 'px';
		};

		function collect_keys(data) {
			let keys = Object.values(data).map((year) => Object.keys(year))
			let single_keys = keys.reduce((prev, curr) => { return prev.concat(curr) }, []);
			return uniq(single_keys);
		}
	}
};
export default subject_viz;