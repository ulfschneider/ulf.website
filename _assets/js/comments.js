var commentsLoaded = false;

function printComments(container, data) {
    if (data && data.commentList && data.commentList.length) {
        container.innerHTML = '<h2>Comments</h2>';
        let dateFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric' });

        for (let comment of data.commentList) {
            let article = document.createElement('article');
            article.classList.add('my-ryt-lg');
            //author 
            let meta = document.createElement('div');
            let author = document.createElement('span');
            author.classList.add('font-bold', 'text-sm');
            author.innerHTML = comment.author;
            //date posted
            let created = document.createElement('span');
            created.classList.add('text-sm');
            created.innerHTML = dateFormat.format(new Date(comment.createdAt));
            meta.appendChild(author);
            meta.appendChild(document.createTextNode(' '));
            meta.appendChild(created);
            article.appendChild(meta);
            //comment body
            let body = document.createElement('div');
            body.innerHTML = comment.htmlBody;
            article.appendChild(body);

            container.appendChild(article);
        }
    } else {
        container.innerHTML = ''
    }
}

async function loadComments(container) {
    try {
        container.innerHTML = '';
        const url = new URL(location.href);
        let response = await fetch('/api/comments/?origUrl=' + url.origin + url.pathname);
        let data = await response.json();
        printComments(container, data);
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    let commentList = document.querySelector('#comment-list');

    let observer = new IntersectionObserver(function () {
        if (!commentsLoaded) {
            loadComments(commentList);
            commentsLoaded = true;
        }
    });
    observer.observe(commentList);

    let commentForm = document.querySelector('#comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const payload = {
                author: commentForm.author.value,
                comment: commentForm.comment.value
            }
            const url = new URL(location.href);
            let response = await fetch('/api/comments/?origUrl=' + url.origin + url.pathname, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            let data = await response.json();
            printComments(commentList, data);
        });
    }
});
