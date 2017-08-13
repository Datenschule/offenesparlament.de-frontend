import { pull, kebabCase } from "lodash";

const BASE_URL = API_BASE_URL;
console.log(BASE_URL);


const poc = {
    template: require("./protocols.html"),
    controller: function ($http) {
        this.loading = true;
        this.selectedSpeakers = [];
        this.selectedYears = [];
        this.selectedFilter = "";

        const loadSessions = (resp) => {
            this.sessions = resp.data.data.map(session => {
                session.tops = session.tops.map(top => {
                    return {
                        title: top,
                        link: `/protokoll/#!/${session.session.sitzung}#${kebabCase(top)}`
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

        this.filterSpeakers = (speaker) => {
            return this.selectedSpeakers.indexOf(speaker) === -1;
        };

        this.filterYears = (year) => {
            return this.selectedYears.indexOf(year) === -1;
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
                }
            }).then(loadSessions);
        }
    }
};
export default poc;