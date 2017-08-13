const BASE_URL = API_BASE_URL;

const protocol = {
    template: require("./protocol.html"),
    controller: function ($http, $location) {
        this.utterances = [];
        this.$onInit = () => {
            const linkTarget = $location.hash();
            $http.get(`${BASE_URL}/api/session${$location.path()}`).then(
                (resp) => {
                    this.utterances = resp.data.data.reduce((acc, currentValue, currentIndex, array) => {
                      if (currentIndex > 1 && currentValue.top !== array[currentIndex -1].top) {
                          acc.push({type: 'top', 'title': currentValue.top})
                      }
                      if (currentValue.sequence === parseInt(linkTarget, 10)) {
                          currentValue.linked = true;
                      }
                      acc.push(currentValue);
                      return acc;
                    }, []);
                }
            );
        }
    }
}
export default protocol;