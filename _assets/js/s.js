function s(user, domain, b) {
    if (user && domain) {
        if (b) {
            window.location.href = `mailto:${btoa(user)}@${btoa(domain)}`;
        } else {
            window.location.href = `mailto:${user}@${domain}`;
        }
    } else {
        console.error(`Cannot use mail address ${user}@${domain}`);
    }
}