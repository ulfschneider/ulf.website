const fs = require("fs");
const pdfParse = require("pdf-parse");
const LanguageDetect = require("languagedetect");
const lngDetector = new LanguageDetect();
lngDetector.setLanguageType("iso2");
const colors = require("colors"); //will extend the string prototype
const { glob } = require("glob");
const site = require("../_data/site.js");

async function identifyPDFDocuments({ output, index }) {
  const result = [];
  const pdfFiles = await glob(`${output}/**/*.pdf`);

  for (const pdf of pdfFiles) {
    const dataBuffer = fs.readFileSync(pdf);
    const { text } = await pdfParse(dataBuffer);
    const iso2Language = lngDetector.detect(text, 1)[0][0];
    const url = pdf.replace(output, "");

    await index.addCustomRecord({
      url: url,
      content: text,
      language: iso2Language,
      meta: {
        title: `Pdf: ${url}`,
      },
    });

    console.log(`${url} ${iso2Language}`.cyan);

    console.log(text);

    result.push({
      url: url,
      content: text,
      language: iso2Language,
      meta: {
        title: `Pdf: ${url}`,
      },
    });
  }

  return result;
}

module.exports = {
  buildSearchIndex: async function ({ output }) {
    //default search
    const start = Date.now();

    const { createIndex, close } = await import("pagefind");
    const { index } = await createIndex();

    const config = {
      path: output,
      glob: "**/*.{html}",
      logfile: "pagefind.log",
    };
    const { page_count } = await index.addDirectory(config);

    const outputPath = `${output}/${site.pagefindFolder}`;
    await index.writeFiles({
      outputPath: outputPath,
    });

    await close();
    const finish = Date.now();
    console.log(
      `Indexed ${page_count} documents ${config.glob} within ${
        (finish - start) / 1000
      } seconds into ${outputPath}`.green
    );
  },
};
