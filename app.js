const{useState,useEffect,useCallback,useRef}=React;

/* ═══ THEME ═══ */
const C={
  bg:'#06080c',bgMid:'#090c12',bgCard:'#0c1018',bgHdr:'#0f1520',
  border:'#1a2535',border2:'#253545',
  blue:'#4a9eff',blueLt:'#7abfff',blueDk:'#0a1828',
  silver:'#b8c8d8',silverDm:'#4a6070',silv:'#8898a8',
  doneBg:'#06080c',doneTx:'#253040',
  red:'#cc4444',amber:'#c89030',amberLt:'#e8b050',
  green:'#3a9a5a',teal:'#2a8a8a',tealLt:'#4ababa',
  purple:'#8a5aaa',purpleLt:'#aa7acc',
  orange:'#cc7030',
  wh:'#4a9eff',hos:'#cc7a30',bw:'#8a5aaa',
};
const FD="'Cinzel','Palatino Linotype',serif";
const FB="'Crimson Text','Palatino Linotype',serif";

/* ═══ TYPE CONFIG ═══ */
function typeConf(type){
  switch(type){
    case'Main Quest':    return{bg:'#0a1828',border:'#1a3a5a',text:'#4a9eff'};
    case'Side Quest':    return{bg:'#081820',border:'#1a3050',text:'#5aafdf'};
    case'Contract':      return{bg:'#1a1200',border:'#4a3000',text:'#e8a820'};
    case'Treasure Hunt': return{bg:'#120818',border:'#3a1a50',text:'#b06ad0'};
    case'Event':         return{bg:'#081408',border:'#1a3a1a',text:'#4aaa5a'};
    case'Race':          return{bg:'#180e00',border:'#4a2800',text:'#e07030'};
    default:             return{bg:C.bgCard,border:C.border,text:C.silv};
  }
}
function fromBadge(from){
  if(from==='Hearts of Stone')return{text:C.hos,label:'HoS'};
  if(from==='Blood and Wine') return{text:C.bw, label:'B&W'};
  return null;
}

/* ═══ WHEN BADGE CONFIG ═══ */
function whenConf(when){
  if(!when)return null;
  const w=when.toUpperCase();
  if(w.includes('POINT OF NO RETURN'))return{color:'#ff4444',label:'⛔ '+when.toUpperCase()};
  if(w==='CAUTION')                   return{color:'#ff8800',label:'⚠ CAUTION'};
  if(w.startsWith('EARLY IN STORY'))  return{color:C.tealLt,label:'🕐 '+when};
  if(w.startsWith('ASAP'))            return{color:C.amber, label:'⚡ '+when};
  return{color:C.silv,label:when};
}

