import {kebabCase, includes, findIndex, uniqBy, find} from "lodash";
import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.css";

const BASE_URL = API_BASE_URL;
import maybeEmojify from "./utils";

const protocol = {
		template: require("./protocol.html"),
		controller: function ($http, $location, $anchorScroll, $timeout) {
			this.utterances = [];
			let self = this;
			this.active = "";
			this.speakers = {};
			this.searchstring = generateSearchString($location.search());
			console.log(this.searchstring);
			this.$onInit = () => {
				const linkTarget = $location.hash();
				console.log($location.search());
				this.link_start = `#!${$location.url()}#`;
				$http.get(`${BASE_URL}/api/session${$location.path()}`).then(
					(resp) => {
						this.tops = [];
						this.selectedTop = {};
						this.utterances = resp.data.data.reduce((acc, currentValue, currentIndex, array) => {
							if (currentIndex > 1 && currentValue.top_id !== array[currentIndex - 1].top_id) {
								acc.push({type: 'top', 'title': currentValue.top})
								this.tops.push({type: 'top', 'title': currentValue.top, 'link': kebabCase(currentValue.top)})
							}
							if (currentValue.sequence === parseInt(linkTarget, 10)) {
								currentValue.linked = true;
							}
							acc.push(currentValue);
							return acc;
						}, []);
						this.session = resp.data.session;
						this.session.date = Date.parse(this.session.date);
						this.date = "15.03.2017";

						$http.get(`${BASE_URL}/api/speakers`).then(
							(resp) => {
								this.speakers = uniqBy(resp.data.data, 'speaker_cleaned').reduce((prev, curr) => {
									prev[curr.speaker_fp] = curr;
									return prev;
								}, {});
								console.log(this.speakers);
								if (this.filter_dict['people'])
									this.filter_dict['people'] = [].concat(this.filter_dict['people']);
									this.filter_dict['people'] = this.filter_dict['people'].map((item) => {
										return find(this.speakers, ['speaker_fp', item]);
								});
							}
						);

						const jumpMarkKnown = includes(this.tops.map(top => top.link), $location.hash());

						if (!jumpMarkKnown) {
							iziToast.show({
								title: '🙈',
								message: 'Aus technischen Gründen können wir leider nicht direkt zu dem' +
								' von dir ausgewählen Tagesordnungspunkt springen.' +
								' Du kannst aber die Browsersuche nutzen, um ihn zu finden.',
								timeout: 10000,
								progressBar: false,
							});
						}

						this.active = $location.hash();
						$anchorScroll.yOffset = 200;
						$timeout($anchorScroll, 0);

					}
				);
				$http.get(`${BASE_URL}/api/tops?${this.searchstring}`).then((response) => {
					this.tops = response.data.data.reduce((prev, item) => {
						item.tops.map((top) => {
							prev.push({identifier: top.session_identifier, session: item.session.sitzung, title: top.title})
						});
						return prev;
					}, []);
					console.log(this.tops);
					this.top_index = find_index(this.tops, {'session' : this.session.number, 'title': $location.hash()})

				});
				$timeout(maybeEmojify, 3000);
				$timeout(() => {
					$('.protocols-top').on('scrollSpy:exit', function (event) {
						console.log('exit')
						let offset_window = window.pageYOffset || document.documentElement.scrollTop;
						let offset_element = $(this).offset();

						//check for scrolling direction
						if (offset_window < offset_element.top) {
							console.log("scrolling up");
							// console.log(self.tops);
							let current_index = findIndex(self.tops, ['link', $(this).attr('id')]);
							self.active = self.tops[current_index - 1].link;
						} else {
							let current_index = findIndex(self.tops, ['link', $(this).attr('id')]);
							self.active = self.tops[current_index].link;
						}
					});

					$('.protocols-top').scrollSpy();


				}, 3000);

				this.filter_dict = $location.search();



				console.log(this.filter_dict['people']);
				console.log(this.filter_dict);

				if (this.filter_dict['search'])
					this.filter_dict['search'] = [].concat(this.filter_dict['search']);

				if (this.filter_dict['categories'])
					this.filter_dict['categories'] = [].concat(this.filter_dict['categories']);

				if (this.filter_dict['years'])
					this.filter_dict['years'] = [].concat(this.filter_dict['years']);

				$(document).on('click', '.side-menu button', function (event) {
					event.preventDefault();
					// $location.hash($.attr(this, 'href'));
					console.log($location.hash());
					$location.hash('test')
					// console.log($location.path());
					// console.log($($.attr(this, 'href')));
					$('html, body').animate({
						scrollTop: $($.attr(this, 'href')).offset().top - 200
					}, 800, 'swing');
				});
			}

			function generateSearchString(value) {
				let result = '';
				Object.keys(value).map((key) => {
					let item = [].concat(value[key]);
					item.map((item_value) => {
						result += key + '=' + item_value + '&';
					})
				});
				return result.slice(0, -1);
			}
		}
	}
;
export default protocol;