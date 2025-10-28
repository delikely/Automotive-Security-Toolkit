const dragBar = document.getElementById('drag-bar');
const leftPanel = document.getElementById('left-panel');
const rightPanel = document.getElementById('right-panel');
const mainWrapper = document.querySelector('.main-wrapper');

let isDragging = false;
dragBar.addEventListener('mousedown', () => { isDragging = true; document.body.style.cursor = 'col-resize'; });
document.addEventListener('mouseup', () => { isDragging = false; document.body.style.cursor = 'default'; });
document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const rect = mainWrapper.getBoundingClientRect();
    let newLeftWidth = e.clientX - rect.left;
    newLeftWidth = Math.max(400, Math.min(rect.width - 400 - dragBar.offsetWidth - 15, newLeftWidth));
    leftPanel.style.flexBasis = `${newLeftWidth}px`;
    rightPanel.style.flexBasis = `${rect.width - newLeftWidth - dragBar.offsetWidth - 15}px`;
});

/* 文件解析及功能 */
const fileDropArea = document.getElementById('file-drop-area');
const fileInput = document.getElementById('file-input');
const addFilesBtn = document.getElementById('add-files-btn');
const clearBtn = document.getElementById('clear-btn');
const blockTableBody = document.querySelector('#block-table tbody');
const searchAddressInput = document.getElementById('search-address-input');
const searchBtn = document.getElementById('search-btn');
const hexdumpOutput = document.getElementById('hexdump-output');

let combinedBlocks = [];
const MAX_FILES = 100;
const MAX_HEX_SIZE = 128 * 1024; // 128KB

fileDropArea.addEventListener('dragover', e => { e.preventDefault(); fileDropArea.classList.add('dragover'); });
fileDropArea.addEventListener('dragleave', () => { fileDropArea.classList.remove('dragover'); });
fileDropArea.addEventListener('drop', e => { e.preventDefault(); fileDropArea.classList.remove('dragover'); addFiles(e.dataTransfer.files); });
addFilesBtn.addEventListener('click', () => fileInput.click());
clearBtn.addEventListener('click', () => {
    combinedBlocks = [];
    blockTableBody.innerHTML = '';
    hexdumpOutput.innerHTML = `All data has been cleared. Please add a new file...`;
});
fileInput.addEventListener('change', e => { addFiles(e.target.files); fileInput.value = ''; });
searchBtn.addEventListener('click', handleSearch);

/* 文件解析 */
async function addFiles(files) {
    if (files.length + combinedBlocks.length > MAX_FILES) {
        alert(`最多只能加载 ${MAX_FILES} 个文件`);
        return;
    }
    const newBlocks = [];
    await Promise.all(Array.from(files).map(f => processFile(f, newBlocks)));
    combinedBlocks = mergeSortedBlockLists(combinedBlocks, newBlocks);
    if (combinedBlocks.length > 0) renderTable();
    else hexdumpOutput.innerHTML = 'No valid data parsed. Please check the file format.';
}

async function processFile(file, targetBlocks) {
    const fileName = file.name;
    const fileExt = fileName.split('.').pop().toLowerCase();
    const reader = new FileReader();
    return new Promise(resolve => {
        reader.onload = e => {
            const content = e.target.result;
            let blocks = [];
            try {
                if (fileExt === 'hex') blocks = parseHex(content);
                else if (fileExt === 's19') blocks = parseS19(content);
                blocks.forEach(block => { block.fileName = fileName; targetBlocks.push(block); });
            } catch (err) { console.error(`Parse ${fileName} error:`, err); }
            resolve();
        };
        reader.readAsText(file);
    });
}

function parseHex(content) {
    const blocks = [], lines = content.split('\n').filter(line => line.startsWith(':'));
    let currentData = [], currentAddress = -1, extendedLinearAddress = 0, extendedSegmentAddress = 0;
    lines.forEach(line => {
        const recordType = parseInt(line.substring(7, 9), 16);
        const dataLength = parseInt(line.substring(1, 3), 16);
        const addr16 = parseInt(line.substring(3, 7), 16);
        const dataHex = line.substring(9, 9 + dataLength * 2);
        if (recordType === 0x04) extendedLinearAddress = parseInt(dataHex, 16) << 16;
        else if (recordType === 0x02) extendedSegmentAddress = parseInt(dataHex, 16) << 4;
        else if (recordType === 0x00) {
            const fullAddress = (extendedLinearAddress + extendedSegmentAddress + addr16) >>> 0;
            const bytes = [];
            for (let i = 0; i < dataHex.length; i += 2) { const h = dataHex.substr(i, 2); if (h.length === 2) bytes.push(parseInt(h, 16)); }
            if (currentData.length > 0 && fullAddress !== currentAddress + currentData.length) {
                blocks.push({ startAddress: currentAddress, endAddress: currentAddress + currentData.length - 1, length: currentData.length, data: new Uint8Array(currentData) });
                currentData = [];
            }
            if (currentData.length === 0) currentAddress = fullAddress;
            bytes.forEach(b => currentData.push(b));
        }
    });
    if (currentData.length > 0) blocks.push({ startAddress: currentAddress, endAddress: currentAddress + currentData.length - 1, length: currentData.length, data: new Uint8Array(currentData) });
    return blocks;
}