/* ═══ BASE COMPONENTS ═══ */
function Bar({done,total,color=C.blue}){
  const pct=total>0?Math.round(done/total*100):0;
  return(
    <div style={{display:'flex',alignItems:'center',gap:'8px',width:'100%'}}>
      <div style={{flex:1,height:'4px',background:'#06080c',border:`1px solid ${C.border}`,borderRadius:'3px',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${color}88,${color})`,transition:'width 0.4s',boxShadow:pct>0?`0 0 4px ${color}55`:'none'}}/>
      </div>
      <span style={{color:pct===100?C.blueLt:C.silv,fontSize:'11px',fontFamily:FD,minWidth:'44px',textAlign:'right'}}>{done}/{total}</span>
    </div>
  );
}

function Checkbox({checked,onChange,color=C.blue,size=15}){
  return(
    <div onClick={onChange} style={{width:size,height:size,flexShrink:0,cursor:'pointer',
      border:`1.5px solid ${checked?color:C.border2}`,borderRadius:'2px',
      background:checked?color:'transparent',display:'flex',alignItems:'center',justifyContent:'center',
      transition:'all 0.15s',boxShadow:checked?`0 0 5px ${color}66`:'none'}}>
      {checked&&<span style={{color:'#060c10',fontSize:Math.floor(size*0.65)+'px',fontWeight:'800',lineHeight:1}}>✓</span>}
    </div>
  );
}

/* ═══ ACHIEVEMENT BADGE (inline on quest row) ═══ */
function QuestAchBadge({achId,checked,onToggle}){
  const ach=ACHIEVEMENTS.find(a=>a.id===achId);
  if(!ach)return null;
  const done=!!checked[achId];
  const[open,setOpen]=useState(false);
  const isMissable=ach.cat.includes('Missable')||ach.cat==='Story'||ach.cat.includes('Story');
  const col=isMissable?'#ffaa22':'#66bbff';
  return(
    <div style={{marginLeft:'23px',marginRight:'8px',marginBottom:'3px',
      background:done?'#0a0c08':'#0e1a10',
      border:`1px solid ${done?'#2a4a20':'#3a7a30'}`,
      borderLeft:`3px solid ${done?'#4a7a30':col}`,
      borderRadius:'0 3px 3px 0',padding:'5px 8px 5px 10px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
        <span style={{fontSize:'12px',flexShrink:0}}>🏆</span>
        <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>onToggle(achId)}>
          <span style={{fontFamily:FD,fontSize:'11px',letterSpacing:'0.5px',
            color:done?'#3a6030':col,textDecoration:done?'line-through':'none'}}>
            {ach.name}
          </span>
          <span style={{fontFamily:FB,fontSize:'10px',color:C.silverDm,fontStyle:'italic',marginLeft:'6px'}}>
            {ach.secret?'(secret achievement)':'(achievement)'}
          </span>
        </div>
        <Checkbox checked={done} onChange={()=>onToggle(achId)} color={col} size={13}/>
        <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}
          style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',padding:'2px 6px',
            cursor:'pointer',border:`1px solid ${col}44`,background:'transparent',
            color:col,borderRadius:'3px',textTransform:'uppercase',flexShrink:0}}>
          {open?'▲':'?'}
        </button>
      </div>
      {open&&(
        <div style={{fontFamily:FB,fontSize:'12px',color:'#6a9060',fontStyle:'italic',
          marginTop:'4px',marginLeft:'20px',lineHeight:'1.4'}}>
          {ach.desc}
        </div>
      )}
    </div>
  );
}

/* ═══ QUEST ITEM ═══ */
function QItem({item,checked,onToggle}){
  const done=!!checked[item.id];
  const tc=typeConf(item.type);
  const fb=fromBadge(item.from);
  const wc=whenConf(item.when);
  const linkedAchs=(QUEST_ACHIEVEMENTS[item.id]||[]);
  const[hov,setHov]=useState(false);
  return(
    <div style={{borderBottom:`1px solid ${C.border}`,background:done?C.doneBg:hov?'#0c1420':'transparent',transition:'background 0.1s'}}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'6px 10px'}}>
        <div style={{marginTop:'3px',flexShrink:0}}>
          <Checkbox checked={done} onChange={()=>onToggle(item.id)} color={tc.text}/>
        </div>
        <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>onToggle(item.id)}>
          {/* Name row */}
          <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}>
            <span style={{fontFamily:FB,fontSize:'14px',lineHeight:'1.3',
              color:done?C.doneTx:C.silver,textDecoration:done?'line-through':'none',transition:'color 0.15s'}}>
              {item.name}
            </span>
            {/* Type badge */}
            <span style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',textTransform:'uppercase',
              padding:'2px 6px',borderRadius:'3px',flexShrink:0,
              background:tc.bg,border:`1px solid ${tc.border}`,color:tc.text}}>
              {item.type}
            </span>
            {fb&&(
              <span style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',textTransform:'uppercase',
                padding:'1px 5px',borderRadius:'3px',flexShrink:0,
                border:`1px solid ${fb.text}44`,color:fb.text}}>
                {fb.label}
              </span>
            )}
          </div>
          {/* When + note row */}
          {!done&&(wc||item.note)&&(
            <div style={{marginTop:'2px',display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:'5px'}}>
              {wc&&(
                <span style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',
                  color:wc.color,textTransform:'uppercase',fontWeight:'700',flexShrink:0}}>
                  {wc.label}
                </span>
              )}
              {item.note&&(
                <span style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',lineHeight:'1.4'}}>
                  {item.note}
                </span>
              )}
            </div>
          )}
        </div>
        {/* Map link */}
        {item.marker&&(
          <a href={item.marker} target="_blank" rel="noopener noreferrer"
            style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',padding:'3px 7px',
              border:`1px solid ${C.teal}55`,color:C.tealLt,borderRadius:'3px',
              textDecoration:'none',flexShrink:0,marginTop:'2px',
              background:'#081414',textTransform:'uppercase',whiteSpace:'nowrap'}}
            title="Open map marker">
            📍 Map
          </a>
        )}
      </div>
      {/* Achievement badges */}
      {linkedAchs.length>0&&linkedAchs.map(achId=>(
        <QuestAchBadge key={achId} achId={achId} checked={checked} onToggle={onToggle}/>
      ))}
    </div>
  );
}

/* ═══ ACHIEVEMENT ITEM ═══ */
function AchItem({ach,checked,onToggle}){
  const done=!!checked[ach.id];
  const[open,setOpen]=useState(false);
  const isCombat=ach.cat.startsWith('Combat');
  const col=ach.cat==='Platinum'?'#e8d0ff':ach.cat.startsWith('Difficulty')?C.amber:
    ach.cat.startsWith('Missable')||ach.cat.startsWith('Story')?'#ffaa22':
    isCombat?'#66ccff':'#aabbcc';
  return(
    <div style={{borderBottom:`1px solid ${C.border}`,
      background:done?C.doneBg:'transparent'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'7px 12px'}}>
        <div style={{marginTop:'2px',flexShrink:0}}>
          <Checkbox checked={done} onChange={()=>onToggle(ach.id)} color={col} size={15}/>
        </div>
        <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>onToggle(ach.id)}>
          <div style={{display:'flex',alignItems:'center',gap:'7px',flexWrap:'wrap'}}>
            <span style={{fontFamily:FB,fontSize:'14px',
              color:done?C.doneTx:col,textDecoration:done?'line-through':'none',transition:'all 0.15s'}}>
              {ach.name}
            </span>
            {ach.secret&&!done&&(
              <span style={{fontFamily:FD,fontSize:'9px',color:C.silverDm,letterSpacing:'1px',
                border:`1px solid ${C.border}`,borderRadius:'2px',padding:'0 4px',textTransform:'uppercase'}}>
                secret
              </span>
            )}
          </div>
        </div>
        <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}
          style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',padding:'3px 8px',cursor:'pointer',
            border:`1px solid ${col}44`,background:'transparent',color:col,
            borderRadius:'3px',textTransform:'uppercase',flexShrink:0,transition:'all 0.12s'}}>
          {open?'▲':'▼ how'}
        </button>
      </div>
      {open&&(
        <div style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',
          margin:'0 12px 8px 35px',lineHeight:'1.4',background:C.bgHdr,
          border:`1px solid ${C.border}`,borderRadius:'3px',padding:'7px 10px'}}>
          {ach.desc}
        </div>
      )}
    </div>
  );
}

/* ═══ ACHIEVEMENT CATEGORY ═══ */
function AchCategory({cat,achs,checked,onToggle}){
  const saved=sessionStorage.getItem('achopen_'+cat);
  const[open,setOpen]=useState(saved===null?true:saved==='1');
  const toggle=()=>{
    const next=!open;
    sessionStorage.setItem('achopen_'+cat,next?'1':'0');
    setOpen(next);
  };
  const done=achs.filter(a=>checked[a.id]).length;
  const allDone=done===achs.length&&achs.length>0;
  const col=cat.includes('Blood and Wine')?C.bw:cat.includes('Hearts of Stone')?C.hos:
    cat==='Platinum'?'#e8d0ff':cat.startsWith('Difficulty')?C.amber:
    cat.startsWith('Missable')||cat.startsWith('Story')?'#ffaa22':'#aabbcc';
  return(
    <div style={{marginBottom:'6px'}}>
      <div onClick={toggle}
        style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 12px',
          background:allDone?`${col}0a`:C.bgHdr,cursor:'pointer',
          border:`1px solid ${allDone?col+'44':C.border}`,borderRadius:'4px',
          userSelect:'none',transition:'all 0.2s'}}>
        <span style={{color:col,fontSize:'10px',transform:open?'rotate(90deg)':'none',
          display:'inline-block',transition:'transform 0.2s'}}>▶</span>
        <span style={{fontFamily:FD,fontSize:'12px',letterSpacing:'1px',flex:1,
          color:allDone?C.blueLt:col,textTransform:'uppercase'}}>{cat}</span>
        {allDone&&<span style={{fontSize:'9px',color:C.blueLt,border:`1px solid ${col}44`,
          borderRadius:'10px',padding:'1px 7px',fontFamily:FD}}>DONE</span>}
        <Bar done={done} total={achs.length} color={col}/>
      </div>
      {open&&(
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderTop:'none',borderRadius:'0 0 4px 4px'}}>
          {achs.map(a=><AchItem key={a.id} ach={a} checked={checked} onToggle={onToggle}/>)}
        </div>
      )}
    </div>
  );
}

/* ═══ ACHIEVEMENTS TAB ═══ */
function AchievementsTab({checked,onToggle}){
  const cats=[...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  const bycat={};
  ACHIEVEMENTS.forEach(a=>{if(!bycat[a.cat])bycat[a.cat]=[];bycat[a.cat].push(a);});
  const done=ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  const total=ACHIEVEMENTS.length;
  return(
    <div>
      <div style={{padding:'10px 14px',background:C.bgHdr,border:`1px solid ${C.border}`,
        borderRadius:'5px',marginBottom:'14px',display:'flex',alignItems:'center',gap:'14px'}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:FD,fontSize:'10px',color:C.silverDm,letterSpacing:'1px',
            textTransform:'uppercase',marginBottom:'4px'}}>Steam Achievements</div>
          <Bar done={done} total={total} color={C.amber}/>
        </div>
        <span style={{fontFamily:FD,fontSize:'16px',color:C.amber}}>{Math.round(done/total*100)}%</span>
      </div>
      <div style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',
        marginBottom:'12px',padding:'6px 10px',background:C.bgCard,
        border:`1px solid ${C.border}`,borderRadius:'4px'}}>
        Story-related and missable achievements also appear inline on the Quests tab — look for the 🏆 badge.
      </div>
      {cats.map(cat=>(
        <AchCategory key={cat} cat={cat} achs={bycat[cat]} checked={checked} onToggle={onToggle}/>
      ))}
    </div>
  );
}

/* ═══ QUESTS TAB (flat list, checked goes to bottom) ═══ */
function QuestsTab({checked,onToggle}){
  const unchecked=QUESTS.filter(q=>!checked[q.id]);
  const done=QUESTS.filter(q=>!!checked[q.id]);
  const sorted=[...unchecked,...done];
  const doneCount=done.length;
  const total=QUESTS.length;
  return(
    <div>
      <div style={{padding:'8px 12px',background:C.bgHdr,border:`1px solid ${C.border}`,
        borderRadius:'5px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontFamily:FD,fontSize:'10px',color:C.silverDm,letterSpacing:'1px',textTransform:'uppercase'}}>Progress</span>
        <div style={{flex:1}}><Bar done={doneCount} total={total} color={C.blue}/></div>
        <span style={{fontFamily:FD,fontSize:'12px',color:C.silv,flexShrink:0}}>{doneCount}/{total}</span>
      </div>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',overflow:'hidden'}}>
        {sorted.map(q=><QItem key={q.id} item={q} checked={checked} onToggle={onToggle}/>)}
      </div>
      {doneCount>0&&(
        <div style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',
          textAlign:'center',marginTop:'8px',opacity:0.6}}>
          {doneCount} completed quest{doneCount!==1?'s':''} shown at bottom
        </div>
      )}
    </div>
  );
}

/* ═══ PROGRESS RING ═══ */
function ProgressRing({pct}){
  const r=42,circ=2*Math.PI*r,offset=circ*(1-pct/100);
  return(
    <svg viewBox="0 0 100 100" width="90" height="90"
      style={{filter:`drop-shadow(0 0 12px ${C.blue}44)`,flexShrink:0}}>
      <circle cx="50" cy="50" r={r} fill="none" stroke={C.blueDk} strokeWidth="3"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={C.blue} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{transform:'rotate(-90deg)',transformOrigin:'50% 50%',transition:'stroke-dashoffset 0.8s'}}/>
      {/* Wolf medallion — provide icons/medallion.png (60×60px recommended) */}
      <image href="icons/medallion.png" x="20" y="20" width="60" height="60"
        style={{opacity:0.85}}/>
      <text x="50" y="92" textAnchor="middle" fill={C.blueLt}
        fontSize="9" fontFamily={FD} fontWeight="600">{pct}%</text>
    </svg>
  );
}

/* ═══ OVERVIEW ═══ */
function Overview({checked,onReset}){
  const qDone=QUESTS.filter(q=>checked[q.id]).length;
  const qTotal=QUESTS.length;
  const aDone=ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  const aTotal=ACHIEVEMENTS.length;
  const overall=Math.round((qDone+aDone)/(qTotal+aTotal)*100);

  const byType=[
    {label:'Main Quests',  done:QUESTS.filter(q=>q.type==='Main Quest'&&checked[q.id]).length, total:QUESTS.filter(q=>q.type==='Main Quest').length,   col:C.blue},
    {label:'Side Quests',  done:QUESTS.filter(q=>q.type==='Side Quest'&&checked[q.id]).length, total:QUESTS.filter(q=>q.type==='Side Quest').length,   col:'#5aafdf'},
    {label:'Contracts',    done:QUESTS.filter(q=>q.type==='Contract'&&checked[q.id]).length,   total:QUESTS.filter(q=>q.type==='Contract').length,     col:C.amber},
    {label:'Treasure Hunts',done:QUESTS.filter(q=>q.type==='Treasure Hunt'&&checked[q.id]).length,total:QUESTS.filter(q=>q.type==='Treasure Hunt').length,col:C.purple},
    {label:'Events',       done:QUESTS.filter(q=>q.type==='Event'&&checked[q.id]).length,      total:QUESTS.filter(q=>q.type==='Event').length,        col:C.green},
    {label:'Races',        done:QUESTS.filter(q=>q.type==='Race'&&checked[q.id]).length,       total:QUESTS.filter(q=>q.type==='Race').length,         col:C.orange},
  ];

  return(
    <div>
      {/* Hero */}
      <div style={{display:'flex',alignItems:'center',gap:'20px',padding:'20px',
        background:C.bgHdr,border:`1px solid ${C.border}`,borderRadius:'6px',marginBottom:'20px',
        backgroundImage:`radial-gradient(ellipse at 0% 50%,${C.blueDk}44 0%,transparent 60%)`}}>
        <ProgressRing pct={overall}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:FD,fontSize:'22px',fontWeight:'700',letterSpacing:'4px',
            textTransform:'uppercase',color:C.blue,textShadow:`0 0 30px ${C.blue}44`,marginBottom:'4px'}}>
            Overall Progress
          </div>
          <div style={{fontFamily:FB,fontSize:'14px',color:C.silverDm,fontStyle:'italic',marginBottom:'10px'}}>
            {qDone+aDone} of {qTotal+aTotal} items completed
          </div>
          <Bar done={qDone+aDone} total={qTotal+aTotal} color={C.blue}/>
        </div>
        <button onClick={onReset}
          style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',padding:'6px 14px',
            cursor:'pointer',border:`1px solid #cc444455`,background:'transparent',
            color:C.red,borderRadius:'3px',textTransform:'uppercase',flexShrink:0}}>
          Reset
        </button>
      </div>
      {/* Summary */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',padding:'12px 14px'}}>
          <div style={{fontFamily:FD,fontSize:'10px',color:C.silv,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'5px'}}>Quests</div>
          <Bar done={qDone} total={qTotal} color={C.blue}/>
        </div>
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',padding:'12px 14px'}}>
          <div style={{fontFamily:FD,fontSize:'10px',color:C.silv,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'5px'}}>Achievements</div>
          <Bar done={aDone} total={aTotal} color={C.amber}/>
        </div>
      </div>
      {/* By type */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'8px'}}>
        {byType.map(t=>(
          <div key={t.label} style={{background:C.bgCard,border:`1px solid ${C.border}`,
            borderTop:`2px solid ${t.done===t.total&&t.total>0?t.col:t.col+'44'}`,
            borderRadius:'0 0 5px 5px',padding:'10px 12px'}}>
            <div style={{fontFamily:FD,fontSize:'10px',color:C.silv,letterSpacing:'1px',
              textTransform:'uppercase',marginBottom:'4px'}}>{t.label}</div>
            <Bar done={t.done} total={t.total} color={t.col}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ APP ═══ */
const TABS=[{id:'overview',label:'Overview'},{id:'quests',label:'Quests'},{id:'achievements',label:'Achievements'}];

function App(){
  const[loaded,setLoaded]=useState(false);
  const[tab,setTab]=useState('overview');
  const[checked,setChecked]=useState({});
  const prevTab=useRef('overview');

  /* Load from localStorage */
  useEffect(()=>{
    try{
      const raw=localStorage.getItem('w3v2');
      if(raw)setChecked(JSON.parse(raw).checked||{});
    }catch(e){}
    setLoaded(true);
  },[]);

  /* Save */
  useEffect(()=>{
    if(!loaded)return;
    try{localStorage.setItem('w3v2',JSON.stringify({checked}));}catch(e){}
  },[checked,loaded]);

  /* Scroll position per tab */
  useEffect(()=>{
    if(!loaded)return;
    const prev=prevTab.current;
    if(prev!==tab){
      sessionStorage.setItem('scroll_'+prev, String(window.scrollY));
      prevTab.current=tab;
      const saved=parseInt(sessionStorage.getItem('scroll_'+tab)||'0',10);
      requestAnimationFrame(()=>window.scrollTo(0,saved));
    }
  },[tab,loaded]);

  const toggle=useCallback((id)=>{
    setChecked(prev=>{
      const n={...prev};
      if(n[id])delete n[id];else n[id]=Date.now();
      return n;
    });
  },[]);

  const reset=()=>{if(confirm('Reset all progress?'))setChecked({});};

  const qDone=QUESTS.filter(q=>checked[q.id]).length;
  const aDone=ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  const total=QUESTS.length+ACHIEVEMENTS.length;
  const pct=Math.round((qDone+aDone)/total*100);

  return(
    <div style={{background:C.bg,minHeight:'100vh',color:C.silver,fontFamily:FB}}>
      {/* HEADER */}
      <div style={{background:`linear-gradient(180deg,${C.bgHdr} 0%,${C.bgCard} 100%)`,
        borderBottom:`1px solid ${C.border2}`,padding:'14px 20px',
        boxShadow:'0 4px 24px #00000099'}}>
        <div style={{maxWidth:'1180px',margin:'0 auto',display:'flex',alignItems:'center',
          justifyContent:'space-between',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
            <img src="icons/medallion.png" width="36" height="36" alt=""
              style={{opacity:0.9,filter:`drop-shadow(0 0 8px ${C.blue}66)`}}
              onError={e=>{e.target.style.display='none'}}/>
            <div>
              <div style={{fontFamily:FD,fontSize:'20px',fontWeight:'700',color:C.blue,
                letterSpacing:'4px',textTransform:'uppercase',textShadow:`0 0 20px ${C.blue}44`}}>
                The Witcher 3
              </div>
              <div style={{fontFamily:FD,fontSize:'9px',letterSpacing:'5px',
                color:C.silverDm,textTransform:'uppercase',marginTop:'1px'}}>
                Wild Hunt — 100% Checklist
              </div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <span style={{fontFamily:FD,fontSize:'11px',color:C.silv,letterSpacing:'1px'}}>
              {pct}%
            </span>
            <div style={{width:'90px'}}><Bar done={qDone+aDone} total={total} color={C.blue}/></div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{background:C.bgCard,borderBottom:`1px solid ${C.border}`,
        position:'sticky',top:0,zIndex:100,boxShadow:'0 2px 12px #00000099'}}>
        <div style={{maxWidth:'1180px',margin:'0 auto',display:'flex',padding:'0 12px'}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',padding:'11px 18px',
                cursor:'pointer',background:'transparent',border:'none',whiteSpace:'nowrap',
                borderBottom:`2px solid ${tab===t.id?C.blue:'transparent'}`,
                color:tab===t.id?C.blue:C.silverDm,textTransform:'uppercase',transition:'all 0.12s'}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:'1180px',margin:'0 auto',padding:'18px 14px'}}>
        {tab!=='overview'&&(
          <div style={{marginBottom:'14px',paddingBottom:'10px',borderBottom:`1px solid ${C.border}`}}>
            <h2 style={{fontFamily:FD,fontSize:'16px',fontWeight:'600',color:C.blue,
              letterSpacing:'3px',textTransform:'uppercase',margin:0}}>
              {tab==='quests'?`Quests (${QUESTS.length})`:`Achievements (${ACHIEVEMENTS.length})`}
            </h2>
          </div>
        )}
        {tab==='overview'    &&<Overview checked={checked} onReset={reset}/>}
        {tab==='quests'      &&<QuestsTab checked={checked} onToggle={toggle}/>}
        {tab==='achievements'&&<AchievementsTab checked={checked} onToggle={toggle}/>}
      </div>

      {!loaded&&(
        <div style={{position:'fixed',inset:0,background:C.bg,display:'flex',
          alignItems:'center',justifyContent:'center',zIndex:9999}}>
          <div style={{fontFamily:FD,fontSize:'13px',letterSpacing:'3px',
            color:C.blue,textTransform:'uppercase'}}>Loading...</div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
