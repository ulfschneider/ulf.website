document.addEventListener('DOMContentLoaded', function (event) {
    let commentForm = document.querySelector('#comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const payload = {
                author: commentForm.author.value,
                comment: commentForm.comment.value
            }
            const url = new URL(location.href);
            const comments = await fetch('/api/comments/?origUrl=' + url.origin + url.pathname, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            console.log(await comments.json());
        });
    }
});