function parseS19(content) {
    const blocks = [];
    const lines = content.split(/\r?\n/);

    if (lines[0].startsWith(':')) {
        // Intel HEX
        return parseHex(content);
    }

    for (let raw of lines) {
        const line = raw.trim();
        if (!line || line[0] !== 'S') continue;

        const typeChar = line[1];
        if (!(typeChar === '1' || typeChar === '2' || typeChar === '3')) continue;

        const byteCount = parseInt(line.substr(2, 2), 16);
        if (isNaN(byteCount) || byteCount < 3) continue;

        // 地址字节数
        const addrBytes = (typeChar === '1') ? 2 : (typeChar === '2' ? 3 : 4);
        const addrHex = line.substr(4, addrBytes * 2);
        const start = parseInt(addrHex, 16);
        if (isNaN(start)) continue;

        // 数据字节数
        const dataBytes = byteCount - addrBytes - 1;
        const dataHex = line.substr(4 + addrBytes * 2, dataBytes * 2);

        const data = new Uint8Array(dataBytes);
        for (let i = 0; i < dataBytes; i++) {
            data[i] = parseInt(dataHex.substr(i * 2, 2), 16);
        }
        if (data.length === 0) continue;

        const end = start + data.length - 1;

        // 合并逻辑：只记录 chunks，最后再拼接
        if (blocks.length > 0) {
            const last = blocks[blocks.length - 1];
            if (last.endAddress + 1 === start) {
                last.chunks.push(data);
                last.endAddress = end;
                last.length += data.length;
                continue;
            }
        }

        // 新建 block
        blocks.push({
            startAddress: start,
            endAddress: end,
            length: data.length,
            chunks: [data]  // 暂存
        });
    }

    // ✅ 最后统一合并 chunks → Uint8Array
    for (const block of blocks) {
        if (block.chunks.length === 1) {
            block.data = block.chunks[0];
        } else {
            const merged = new Uint8Array(block.length);
            let offset = 0;
            for (const chunk of block.chunks) {
                merged.set(chunk, offset);
                offset += chunk.length;
            }
            block.data = merged;
        }
        delete block.chunks;
    }

    return blocks;
}


function mergeSortedBlockLists(list1, list2) {
    const map = new Map();
    list1.forEach(item => {
        const key = `${item.startAddress}_${item.endAddress}`;
        map.set(key, { ...item, fileName: [item.fileName] });
    });
    list2.forEach(item => {
        const key = `${item.startAddress}_${item.endAddress}`;
        if (map.has(key)) {
            const existing = map.get(key);
            if (!existing.fileName.includes(item.fileName)) existing.fileName.push(item.fileName);
        } else {
            map.set(key, { ...item, fileName: [item.fileName] });
        }
    });
    return Array.from(map.values()).map(item => ({
        ...item,
        fileName: item.fileName.join(',')
    }));
}

/* 表格排序 */
let currentSortField = 'startAddress';
let currentSortAsc = true;
document.querySelectorAll('#block-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        const field = th.getAttribute('data-sort');
        if (currentSortField === field) {
            currentSortAsc = !currentSortAsc;
        } else {
            currentSortField = field;
            currentSortAsc = true;
        }
        renderTable();
    });
});

// 初始化排序箭头
function updateSortIndicators() {
    document.querySelectorAll('#block-table th[data-sort]').forEach(th => {
        const indicator = th.querySelector('.sort-indicator');
        if (th.getAttribute('data-sort') === currentSortField) {
            indicator.textContent = currentSortAsc ? '▲' : '▼';
        } else {
            indicator.textContent = '';
        }
    });
}

