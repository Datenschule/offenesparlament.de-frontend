import {includes} from "lodash";

const slider = {
	template: `
     <ui-carousel slides="$ctrl.single.slides" dots="true" arrows="true" speed="800" style="" autoplay="true" autoplay-speed="8000">
     	<carousel-item>
			<div ng-class="item.style" class="carousel">
				<div class="carousel-overlay">  
					<div class="carousel-container">
						<p><strong>{{item.title}}</strong></p>
						<p ng-bind-html="item.text"></p>
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
					title: "Debatte zur Ehe für Alle",
					text: "„Meine Kolleginnen und Kollegen von der Union, wer will denn in Deutschland die Ehe für alles? Für alle! - 83 Prozent aller Deutschen wollen sie.“",
					speaker: "Karl-Heinz Brunner, SPD"

				},
				{
					style: 'carousel-3',
					title: "Plattdeutsch im Bundestag",
					text: "„Die Zusammenarbeit zwischen unserer Untersuchungskommission und Volkswagen funktioniert übrigens kooperativ.”</p><p>(Alexander Dobrindt, CSU)</p><p><i>“Das glaube ich ausnahmsweise!”</i></p>",
					speaker: 'Anton Hofreiter, BÜNDNIS 90/DIE GRÜNEN'


				},
				{
					style: 'carousel-4',
					title: "Debatte zur Aufnahme von Geflüchteten",
					text: "“Ja, wir brauchen auch - auch das will ich sagen; das habe ich noch nie in meinem Leben gesagt - die vielen Mitglieder der CDU, die den Ausspruch von Angela Merkel „Wir schaffen das“ als einen Auftrag zur Nächstenliebe im Alltag begriffen haben”",
					speaker: "Jan Korte, DIE LINKE"
				}
			]
		}
	}
}
export default slider;