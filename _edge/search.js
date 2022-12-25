import MiniSearch from 'https://cdn.jsdelivr.net/npm/minisearch@6.0.0/dist/es/index.js';
import excerptIndex from './excerpt-index.json' assert {type: 'json'};



export default async function (request, context) {
    try {
        let miniSearch = new MiniSearch({
            fields: ['id', 'title', 'date', 'humanDate', 'tags', 'starred', 'content'],
            storeFields: ['id', 'title', 'date', 'humanDate', 'tags', 'starred', 'content']
        });
        for (let entry of excerptIndex) {
            try {
                miniSearch.add(entry);
            } catch (error) { }
        }
        let results = miniSearch.search('ulf');
        return new Response(JSON.stringify(results));
    } catch (error) {
        return new Response(error);
    }
}

