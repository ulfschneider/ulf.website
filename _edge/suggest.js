
import searchIndex from './search-index.json' assert {type: 'json'};
//keep the version number of minisearch in sync with the version that is used when 
//building the search indexy
import MiniSearch from 'https://cdn.jsdelivr.net/npm/minisearch@6.0.1/dist/es/index.js';
const miniSearch = MiniSearch.loadJSON(JSON.stringify(searchIndex), {
    fields: searchIndex.INDEX_FIELDS
});
const RESULT_COUNT = 7;

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

function prepareResults(results, termCount) {
    let limitedResults = new Set();

    for (let result of results) {
        if (limitedResults.size == RESULT_COUNT) {
            break;
        }
        //use only the first termCount number of terms 
        //per each result
        let slice = result.terms.slice(0, termCount);

        //join the sliced terms with a space
        //and add them to the limited results
        limitedResults.add(slice.join(' '));
    }

    return [...limitedResults];
}



export default async (request, context) => {
    try {
        const start = Date.now();

        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const query = searchParams.get('query');
        const termCount = searchTermCount(query);
        const combine = searchParams.get('combine') == 'OR' ? 'OR' : 'AND'; //AND is default

        let results = miniSearch.autoSuggest(query, { prefix: true, combineWith: combine });
        const now = Date.now();
        console.log(`The suggest for [${query}] returned ${results.length} results within ${now - start} milliseconds`);

        let limitedResults = prepareResults(results, termCount)
        return new Response(JSON.stringify(limitedResults), {
            status: 200,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    } catch (err) {
        console.log(`Failure when suggesting for [${query}]: ${err}`);
        return new Response(err.message, {
            status: 500
        });

    }
}

