import {includes} from "lodash";

const slider = {
	template: `
     <ui-carousel slides="$ctrl.slides" dots="true" arrows="true" speed="800" style="" autoplay="true" autoplay-speed="8000">
     	<!--<carousel-item>-->
			<!--<div ng-class="item.style" class="carousel">-->
				<!--<div class="carousel-overlay">  -->
					<!--<div class="carousel-container">-->
						<!--<p><strong>{{item.title}}</strong></p>-->
						<!--<p ng-bind-html="item.text"></p>-->
						<!--&lt;!&ndash;<p>({{item.speaker}})</p>		  			&ndash;&gt;-->
					<!--</div>			-->
				<!--</div>-->
    		<!--</div>-->
    			<!---->
  		<!--</carousel-item>-->
  		<carousel-item>
  			<p><strong class="carousel-title">{{item.title}}</strong></p>
  			<div ng-bind-html="item.text"></div>
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

			this.slides = [
				{
					style: 'carousel-1',
					title: "Debatte zur Ehe für Alle",
					text: `<div id="503" class="carousel-cite">
								<div>
									<div class="protocols-speaker-info">
					
										<a class="protocols-speaker"  href="https://www.abgeordnetenwatch.de/profile/dr-karl-heinz-brunner-0">
											<span>  Dr. Karl-Heinz Brunner </span>
										</a>
										<span class="protocols-party">
											<img src="/static/img/parties/spd.svg">
										</span>
					
										<a class="protocols-jumpmark" href="#!/220#503">🔗</a>
					
									</div>
									<div class="protocols-text" >Meine Kolleginnen und Kollegen von der Union, wer will denn in Deutschland die 
									Ehe für alles?</div>
								</div>
							</div>
							<div id="506" class="carousel-cite">
								<div>
									<div class="protocols-speaker-info">
										<a class="protocols-speaker" href="https://www.abgeordnetenwatch.de/profile/dr-karl-heinz-brunner-0">
											<span>  Dr. Karl-Heinz Brunner </span>
										</a>
										<span class="protocols-party">
											<img src="/static/img/parties/spd.svg">
										</span><!-- end ngIf: $ctrl.utterance.speaker_party -->
										<a class="protocols-jumpmark" href="#!/220#506">🔗</a>
			
									</div>
									<div class="protocols-text">- Für alle! - 83 Prozent aller Deutschen wollen sie.</div>
								</div>
							</div>`,
				},
				{
					style: 'carousel-3',
					title: "Debatte zum Abgasskandal",
					text: `
						<div class="carousel-cite">
    						<div>
        						<div class="protocols-speaker-info">
            						<a class="protocols-speaker" href="https://www.abgeordnetenwatch.de/profile/alexander-dobrindt-0">
                						<span>  Alexander Dobrindt, Bundesminister für Verkehr und digitale Infrastruktur </span>
									</a>
            						<a class="protocols-jumpmark" href="#!/155#739">🔗</a>   
        						</div>
        						<div class="protocols-text">Die Zusammenarbeit zwischen unserer Untersuchungskommission und Volkswagen funktioniert übrigens kooperativ.</div>
    						</div>
    						
    						<div class="protocols-poi pull-right" style="float: right;">
            					<div>
                					<span class="protocols-poiemoji">🗯</span>
                					<span>Das glaube ich ausnahmsweise!
                    					<span>
                        					<a href="">Dr. Anton Hofreiter</a>
                       						<span class="protocols-poi-party">
                            					<img src="/static/img/parties/gruene.svg">
                        					</span>
                    					</span>
                    					<a class="protocols-jumpmark" href="#!/155#740">🔗</a>
                					</span>
            					</div>
        					</div>
						</div>
					`


				},
				{
					style: 'carousel-4',
					title: "Debatte zur Aufnahme von Geflüchteten",
					text: `
						<div class="carousel-cite">
    						<div>
        						<div class="protocols-speaker-info">
            						<a class="protocols-speaker" href="https://www.abgeordnetenwatch.de/profile/jan-korte/archive/215438">
                						<span ng-if="$ctrl.utterance.speaker_party">  Jan Korte </span>
            						</a>
            						<span class="protocols-party">
                						<img src="/static/img/parties/linke.svg">
            						</span>
            						<a class="protocols-jumpmark" href="#!/158#80">🔗</a>
            
        						</div>
        						<div class="protocols-text">Ja, wir brauchen auch - auch das will ich sagen; das habe ich noch nie in meinem Leben gesagt - die vielen Mitglieder der CDU, die den Ausspruch von Angela Merkel „Wir schaffen das“ als einen Auftrag zur Nächstenliebe im Alltag begriffen haben. Auch sie brauchen wir; - um es klar zu sagen.</div>
    						</div>
    					</div>
						`
				}
			]
		}
	}
}
export default slider;