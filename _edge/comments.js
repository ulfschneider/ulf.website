import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Octokit } from "https://cdn.skypack.dev/octokit";

const REPO = 'ulf.website'; //repo to check for comments
const OWNER = 'ulfschneider'; //repo owner
const LABEL_FILTER = 'website-comments'; //use empty string to ignore label filtering

let octokit;
let issues;
let comments;
let commentRoot;
let commentRootIssue;
let commentRootNumber;


async function loginGitHub() {
    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    const token = config().GITHUB_PAT || Deno.env.get(GITHUB_PAT);
    return new Octokit({ auth: token });
}


async function getRemainingRateLimit() {
    const { data } = await octokit.rest.rateLimit.get();
    return data.rate.remaining;
}

async function loadIssues() {
    issues = [];
    comments = [];
    await octokit.paginate(octokit.rest.issues.listForRepo, {
        owner: OWNER,
        repo: REPO,
        labels: LABEL_FILTER
    })
        .then(allIssues => {
            //paginate returns all issues of the repo in an array
            issues = allIssues;
        });
    getCommentRootIssue();
}


function getCommentRootIssue() {
    commentRootNumber = -1;
    commentRootIssue = null;
    if (issues) {
        for (let issue of issues) {
            if (issue.title == commentRoot) {
                commentRootIssue = issue;
                commentRootNumber = issue.number;
                console.log(`${commentRoot} has the url ${commentRootIssue.html_url}`);
                return commentRootIssue;
            }
        }
    }
    return null;
}

async function createCommentRootIssue() {
    await octokit.rest.issues.create({
        owner: OWNER,
        repo: REPO,
        title: commentRoot,
        labels: [LABEL_FILTER]
    });
    //TODO store a backlink to the original website post
}

async function createComment(commentBody) {
    if (commentRootNumber < 0) {
        await createCommentRootIssue();
        await loadIssues();
    }
    await octokit.rest.issues.createComment({
        owner: OWNER,
        repo: REPO,
        issue_number: commentRootNumber,
        body: commentBody,
    });
}

async function loadComments() {
    comments = [];
    if (commentRootIssue) {
        const { data } = await octokit.rest.issues.listComments({
            owner: OWNER,
            repo: REPO,
            issue_number: commentRootIssue.number
        });
        comments = data;
        console.log(`Found ${comments.length} comments for ${commentRoot}`);
    }
    return comments;
}




export default async (request, context) => {

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const method = request.method;
    const body = request.body;
    commentRoot = searchParams.get('root');

    console.log(method, commentRoot);

    if (!commentRoot) {
        console.error('The comment root argument is not specified');
        return new Response(JSON.stringify('You didn´t specify a comment root with ?root='), {
            status: 400,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });

    }

    if (!octokit) {
        octokit = await loginGitHub();
    }


    let remaining = await getRemainingRateLimit();
    console.log(`GitHub remaining rate limit: ${remaining}`);
    if (remaining == 0) {
        return {
            statusCode: 429,
            body: JSON.stringify({ error: 'Unable to fetch comments at this time. Check back later.' }),
        };
    }


    await loadIssues();
    await createComment('my new body');
    await loadComments();
    for (let c of comments) {
        console.log(c.body);
    }

    return new Response(JSON.stringify(commentRoot), {
        status: 200,
        headers: { "content-type": "application/json;charset=UTF-8" }
    });
}