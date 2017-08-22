import { keys,values, reverse } from "lodash";

const BASE_URL = API_BASE_URL;

const subject_viz = {
	template: require("./subject-viz.html"),
	controller: function ($location, $anchorScroll, $timeout, $http) {
		this.$onInit = () => {
			this.data = {
				labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
				series: [
					[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
				]
			};

			this.options = {
				horizontalBars: true,
				height: "100px",
				axisY: {
					offset: 110
				},
				axisX: {
					showGrid: false
				},
				showLine: true
			};

			$http.get(BASE_URL + '/api/tops/category_sum').then((response) => {
				console.log(response);

				var items = Object.keys(response.data).map(function(key) {
					return [key, response.data[key]];
				});

				items.sort(function(first, second) {
					return first[1] - second[1];
				});

				console.log(items);

				this.data.labels = items.map((item) => item[0]);
				this.data.series = [items.map((item) => item[1])];
				console.log(this.data.series[0].length * 20 + 'px');
				this.options.height = this.data.series[0].length * 50 + 'px'
			})
		}
	}
};
export default subject_viz;