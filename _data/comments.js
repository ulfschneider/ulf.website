const dotenv = require('dotenv');
dotenv.config();

const site = require('./site.js');
const comments = require('../_api/comments.js');
let issueMap;


async function loadComments() {
  if (issueMap) {
    return issueMap;
  }
  let issues = await comments.loadCommentRootIssues();
  let map = new Map();
  for (let issue of issues) {
    console.log(`Loading comments for ${issue.title}`);
    issue.comments = await comments.loadCommentsForIssue(issue.number);
    map.set(issue.title, issue);
  }
  issueMap = map;
  return issueMap;
}

//start this only one time
loadComments();

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function getIssueMap() {
  //wait until the issueMap is loaded!
  while (!issueMap) {
    await sleep(500);
  }
  return issueMap;
}

async function getIssue(path) {
  let issueMap = await getIssueMap();
  const url = new URL(path, process.env.ENVIRONMENT == 'DEV' ? 'http://localhost' : site.origin);
  const key = url.hostname + url.pathname;
  return issueMap.get(key);

}

async function getIssueNumber(path) {
  let issue = await getIssue(path);
  return issue ? issue.number : undefined;
}


module.exports = {
  getRootIssueNumber: async (path) => {
    return getIssueNumber(path);
  },
  get: async (path) => {
    let issue = await getIssue(path);
    if (issue) {
      return issue.comments?.commentList;
    }
    return [];
  },
  all: async () => {
    let issueMap = await getIssueMap();
    return ['//TODO implement'];
  }
}
