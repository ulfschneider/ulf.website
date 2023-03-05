
import searchIndex from './search-index.json' assert {type: 'json'};
//keep the version number of minisearch in sync with the version that is used when 
//building the search indexy
import MiniSearch from 'https://cdn.jsdelivr.net/npm/minisearch@6.0.1/dist/es/index.js';
const miniSearch = MiniSearch.loadJSON(JSON.stringify(searchIndex), {
    fields: searchIndex.INDEX_FIELDS
});


export default async (request, context) => {
    try {
        const start = Date.now();

        const url = new URL(request.url);
        const searchParams = url.searchParams;
        const query = searchParams.get('query');
        const combine = searchParams.get('combine') == 'OR' ? 'OR' : 'AND'; //AND is default

        let results = miniSearch.search(query, { prefix: true, combineWith: combine });
        const now = Date.now();
        console.log(`The search for [${query}] returned ${results.length} results within ${now - start} milliseconds`);
        return new Response(JSON.stringify(results), {
            status: 200,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    } catch (err) {
        console.log(`Failure when searching for [${query}]: ${err}`);
        return new Response(err.message, {
            status: 500
        });

    }
}

