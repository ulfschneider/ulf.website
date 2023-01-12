
import searchIndex from './search-index.json' assert {type: 'json'};
//keep the version number of minisearch in sync with the version that is used when 
//building the search indexy
import MiniSearch from 'https://cdn.jsdelivr.net/npm/minisearch@6.0.0/dist/es/index.js';
const miniSearch = MiniSearch.loadJSON(JSON.stringify(searchIndex), {
    fields: searchIndex.INDEX_FIELDS
});



export default async (request, context) => {
    const start = Date.now();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get('query');
    const combine = searchParams.get('combine') == 'OR' ? 'OR' : 'AND'; //AND is default

    try {
        let results = miniSearch.autoSuggest(query, { prefix: true, combineWith: combine });
        const now = Date.now();
        console.log(`The suggest for [${query}] returned ${results.length} results within ${now - start} milliseconds`);
        //return at max 7 suggestions
        let limitedResult = results.slice(0, 7);
        return new Response(JSON.stringify(limitedResult), {
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

