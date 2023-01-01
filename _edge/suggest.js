
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
        let results = miniSearch.autoSuggest(deriveSearchOptions(query));
        const now = Date.now();
        console.log(`The suggest for [${query}] returned ${results.length} results within ${now - start} milliseconds`);
        //return at max 7 suggestions
        let limitedResult = context.json(results.slice(0, 7));
        return limitedResult;
    } catch (error) {
        console.log(`Failure when suggesting for [${query}]: ${error}`);
        return new Response(error, {
            status: 500
        });
    }
}

