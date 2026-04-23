let openInNewTab = false;

/**
 * Check if a URL is reachable and returns a valid status.
 * @param {string} url - The URL to check
 * @returns {Promise<{ok: boolean, status: number, statusText: string, unknown: boolean}>}
 */
async function checkUrl(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        // Try normal fetch first to get status code
        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        const result = {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            unknown: false
        };

        if (!response.ok) {
            console.error('[JumpX] URL returned error status:', url, '-', response.status, response.statusText);
        }

        return result;
    } catch (e) {
        clearTimeout(timeoutId);

        // If CORS error, try no-cors as fallback to check connectivity
        if (e.name === 'TypeError') {
            try {
                const controller2 = new AbortController();
                const timeoutId2 = setTimeout(() => controller2.abort(), 5000);
                await fetch(url, {
                    mode: 'no-cors',
                    method: 'HEAD',
                    signal: controller2.signal
                });
                clearTimeout(timeoutId2);
                // no-cors returns opaque response, we can't check status
                // Return unknown status (server reachable but can't verify due to CORS)
                return { ok: false, status: 0, statusText: 'CORS', unknown: true };
            } catch (e2) {
                console.error('[JumpX] URL unreachable:', url, '-', e2.message || e2);
                return { ok: false, status: 0, statusText: e2.message || 'Network error', unknown: false };
            }
        }

        console.error('[JumpX] URL check failed:', url, '-', e.message || e);
        return { ok: false, status: 0, statusText: e.message || 'Request failed', unknown: false };
    }
}

function toggleOpenMode() {
    openInNewTab = !openInNewTab;
    const toggle = document.getElementById('toggleSwitch');
    const labelCurrent = document.getElementById('labelCurrent');
    const labelNew = document.getElementById('labelNew');

    toggle.classList.toggle('active', openInNewTab);
    labelCurrent.classList.toggle('active', !openInNewTab);
    labelNew.classList.toggle('active', openInNewTab);

    // 切换到新标签页模式时，隐藏预览
    if (openInNewTab) {
        closePreview();
    }
}

function jump(url) {
    if (!url) return;

    // 如果选择在当前页面打开且是 http/https 链接，显示预览
    if (!openInNewTab && /^https?:\/\//i.test(url)) {
        showPreview(url);
        return;  // 确保不执行后面的跳转
    }

    // 其他情况：新标签页打开或非 http/https 链接
    if (openInNewTab) {
        window.open(url, '_blank');
    } else {
        location.href = url;
    }
}

async function showPreview(url) {
    console.log('showPreview called with:', url);
    const previewBar = document.getElementById('urlPreviewBar');
    const previewInput = document.getElementById('urlPreviewInput');
    const previewFrame = document.getElementById('previewFrame');
    const container = document.querySelector('.container');
    const urlStatus = document.getElementById('urlStatus');

    if (!previewBar || !previewInput || !previewFrame || !container) {
        console.error('Elements not found');
        return;
    }

    previewInput.value = url;
    previewBar.style.display = 'block';
    previewFrame.style.display = 'block';

    // Show checking status
    if (urlStatus) {
        urlStatus.textContent = 'Checking...';
        urlStatus.className = 'url-status checking';
    }

    // Check URL reachability before loading iframe
    const result = await checkUrl(url);

    // Update status based on result
    if (urlStatus) {
        if (result.ok) {
            urlStatus.textContent = result.status ? `${result.status} OK` : 'OK';
            urlStatus.className = 'url-status success';
        } else if (result.unknown) {
            urlStatus.textContent = 'Unknown';
            urlStatus.className = 'url-status unknown';
        } else {
            urlStatus.textContent = result.status ? `${result.status} ${result.statusText}` : 'Unreachable';
            urlStatus.className = 'url-status error';
        }
    }

    previewFrame.src = url;

    // 隐藏主要内容
    container.style.display = 'none';

    previewInput.focus();
    previewInput.select();
    console.log('Preview shown');
}

function closePreview() {
    const previewBar = document.getElementById('urlPreviewBar');
    const previewFrame = document.getElementById('previewFrame');
    const container = document.querySelector('.container');
    const urlStatus = document.getElementById('urlStatus');

    previewBar.style.display = 'none';
    previewFrame.style.display = 'none';
    previewFrame.src = '';
    container.style.display = 'block';

    // Clear status
    if (urlStatus) {
        urlStatus.textContent = '';
        urlStatus.className = 'url-status';
    }
}

async function confirmUrl() {
    const previewInput = document.getElementById('urlPreviewInput');
    const url = previewInput.value.trim();
    const urlStatus = document.getElementById('urlStatus');

    if (url) {
        // Show checking status
        if (urlStatus) {
            urlStatus.textContent = 'Checking...';
            urlStatus.className = 'url-status checking';
        }

        // Check URL reachability
        const result = await checkUrl(url);

        // Update status based on result
        if (urlStatus) {
            if (result.ok) {
                urlStatus.textContent = result.status ? `${result.status} OK` : 'OK';
                urlStatus.className = 'url-status success';
            } else if (result.unknown) {
                urlStatus.textContent = 'Unknown';
                urlStatus.className = 'url-status unknown';
            } else {
                urlStatus.textContent = result.status ? `${result.status} ${result.statusText}` : 'Unreachable';
                urlStatus.className = 'url-status error';
            }
        }

        const previewFrame = document.getElementById('previewFrame');
        previewFrame.src = url;
    }
}

function handleGo() {
    const input = document.getElementById('urlInput');
    const val = input.value.trim();
    if (val) jump(val);
}

document.getElementById('urlInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') handleGo();
});

// 预览输入框回车确认
document.getElementById('urlPreviewInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') confirmUrl();
});
