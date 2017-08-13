import * as angular from "angular";
import { pull } from "lodash";

angular.module('offenesparlament', [])
    .component('protocols', {
        template: require("./protocols.html"),
        controller: function ($http) {
            var api_url = "http://api.offenesparlament.de/";

            this.loading = true;
            this.selectedSpeakers = [];
            this.selectedFilter = "";

            this.togglSpeaker = (speaker) => {
                if (this.selectedSpeakers.indexOf(speaker) === -1) {
                    this.selectedSpeakers.push(speaker)
                } else {
                    pull(this.selectedSpeakers, speaker);
                }
            };
            
            this.filterSpeakers = (speaker) => {
                return this.selectedSpeakers.indexOf(speaker) === -1;
            }

            this.selectFilter = (filter) => {
                if (this.selectedFilter == filter) {
                    this.selectedFilter = "";
                } else {
                    this.selectedFilter = filter;
                }
            };

            $http.get(api_url + "api/tops").then(
                (resp) => {
                    this.sessions = resp.data.data;
                }
            );

            $http.get(api_url + "api/speakers").then(
                (resp) => {
                    this.speakers = resp.data.data;
                    this.loading = false;
                }
            );

            this.search = () => {
                this.loading = true;
                $http({
                    method: "GET",
                    url: api_url + "api/tops",
                    params: {
                        search: this.searchText,
                        people: this.selectedSpeakers.map(s => s.speaker_fp),
                    }
                }).then(
                    (resp) => {
                        this.sessions = resp.data.data;
                        this.loading = false
                    }
                );
            }
        }
    });