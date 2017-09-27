import { keys,values, reverse, has, max, sumBy, groupBy, chain, map, filter, uniqBy} from "lodash";

const BASE_URL = API_BASE_URL;

const subject_viz = {
	template: require("./speech-mdb.component-viz.html"),
	controller: function ($location, $anchorScroll, $timeout, $http, $q) {

		this.selected_category = "alle";
		this.selected_fraction = "alle";

		this.categories = [];
		this.fractions = ["alle", "CDU/CSU", "SPD", "Bündnis 90 die Grünen", "die Linke"];
		this.loading = true;

		let self = this;

		this.$onInit = () => {
			$http.get(BASE_URL + '/api/categories').then((response) => {
				let categories = response.data.data;
				categories.unshift("alle");
				this.categories = categories;
			})
			this.load_data()
		}

		this.load_data = function() {
			// $http.get(BASE_URL + '/api/mdb/speech_by_category').then((response) => {
			//
			// })
			//
			// $http.get(BASE_URL + '/api/mdb/speech_sum').then((response) => {
			// 	this.data['alle']['alle'] = chain(response.data).sortBy('count').reverse().value();
			// 	console.log(this.data['alle']['alle'])
			// })

			$q.all([$http.get(BASE_URL + '/api/mdb/speech_by_category'), $http.get(BASE_URL + '/api/mdb/speech_sum')])
				.then((response => {
					let result = {};
					let fraction_mapper = {
						"CDU" : "CDU/CSU",
						"CSU" : "CDU/CSU",
						"DIE LINKE": "die Linke",
						"DIE GRÜNEN" : "Bündnis 90 die Grünen",
						"SPD": "SPD"
					}

					let category_data = response[0];
					let sum_data = response[1];

					console.log(response)

					sum_data.data = sum_data.data.map((item) => { item['fraction'] = fraction_mapper[item.party]; return item; });
					console.log(sum_data)

					category_data.data = map(category_data.data, (value) => {
						value.fraction = fraction_mapper[value.party];
						return value;
					});

					result['alle'] = {};

					result['alle'] = this.map_fractions(sum_data.data);

					result['alle']['alle'] = chain(sum_data.data).sortBy('count').reverse().value();

					let categories = uniqBy(category_data.data, 'category').reduce((prev,item) => {
						if (item['category']) {
							prev.push(item['category']);
						}
						return prev;
					}, []);

					// console.log(response.data);

					map(categories, (category) => {
						result[category] = this.map_fractions(filter(category_data.data, ['category', category]))
						result[category]['alle'] = map_data(filter(category_data.data, ['category', category]));
					});
					console.log(result);
					this.data = result;
					this.update();
					this.loading = false;
				}))
		};

		this.update = function() {
			this.ranking = this.data[this.selected_category][this.selected_fraction]
		};

		this.map_fractions = function(data) {
			// console.log(data)
			let result = {};
			map(this.fractions, (fraction) => {
				result[fraction] = map_data(filter(data, ['fraction', fraction]))
			});
			return result;
		}

		function map_data(data) {
			return chain(data)
				.groupBy('speaker_key')
				.map((values) => {
					let count = sumBy(values, 'count');
					let result = values[0];
					result.count = count;
					return result
				})
				.sortBy('count')
				.reverse()
				.value();
		}
	}
};
export default subject_viz;
