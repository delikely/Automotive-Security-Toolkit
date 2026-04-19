let openInNewTab = false;

function toggleOpenMode() {
    openInNewTab = !openInNewTab;
    const toggle = document.getElementById('toggleSwitch');
    const labelCurrent = document.getElementById('labelCurrent');
    const labelNew = document.getElementById('labelNew');

    toggle.classList.toggle('active', openInNewTab);
    labelCurrent.classList.toggle('active', !openInNewTab);
    labelNew.classList.toggle('active', openInNewTab);
}

function jump(url) {
    if (!url) return;
    setTimeout(() => {
        if (openInNewTab) {
            window.open(url, '_blank');
        } else {
            location.href = url;
        }
    }, 80);
}

function handleGo() {
    const input = document.getElementById('urlInput');
    const val = input.value.trim();
    if (val) jump(val);
}

document.getElementById('urlInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleGo();
});
