import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Octokit } from "https://cdn.skypack.dev/octokit";

const REPO = 'ulf.website'; //repo to check for comments
const OWNER = 'ulfschneider'; //repo owner
const LABEL_FILTER = 'website-comments'; //use empty string to ignore label filtering

let octokit;
let issues;


async function loginGitHub() {
    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    const token = config().GITHUB_PAT || process.env.GITHUB_PAT;
    return new Octokit({ auth: token });
}


async function getRemainingRateLimit() {
    const { data } = await octokit.rest.rateLimit.get();
    return data.rate.remaining;
}

async function loadIssues() {
    return octokit.paginate(octokit.rest.issues.listForRepo, {
        owner: OWNER,
        repo: REPO,
        labels: LABEL_FILTER
    })
        .then(allIssues => {
            //paginate returns all issues of the repo in an array
            issues = allIssues;
        });
}


function getIssueByTitle(title) {
    if (issues) {
        for (let issue of issues) {
            if (issue.title == title) {
                return issue;
            }
        }
    }
    return null;
}

async function loadComments(commentRoot) {
    let comments = [];
    let commentRootIssue = getIssueByTitle(commentRoot);
    if (!commentRootIssue) {
        console.log(`No comment root ${commentRoot} found`);
    } else {
        console.log(`Using comment root ${commentRoot}`);
        const { data } = await octokit.rest.issues.listComments({
            owner: OWNER,
            repo: REPO,
            issue_number: commentRootIssue.number
        });
        comments = data;
    }
    return comments;
}




export default async (request, context) => {

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

    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const commentRoot = searchParams.get('comment-root');

    await loadIssues();
    let comments = await loadComments(commentRoot);
    for (let comment of comments) {
        console.log('--');
        console.log(comment.body);
    }


    return new Response(JSON.stringify(commentRoot), {
        status: 200,
        headers: { "content-type": "application/json;charset=UTF-8" }
    });
}