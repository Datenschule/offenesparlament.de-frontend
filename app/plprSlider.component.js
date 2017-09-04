import {includes} from "lodash";

const slider = {
	template: `
     <ui-carousel slides="$ctrl.single.slides" dots="true" arrows="true" speed="800" style="">
     	<carousel-item>
			<div ng-class="item.style" class="carousel">
				<div class="carousel-overlay">  
					<div class="carousel-container">
						<p><strong>{{item.title}}</strong></p>
						<p>{{item.text}}</p>
						<p>({{item.speaker}})</p>		  			
					</div>			
				</div>
    		</div>
    			
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
			this.single.slides = [
				{
					style: 'carousel-1',
					title: "Plattdeutsch im Bundestag",
					text: "„Spraak is Heimat, Spraak hett wat mit Identität to doon, wi weet, wo wi herkaamt, un wi köönt kieken, wo wi henwüllt.“",
					speaker: "Herbert Behrens Die LINKE"

				},
				{
					style: 'carousel-2',
					title: "Zu Deutschlands Politik in der Debatte zur Bankenunion",
					text: "drei kleine Schweinchen„Die Politik, die Sie in Brüssel betreiben, erinnert mich an die Die drei kleinen Schweinchen.“",
					speaker: "Manuel Sarrazin, Bündnis '90 die Grünen"

				},
				{
					style: 'carousel-3',
					title: "Plattdeutsch im Bundestag",
					text: "„Spraak is Heimat, Spraak hett wat mit Identität to doon, wi weet, wo wi herkaamt, un wi köönt kieken, wo wi henwüllt.“",
					speaker: "Herbert Behrens Die LINKE"

				},
				{
					style: 'carousel-4',
					title: "In der Debatte zur Ehe für Alle",
					text: "„Vor lauter Schreck ist Horst Seehofer dann aber leider krank geworden.“",
					speaker: "(Caren Lay, DIE LINKE)"
				}
			]
		}
	}
}
export default slider;