import * as angular from "angular";
import ngAnimate from "angular-animate"
import ui_select from "ui-select"
import angularChartist from "angular-chartist.js"
import ngSanitize from "angular-sanitize"
import duScroll from "angular-scroll"
import angularInview from 'angular-inview';
import angularCarousel from "angular-ui-carousel"
// import smoothScroll from 'ngSmoothScroll';

// import chartistBarLabels from "./lib/chartist-bar-labels"



import protocolOverviewComponent from "./protocol-overview.component";
import poiComponent from "./poi.component"
import protocolComponent from "./protocol.component"
import speechComponent from "./speech.component"
import top from "./top.component"
import subjectVizComponent from "./subject-viz.component"
import speechFrequencyComponent from "./speech-frequency.component-viz"
import speechMdbComponent from "./speech-mdb-viz"
import plprSlider from "./plprSlider.component"

let app = angular.module('offenesparlament', [ngAnimate, angularChartist, ui_select, ngSanitize, duScroll, angularInview.name, 'ui.carousel'])
    .component('protocols', protocolOverviewComponent)
    .component('protocol', protocolComponent)
    .component('speech', speechComponent)
    .component('poi', poiComponent)
    .component('top', top)
    .component('subjectViz', subjectVizComponent)
    .component('speechFrequency', speechFrequencyComponent)
    .component('speechMdb', speechMdbComponent)
    .component('plprSlider', plprSlider)
	.value('duScrollOffset', -200);

app.filter('newlines', function () {
        return function(text) {
            return text.replace(/\n/g, '<br/>');
        }
    });

app.directive("stickyNav", function stickyNav($window){
        function stickyNavLink(scope, element){
            var w = angular.element($window),
                size = element[0].clientHeight,
                top = 0;

            function toggleStickyNav(){
                if(!element.hasClass('controls-fixed') && $window.pageYOffset > top + size){
                    element.addClass('controls-fixed');
                } else if(element.hasClass('controls-fixed') && $window.pageYOffset <= top + size){
                    element.removeClass('controls-fixed');
                }
            }

            scope.$watch(function(){
                return element[0].getBoundingClientRect().top + $window.pageYOffset;
            }, function(newValue, oldValue){
                if(newValue !== oldValue && !element.hasClass('controls-fixed')){
                    top = newValue;
                }
            });

            w.bind('resize', function stickyNavResize(){
                element.removeClass('controls-fixed');
                top = element[0].getBoundingClientRect().top + $window.pageYOffset;
                toggleStickyNav();
            });
            w.bind('scroll', toggleStickyNav);
        }

        return {
            scope: {},
            restrict: 'A',
            link: stickyNavLink
        };
    });