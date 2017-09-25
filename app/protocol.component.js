import {kebabCase, includes, findIndex} from "lodash";
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
			this.$onInit = () => {
				const linkTarget = $location.hash();
				this.link_start = `#!${$location.url()}#`;
				console.log(this.link_start)
				$http.get(`${BASE_URL}/api/session${$location.path()}`).then(
					(resp) => {
						this.tops = [];
						this.selectedTop = {};
						this.utterances = resp.data.data.reduce((acc, currentValue, currentIndex, array) => {
							if (currentIndex > 1 && currentValue.top_id !== array[currentIndex - 1].top_id) {
								console.log('new top detected');
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
						console.log(this.tops);

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

						console.log($location.hash());
						this.active = $location.hash();
						$anchorScroll.yOffset = 200;
						$timeout($anchorScroll, 0);

					}
				);
				$timeout(maybeEmojify, 3000);
				$timeout(() => {

					$('.protocols-top').on('scrollSpy:exit', function (event) {
						console.log('exit')
						// self.active = $(this).attr('id');
						// console.log('active:' + self.active);
						// console.log(self.tops);
						// console.log(event);
						// console.log(findIndex(self.tops))
						// console.log($(this).offset());
						// console.log(window.pageYOffset || document.documentElement.scrollTop)
						var offset_window = window.pageYOffset || document.documentElement.scrollTop;
						var offset_element = $(this).offset();
						if (offset_window < offset_element.top) {
							console.log("scrolling up");
							// console.log(self.tops);
							let current_index = findIndex(self.tops, ['link', $(this).attr('id')]);
							self.active = self.tops[current_index - 1].link;
							console.log(self.active);
						} else {
							console.log("scrolling down")
							let current_index = findIndex(self.tops, ['link', $(this).attr('id')]);
							self.active = self.tops[current_index].link;
							console.log(self.active);
						}
					});

					$('.protocols-top').scrollSpy();
					this.filter_dict = $location.search();
					console.log($location.search())
				}, 3000);

				// this.selectTop = function (link) {
				// 	console.log('scrolled by' + link);
				// 	// var element = document.getElementById(link);
				// 	// angular.element(document.body).scrollToElement(element);
				// 	$location.hash(link);
				// 	$anchorScroll.yOffset = 200;
				// 	// call $anchorScroll()
				// 	$anchorScroll();
				// };

				$(document).on('click', '.side-menu a', function (event) {
					event.preventDefault();
					console.log($.attr(this, 'href'))
					$location.hash(self.session + $.attr(this, 'href'));

					$('html, body').animate({
						scrollTop: $($.attr(this, 'href')).offset().top - 200
					}, 800, 'swing');
				});
			}
		}
	}
;
export default protocol;