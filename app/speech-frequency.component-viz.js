import { keys,values, reverse, has, max, sum, filter } from "lodash";

const BASE_URL = API_BASE_URL;

const subject_viz = {
	template: require("./speech-frequency.component-viz.html"),
	controller: function ($location, $anchorScroll, $timeout, $http, $q) {

		this.itemArray = [
			{id: 1, name: 'Häufigkeit nach Alter', url_speech: '/api/utterances/by_birth_date_category', url_mdb:'/api/mdb/aggregated/age'},
			{id: 2, name: 'Häufigkeit nach Bundesland', url_speech: '/api/utterances/by_election_list_category', url_mdb:'/api/mdb/aggregated?attribute=election_list'},
			{id: 3, name: 'Häufigkeit nach Geschlecht', url_speech: '/api/utterances/by_gender_category', url_mdb:'/api/mdb/aggregated?attribute=gender'},
			{id: 4, name: 'Häufigkeit nach Beruf', url_speech: '/api/utterances/by_profession_category', url_mdb:'/api/mdb/aggregated?attribute=education_category'},
		];

		//this.selectedItem = this.itemArray[0];
		this.selectedItem = { name: "Wähle eine Kategorie"};
		this.selected_category = "Wähle ein Thema";
		this.loading = true;
		this.category_initialized = false;
		this.subject_initialized = false;


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
				high: 50,
				low: 0,
				axisX: {
					showGrid: false,
					showLabel: false
				},
				showLine: true,
				labelOffset: [{
					x: 10,
					y: 5
				}, {
					x: 10,
					y: 5
				}],
				textAnchor: 'left',
				chartPadding: {
					top: 15,
					right: 215,
					bottom: 5,
					left: 155
				},
			};

			let self = this;

			this.events = {
				draw: function eventHandler(data) {
					if (data.type === 'bar' && self.category_initialized /*&& self.subject_initialized*/) {
						let curr_key = self.keys[data.index];
						let value = 0;
						if (self.subject != 'all')
							value = data.seriesIndex == 1 ? self.mdb[curr_key] : self.speeches[self.subject][curr_key];
						else
							value = data.seriesIndex == 1 ? self.mdb[curr_key] : 0;

						if (!value)
							value = 0;

						let text = data.seriesIndex == 1 ? " Abgeordnete" : " Reden";
						if (value == 1)
							text = data.seriesIndex == 1 ? " Abgeordneter" : " Rede";
						text += " (" + Math.round(data.value.x * 100) / 100 + "%)";
						data.group.elem('text', {
							x: data.x2 + self.options.labelOffset[data.seriesIndex].x,
							y: data.value.y > 0 ? data.y2 + self.options.labelOffset[data.seriesIndex].y : data.y1 + self.options.labelOffset[data.seriesIndex].y,
							style: 'text-anchor: ' + self.options.textAnchor
						}, self.options.labelClass).text(value + text);
					}
				}
			};

			let category_req = $http.get(BASE_URL + '/api/categories')

			let load_data = this.load_data('/api/utterances/by_birth_date_category', '/api/mdb/aggregated/age', 1, true);
			//
			$q.all([category_req, load_data]).then((data) => {
				this.categories = data[0].data.data;
				this.select_subject(this.categories[0]);
				this.loading = false;
				this.selected_category = this.categories[0];
				this.selectedItem = this.itemArray[0]
			})
		}

		
		this.load_data = function(url_speech, url_mdb, id, initialized) {
			this.loading = true;
			return $q((resolve, reject) => {
				let speeches = $http.get(BASE_URL + url_speech);
				let mdb = $http.get(BASE_URL + url_mdb);

				// this.speeches = speeches;
				// this.mdb = mdb;

				$location.search('category_id', id);

				$q.all([speeches, mdb]).then((results) => {
					this.speeches = results[0].data;
					this.mdb = results[1].data;
					delete this.mdb['null'];
					// this.category = "age";
					// this.subject = "all";

					this.keys = keys(this.mdb).sort();
					this.data.labels = this.keys;

					let data = {};
					for (let category in this.speeches) {
						let item = this.speeches[category];
						for (let group in item) {
							if (!has(data, group)) {
								data[group] = 0
							}
							data[group] += item[group]
						}
					}
					let series_speech = this.data.labels.map((key) => {
						// if (!this.subject_initialized)
						// 	return 0;
						return data[key]
					});

					let series_mdb = this.data.labels.map((key) => {
						if (!this.subject_initialized)
							return 0;
						// return this.mdb[key]
						// return 0
					});

					let max_speech = sum(series_speech);
					let max_mdb = sum(series_mdb);

					series_speech = series_speech.map((value) => { return value * 100 / max_speech });
					series_mdb = series_mdb.map((value) => { return value * 100 / max_mdb});

					this.data.series = [series_mdb, series_speech];
					this.options.height = this.data.series[0].length * 70 + 'px';
					console.log(initialized);
					if (!initialized) {
						console.log('Subject: ' + this.subject);
						this.select_subject(this.subject);
					}
					this.category_initialized = true;
					this.loading = false;
					resolve()

				})
			});
		};

		this.select_subject = function(subject) {

			$location.search('subject', subject);
			this.subject = subject;

			let series_speech = this.data.labels.map((key) => {
				return this.speeches[subject][key];
			});
			let max_speech = sum(series_speech);
			series_speech = series_speech.map((value) => { return value * 100 / max_speech });

			this.data.series[0] = series_speech;
			this.subject_initialized = true;
		}
	}
};
export default subject_viz;