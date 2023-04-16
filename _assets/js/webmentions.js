
function disableForm(form) {
    for (let el of form.elements) {
        el.disabled = true;
    }
}

function enableForm(form) {
    for (let el of form.elements) {
        el.disabled = false;
    }
}

function clearForm(form) {
    form.webmention.value = '';
}

function formHandling() {
    let webmentionForm = document.querySelector('.webmentions .webmention-form');
    let submitButton = document.querySelector('.webmentions .submit-webmention');
    let indicateSubmitFailure = document.querySelector('.webmentions .indicate-submit-failure');
    if (webmentionForm) {
        webmentionForm.addEventListener('submit', async (event) => {
            try {
                event.preventDefault();
                disableForm(webmentionForm);
                if (submitButton) {
                    submitButton.value = 'Submitting your comment ...';
                }
                const payload = {
                    source: webmentionForm.webmention.value,
                    target: webmentionForm.comment.value
                }
                const url = new URL(location.href);

                let response = await fetch('/api/comments/?origUrl=' + url.origin + url.pathname + '&issueNumber=' + issueNumber, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });
                if (response.ok) {
                    if (indicateSubmitFailure) {
                        indicateSubmitFailure.innerHTML = '';
                    }
                    let data = await response.json();
                    printComments(commentList, data);
                    clearForm(webmentionForm);
                } else {
                    throw new Error(response.status + ' ' + response.statusText);
                }
            } catch (err) {
                commentsLoaded = false;
                if (indicateSubmitFailure) {
                    indicateSubmitFailure.innerHTML = 'There was a failure.<br>Your comment has not been submitted.<br>Please try again later.';
                }
                console.error(err);
            }
            finally {
                if (submitButton) {
                    submitButton.value = 'Submit your comment'
                }
                enableForm(webmentionForm);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', event => {
    formHandling(commentList);
});