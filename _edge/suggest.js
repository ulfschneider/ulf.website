
import searchIndex from './search-index.json' assert {type: 'json'};
//keep the version number of minisearch in sync with the version that is used when 
//building the search indexy
import MiniSearch from 'https://cdn.jsdelivr.net/npm/minisearch@6.0.0/dist/es/index.js';
const miniSearch = MiniSearch.loadJSON(JSON.stringify(searchIndex), {
    fields: searchIndex.INDEX_FIELDS
});

function splitSearchTerms(query) {
    query = query || document.querySelector('#search-query').value;

    return query
        ? query.split(/\s+/)
        : [];
}
function searchTermCount(query) {
    let split = splitSearchTerms(query);
    return split.length;
}

function chunk(arr = [], chunkSize = 1) {
    let chunks = [];
    let tmp = [...arr];
    if (chunkSize <= 0) return chunks;
    while (tmp.length) {
        chunks.push(tmp.splice(0, chunkSize));
    }
    return chunks
}

function prepareResults(results, termCount) {
    let limitedResults = new Set();
    if (results.length) {
        for (let result of results) {
            let chunks = chunk(result.terms, termCount);
            for (let chunk of chunks) {
                //return at max 7 suggestions        
                if (limitedResults.size == 7) {
                    return [...limitedResults];
                }
                if (chunk.length == termCount) {
                    limitedResults.add(chunk.join(' '));
                }
            }

        }
    }
    return [...limitedResults];
}



export default async (request, context) => {
    const start = Date.now();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get('query');
    const termCount = searchTermCount(query);
    const combine = searchParams.get('combine') == 'OR' ? 'OR' : 'AND'; //AND is default

    try {
        let results = miniSearch.autoSuggest(query, { prefix: true, combineWith: combine });
        const now = Date.now();
        console.log(`The suggest for [${query}] returned ${results.length} results within ${now - start} milliseconds`);

        let limitedResults = prepareResults(results, termCount)
        return new Response(JSON.stringify(limitedResults), {
            status: 200,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    } catch (error) {
        console.log(`Failure when suggesting for [${query}]: ${error}`);
        return new Response(error.message, {
            status: 500
        });
    }
}

