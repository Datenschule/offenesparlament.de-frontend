import { keys,values, reverse, has, max, sum } from "lodash";

const BASE_URL = API_BASE_URL;

const subject_viz = {
	template: require("./speech-frequency.component-viz.html"),
	controller: function ($location, $anchorScroll, $timeout, $http, $q) {

		this.$onInit = () => {
			this.data = {
				labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'],
				series: [
					[1, 2, 4, 8, 6, -2, -1, -4, -6, -2]
				]
			};

			this.categories = [];

			this.options = {
				seriesBarDistance: 20,
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
			$http.get(BASE_URL + '/api/categories').then((response) => {
				this.categories = response.data.data;
			});
			this.load_data('/api/utterances/by_birth_date_category', '/api/mdb/aggregated/age');
		}
		this.load_data = function(url_speech, url_mdb) {
			let speeches = $http.get(BASE_URL + url_speech);
			let mdb = $http.get(BASE_URL + url_mdb);

			this.speeches = speeches;
			this.mdb = mdb;

			$q.all([speeches, mdb]).then((results) => {
				this.speeches = results[0].data;
				this.mdb = results[1].data;
				this.category = "age";
				this.subject = "all";

				this.data.labels = keys(this.mdb).sort();

				let data = {};
				for (let category in this.speeches) {
					let item = this.speeches[category];
					for (let group in item) {
						if (!has(data, group)) {
							console.log("Initialising group");
							data[group] = 0
						}
						data[group] += item[group]
					}
				}
				let series_speech = this.data.labels.map((key) => {
					return data[key]
				});

				let series_mdb = this.data.labels.map((key) => {
					return this.mdb[key]
				});

				let max_speech = sum(series_speech);
				let max_mdb = sum(series_mdb);

				series_speech = series_speech.map((value) => { return value * 100 / max_speech });
				series_mdb = series_mdb.map((value) => { return value * 100 / max_mdb});

				this.data.series = [series_mdb, series_speech];
				this.options.height = this.data.series[0].length * 70 + 'px';
			});

		}
		this.select_subject = function(subject) {

			let series_speech = this.data.labels.map((key) => {
				return this.speeches[subject][key];
			});
			let max_speech = sum(series_speech);
			series_speech = series_speech.map((value) => { return value * 100 / max_speech });

			this.data.series[0] = series_speech;
		}
	}
};
export default subject_viz;