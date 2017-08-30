import { kebabCase } from "lodash";

const BASE_URL = API_BASE_URL;

const protocol = {
    template: require("./protocol.html"),
    controller: function ($http, $location, $anchorScroll, $timeout) {
        this.utterances = [];
        this.$onInit = () => {
            const linkTarget = $location.hash();
            $http.get(`${BASE_URL}/api/session${$location.path()}`).then(
                (resp) => {
                    this.tops = [];
                    this.selectedTop = {};
                    this.utterances = resp.data.data.reduce((acc, currentValue, currentIndex, array) => {
                      if (currentIndex > 1 && currentValue.top !== array[currentIndex -1].top) {
                          acc.push({type: 'top', 'title': currentValue.top})
                          this.tops.push({type: 'top', 'title': currentValue.top, 'link': kebabCase(currentValue.top)})
                      }
                      if (currentValue.sequence === parseInt(linkTarget, 10)) {
                          currentValue.linked = true;
                      }
                      acc.push(currentValue);
                      return acc;
                    }, []);
					this.session = this.utterances[0]['sitzung'];
                    this.date = "15.03.2017";
                    this.current_top = "TOP 40 Bundeswehreinsatz im Mittelmeer (SOPHIA)"
                    console.log($location.hash());
					$anchorScroll.yOffset = 200;
                    $timeout($anchorScroll, 0);

				}
            );
        }
        this.selectTop = function(link) {
            console.log('scrolled by' + link);
			// var element = document.getElementById(link);
			// angular.element(document.body).scrollToElement(element);
			$location.hash(link);
			$anchorScroll.yOffset = 200;
			// call $anchorScroll()
			$anchorScroll();
        };
    }
}
export default protocol;