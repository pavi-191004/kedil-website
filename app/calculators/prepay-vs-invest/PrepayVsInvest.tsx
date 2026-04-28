"use client";

import { useState, useMemo, useEffect, useRef, type ReactNode, type ChangeEvent } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const F = `'DM Sans', system-ui, -apple-system, sans-serif`;
const C = {
  bg: "#F7F7F5", white: "#FFFFFF", text: "#1A1A1A", sec: "#5C5C5C", muted: "#9A9A9A",
  border: "#E5E5E0", borderL: "#EEEEEA",
  grn: "#1B9B5E", grnL: "#E6F5ED", grnD: "#157A49",
  pur: "#6B5CE7", purL: "#EEECFB",
  org: "#D97B3A", orgL: "#FEF3EB",
  red: "#D14343",
  ylw: "#C78B0A", ylwL: "#FEF6E1",
};

const fmt = (v: number | null | undefined) => { if (v == null || isNaN(v)) return "\u20B90"; const a = Math.abs(v), s = v < 0 ? "-" : ""; if (a >= 1e7) return `${s}\u20B9${(a/1e7).toFixed(2)} Cr`; if (a >= 1e5) return `${s}\u20B9${(a/1e5).toFixed(2)} L`; if (a >= 1e3) return `${s}\u20B9${(a/1e3).toFixed(1)}K`; return `${s}\u20B9${a.toFixed(0)}`; };
const fFull = (v: number | null | undefined) => { if (v == null || isNaN(v)) return "\u20B90"; return `${v < 0 ? "-" : ""}\u20B9${Math.abs(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`; };

const emi = (p: number, r: number, n: number) => { if (p <= 0 || n <= 0) return 0; if (r === 0) return p / n; const m = r/12/100; return (p*m*Math.pow(1+m,n))/(Math.pow(1+m,n)-1); };

const amort = (pr: number, rate: number, mo: number, fixEmi: number | null = null) => {
  const e = fixEmi || emi(pr, rate, mo), r = rate/12/100;
  let b = pr, tI = 0, tP = 0, yI = 0, yPr = 0;
  const yr: { year: number; interest: number; principal: number; balance: number }[] = [];
  for (let m = 1; m <= mo; m++) {
    if (b <= 0) break;
    const ip = b*r, pp = Math.min(e-ip, b);
    b = Math.max(0, b-pp); tI += ip; tP += ip+pp; yI += ip; yPr += pp;
    if (m%12===0 || m===mo || b<=0) { yr.push({year:Math.ceil(m/12),interest:yI,principal:yPr,balance:b}); yI=0; yPr=0; if(b<=0)break; }
  }
  let lf = mo, b2 = pr;
  for (let m=1;m<=mo;m++){if(b2<=0){lf=m-1;break;}const ip=b2*r,pp=Math.min(e-ip,b2);b2=Math.max(0,b2-pp);if(b2<=0){lf=m;break;}}
  return {emi:e, totalInterest:tI, totalPaid:tP, yearly:yr, lfm:lf};
};

const SLABS = [{l:"0%",v:0},{l:"5%",v:5},{l:"10%",v:10},{l:"15%",v:15},{l:"20%",v:20},{l:"25%",v:25},{l:"30%",v:30}];
const MFP = [{l:"Conservative",r:10},{l:"Moderate",r:12},{l:"Aggressive",r:14}];

const encodeMoneyParam = (value: number) => {
  if (!isFinite(value)) return "0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e7 && abs % 1e7 === 0) return `${sign}${abs / 1e7}Cr`;
  if (abs >= 1e5 && abs % 1e5 === 0) return `${sign}${abs / 1e5}L`;
  if (abs >= 1e3 && abs % 1e3 === 0) return `${sign}${abs / 1e3}K`;
  return `${sign}${Math.round(abs)}`;
};

const decodeMoneyParam = (value: string | null) => {
  if (!value) return null;
  const trimmed = value.trim().toUpperCase();
  const match = trimmed.match(/^(-?[0-9]+(?:\.[0-9]+)?)(CR|L|K)?$/);
  if (!match) return Number(trimmed.replace(/[^0-9.-]/g, "")) || null;
  const numeric = Number(match[1]);
  if (!isFinite(numeric)) return null;
  const suffix = match[2];
  if (suffix === "CR") return numeric * 10000000;
  if (suffix === "L") return numeric * 100000;
  if (suffix === "K") return numeric * 1000;
  return numeric;
};