/* 渲染表格 */
function renderTable() {
    blockTableBody.innerHTML = '';

    const sortedBlocks = [...combinedBlocks].sort((a, b) => {
        let valA = a[currentSortField];
        let valB = b[currentSortField];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return currentSortAsc ? -1 : 1;
        if (valA > valB) return currentSortAsc ? 1 : -1;
        return 0;
    });

    sortedBlocks.forEach(block => {
        const row = document.createElement('tr'); row.__blockData__ = block;
        const startHex = '0x' + block.startAddress.toString(16).toUpperCase().padStart(8, '0');
        const endHex = '0x' + block.endAddress.toString(16).toUpperCase().padStart(8, '0');
        const lengthHex = '0x' + block.length.toString(16).toUpperCase();
        row.innerHTML = `<td>${block.fileName}</td><td>${startHex}</td><td>${endHex}</td><td>${lengthHex}</td><td><button class="download-btn">Download</button></td>`;
        row.addEventListener('dblclick', () => showHexdump(block));
        row.querySelector('.download-btn').addEventListener('click', e => {
            e.stopPropagation();
            downloadBinFile(block.data, `firmware_0x${block.startAddress.toString(16).toUpperCase()}.bin`);
        });
        blockTableBody.appendChild(row);
    });
    updateSortIndicators();
}

/* 下载 */
function downloadBinFile(data, filename) {
    const blob = new Blob([data], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
}

/* HEX 显示 */
function showHexdump(block, highlightAddress = null) {
    const hexdumpOutput = document.getElementById('hexdump-output');
    hexdumpOutput.innerHTML = '';
    let startAddress = block.startAddress;
    let endAddress = block.endAddress;

    if (highlightAddress !== null) {
        const linesBefore = 10 * 16;
        startAddress = Math.max(block.startAddress, highlightAddress - linesBefore);
    }

    const displayLength = Math.min(MAX_HEX_SIZE, endAddress - startAddress + 1);

    const highlightPositions = [];
    for (let addr = startAddress; addr < startAddress + displayLength; addr += 16) {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'hexdump-line';
        const addressHex = addr.toString(16).toUpperCase().padStart(8, '0');
        let hexString = '', asciiString = '';

        for (let i = 0; i < 16; i++) {
            const currentByteAddress = addr + i;
            const dataIndex = currentByteAddress - block.startAddress;
            if (dataIndex >= 0 && dataIndex < block.data.length) {
                const byteValue = block.data[dataIndex];
                let hexPart = byteValue.toString(16).toUpperCase().padStart(2, '0');
                let asciiPart = byteValue >= 32 && byteValue <= 126 ? String.fromCharCode(byteValue) : '.';
                if (highlightAddress !== null && currentByteAddress === highlightAddress) {
                    hexPart = `<span class="highlight">${hexPart}</span>`;
                    asciiPart = `<span class="highlight">${asciiPart}</span>`;
                    highlightPositions.push(lineDiv);
                }
                hexString += hexPart + ' ';
                asciiString += asciiPart;
            } else {
                hexString += '   ';
                asciiString += ' ';
            }
        }

        lineDiv.innerHTML = `<span class="hexdump-address">0x${addressHex}</span><span class="hexdump-hex">${hexString}</span><span class="hexdump-ascii">${asciiString}</span>`;
        hexdumpOutput.appendChild(lineDiv);
    }

    if (highlightPositions.length > 0) {
        const firstHighlight = highlightPositions[0];
        const containerHeight = hexdumpOutput.clientHeight;
        const offsetTop = firstHighlight.offsetTop;
        hexdumpOutput.scrollTop = offsetTop - containerHeight / 2 + firstHighlight.offsetHeight / 2;
    }
}

/* 搜索 */
function handleSearch() {
    const addressInput = searchAddressInput.value.trim();
    if (!addressInput) { hexdumpOutput.innerHTML = 'Enter an address to search.'; return; }
    const searchAddress = parseInt(addressInput, 16);
    if (isNaN(searchAddress)) { hexdumpOutput.innerHTML = 'The address format is incorrect. Please enter a valid hexadecimal address.'; return; }
    const foundBlock = combinedBlocks.find(block => searchAddress >= block.startAddress && searchAddress <= block.endAddress);
    if (!foundBlock) { hexdumpOutput.innerHTML = `The address was not found in the memory map. 0x${searchAddress.toString(16).toUpperCase()}.`; return; }

    var addressInFile = `Address 0x${searchAddress.toString(16).toUpperCase()} in file: ${foundBlock.fileName}`;
    console.log(addressInFile);

    var type = "success";
    var title = "Success";
    pop_notify(type, title, addressInFile);

    showHexdump(foundBlock, searchAddress);
    
}


// 添加 Enter 键触发搜索
searchAddressInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});