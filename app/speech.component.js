const poi = {
    template: `
    <div id="$ctrl.utterance.sequence">
        <div class="speaker-info">
    
            <a class="protocols-speaker" ng-href="{{$ctrl.utterance.agw_url}}">
                <span ng-if="$ctrl.utterance.speaker_party">  {{ $ctrl.utterance.speaker_cleaned}} </span>
                <span ng-if="!$ctrl.utterance.speaker_party">  {{ $ctrl.utterance.speaker}} </span>
            </a>
            <span ng-if="$ctrl.utterance.type == 'chair'"> 👩‍⚖️</span>
            
            <span class="protocols-party" ng-if="$ctrl.utterance.speaker_party">
                <img ng-src="{{$ctrl.imgUrl}}"/>
            </span>
            
            <a class="jumpmark" href="{{ $ctrl.link }}">🔗</a>
            
        </div>
        <div class="text" style="white-space: pre-wrap">{{ $ctrl.utterance.text }}</div>
    </div>
    `
    ,
    bindings: {
        utterance: '<',
    },
    controller: function ($anchorScroll, $location) {
        this.$onInit = () => {
            this.imgUrl = `/static/img/parties/${this.utterance.speaker_party}.svg`;
            this.link = `#!${$location.path()}#${this.utterance.sequence}`;
            if (this.utterance.linked){
                $anchorScroll();
            }
        }
    }
};
export default poi;