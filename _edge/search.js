
import MiniSearch from 'https://cdn.jsdelivr.net/npm/minisearch@6.0.0/dist/es/index.js';
import searchIndex from './search-index.json' assert {type: 'json'};
const miniSearch = MiniSearch.loadJSON(JSON.stringify(searchIndex), {
    fields: searchIndex.INDEX_FIELDS
});


function andTerms(query) {
    let terms = [];
    for (let match of query.matchAll(/(^|\s)[+]([^\s]*)/g)) {
        terms.push(match[2]);
    }
    return terms;
}

function orTerms(query) {
    let terms = [];
    for (let match of query.matchAll(/(^|\s)([^\s+]+)/g)) {
        terms.push(match[2]);
    }
    return terms;
}

function deriveSearchOptions(query) {
    let or = orTerms(query);
    let and = andTerms(query);
    let searchOptions = {
        queries: [],
    }
    if (or.length) {
        searchOptions.combineWith = 'OR';
        searchOptions.queries = or;
    }
    if (and.length) {
        if (searchOptions.queries.length) {
            searchOptions.queries.push({
                combineWith: 'AND',
                queries: and,
            })
        } else {
            searchOptions.combineWith = 'AND';
            searchOptions.queries = and;
        }
    }

    return searchOptions;
}

export default async (request, context) => {
    const start = Date.now();

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const query = searchParams.get('query');
    try {
        let results = miniSearch.search(deriveSearchOptions(query));
        const now = Date.now();
        console.log(`The search for [${query}] returned ${results.length} results within ${now - start} milliseconds`);
        return context.json(results);
    } catch (error) {
        console.log(`Failure when searching for [${query}]: ${error}`);
        return new Response(error, {
            status: 500
        });
    }
}

