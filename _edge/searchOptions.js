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

export default function deriveSearchOptions(query) {
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
