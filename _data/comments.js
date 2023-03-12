const dotenv = require('dotenv');
dotenv.config();

const site = require('./site.js');
const comments = require('../_api/comments.js');
let issueMap;


async function loadCommentRootIssueMap() {
    if (issueMap) {
        return issueMap;
    }
    console.log('Start loading comment root issues');
    let issues = await comments.loadCommentRootIssues();
    issueMap = new Map();
    for (let issue of issues) {
        issueMap.set(issue.title, issue);
    }
    console.log('Comment root issues are loaded');
    return issueMap;
}

//start this only one time
loadCommentRootIssueMap();

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


module.exports = {
    getIssueNumber: async (path) => {
        //wait until the issueMap is loaded!
        while (!issueMap) {
            await sleep(500);
        }
        const url = new URL(path, process.env.ENVIRONMENT == 'DEV' ? 'http://localhost' : site.origin);
        const key = url.hostname + url.pathname;
        const issue = issueMap.get(key);
        return issue ? issue.number : undefined;
    }
} 