
import searchIndex from './search-index.json' assert {type: 'json'};
import deriveSearchOptions from './searchOptions.js';
import MiniSearch from 'https://cdn.jsdelivr.net/npm/minisearch@6.0.0/dist/es/index.js';
const miniSearch = MiniSearch.loadJSON(JSON.stringify(searchIndex), {
    fields: searchIndex.INDEX_FIELDS
});


export default async (request, context) => {
    const start = Date.now();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get('query');
    try {
        let results = miniSearch.search(deriveSearchOptions(query));
        const now = Date.now();
        context.log(`The search for [${query}] returned ${results.length} results within ${now - start} milliseconds`);
        return new Response(JSON.stringify(results),
            {
                status: 200,
                headers: { "content-type": "application/json;charset=UTF-8" }
            });
    } catch (error) {
        context.log(`Failure when searching for [${query}]: ${error}`);
        return new Response(error, {
            status: 500
        });
    }
}

