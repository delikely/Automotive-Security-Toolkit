fetch('https://api.github.com/repos/automotive-security/Automotive-Security-Toolkit')
    .then(r => r.json())
    .then(d => { if (d.stargazers_count !== undefined) document.getElementById('gh-stars').textContent = d.stargazers_count; })
    .catch(() => { });