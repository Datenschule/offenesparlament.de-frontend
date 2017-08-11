import * as angular from "angular";
import { pull } from "lodash";

angular.module('offenesparlament', [])
    .component('protocols', {
        template: require("./protocols.html"),
        controller: function ($http) {
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

            $http.get("http://localhost:5000/api/tops").then(
                (resp) => {
                    this.sessions = resp.data.data;
                }
            );

            $http.get("http://localhost:5000/api/speakers").then(
                (resp) => {
                    this.speakers = resp.data.data;
                    this.loading = false;
                }
            );

            this.search = () => {
                this.loading = true;
                $http({
                    method: "GET",
                    url: "http://localhost:5000/api/tops",
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