const buildShareUrl = (params: {
  loan: number;
  rate: number;
  tenure: number;
  surplus: number;
  slab: number;
  mfR: number;
  ppCh: number;
  regime: string;
  sipOn: boolean;
  emi: number | null;
}) => {
  const search = new URLSearchParams();
  search.set("loan", encodeMoneyParam(params.loan));
  search.set("rate", String(params.rate));
  search.set("tenure", String(params.tenure));
  search.set("surplus", encodeMoneyParam(params.surplus));
  search.set("slab", String(params.slab));
  search.set("mf", String(params.mfR));
  search.set("pp", String(params.ppCh));
  search.set("regime", params.regime);
  search.set("sip", params.sipOn ? "1" : "0");
  if (params.emi != null) search.set("emi", encodeMoneyParam(params.emi));
  return `${window.location.origin}/calculators/prepay-vs-invest?${search.toString()}`;
};

/* ---------- Shared styles ---------- */
const css = {
  section: { background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px 22px", marginBottom: 16 } as const,
  label: { display: "block" as const, fontSize: 12, color: C.sec, marginBottom: 6, fontWeight: 500, letterSpacing: "0.02em" },
  inputWrap: { display:"flex" as const, alignItems:"center" as const, borderBottom:`1.5px solid ${C.border}`, paddingBottom:3, gap:4 },
  input: { flex:1, border:"none", outline:"none", color:C.text, fontSize:17, fontFamily:F, fontWeight:600, background:"transparent", padding:"6px 0", width:"100%"},
  prefix: { color:C.muted, fontSize:14, fontWeight:600 },
  suffix: { color:C.muted, fontSize:12, fontWeight:500 },
  help: { fontSize:11, color:C.muted, marginTop:5, lineHeight:1.4 },
  pill: (on: boolean, color=C.grn) => ({ padding:"7px 14px", borderRadius:20, fontSize:12, fontWeight:on?700:500, color:on?C.white:C.sec, background:on?color:C.white, border:`1.5px solid ${on?color:C.border}`, cursor:"pointer" as const, fontFamily:F, transition:"all 0.15s" }),
  divider: { height:1, background:C.border, margin:"20px 0" },
};

/* ---------- Indian comma helpers ---------- */
const toIndian = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const stripNonDigit = (s: string) => s.replace(/[^0-9]/g, "");

/** Currency input that shows Indian commas while typing and allows clearing to empty. */
function CurrInput({ value, onChange, style }: { value: number | null; onChange: (v: number | null) => void; style?: React.CSSProperties }) {
  const [raw, setRaw] = useState(() => value != null && value !== 0 ? toIndian(value) : value === 0 ? "0" : "");
  const ref = useRef<HTMLInputElement>(null);

  // Sync display when parent value changes externally (e.g. reset, computed EMI)
  useEffect(() => {
    const parsed = Number(stripNonDigit(raw)) || 0;
    if (value != null && parsed !== value) setRaw(value === 0 ? "0" : toIndian(value));
  }, [value]);

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === "") { setRaw(""); onChange(null); return; }
    const digits = stripNonDigit(input);
    if (digits === "") { setRaw(""); onChange(null); return; }
    const num = Number(digits);
    if (!isFinite(num)) return;
    // Preserve cursor position relative to digits
    const el = ref.current;
    const prevPos = el?.selectionStart ?? input.length;
    const digitsBeforeCursor = stripNonDigit(input.slice(0, prevPos)).length;
    const formatted = toIndian(num);
    setRaw(formatted);
    onChange(num);
    // Restore cursor
    requestAnimationFrame(() => {
      if (!el) return;
      let count = 0, pos = 0;
      for (pos = 0; pos < formatted.length && count < digitsBeforeCursor; pos++) {
        if (formatted[pos] >= "0" && formatted[pos] <= "9") count++;
      }
      el.setSelectionRange(pos, pos);
    });
  };

  return <input ref={ref} type="text" inputMode="numeric" value={raw} onChange={handle} style={style || css.input} />;
}

/* ---------- Components ---------- */
function Inp({label,value,onChange,prefix="\u20B9",suffix,help,step=1,max,children}: {
  label: string; value?: number; onChange?: (v: number) => void; prefix?: string;
  suffix?: string; help?: string; step?: number; max?: number; children?: ReactNode;
}) {
  const isCurrency = prefix === "\u20B9";
  return (
    <div style={{marginBottom:18}}>
      <label style={css.label}>{label}</label>
      {children || (
        <div style={css.inputWrap}>
          {prefix && <span style={css.prefix}>{prefix}</span>}
          {isCurrency
            ? <CurrInput value={value ?? 0} onChange={v => onChange?.(v ?? 0)} />
            : <input type="number" value={value} onChange={e=>onChange?.(Number(e.target.value))} step={step} max={max} style={css.input}/>
          }
          {suffix && <span style={css.suffix}>{suffix}</span>}
        </div>
      )}
      {help && <p style={css.help}>{help}</p>}
    </div>
  );
}

