
/* ===== tuning ===== */
const CONCURRENCY = 32;
const TIMEOUT = 1200;
const RATE_WINDOW = 5;
const MAX_CIDR_IPS = 1024;

/* ===== state ===== */
let targets=[],idx=0,active=0,hits=0;
let running=false,paused=false;
let startTime=0,elapsedTotal=0,ratePoints=[];

/* ===== dom ===== */
const logBox=document.getElementById("logBox");
const controlBtn=document.getElementById("controlBtn");
const stopBtn=document.getElementById("stopBtn");
const progressBar=document.getElementById("progressBar");
const progressText=document.getElementById("progressText");
const timeText=document.getElementById("timeText");
const httpChk=document.getElementById("httpChk");
const httpsChk=document.getElementById("httpsChk");

/* ===== utils ===== */
const fmt=s=>{
    s=Math.max(0,Math.floor(s));
    return `${String(s/3600|0).padStart(2,"0")}:${String(s%3600/60|0).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
};
const log=(m,c="info")=>{
    if(c=="hit") {
    const d=document.createElement("div");
    d.className=c;d.innerHTML=m;
    logBox.appendChild(d);logBox.scrollTop=1e9;
    }else{
        const d=document.createElement("div");
        d.className=c;d.textContent=m;
        logBox.appendChild(d);logBox.scrollTop=1e9;
    }
};

/* ===== parse ===== */
function parsePorts(str){
    const set=new Set();
    str.split(",").forEach(p=>{
        if(p.includes("-")){
            let[a,b]=p.split("-").map(Number);
            for(let i=a;i<=b;i++) set.add(i);
        }else set.add(Number(p));
    });
    return [...set].filter(p=>p>0&&p<65536);
}

const ipToInt=ip=>ip.split(".").reduce((a,b)=>(a<<8)+(+b),0)>>>0;
const intToIp=n=>[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join(".");

function parseCIDR(c){
    const[base,mask]=c.split("/");
    const bits=32-Number(mask);
    const start=ipToInt(base)&(~((1<<bits)-1));
    const count=Math.min(1<<bits,MAX_CIDR_IPS);
    const out=[];
    for(let i=0;i<count;i++) out.push(intToIp(start+i));
    return out;
}

function parseIPs(str){
    if(str.includes("/")) return parseCIDR(str);
    if(str.includes("-")){
        const[a,b]=str.split("-");
        const sa=ipToInt(a),sb=ipToInt(b);
        const out=[];
        for(let i=sa;i<=sb&&out.length<MAX_CIDR_IPS;i++)
            out.push(intToIp(i));
        return out;
    }
    return [str.trim()];
}

/* ===== scan ===== */
async function probe(proto,ip,port){
    try{
        const c=new AbortController();
        setTimeout(()=>c.abort(),TIMEOUT);
        await fetch(`${proto}://${ip}:${port}/`,{
            mode:"no-cors",
            signal:c.signal
        });
        return true;
    }catch{return false;}
}

function pump(){
    while(running&&!paused&&active<CONCURRENCY&&idx<targets.length){
        const{proto,ip,port}=targets[idx++];
        active++;
        probe(proto,ip,port).then(ok=>{
            active--;
            const t=Date.now()/1000;
            ratePoints.push(t);
            ratePoints=ratePoints.filter(x=>t-x<RATE_WINDOW);
            if(ok){
                hits++;

                const url = `${proto}://${ip}:${port}/`;

                log(`
                <span class="hit-mark">[+]</span>
                <span class="hit-url">${url}</span>
                <a class="icon-link" href="${url}" title="Open here">🔗</a>
                <a class="icon-link" href="${url}" target="_blank" title="Open in new tab">🧭</a>
                `, "hit");

            }
            update();
            if(idx>=targets.length&&active===0) finish();
            else pump();
        });
    }
}

function update(){
    let el=elapsedTotal+(running&&!paused?(Date.now()-startTime)/1000:0);
    let rate=ratePoints.length/RATE_WINDOW;
    let eta=rate?(targets.length-idx)/rate:0;
    progressBar.style.width=((idx/targets.length)*100).toFixed(1)+"%";
    progressText.textContent=`${idx}/${targets.length} · Active ${active} · Hits ${hits}`;
    timeText.textContent=`Elapsed: ${fmt(el)} · ETA: ${rate?fmt(eta):"--:--:--"}`;
}

/* ===== control ===== */
controlBtn.onclick=()=>{
    if(!running){
        if(!httpChk.checked && !httpsChk.checked){
            alert("Select at least one protocol");
            return;
        }

        logBox.innerHTML="";
        targets=[];
        const ips=parseIPs(ipInput.value||"127.0.0.1");
        const ports=parsePorts(portInput.value);
        ips.forEach(ip=>{
            ports.forEach(p=>{
                if(httpChk.checked) targets.push({proto:"http",ip,port:p});
                if(httpsChk.checked) targets.push({proto:"https",ip,port:p});
            });
        });
        if(!targets.length) return;

        idx=active=hits=0;
        elapsedTotal=0;ratePoints=[];
        running=true;paused=false;startTime=Date.now();

        controlBtn.textContent="Pause";
        controlBtn.className="btn-pause";
        stopBtn.disabled=false;

        log(`[*] Scan started (${targets.length})`);
        pump();

    }else if(!paused){
        paused=true;
        elapsedTotal+=(Date.now()-startTime)/1000;
        controlBtn.textContent="Resume";
        controlBtn.className="btn-resume";
        log("[*] Paused");

    }else{
        paused=false;
        startTime=Date.now();
        controlBtn.textContent="Pause";
        controlBtn.className="btn-pause";
        log("[*] Resumed");
        pump();
    }
};

stopBtn.onclick=()=>{
    if(!running) return;
    running=false;
    elapsedTotal+=(Date.now()-startTime)/1000;
    controlBtn.textContent="Start";
    controlBtn.className="btn-start";
    stopBtn.disabled=true;
    log(`[!] Stopped · ${fmt(elapsedTotal)}`,"done");
};

function finish(){
    running=false;
    elapsedTotal+=(Date.now()-startTime)/1000;
    controlBtn.textContent="Start";
    controlBtn.className="btn-start";
    stopBtn.disabled=true;
    log(`[✓] Finished · Hits ${hits} · ${fmt(elapsedTotal)}`,"done");
}

