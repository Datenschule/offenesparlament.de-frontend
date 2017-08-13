import {includes} from "lodash";

const poi = {
    bindings: {
        utterance: '<',
    },
    template: `
     <div class="protocols-poi" ng-class="{linked: $ctrl.utterance.linked}">
            <div id="{{ $ctrl.utterance.sequence }}">
                <span class="protocols-poiemoji">
                    {{ $ctrl.emoji }}
                </span>
                <span>
                    {{ $ctrl.utterance.text }}

                    <span ng-if="$ctrl.utterance.speaker_cleaned">
                        <a ng-href="$ctrl.utterance.agw_url">{{ $ctrl.utterance.speaker_cleaned }}</a>
                        <span class="protocols-poi-party" ng-if="$ctrl.utterance.speaker_party">
                            <img ng-src="{{$ctrl.imgUrl}}"/>
                        </span>
                    </span>
                    <a class="protocols-jumpmark" href="{{ $ctrl.link }}">🔗</a>
                </span>
            </div>
        </div>
    `,
    controller: function ($location, $anchorScroll) {
        this.$onInit = () => {
            this.emoji = createEmoji(this.utterance.text);
            this.imgUrl = `/static/img/parties/${this.utterance.speaker_party}.svg`;
            this.link = `#!${$location.path()}#${this.utterance.sequence}`;
            if (this.utterance.linked){
                $anchorScroll();
            }
        };

        function createEmoji(text){
            let result = []
            if (includes(text, 'Beifall')){
                result.push("👏")
            }
            if (includes(text, "Heiterkeit")){
                result.push("😂")
            }
            if (includes(text, "Unterbrechung")){
                result.push("⏰")
            }
            if (!result.length) {
                result.push("🗯")
            }
            return result.join(" ");
        }
    }
};
export default poi;