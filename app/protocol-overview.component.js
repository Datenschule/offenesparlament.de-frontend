import { pull, kebabCase, uniqBy, find } from "lodash";
import maybeEmojify from "./utils";

const BASE_URL = API_BASE_URL;

const poc = {
    template: require("./protocols.html"),
    controller: function ($http, $timeout, $location, $window, $rootScope) {
        let self = this;
        this.loading = true;
        this.selectedSpeakers = [];
        this.selectedYears = [];
        this.selectedCategories = [];
        this.categories = [];
        this.selectedFilter = "";
        this.selectedSearch = [];

        this.parties = {
            'cducsu' : {
                name: 'CDU / CSU',
                logo: '/static/img/parties/cducsu.svg'
            },
            'spd' : {
                name: 'SPD',
                logo: '/static/img/parties/spd.svg'
            },
            'gruene' : {
                name: 'Bündnis \'90 die Grünen',
                logo: '/static/img/parties/gruene.svg'
            },
            'linke': {
                name: 'Die Linke',
                logo: '/static/img/parties/linke.svg'
            }
        };

		$rootScope.$on('$locationChangeSuccess', function () {
			let get_string = $window.location.href.split('?')[1];
			if (get_string)
				self.paramstring = '?' + get_string;
			else
				self.paramstring = '';
		});

		this.tagTransform = function (newTag) {
			var item = {
			    text: newTag,
                isTag: true
			}

			return item;
		};

        const loadSessions = (resp) => {
            this.sessions = resp.data.data.map(session => {
                session.session.date = Date.parse(session.session.date);
                session.tops = session.tops.map(top => {
                    return {
                        title: top.title,
                        link: `/protokoll/#!/${session.session.sitzung}`,
                        link_fragment: `#${kebabCase(top.title)}`,
                        categories: top.categories,
                        name: top.name,
                        session_identifier: top.session_identifier
                    }
                });
                return session;
            });
            this.loading = false;
        };

        this.$onInit = () => {
            $http.get(`${BASE_URL}/api/tops`).then(loadSessions);

            $http.get(`${BASE_URL}/api/speakers`).then(
                (resp) => {
                    this.speakers = uniqBy(resp.data.data, 'speaker_cleaned');
                    this.parseUrl()
                }
            );

            $http.get(`${BASE_URL}/api/categories`).then(
                (resp) => {
                    this.categories = resp.data.data;
                }
            );



            $timeout(maybeEmojify, 1000);
        };

        this.togglSpeaker = (speaker) => {
            if (this.selectedSpeakers.indexOf(speaker) === -1) {
                this.selectedSpeakers.push(speaker)
            } else {
                pull(this.selectedSpeakers, speaker);
            }
        };

        this.togglYear = (year) => {
            if (this.selectedYears.indexOf(year) === -1) {
                this.selectedYears.push(year)
            } else {
                pull(this.selectedYears, year);
            }
        };

        this.togglCategory = (category) => {
            if (this.selectedCategories.indexOf(category) === -1) {
                this.selectedCategories.push(category)
            } else {
                pull(this.selectedCategories, category);
            }
        };

        this.filterSpeakers = (speaker) => {
            return this.selectedSpeakers.indexOf(speaker) === -1;
        };

        this.filterYears = (year) => {
            return this.selectedYears.indexOf(year) === -1;
        };

        this.filterCategories = (category) => {
            return this.selectedCategories.indexOf(category) === -1;
        };

        this.selectFilter = (filter) => {
            if (this.selectedFilter === filter) {
                this.selectedFilter = "";
            } else {
                this.selectedFilter = filter;
            }
        };

        this.search = () => {
            console.log("search called");
            this.loading = true;
            this.updateUrl();

            $http({
                method: "GET",
                url: `${BASE_URL}/api/tops`,
                params: {
                    search: this.selectedSearch.map(s => s.text),
                    people: this.selectedSpeakers.map(s => s.speaker_fp),
                    years: this.selectedYears,
                    categories: this.selectedCategories,
                }
            }).then(loadSessions);
        }

        this.updateUrl = function() {
            $location.search('people', this.selectedSpeakers.map(s => s.speaker_fp));
            $location.search('categories', this.selectedCategories);
            $location.search('search', this.selectedSearch.map(s => s.text));
            $location.search('years', this.selectedYears);
        }

        this.parseUrl = function() {
            let data = $location.search();
            let keys = ['people', 'categories', 'search', 'years'];
            keys.map((key) => { if (data[key]) { data[key] = [].concat(data[key])}});

            if (data['search']) this.selectedSearch = data['search'].map((s) => { return {text: s, isTag:true } });
            if (data['years']) this.selectedYears = data['years'];
            if (data['categories']) this.selectedCategories = data['categories'];
            if (data['people']) this.selectedSpeakers = data['people'].map((speaker) => { console.log(speaker); return find(this.speakers, ['speaker_fp', speaker]) });

            this.search()
        }
    }
};
export default poc;