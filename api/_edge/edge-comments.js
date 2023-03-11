import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Octokit } from "https://cdn.skypack.dev/octokit?dts";
import { micromark } from 'https://esm.sh/micromark@3';

let octokit;

const REPO = config().GITHUB_COMMENT_REPO; //repo to check for comments
const OWNER = config().GITHUB_COMMENT_REPO_OWNER; //repo owner
const LABEL_FILTER = config().GITHUB_COMMENT_LABEL_FILTER; //use empty string to ignore label filtering

async function loginGitHub() {
    // Compare: https://docs.github.com/en/rest/reference/users#get-the-authenticated-user
    const token = config().GITHUB_PAT;
    return new Octokit({ auth: token });
}

function printRootIssue(processing) {
    let print = '';
    if (processing.origUrl) {
        print += 'origin url ' + processing.origUrl;
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
    if (!processing.issueNumber && processing.origUrl) {
        //we do not have an issue number and therefore
        //have to load all issues and extract the correct number
        await loadCommentRootIssues(processing);
        for (let issue of processing.issues) {
            if (issue.title == processing.origUrl.hostname + processing.origUrl.pathname) {
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
        title: processing.origUrl.hostname + processing.origUrl.pathname,
        labels: [LABEL_FILTER],
        body: `This is a comment root to collect discussions about ${processing.origUrl}`
    });

    processing.issueNumber = data.number;
    console.log(`Created comment root issue ${data.html_url} for ${printRootIssue(processing)}`);
}

function formatComment(processing) {
    return `by ${processing.comment.author}\n--\n\n${processing.comment.body}`;
}

function parseCommentBody(commentBody) {

    let author = commentBody.match(/^\s*by\s+(.*?)\s*--\s*/si);
    let body = commentBody.match(/\s*--\s*(.*?)\s*$/si);


    let parsed = {
        author: author ? author[1] : '',
        body: body ? body[1] : commentBody
    };

    return parsed;
}

async function createComment(processing) {
    if (!processing.issueNumber) {
        await createCommentRootIssue(processing);
    }
    const { data } = await octokit.rest.issues.createComment({
        owner: OWNER,
        repo: REPO,
        issue_number: processing.issueNumber,
        body: formatComment(processing)
    });
    console.log(`Created a comment ${data.html_url} for ${printRootIssue(processing)}`);
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

function getPrettifiedComments(processing) {
    return {
        issueNumber: processing.issueNumber,
        commentList: processing.comments?.map(comment => {
            let parsed = parseCommentBody(comment.body);
            return {
                body: parsed.body,
                htmlBody: micromark(parsed.body),
                author: parsed.author || comment.user.login,
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
        let origUrl = '';
        if (searchParams.get('origUrl')) {
            origUrl = new URL(searchParams.get('origUrl'));
        }

        let processing = {
            origUrl: origUrl,
            issueNumber: searchParams.get('issueNumber'),
            since: searchParams.get('since'),
            method: request.method
        }


        console.log(processing.method, printRootIssue(processing));

        if (!processing.origUrl && !processing.issueNumber) {
            console.error('The comment root argument is not specified');
            return new Response('You didn´t specify a comment root with either ?origUrl= or ?issueNumber=', {
                status: 400
            });
        }
        if (processing.method == 'POST') {
            const body = await request.json();
            processing.comment = {
                author: body.author,
                body: body.comment
            }

            if (!processing.comment.body) {
                console.error('The comment body is missing');
                return new Response('You didn´t provide a comment body to post', {
                    status: 400
                });
            }
            if (!processing.comment.author) {
                console.error('The comment author is missing');
                return new Response('You didn´t provide a comment author to post', {
                    status: 400
                });
            }
        }

        if (!octokit) {
            octokit = await loginGitHub();
        }

        await determinIssueNumber(processing);

        if (processing.method == 'POST') {
            await createComment(processing);
        }

        await loadComments(processing);

        let prettifiedComments = getPrettifiedComments(processing);
        const now = Date.now();
        console.log(`Loading ${processing.comments.length} comments for ${printRootIssue(processing)} took ${now - start} milliseconds`);
        await ammonia.init();
        return new Response(JSON.stringify(prettifiedComments), {
            status: 200,
            headers: { "content-type": "application/json;charset=UTF-8" }
        });
    } catch (err) {
        console.error(err);
        return new Response(err.message, {
            status: 500
        });
    }
}