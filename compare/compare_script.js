const areaO = document.getElementById('uploadAreaOrig');
const areaM = document.getElementById('uploadAreaMod');
const inpO = document.getElementById('fileInputOrig');
const inpM = document.getElementById('fileInputMod');
const txtO = document.getElementById('uploadTextOrig');
const txtM = document.getElementById('uploadTextMod');
const stat = document.getElementById('statusText');
const bar = document.getElementById('progressBar');
const gen = document.getElementById('generateBtn');
const dl = document.getElementById('downloadBtn');

let fileO = null;
let fileM = null;

const originalTextO = txtO.innerHTML;
const originalTextM = txtM.innerHTML;

const setStat = (m, c = '') => {
    stat.textContent = m;
    stat.className = 'status-text' + (c ? ' ' + c : '');
};

const chk = () => {
    gen.disabled = !(fileO && fileM);
};

function bind(area, input, txt, originalText, isO) {
    area.addEventListener('click', () => input.click());
    ['dragenter', 'dragover'].forEach(e => {
        area.addEventListener(e, v => {
            v.preventDefault();
            area.classList.add('dragover');
        });
    });
    ['dragleave', 'drop'].forEach(e => {
        area.addEventListener(e, v => {
            v.preventDefault();
            area.classList.remove('dragover');
        });
    });
    area.addEventListener('drop', e => {
        const f = e.dataTransfer.files[0];
        handle(f, txt, originalText, isO);
    });
    input.addEventListener('change', e => {
        const f = e.target.files[0];
        if (f) {
           handle(f, txt, originalText, isO);
        }
        input.value = '';
    });
}

function handle(f, txt, originalText, isO) {
    if (!f || !f.name.endsWith('.dat')) {
        setStat('只接受 .dat 文件', 'error');
        txt.innerHTML = originalText;
        if (isO) { fileO = null; } 
        else { fileM = null; }
        chk();
        return;
    }
    if (isO) {
        fileO = f;
    } else {
        fileM = f;
    }
    txt.textContent = f.name;
    setStat('文件已就绪', 'success');
    chk();
}

bind(areaO, inpO, txtO, originalTextO, true);
bind(areaM, inpM, txtM, originalTextM, false);

gen.addEventListener('click', async () => {
    gen.disabled = true;
    dl.classList.add('hidden');
    setStat('解析中…');
    bar.classList.add('visible');
    try {
        const [bo, bm] = await Promise.all([fileO, fileM].map(f => new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = () => rej(r.error);
            r.readAsArrayBuffer(f);
        })));
        const yml = diff(new Uint8Array(bo), new Uint8Array(bm));
        if (!yml) {
            setStat('无差异，未生成文件', 'success');
        } else {
            const blob = new Blob([yml], {
                type: 'text/yaml;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);
            dl.href = url;
            dl.download = 'diff.yaml';
            dl.classList.remove('hidden');
            setStat('生成完成', 'success');
        }
    } catch (e) {
        setStat('错误：' + e.message, 'error');
    }
    bar.classList.remove('visible');
    gen.disabled = false;
    chk();
});

dl.addEventListener('click', () => {
    setTimeout(() => {
        URL.revokeObjectURL(dl.href);
    }, 100);
});

function find(b, p) {
    for (let i = 0; i <= b.length - p.length; i++) {
        let ok = true;
        for (let j = 0; j < p.length; j++) {
            if (b[i + j] !== p[j]) {
                ok = false;
                break;
            }
        }
        if (ok) return i;
    }
    return -1;
}

const u32 = s => (s[0]) | (s[1] << 8) | (s[2] << 16) | (s[3] << 24) >>> 0;

function idx(b, s) {
    const r = [];
    for (let i = 0; i <= b.length - s.length; i++) {
        if (b[i] === s[0] && b[i + 1] === s[1]) r.push(i);
    }
    return r;
}

function diff(o, m) {
    const pat = Uint8Array.from([0x39, 0x50, 0x06, 0x00]);
    const pos = find(o, pat);
    if (pos === -1 || pos < 33) throw new Error('定位模式未找到或过靠前');
    const mk = o.slice(pos - 17, pos - 15);
    const seen = new Set();
    const out = [];
    for (const i of idx(o, mk)) {
        const off = i + 17;
        if (off + 4 > o.length || off + 4 > m.length) continue;
        const a = o.slice(off, off + 4);
        const b = m.slice(off, off + 4);
        if (a.every((v, j) => v === b[j])) continue;
        const x = u32(a);
        const y = u32(b);
        const s = Math.min(x, y);
        const l = Math.max(x, y);
        const k = s + '|' + l;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push([s, l]);
    }
    if (!out.length) return '';
    return 'search_targets:\n' + out.map(([s, l]) => '   - [' + s + ',' + l + ']\n').join('');
}