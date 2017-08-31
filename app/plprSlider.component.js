import {includes} from "lodash";

const slider = {
	template: `
     <ui-carousel slides="$ctrl.single.slides" dots="true" arrows="true" speed="800">
  		<carousel-item>
    		<h3>{{ item + 1 }} TEST!!!!</h3>
  		</carousel-item>
  		<!-- For customize carousel next, previous button -->
  		<!--<carousel-prev>-->
    		<!--&lt;!&ndash; placed your previous button here &ndash;&gt;-->
    			<!--<button>Prev</button>-->
    		<!--&lt;!&ndash; end &ndash;&gt;-->
  		<!--</carousel-prev>-->

  		<!--<carousel-next>-->
    		<!--&lt;!&ndash; placed your next button here &ndash;&gt;-->
    		<!--<button>Next</button>-->
    		<!--&lt;!&ndash; end &ndash;&gt;-->
  		<!--</carousel-next>-->
	</ui-carousel>
    `,
	controller: function ($location) {
		this.$onInit = () => {
			this.single = {};
			this.single.slides = [1, 2, 3, 4, 5]
		}
	}
}
export default slider;