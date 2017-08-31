import * as twemoji from "twemoji";

// from https://gist.github.com/mathisonian/7885295
function doesSupportEmoji() {
    var context, smiley;
    if (!document.createElement('canvas').getContext) return;
    context = document.createElement('canvas').getContext('2d');
    if (typeof context.fillText != 'function') return;
    smiley = String.fromCharCode(55357) + String.fromCharCode(56835);
    context.textBaseline = "top";
    context.font = "32px Arial";
    context.fillText(smile, 0, 0);
    return context.getImageData(16, 16, 1, 1).data[0] !== 0;
}

export default function maybeEmojify() {
    if (!doesSupportEmoji()){
        twemoji.parse(document.querySelector("#mainContent"));
    }
}