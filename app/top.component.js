import { kebabCase } from "lodash";

const top = {
    bindings: {
        title: '<',
    },
    template: `<h2 id="{{$ctrl.link}}">{{$ctrl.title}}</h2>`,
    controller: function ($location, $anchorScroll, $timeout) {
        this.$onInit = () => {
            this.link = kebabCase(this.title);
            if ($location.hash() === this.link){
                $anchorScroll();
            }
        };
    }
};
export default top;