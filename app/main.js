import * as angular from "angular";
import ngAnimate from "angular-animate"
import ui_select from "ui-select"
import angularChartist from "angular-chartist.js"
import ngSanitize from "angular-sanitize"

// import chartistBarLabels from "./lib/chartist-bar-labels"



import protocolOverviewComponent from "./protocol-overview.component";
import poiComponent from "./poi.component"
import protocolComponent from "./protocol.component"
import speechComponent from "./speech.component"
import top from "./top.component"
import subjectVizComponent from "./subject-viz.component"
import speechFrequencyComponent from "./speech-frequency.component-viz"

angular.module('offenesparlament', [ngAnimate, angularChartist, ui_select, ngSanitize])
    .component('protocols', protocolOverviewComponent)
    .component('protocol', protocolComponent)
    .component('speech', speechComponent)
    .component('poi', poiComponent)
    .component('top', top)
    .component('subjectViz', subjectVizComponent)
    .component('speechFrequency', speechFrequencyComponent)
    .filter('newlines', function () {
        return function(text) {
            return text.replace(/\n/g, '<br/>');
        }
    });