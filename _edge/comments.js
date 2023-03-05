import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Octokit } from "https://cdn.skypack.dev/octokit";

const WEBSITE_ORIGIN = 'https://ulfschneider.io'; //FIXME improve this
const REPO = 'ulf.website'; //repo to check for comments
const OWNER = 'ulfschneider'; //repo owner
const LABEL_FILTER = 'website-comments'; //use empty string to ignore label filtering

let octokit;


async function loginGitHub() {
    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    const token = config().GITHUB_PAT || Deno.env.get(GITHUB_PAT);
    return new Octokit({ auth: token });
}


async function getRemainingRateLimit() {
    const { data } = await octokit.rest.rateLimit.get();
    return data.rate.remaining;
}

async function loadIssues(processing) {
    processing.issues = [];
    await octokit.paginate(octokit.rest.issues.listForRepo, {
        owner: OWNER,
        repo: REPO,
        labels: LABEL_FILTER
    })
        .then(allIssues => {
            //paginate returns all issues of the repo in an array
            processing.issues = allIssues;
        });
    console.log(`Loaded ${processing.issues.length} comment root issues`);
}


async function loadCommentRootIssue(processing) {
    processing.commentRootIssue = null;

    if (processing.commentRoot && processing.commentRoot.startsWith('/')) {
        await loadIssues(processing);
        for (let issue of processing.issues) {
            if (issue.title == processing.commentRoot) {
                processing.commentRootIssue = issue;
                break;
            }
        }
    } else if (processing.commentRoot) {
        //the commentRoot is treated as a GitHub issue number
        const { data } = octokit.rest.issues.get({
            owner: OWNER,
            repo: REPO,
            issue_number: processing.commentRoot,
        });
        processing.commentRootIssue = data;
    }

    if (processing.commentRootIssue) {
        console.log(`${processing.commentRoot} has the url ${processing.commentRootIssue.html_url}`);
    }
}

async function createCommentRootIssue(processing) {
    const { data } = await octokit.rest.issues.create({
        owner: OWNER,
        repo: REPO,
        title: processing.commentRoot,
        labels: [LABEL_FILTER],
        body: `This is a comment root to collect discussions about ${WEBSITE_ORIGIN + processing.commentRoot}`
    });

    processing.commentRootIssue = data;
}

async function createComment(processing) {
    if (!processing.commentRootIssue) {
        await createCommentRootIssue(processing);
    }
    const { data } = await octokit.rest.issues.createComment({
        owner: OWNER,
        repo: REPO,
        issue_number: processing.commentRootIssue.number,
        body: processing.commentBody,
    });
    console.log(`Created a comment for ${processing.commentRoot}`);
}

async function loadComments(processing) {
    processing.comments = [];
    if (processing.commentRootIssue) {
        const { data } = await octokit.rest.issues.listComments({
            owner: OWNER,
            repo: REPO,
            issue_number: processing.commentRootIssue.number
        });
        processing.comments = data;
        console.log(`Loaded ${processing.comments.length} comments for ${processing.commentRoot}`);
    }
}

function extractCommentAuthor(comment) {
    return ''; //TODO implement
}

function extractCommentWebsite(comment) {
    return ''; //TODO implement
}

function extractCommentBody(comment) {
    return comment.body; //TODO finalize
}

function getPrettifiedComments(processing) {
    return processing.comments?.map(comment => {
        return {
            body: extractCommentBody(comment),
            author: extractCommentAuthor(comment),
            website: extractCommentWebsite(comment),
            createdAt: comment.created_at,
            updatedAt: comment.updated_at
        }
    })
}




export default async (request, context) => {

    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        let processing = {
            commentRoot: searchParams.get('root'),
            method: request.method
        }

        console.log(processing.method, processing.commentRoot);

        if (!processing.commentRoot) {
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


        await loadCommentRootIssue(processing);

        //TODO create a comment only for method=='POST' && body != empty
        processing.commentBody = 'my new body';
        await createComment(processing);

        await loadComments(processing);

        return new Response(JSON.stringify(getPrettifiedComments(processing)), {
            status: 200,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify(err.message), {
            status: 500,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    }
}