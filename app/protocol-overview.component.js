import { pull, kebabCase } from "lodash";

const BASE_URL = API_BASE_URL;

const poc = {
    template: require("./protocols.html"),
    controller: function ($http) {
        this.loading = true;
        this.selectedSpeakers = [];
        this.selectedYears = [];
        this.selectedCategories = [];
        this.categories = [];
        this.selectedFilter = "";

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

        const loadSessions = (resp) => {
            this.sessions = resp.data.data.map(session => {
                session.session.date = Date.parse(session.session.date);
                session.tops = session.tops.map(top => {
                    return {
                        title: top.title,
                        link: `/protokoll/#!/${session.session.sitzung}#${kebabCase(top)}`,
                        categories: top.categories
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
                    this.speakers = resp.data.data;
                    this.loading = false;
                }
            );

            $http.get(`${BASE_URL}/api/categories`).then(
                (resp) => {
                    this.categories = resp.data.data;
                    this.loading = false;
                }
            );
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
            this.loading = true;
            $http({
                method: "GET",
                url: `${BASE_URL}/api/tops`,
                params: {
                    search: this.searchText,
                    people: this.selectedSpeakers.map(s => s.speaker_fp),
                    years: this.selectedYears,
                    categories: this.selectedCategories,
                }
            }).then(loadSessions);
        }
    }
};
export default poc;