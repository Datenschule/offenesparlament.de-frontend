import * as angular from "angular";
import ngAnimate from "angular-animate"

import protocolOverviewComponent from "./protocol-overview.component";
import poiComponent from "./poi.component"
import protocolComponent from "./protocol.component"
import speechComponent from "./speech.component"
import top from "./top.component"

angular.module('offenesparlament', [ngAnimate])
    .component('protocols', protocolOverviewComponent)
    .component('protocol', protocolComponent)
    .component('speech', speechComponent)
    .component('poi', poiComponent)
    .component('top', top)
    .filter('newlines', function () {
        return function(text) {
            return text.replace(/\n/g, '<br/>');
        }
    });