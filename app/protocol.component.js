import {kebabCase, includes} from "lodash";
import iziToast from "izitoast";

import "izitoast/dist/css/iziToast.css";

const BASE_URL = API_BASE_URL;
import maybeEmojify from "./utils";

const protocol = {
	template: require("./protocol.html"),
	controller: function ($http, $location, $anchorScroll, $timeout) {
		this.utterances = [];
		let self = this;
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


					this.current_top = "TOP 40 Bundeswehreinsatz im Mittelmeer (SOPHIA)"
					console.log($location.hash());
					$anchorScroll.yOffset = 200;
					$timeout($anchorScroll, 0);

				}
			);
			$timeout(maybeEmojify, 3000);
			$timeout( () => {
				$('.protocols-top').on('scrollSpy:enter', function() {
					self.active = $(this).attr('id');
					console.log('active:' + self.active);
				});

				$('.protocols-top').scrollSpy();
				this.filter_dict = $location.search();
				console.log($location.search())
			}, 3000);
		}
		this.selectTop = function (link) {
			console.log('scrolled by' + link);
			// var element = document.getElementById(link);
			// angular.element(document.body).scrollToElement(element);
			$location.hash(link);
			$anchorScroll.yOffset = 200;
			// call $anchorScroll()
			$anchorScroll();
		};

		$(document).on('click', '.side-menu a', function(event){
			event.preventDefault();
			console.log($.attr(this, 'href'))
			// $location.hash($.attr(this, 'href').substr(1));

			$('html, body').animate({
				scrollTop: $( $.attr(this, 'href') ).offset().top - 200
			}, 800, 'swing');
		});
	}
};
export default protocol;