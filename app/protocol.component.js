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
			this.filter_dict = $location.search();
			this.nextLink = "#next";
			this.prevLink = "#prev";
			this.$onInit = () => {
				const linkTarget = $location.hash();
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
						console.log(resp);
						this.session.date = Date.parse(this.session.date);

						$http.get(`${BASE_URL}/api/speakers`).then(
							(resp) => {
								this.speakers = uniqBy(resp.data.data, 'speaker_cleaned').reduce((prev, curr) => {
									prev[curr.speaker_fp] = curr;
									return prev;
								}, {});
								if (this.filter_dict['people'])
									// console.log(this.filter_dict['people']);
;									this.filter_dict['people'] = [].concat(this.filter_dict['people']);
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

						$http.get(`${BASE_URL}/api/tops/?${this.searchstring}`).then((response) => {
							console.log(response.data.data);
							this.tops_search = response.data.data.map((item) => {
								return {session: item.session.sitzung, top: item.tops[0].title};
							});
							let top_index = findIndex(this.tops_search, {'session' : this.session.number});
							console.log(top_index);
							this.nextLink = top_index < this.tops_search.length - 1 ?
								`/protokoll/#!/${this.tops_search[top_index + 1].session}?${this.searchstring}#${kebabCase(this.tops_search[top_index + 1].top)}` : ""
							this.prevLink = top_index > 0 ?
								`/protokoll/#!/${this.tops_search[top_index - 1].session}?${this.searchstring}#${kebabCase(this.tops_search[top_index - 1].top)}` : ""

						});

					}
				);

				$timeout(maybeEmojify, 3000);
				$timeout(() => {
					$('.protocols-top').on('scrollSpy:exit', function (event) {
						let offset_window = window.pageYOffset || document.documentElement.scrollTop;
						let offset_element = $(this).offset();

						//check for scrolling direction
						if (offset_window < offset_element.top) {
							console.log(self.tops);
							let current_index = findIndex(self.tops, ['link', $(this).attr('id')]);
							// self.active = self.tops[current_index - 1].link;
						} else {
							let current_index = findIndex(self.tops, ['link', $(this).attr('id')]);
							self.active = self.tops[current_index].link;
						}
					});

					$('.protocols-top').scrollSpy();


				}, 3000);

				this.reload = function(link) {
					console.log(link);
					$timeout(() => {
						this.utterances = [];
						this.$onInit();
					})
				}

				if (this.filter_dict['search'])
					this.filter_dict['search'] = [].concat(this.filter_dict['search']);

				if (this.filter_dict['categories'])
					this.filter_dict['categories'] = [].concat(this.filter_dict['categories']);

				if (this.filter_dict['years'])
					this.filter_dict['years'] = [].concat(this.filter_dict['years']);

				$(document).on('click', '.side-menu button', function (event) {
					event.preventDefault();
					$location.hash($.attr(this, 'href'));
					// $location.hash('test')
					// console.log($location.path());
					// console.log($($.attr(this, 'href')));
					let link = $.attr(this, 'href');
					$('html, body').animate({
						scrollTop: $($.attr(this, 'href')).offset().top - 200
					}, 800, 'swing');
				});
			};

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