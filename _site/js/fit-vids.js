
/*
A tailored version of FitVids, 
which is originally created by Dave Rupert (davatron5000).
FitVids again, is based on https://css-tricks.com/fluid-width-video/ by Chris Coyier, 
which borrows its basic idea from Thierry Koblentz
https://alistapart.com/article/creating-intrinsic-ratios-for-video/
*/

addEventListener('load', event => {
    // List of Video Vendors embeds you want to support
    const players = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
    ];

    // Select videos
    const fitVids = document.querySelectorAll(players.join(','));

    // If there are videos on the page...
    if (fitVids.length) {

        // Loop through videos
        for (let vid of fitVids) {

            // Get Video Information            
            var width = vid.getAttribute('width');
            var height = vid.getAttribute('height');
            var aspectRatio = height / width;
            var parentDiv = vid.parentNode;

            // Wrap it in a DIV
            var div = document.createElement('div');
            div.style.position = 'relative';
            div.style.paddingBottom = aspectRatio * 100 + '%';
            div.style.width = '100%';
            div.style.height = '0';

            vid.style.position = 'absolute';
            vid.style.top = '0';
            vid.style.left = '0';
            vid.style.width = '100%';
            vid.style.height = '100%';

            parentDiv.insertBefore(div, vid);
            vid.remove();
            div.appendChild(vid);

            // Clear height/width from fitVid
            vid.removeAttribute('height')
            vid.removeAttribute('width');
        }
    }
});
