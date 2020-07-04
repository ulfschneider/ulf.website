//UNFORTUNATELY, this pipeline doesn´t work for italic fonts on safari 13.1.1

const GetGoogleFonts = require('get-google-fonts');
const googleFontUrl = GetGoogleFonts.constructUrl(
    {
        'IBM Plex Sans': ['200', '400', '400i', '700', '700i'],
        'IBM Plex Serif': ['400', '400i', '700', '700i'],
        'IBM Plex Mono': ['400', '400i', '700', '700i']
    },
    ['latin'],
    'swap');

const fonts = async () => {
    console.log('Loading fonts ' + googleFontUrl);
    const instance = new GetGoogleFonts({
        path:       '/fonts/',
        outputDir: '_assets/fonts/',
        cssFile: '../css/fonts.css',
        template: '{_family}_{weight}_{comment}.{ext}',
        overwriting: true,
        verbose: true
    });

    const result = await instance.download(googleFontUrl);

    return result;
};

module.exports = fonts;