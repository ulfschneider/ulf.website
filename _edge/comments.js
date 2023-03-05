import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Octokit } from "https://cdn.skypack.dev/octokit";

const WEBSITE_ORIGIN = 'https://ulfschneider.io'; //TODO improve this
const REPO = 'ulf.website'; //repo to check for comments
const OWNER = 'ulfschneider'; //repo owner
const LABEL_FILTER = 'website-comments'; //use empty string to ignore label filtering

let octokit;

async function loginGitHub() {
    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    const token = config().GITHUB_PAT || Deno.env.get(GITHUB_PAT);
    return new Octokit({ auth: token });
}

function printRootIssue(processing) {
    let print = '';
    if (processing.originPath) {
        print += 'origin path ' + processing.originPath;
    }
    if (processing.issueNumber) {
        if (print) {
            print += ' with ';
        }
        print += 'issue number ' + processing.issueNumber;
    }
    return print;
}

async function loadCommentRootIssues(processing) {
    processing.issues = [];
    await octokit.paginate(octokit.rest.issues.listForRepo, {
        owner: OWNER,
        repo: REPO,
        labels: LABEL_FILTER /*use a filter to reduce load */
    })
        .then(allIssues => {
            //paginate returns all issues of the repo in an array
            processing.issues = allIssues;
        });
}


async function determinIssueNumber(processing) {
    if (!processing.issueNumber && processing.originPath) {
        //we do not have an issue number and therefore
        //have to load all issues and extract the correct number
        await loadCommentRootIssues(processing);
        for (let issue of processing.issues) {
            if (issue.title == processing.originPath) {
                processing.issueNumber = issue.number;
                break;
            }
        }
    }
}

async function createCommentRootIssue(processing) {
    const { data } = await octokit.rest.issues.create({
        owner: OWNER,
        repo: REPO,
        title: processing.originPath,
        labels: [LABEL_FILTER],
        body: `This is a comment root to collect discussions about ${WEBSITE_ORIGIN + processing.originPath}`
    });

    processing.issueNumber = data.number;
    console.log(`Created comment root issue for ${printRootIssue(processing)}`);
}

async function createComment(processing) {
    if (!processing.issueNumber) {
        await createCommentRootIssue(processing);
    }
    //TODO handle comment author and website
    const { data } = await octokit.rest.issues.createComment({
        owner: OWNER,
        repo: REPO,
        issue_number: processing.issueNumber,
        body: processing.commentBody,
    });
    console.log(`Created a comment for ${printRootIssue(processing)}`);
}

async function loadComments(processing) {
    processing.comments = [];

    if (processing.issueNumber) {
        let options = {
            owner: OWNER,
            repo: REPO,
            issue_number: processing.issueNumber,
        }
        if (processing.since) {
            options.since = processing.since;
        }
        await octokit.paginate(octokit.rest.issues.listComments, options)
            .then(allComments => {
                //paginate returns all comments in an array
                processing.comments = allComments;
            });
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
    return {
        issueNumber: processing.issueNumber,
        comments: processing.comments?.map(comment => {
            return {
                body: extractCommentBody(comment),
                author: extractCommentAuthor(comment),
                website: extractCommentWebsite(comment),
                isEdited: comment.created_at !== comment.updated_at,
                createdAt: comment.created_at,
                updatedAt: comment.updated_at
            }
        })
    }
}


export default async (request, context) => {

    try {
        const start = Date.now();
        const url = new URL(request.url);
        const searchParams = url.searchParams;

        let processing = {
            originPath: searchParams.get('originPath'),
            issueNumber: searchParams.get('issueNumber'),
            since: searchParams.get('since'),
            method: request.method
        }

        console.log(processing.method, printRootIssue(processing));

        if (!processing.originPath && !processing.issueNumber) {
            console.error('The comment root argument is not specified');
            return new Response(JSON.stringify('You didn´t specify a comment root with either ?originPath= or ?issueNumber='), {
                status: 400,
                headers: { "content-type": "application/json;charset=UTF-8" }
            });

        }

        if (!octokit) {
            octokit = await loginGitHub();
        }
        await determinIssueNumber(processing);

        //TODO create a comment only for method=='POST' && body != empty 
        //await createComment(processing);

        await loadComments(processing);

        let prettifiedComments = getPrettifiedComments(processing);
        const now = Date.now();
        console.log(`Loading ${processing.comments.length} comments for ${printRootIssue(processing)} took ${now - start} milliseconds`);

        return new Response(JSON.stringify(prettifiedComments), {
            status: 200,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    } catch (err) {
        console.error(`Failure in commenting process: ${err}`);
        return new Response(err.message, {
            status: 500
        });
    }
}