function Tog({label,on,flip,note}: {label: string; on: boolean; flip: () => void; note?: string}) {
  return (
    <div style={{marginBottom:18}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}} onClick={flip}>
        <span style={{fontSize:13,color:C.sec,fontWeight:500}}>{label}</span>
        <div style={{width:38,height:20,borderRadius:10,padding:2,background:on?C.grn:C.border,transition:"background 0.2s",cursor:"pointer"}}>
          <div style={{width:16,height:16,borderRadius:8,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.15)",transform:on?"translateX(18px)":"translateX(0)",transition:"transform 0.2s"}}/>
        </div>
      </div>
      {note && <p style={{fontSize:11,color:C.muted,marginTop:5,lineHeight:1.5}}>{note}</p>}
    </div>
  );
}

function Tip({active,payload,label:l}: {active?: boolean; payload?: Array<{color: string; name: string; value: number}>; label?: string}) {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",boxShadow:"0 4px 16px rgba(0,0,0,0.07)",minWidth:160}}>
      <div style={{fontSize:10,color:C.muted,marginBottom:6,fontWeight:600,textTransform:"uppercase"}}>Year {l}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:i<payload.length-1?5:0}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:p.color,flexShrink:0}}/>
          <span style={{fontSize:11,color:C.sec,flex:1}}>{p.name}</span>
          <span style={{fontSize:11,color:C.text,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fFull(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function VRow({label,left,right,lc,rc,bold,indent}: {
  label: string; left: string; right: string; lc?: string; rc?: string; bold?: boolean; indent?: boolean;
}) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",gap:8,padding:"9px 0",borderBottom:`1px solid ${C.borderL}`}}>
      <div style={{fontSize:13,color:bold?C.text:C.sec,fontWeight:bold?700:400,paddingLeft:indent?12:0}}>{label}</div>
      <div style={{fontSize:13,color:lc||C.text,fontWeight:bold?800:600,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{left}</div>
      <div style={{fontSize:13,color:rc||C.text,fontWeight:bold?800:600,textAlign:"right",fontVariantNumeric:"tabular-nums"}}>{right}</div>
    </div>
  );
}

/* ---------- Main ---------- */
export default function PrepayVsInvest() {
  const [loan, setLoan] = useState(3000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(15);
  const [surplus, setSurplus] = useState(500000);
  const [slab, setSlab] = useState(30);
  const [mfR, setMfR] = useState(12);
  const [ppCh, setPpCh] = useState(0);
  const [regime, setRegime] = useState("old");
  const [sipOn, setSipOn] = useState(false);
  const [cEmi, setCEmi] = useState<number | null>(null);
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle");
  const hasHydrated = useRef(false);

  const aEmi = useMemo(()=>emi(loan,rate,tenure*12),[loan,rate,tenure]);
  const eEmi = cEmi!==null?cEmi:aEmi;
  useEffect(()=>{setCEmi(null)},[loan,rate,tenure]);
  const isNew = regime==="new";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loanParam = decodeMoneyParam(params.get("loan"));
    const rateParam = Number(params.get("rate"));
    const tenureParam = Number(params.get("tenure"));
    const surplusParam = decodeMoneyParam(params.get("surplus"));
    const slabParam = Number(params.get("slab"));
    const mfParam = Number(params.get("mf"));
    const ppParam = Number(params.get("pp"));
    const regimeParam = params.get("regime");
    const sipParam = params.get("sip");
    const emiParam = decodeMoneyParam(params.get("emi"));

    if (loanParam != null) setLoan(loanParam);
    if (isFinite(rateParam)) setRate(rateParam);
    if (isFinite(tenureParam) && tenureParam > 0) setTenure(tenureParam);
    if (surplusParam != null) setSurplus(surplusParam);
    if (isFinite(slabParam)) setSlab(slabParam);
    if (isFinite(mfParam)) setMfR(mfParam);
    if (isFinite(ppParam)) setPpCh(ppParam);
    if (regimeParam === "old" || regimeParam === "new") setRegime(regimeParam);
    if (sipParam === "1" || sipParam === "true") setSipOn(true);
    if (emiParam != null) setCEmi(emiParam);

    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    const nextUrl = buildShareUrl({ loan, rate, tenure, surplus, slab, mfR, ppCh, regime, sipOn, emi: cEmi });
    window.history.replaceState({}, "", nextUrl);
  }, [loan, rate, tenure, surplus, slab, mfR, ppCh, regime, sipOn, cEmi]);

  const R = useMemo(()=>{
    const mo=tenure*12, tr=slab/100;
    const noP=amort(loan,rate,mo,eEmi), np=Math.max(0,loan-surplus), wiP=amort(np,rate,mo,eEmi);
    const iSv=noP.totalInterest-wiP.totalInterest, pc=surplus*(ppCh/100);
    const s24C=isNew?0:200000, s80C=isNew?0:150000;
    let s24=0,s80=0;
    for(let y=0;y<Math.min(noP.yearly.length,wiP.yearly.length);y++){
      s24+=(Math.min(noP.yearly[y].interest,s24C)-Math.min(wiP.yearly[y]?.interest||0,s24C))*tr;
      s80+=(Math.min(noP.yearly[y].principal,s80C)-Math.min(wiP.yearly[y]?.principal||0,s80C))*tr;
    }
    const tL=Math.max(0,s24+s80), mS=noP.lfm-wiP.lfm;
    let sC=0,sI=0,sG=0,sT=0,sN=0;
    if(sipOn&&mS>0){const mr=mfR/100/12;sI=eEmi*mS;for(let m=1;m<=mS;m++)sC+=eEmi*Math.pow(1+mr,mS-m);sG=sC-sI;sT=Math.max(0,sG-125000)*0.125;sN=sC-sT;}
    const nP=iSv-pc-tL+sN;
    const mV=surplus*Math.pow(1+mfR/100,tenure),mG=mV-surplus,mT=Math.max(0,mG-125000)*0.125,nI=mG-mT;
    const d=nI-nP,w=d>0?"invest":"prepay";

    const ch: Record<string, number>[] = [{year:0,"As-Is":loan,"Prepaid":np,"MF Invest":surplus,...(sipOn?{"EMI SIP":0}:{})}];
    for(let y=1;y<=tenure;y++){
      const pt: Record<string, number> = {year:y,"As-Is":Math.round(noP.yearly[y-1]?.balance??0),"Prepaid":Math.round(wiP.yearly[y-1]?.balance??0),"MF Invest":Math.round(surplus*Math.pow(1+mfR/100,y))};
      if(sipOn&&mS>0){const sm=Math.min(Math.max(0,y*12-wiP.lfm),mS),mr=mfR/100/12;let sc=0;for(let m=1;m<=sm;m++)sc+=eEmi*Math.pow(1+mr,sm-m);pt["EMI SIP"]=Math.round(sc);}
      ch.push(pt);
    }
    const yS=Math.floor(mS/12),rM=mS%12,ptY=Math.floor(wiP.lfm/12),ptM=wiP.lfm%12;
    const ptL=`${ptY>0?ptY+" yr":""}${ptM>0?" "+ptM+" mo":""}`.trim()||"0";
    return {noP,wiP,iSv,pc,tL,s24,s80,nP,mV,mG,mT,nI,d,w,wA:Math.abs(d),ch,mS,yS,rM,np,ptL,sC,sI,sG,sT,sN,emi:eEmi};
  },[loan,rate,tenure,surplus,slab,mfR,ppCh,regime,sipOn,eEmi,isNew]);

  const wC = R.w==="prepay"?C.grn:C.pur;
  const pctP = R.nP/(R.nP+R.nI)*100;

  const shareResult = async () => {
    try {
      const url = buildShareUrl({ loan, rate, tenure, surplus, slab, mfR, ppCh, regime, sipOn, emi: cEmi });
      await navigator.clipboard.writeText(url);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
  };

  const saveAsPdf = () => {
    window.print();
  };

  return (
    <div style={{fontFamily:F,background:C.bg,color:C.text,minHeight:"100vh"}}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet"/>
      <style>{`
        .kd-grid{display:grid;grid-template-columns:360px 1fr;gap:28px;align-items:start}
        .kd-sidebar{position:sticky;top:16px}
        @media(max-width:800px){
          .kd-grid{grid-template-columns:1fr;gap:16px}
          .kd-sidebar{position:static}
          .kd-hero-stats{flex-direction:column!important;gap:12px!important}
          .kd-tax-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* Nav */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"12px 0"}}>
        <div style={{maxWidth:1040,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:26,height:26,borderRadius:6,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",background:C.white,border:`1px solid ${C.border}`}}>
              <img src="/app_logo.png" alt="Kedil logo" style={{width:"100%",height:"100%",objectFit:"cover"}} />
            </div>
            <span style={{fontSize:14,fontWeight:700}}>Kedil</span>
            <span style={{fontSize:10,color:C.muted,background:C.grnL,padding:"2px 7px",borderRadius:8,fontWeight:600}}>Tools</span>
          </div>
          <a href="https://app.kedil.money" style={{fontSize:12,color:C.grn,fontWeight:600,textDecoration:"none"}}>Open App &rarr;</a>
        </div>
      </div>

      <div style={{maxWidth:1040,margin:"0 auto",padding:"32px 20px 48px"}}>
        <nav aria-label="Breadcrumb" style={{fontSize:12,color:C.muted,marginBottom:14}}>
          <a href="/" style={{color:C.muted,textDecoration:"none"}}>Home</a>
          <span style={{margin:"0 8px"}}>&gt;</span>
          <span style={{color:C.muted}}>Calculators</span>
          <span style={{margin:"0 8px"}}>&gt;</span>
          <span style={{color:C.text,fontWeight:600}}>Prepay vs Invest Calculator</span>
        </nav>

        {/* Title */}
        <div style={{marginBottom:28}}>
          <h1 style={{fontSize:26,fontWeight:800,lineHeight:1.25,margin:"0 0 8px",letterSpacing:"-0.02em"}}>
            Home Loan Prepayment Calculator <span style={{color:C.muted,fontWeight:600}}>&mdash; Save Lakhs on Interest</span>
          </h1>
          <p style={{fontSize:14,color:C.sec,margin:0,lineHeight:1.5,maxWidth:"100%"}}>
            Find out exactly how much interest you save — and how many years you cut — by making a lump-sum prepayment on your home loan vs. investing that money in mutual funds or FDs. Built for salaried professionals in India who want a clear, data-backed answer and not generic advice.
          </p>
        </div>

        <div className="kd-grid">
          {/* ====== LEFT: INPUTS ====== */}
          <div className="kd-sidebar">
            <div style={css.section}>
              <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>Loan Details</div>
              <Inp label="Loan Outstanding" value={loan} onChange={setLoan} step={100000}/>
              <Inp label="Interest Rate" value={rate} onChange={setRate} prefix="" suffix="% p.a." step={0.1} max={20}/>
              <Inp label="Remaining Tenure" value={tenure} onChange={setTenure} prefix="" suffix="years" max={30}/>
              <Inp label="Monthly EMI">
                <div style={css.inputWrap}>
                  <span style={css.prefix}>{"\u20B9"}</span>
                  <CurrInput value={Math.round(eEmi)} onChange={v=>setCEmi(v)} style={css.input}/>
                  {cEmi!==null&&<button onClick={()=>setCEmi(null)} style={{background:C.grnL,border:"none",color:C.grn,fontSize:10,cursor:"pointer",fontFamily:F,padding:"2px 7px",borderRadius:8,fontWeight:600,whiteSpace:"nowrap"}}>{"\u21BA"} Auto</button>}
                </div>
                <p style={css.help}>{cEmi!==null?`Auto: ${fFull(Math.round(aEmi))}`:"Auto-calculated. Edit to override."}</p>
              </Inp>

              <div style={css.divider}/>
              <div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:16}}>Investment Options</div>
              <Inp label="Surplus Amount" value={surplus} onChange={setSurplus} step={50000} help="Lump sum you can deploy today"/>

              {/* Tax Regime */}
              <div style={{marginBottom:18}}>
                <label style={css.label}>Tax Regime</label>
                <div style={{display:"flex",gap:6}}>
                  <button style={css.pill(regime==="old")} onClick={()=>setRegime("old")}>Old Regime</button>
                  <button style={css.pill(regime==="new")} onClick={()=>setRegime("new")}>New Regime</button>
                </div>
                {isNew&&<p style={{fontSize:10,color:C.org,marginTop:5}}>Sec 24 &amp; 80C not available under new regime</p>}
              </div>

              {!isNew&&(
                <div style={{marginBottom:18}}>
                  <label style={css.label}>Tax Slab</label>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {SLABS.map(s=><button key={s.v} onClick={()=>setSlab(s.v)} style={css.pill(slab===s.v)}>{s.l}</button>)}
                  </div>
                </div>
              )}

              {/* MF Return */}
              <div style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                  <label style={{...css.label,marginBottom:0}}>Expected MF Return</label>
                  <span style={{fontSize:18,fontWeight:800,color:C.pur}}>{mfR}%</span>
                </div>
                {/* Slider */}
                <div style={{position:"relative",marginBottom:10}}>
                  <div style={{position:"absolute",top:9,left:0,right:0,height:4,borderRadius:2,background:C.borderL}}/>
                  <div style={{position:"absolute",top:9,left:0,width:`${((mfR-6)/18)*100}%`,height:4,borderRadius:2,background:C.pur,transition:"width 0.1s"}}/>
                  <input type="range" min={6} max={24} step={0.5} value={mfR} onChange={e=>setMfR(Number(e.target.value))}
                    style={{width:"100%",appearance:"none",WebkitAppearance:"none",background:"transparent",cursor:"pointer",height:22,position:"relative",zIndex:1,outline:"none"}}
                  />
                  <style>{`
                    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:${C.pur};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.15);cursor:pointer}
                    input[type=range]::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:${C.pur};border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.15);cursor:pointer}
                  `}</style>
                </div>
                {/* Preset pills */}
                <div style={{display:"flex",gap:6}}>
                  {MFP.map(p=>(
                    <button key={p.r} onClick={()=>setMfR(p.r)} style={{
                      padding:"4px 10px",borderRadius:14,fontSize:11,fontWeight:mfR===p.r?700:500,cursor:"pointer",fontFamily:F,
                      color:mfR===p.r?C.pur:C.muted,background:mfR===p.r?C.purL:"transparent",
                      border:`1px solid ${mfR===p.r?C.pur:C.border}`,transition:"all 0.15s",
                    }}>
                      {p.l} {p.r}%
                    </button>
                  ))}
                </div>
                <p style={css.help}>Equity MF &middot; LTCG 12.5% above {"\u20B9"}1.25L</p>
              </div>

              <Inp label="Prepayment Charges" value={ppCh} onChange={setPpCh} prefix="" suffix="%" step={0.25} max={5} help="Floating: usually 0%"/>

              <div style={css.divider}/>
              <Tog label="Freed EMI Reinvestment" on={sipOn} flip={()=>setSipOn(!sipOn)}
                note="After prepayment closes the loan early, invest the freed EMI as monthly SIP for the remaining tenure."/>
              {sipOn&&R.mS>0&&(
                <div style={{background:C.grnL,borderRadius:8,padding:"7px 10px",fontSize:11,color:C.grnD,fontWeight:500,marginTop:-10}}>
                  {fFull(Math.round(eEmi))}/mo &times; {R.mS} months at {mfR}%
                </div>
              )}
            </div>
          </div>

          {/* ====== RIGHT: RESULTS ====== */}
          <div>
            {/* Result Banner */}
            <div style={{...css.section,padding:"24px 22px 20px"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>
                  {R.w==="prepay"?"\uD83C\uDFE0 Prepayment":"\uD83D\uDCC8 Investing"} wins
                </span>
                {isNew&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:C.orgL,color:C.org,fontWeight:600}}>New Regime</span>}
                {sipOn&&R.mS>0&&<span style={{fontSize:10,padding:"2px 7px",borderRadius:8,background:C.grnL,color:C.grn,fontWeight:600}}>+EMI SIP</span>}
              </div>
              <div style={{fontSize:40,fontWeight:800,color:wC,letterSpacing:"-0.03em",lineHeight:1,marginBottom:16}}>
                {fFull(Math.round(R.wA))} <span style={{fontSize:15,fontWeight:500,color:C.muted}}>net advantage</span>
              </div>
              {/* Bar */}
              <div style={{height:6,borderRadius:3,background:C.borderL,overflow:"hidden",display:"flex",marginBottom:6}}>
                <div style={{width:`${Math.max(4,Math.min(96,pctP))}%`,background:C.grn,borderRadius:"3px 0 0 3px",transition:"width 0.3s"}}/>
                <div style={{flex:1,background:C.pur,borderRadius:"0 3px 3px 0"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.sec}}>
                <span><span style={{color:C.grn,fontWeight:700}}>Prepay</span> {fmt(R.nP)}</span>
                <span>{fmt(R.nI)} <span style={{color:C.pur,fontWeight:700}}>Invest</span></span>
              </div>
              <div className="kd-hero-stats" style={{display:"flex",gap:28,marginTop:20,paddingTop:16,borderTop:`1px solid ${C.borderL}`}}>
                {[{l:"Monthly EMI",v:fFull(Math.round(R.emi))},{l:"Interest Saved",v:fmt(R.iSv)},{l:"Loan-Free",v:R.ptL}].map((s,i)=>(
                  <div key={i}><div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3}}>{s.l}</div><div style={{fontSize:18,fontWeight:700}}>{s.v}</div></div>
                ))}
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:16}}>
                <button onClick={shareResult} style={{minHeight:44,padding:"0 14px",borderRadius:12,border:`1px solid ${C.grn}`,background:C.grn,color:C.white,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>Share this result</button>
                <button onClick={saveAsPdf} style={{minHeight:44,padding:"0 14px",borderRadius:12,border:`1px solid ${C.border}`,background:C.white,color:C.text,fontFamily:F,fontSize:13,fontWeight:700,cursor:"pointer"}}>Save as PDF</button>
              </div>
              <div style={{fontSize:11,color:shareState === "copied" ? C.grn : shareState === "error" ? C.red : C.muted,marginTop:8,minHeight:16}}>
                {shareState === "copied" ? "Result link copied. Share it on WhatsApp or X." : shareState === "error" ? "Copy failed. You can still copy the URL from your browser." : ""}
              </div>
            </div>

            {/* Chart */}
            <div style={{...css.section,padding:"24px 20px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:8}}>
                <div>
                  <h3 style={{fontSize:15,fontWeight:700,margin:"0 0 4px"}}>Loan Balance Over Time</h3>
                  {R.mS>0&&<span style={{fontSize:11,color:C.grn,fontWeight:600}}>{"\u26A1"} Loan-free {R.yS>0?`${R.yS}yr `:""}{R.rM>0?`${R.rM}mo `:""} earlier</span>}
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {[{c:C.org,n:"As-Is",d:true},{c:C.grn,n:"Prepaid",d:false},{c:C.pur,n:"MF",d:true},...(sipOn&&R.mS>0?[{c:C.ylw,n:"EMI SIP",d:false}]:[])].map((l,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:12,height:2,background:l.d?"transparent":l.c,borderTop:l.d?`2px dashed ${l.c}`:"none"}}/>
                      <span style={{fontSize:10,color:C.muted,fontWeight:500}}>{l.n}</span>
                    </div>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={R.ch} margin={{top:4,right:4,left:0,bottom:0}}>
                  <defs>
                    <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.org} stopOpacity={0.06}/><stop offset="100%" stopColor={C.org} stopOpacity={0}/></linearGradient>
                    <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.grn} stopOpacity={0.1}/><stop offset="100%" stopColor={C.grn} stopOpacity={0}/></linearGradient>
                    <linearGradient id="a3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.pur} stopOpacity={0.08}/><stop offset="100%" stopColor={C.pur} stopOpacity={0}/></linearGradient>
                    <linearGradient id="a4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.ylw} stopOpacity={0.1}/><stop offset="100%" stopColor={C.ylw} stopOpacity={0}/></linearGradient>
                  </defs>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill:C.muted,fontSize:10,fontFamily:F}} dy={5}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill:C.muted,fontSize:10,fontFamily:F}} tickFormatter={fmt} width={48}/>
                  <Tooltip content={<Tip/>} cursor={{stroke:C.border,strokeWidth:1}}/>
                  <Area type="monotone" dataKey="As-Is" stroke={C.org} strokeWidth={1.5} fill="url(#a1)" strokeDasharray="5 3" dot={false} activeDot={{r:3,fill:C.org,stroke:C.white,strokeWidth:2}}/>
                  <Area type="monotone" dataKey="Prepaid" stroke={C.grn} strokeWidth={2} fill="url(#a2)" dot={false} activeDot={{r:3,fill:C.grn,stroke:C.white,strokeWidth:2}}/>
                  <Area type="monotone" dataKey="MF Invest" stroke={C.pur} strokeWidth={1.5} fill="url(#a3)" strokeDasharray="4 3" dot={false} activeDot={{r:3,fill:C.pur,stroke:C.white,strokeWidth:2}}/>
                  {sipOn&&R.mS>0&&<Area type="monotone" dataKey="EMI SIP" stroke={C.ylw} strokeWidth={1.5} fill="url(#a4)" dot={false} activeDot={{r:3,fill:C.ylw,stroke:C.white,strokeWidth:2}}/>}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Final Numbers */}
            <div style={{...css.section,padding:"24px 22px"}}>
              <h3 style={{fontSize:15,fontWeight:700,margin:"0 0 3px"}}>Your Final Numbers</h3>
              <p style={{fontSize:12,color:C.muted,margin:"0 0 16px"}}>What happens to your {fFull(surplus)} over {tenure} years.</p>
              <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",gap:8,padding:"6px 0",borderBottom:`2px solid ${C.border}`}}>
                <div/><div style={{fontSize:10,color:C.grn,fontWeight:700,textAlign:"right",textTransform:"uppercase",letterSpacing:"0.05em"}}>Prepay</div>
                <div style={{fontSize:10,color:C.pur,fontWeight:700,textAlign:"right",textTransform:"uppercase",letterSpacing:"0.05em"}}>Invest</div>
              </div>
              <VRow label="Surplus Deployed" left={fFull(surplus)} right={fFull(surplus)}/>
              <VRow label="New Loan Principal" left={fFull(Math.round(R.np))} right={fFull(loan)} lc={C.grn}/>
              <VRow label="EMI (unchanged)" left={fFull(Math.round(R.emi))} right={fFull(Math.round(R.emi))}/>
              <VRow label="Actual Tenure" left={R.ptL} right={`${tenure} yr`} lc={C.grn}/>
              <VRow label="Total Interest" left={fFull(Math.round(R.wiP.totalInterest))} right={fFull(Math.round(R.noP.totalInterest))} lc={C.grn} rc={C.org}/>
              <VRow label="Interest Saved" left={fFull(Math.round(R.iSv))} right={"\u2014"} lc={C.grn} rc={C.muted}/>
              {!isNew&&<VRow label="Tax Benefits Lost" left={`-${fFull(Math.round(R.tL))}`} right={"\u20B90 (retained)"} lc={C.red} rc={C.grn}/>}
              {isNew&&<VRow label="Tax Benefits" left={"\u20B90"} right={"\u20B90"} lc={C.muted} rc={C.muted}/>}
              {sipOn&&R.sC>0&&<>
                <VRow label="EMI SIP Invested" left={fFull(Math.round(R.sI))} right={"\u2014"} rc={C.muted} indent/>
                <VRow label="EMI SIP Corpus" left={fFull(Math.round(R.sC))} right={"\u2014"} lc={C.ylw} rc={C.muted} indent/>
                <VRow label="EMI SIP Tax" left={R.sT>0?`-${fFull(Math.round(R.sT))}`:`\u20B90`} right={"\u2014"} lc={R.sT>0?C.red:C.muted} rc={C.muted} indent/>
              </>}
              <VRow label={`MF Corpus (Yr ${tenure})`} left={"\u2014"} right={fFull(Math.round(R.mV))} lc={C.muted} rc={C.pur}/>
              <VRow label="Capital Gains Tax" left={"\u2014"} right={`-${fFull(Math.round(R.mT))}`} lc={C.muted} rc={C.red}/>
              {R.mS>0&&<VRow label="Loan-Free Earlier" left={`${R.yS>0?R.yS+"yr ":""}${R.rM>0?R.rM+"mo":""}`} right={"\u2014"} lc={C.grn} rc={C.muted}/>}
              <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",gap:8,padding:"12px 0 4px",borderTop:`2px solid ${C.border}`,marginTop:4}}>
                <div style={{fontSize:14,fontWeight:800}}>NET BENEFIT</div>
                <div style={{fontSize:18,fontWeight:800,textAlign:"right",color:R.w==="prepay"?C.grn:C.text,fontVariantNumeric:"tabular-nums"}}>{fmt(R.nP)}{R.w==="prepay"&&" \u2713"}</div>
                <div style={{fontSize:18,fontWeight:800,textAlign:"right",color:R.w==="invest"?C.pur:C.text,fontVariantNumeric:"tabular-nums"}}>{fmt(R.nI)}{R.w==="invest"&&" \u2713"}</div>
              </div>
            </div>

            {/* Tax */}
            <div style={css.section}>
              <h3 style={{fontSize:15,fontWeight:700,margin:"0 0 18px"}}>Tax Impact</h3>
              <div className="kd-tax-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
                <div style={{background:C.grnL,borderRadius:10,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.grn,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.04em"}}>Cost of Prepaying</div>
                  {(!isNew?[
                    {l:"Sec 24 Lost",v:`-${fFull(Math.round(R.s24))}`,c:C.red,h:`Up to \u20B92L/yr \u00D7 ${slab}%`},
                    {l:"Sec 80C Lost",v:`-${fFull(Math.round(R.s80))}`,c:C.red,h:`Up to \u20B91.5L/yr \u00D7 ${slab}%`},
                    {l:"Total",v:`-${fFull(Math.round(R.tL))}`,c:C.red,b:true},
                  ]:[
                    {l:"Sec 24 / 80C",v:"\u20B90",c:C.muted,h:"Not available under new regime"},
                    {l:"Total",v:"\u20B90",c:C.grn,h:"No tax penalty",b:true},
                  ]).map((x,i)=>(
                    <div key={i} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:12,color:C.sec,fontWeight:x.b?700:400}}>{x.l}</span>
                        <span style={{fontSize:12,color:x.c,fontWeight:x.b?800:600,fontVariantNumeric:"tabular-nums"}}>{x.v}</span>
                      </div>
                      {x.h&&<div style={{fontSize:10,color:C.muted,marginTop:1}}>{x.h}</div>}
                    </div>
                  ))}
                </div>
                <div style={{background:C.purL,borderRadius:10,padding:"16px 18px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.pur,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.04em"}}>Cost of Investing</div>
                  {[
                    {l:"LTCG (12.5%)",v:`-${fFull(Math.round(R.mT))}`,c:C.red,h:"On gains above \u20B91.25L"},
                    ...(!isNew?[{l:"Benefits Retained",v:`+${fFull(Math.round(R.tL))}`,c:C.grn,h:"Sec 24 & 80C continue"}]:[]),
                    ...(sipOn&&R.sT>0?[{l:"EMI SIP LTCG",v:`-${fFull(Math.round(R.sT))}`,c:C.red,h:"On freed EMI SIP gains"}]:[]),
                  ].map((x,i)=>(
                    <div key={i} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:12,color:C.sec}}>{x.l}</span>
                        <span style={{fontSize:12,color:x.c,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{x.v}</span>
                      </div>
                      {x.h&&<div style={{fontSize:10,color:C.muted,marginTop:1}}>{x.h}</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{padding:"10px 14px",background:C.bg,borderRadius:8,fontSize:11,color:C.muted,lineHeight:1.6}}>
                {!isNew&&<>80C ({"\u20B9"}1.5L) shared with EPF/PPF/ELSS. Assumes self-occupied (Sec 24 cap {"\u20B9"}2L).<br/></>}
                {isNew&&<>New regime: no Sec 24/80C &mdash; no tax penalty for prepaying.<br/></>}
                MF returns assumed constant. Consult a financial advisor.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
