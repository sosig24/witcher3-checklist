const{useState,useEffect,useCallback,useRef}=React;

/* ═══ PALETTE — Witcher 3 Blue-Steel theme ═══ */
const C={
  bgDk:'#06080c',bgMid:'#090c12',bgCard:'#0c1018',bgHdr:'#0f1520',
  border:'#1a2535',border2:'#253545',
  blue:'#4a9eff',blueLt:'#7abfff',blueDk:'#1a3a5a',
  silver:'#b8c8d8',silverDm:'#4a6070',
  doneBg:'#060c10',doneTx:'#2a4050',
  red:'#8b1a1a',redLt:'#cc4444',
  silv:'#8898a8',
  green:'#2a7a4a',greenLt:'#5ab87a',greenDk:'#0a2a1a',
  amber:'#c89030',amberLt:'#e8b050',
  teal:'#2a8a8a',tealLt:'#5ababa',
  mainQ:'#4a9eff',mainQBg:'#0a1828',mainQBd:'#1a3a5a',
  sideQ:'#7abfff',sideQBg:'#0a1220',sideQBd:'#1a3050',
  contract:'#e8b050',contractBg:'#1a1408',contractBd:'#4a3810',
  treasure:'#8a6aaa',treasureBg:'#120a18',treasureBd:'#3a2a50',
  event:'#5a7a5a',eventBg:'#080e08',eventBd:'#1a2a1a',
  race:'#cc7a30',raceBg:'#180e04',raceBd:'#4a2a08',
  wh:'#4a9eff', hos:'#cc7a30', bw:'#7a5aaa',
};
const FD="'Cinzel','Palatino Linotype',serif";
const FB="'Crimson Text','Palatino Linotype',serif";

/* ═══ TYPE STYLES ═══ */
function typeStyle(type){
  switch(type){
    case'Main Quest':    return{color:C.mainQ,  bg:C.mainQBg,  bd:C.mainQBd};
    case'Side Quest':    return{color:C.sideQ,  bg:C.sideQBg,  bd:C.sideQBd};
    case'Contract':      return{color:C.contract,bg:C.contractBg,bd:C.contractBd};
    case'Treasure Hunt': return{color:C.treasure,bg:C.treasureBg,bd:C.treasureBd};
    case'Event':         return{color:C.event,  bg:C.eventBg,  bd:C.eventBd};
    case'Race':          return{color:C.race,   bg:C.raceBg,   bd:C.raceBd};
    default:             return{color:C.silv,   bg:C.bgCard,   bd:C.border};
  }
}
function fromColor(from){
  if(from==='Hearts of Stone')return C.hos;
  if(from==='Blood and Wine') return C.bw;
  return C.wh;
}
function achTypeColor(type){
  if(type==='platinum')return'#e8d0ff';
  if(type==='gold')    return C.amber;
  if(type==='silver')  return'#c8d8e8';
  return'#b8c8d8';
}

/* ═══ TABS ═══ */
const TABS=[
  {id:'overview', label:'Overview'},
  {id:'quests',   label:'Quests'},
  {id:'achievements', label:'Achievements'},
];

/* ═══ REGIONS for grouping ═══ */
const REGIONS_ORDER=[
  'Kaer Morhen','White Orchard','Vizima','Velen','Novigrad','Skellige','Multiple','Toussaint'
];

/* ═══ BASE COMPONENTS ═══ */
function Bar({done,total,color=C.blue}){
  const pct=total>0?Math.round(done/total*100):0;
  return(
    <div style={{display:'flex',alignItems:'center',gap:'8px',width:'100%'}}>
      <div style={{flex:1,height:'5px',background:'#06080c',border:`1px solid ${C.border}`,borderRadius:'3px',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${color}66,${color})`,borderRadius:'3px',transition:'width 0.5s',boxShadow:pct>0?`0 0 5px ${color}44`:'none'}}/>
      </div>
      <span style={{color:pct===100?C.blueLt:C.silv,fontSize:'11px',fontFamily:FD,minWidth:'48px',textAlign:'right'}}>{done}/{total}</span>
    </div>
  );
}

function Checkbox({checked,onChange,color=C.blue,size=15}){
  return(
    <div onClick={onChange} style={{width:size,height:size,flexShrink:0,cursor:'pointer',
      border:`1.5px solid ${checked?color:C.border2}`,borderRadius:'2px',
      background:checked?color:'transparent',display:'flex',alignItems:'center',justifyContent:'center',
      transition:'background 0.15s,border-color 0.15s',boxShadow:checked?`0 0 6px ${color}55`:'none'}}>
      {checked&&<span style={{color:C.bgDk,fontSize:Math.floor(size*0.65)+'px',fontWeight:'700',lineHeight:1}}>✓</span>}
    </div>
  );
}

function Divider({label}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:'12px',margin:'16px 0 8px'}}>
      <div style={{flex:1,height:'1px',background:`linear-gradient(90deg,transparent,${C.blueDk})`}}/>
      {label&&<span style={{color:C.blue,fontFamily:FD,fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase'}}>{label}</span>}
      <div style={{flex:1,height:'1px',background:`linear-gradient(270deg,transparent,${C.blueDk})`}}/>
    </div>
  );
}

/* Wolf medallion SVG ring */
function MedallionRing({pct}){
  const r=42,circ=2*Math.PI*r,offset=circ*(1-pct/100);
  return(
    <svg viewBox="0 0 100 100" width="80" height="80" style={{filter:`drop-shadow(0 0 10px ${C.blue}44)`}}>
      <circle cx="50" cy="50" r={r} fill="none" stroke={C.blueDk} strokeWidth="2.5"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={C.blue} strokeWidth="2.5"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{transform:'rotate(-90deg)',transformOrigin:'50% 50%',transition:'stroke-dashoffset 0.8s'}}/>
      <image href="icons/medallion.svg" x="22" y="22" width="56" height="56"/>
      <text x="50" y="72" textAnchor="middle" fill={C.blueLt} fontSize="10" fontFamily={FD} fontWeight="600">{pct}%</text>
    </svg>
  );
}

/* ═══ ACHIEVEMENT BADGE (inline on quest row) ═══ */
function AchievementBadge({achId,checked,onToggle}){
  const ach=ACHIEVEMENTS.find(a=>a.id===achId);
  if(!ach)return null;
  const done=!!checked[achId];
  const col=achTypeColor(ach.type);
  const[hintOpen,setHintOpen]=useState(false);
  return(
    <div style={{margin:'2px 10px 2px 28px',padding:'5px 8px',
      background:done?`${col}11`:C.bgHdr,
      border:`1px solid ${done?col+'44':C.border}`,borderRadius:'3px'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'8px'}}>
        <div style={{marginTop:'1px',flexShrink:0}}>
          <Checkbox checked={done} onChange={()=>onToggle(achId)} color={col} size={13}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
            <img src={`icons/trophy_${ach.type}.svg`} width="12" height="12" alt={ach.type}
              style={{opacity:0.85,flexShrink:0}}
              onError={e=>{e.target.style.display='none'}}/>
            <span style={{fontFamily:FD,fontSize:'11px',color:done?col+'88':col,
              textDecoration:done?'line-through':'none',letterSpacing:'0.5px'}}>{ach.name}</span>
            <span style={{fontFamily:FB,fontSize:'10px',color:C.silverDm,fontStyle:'italic'}}>achievement</span>
          </div>
        </div>
        <button onClick={e=>{e.stopPropagation();setHintOpen(o=>!o);}}
          style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',padding:'2px 7px',cursor:'pointer',
            border:`1px solid ${col}44`,background:'transparent',color:col,borderRadius:'3px',
            textTransform:'uppercase',flexShrink:0}}>
          {hintOpen?'▲':'▼'}
        </button>
      </div>
      {hintOpen&&(
        <div style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',
          marginTop:'4px',lineHeight:'1.4',background:C.bgHdr,
          border:`1px solid ${C.border}`,borderRadius:'3px',padding:'6px 10px',
          marginLeft:'21px'}}>
          {ach.desc}
        </div>
      )}
    </div>
  );
}

/* ═══ QUEST ITEM ═══ */
function QItem({item,checked,onToggle}){
  const done=!!checked[item.id];
  const ts=typeStyle(item.type);
  const linkedAchs=(QUEST_ACHIEVEMENTS[item.id]||[]);
  const[hovered,setHovered]=useState(false);
  return(
    <div style={{position:'relative'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'5px 10px',borderRadius:'3px',
        background:done?C.doneBg:hovered?C.bgHdr:'transparent',transition:'background 0.12s'}}
        onMouseEnter={()=>setHovered(true)}
        onMouseLeave={()=>setHovered(false)}>
        <div style={{marginTop:'3px',flexShrink:0}}>
          <Checkbox checked={done} onChange={()=>onToggle(item.id)} color={ts.color}/>
        </div>
        <div style={{flex:1,cursor:'pointer',minWidth:0}} onClick={()=>onToggle(item.id)}>
          <div style={{display:'flex',alignItems:'center',gap:'6px',flexWrap:'wrap'}}>
            <span style={{fontFamily:FB,fontSize:'14px',color:done?C.doneTx:C.silver,
              textDecoration:done?'line-through':'none',transition:'all 0.15s',lineHeight:'1.35'}}>
              {item.name}
            </span>
            <span style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',
              padding:'1px 5px',borderRadius:'2px',
              border:`1px solid ${ts.bd}`,background:ts.bg,color:ts.color,
              textTransform:'uppercase',flexShrink:0}}>
              {item.type}
            </span>
            {item.from!=='Wild Hunt'&&(
              <span style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',
                padding:'1px 5px',borderRadius:'2px',
                border:`1px solid ${fromColor(item.from)}44`,
                color:fromColor(item.from),textTransform:'uppercase',flexShrink:0}}>
                {item.from==='Hearts of Stone'?'HoS':'B&W'}
              </span>
            )}
          </div>
          {(item.when||item.note)&&!done&&(
            <div style={{marginTop:'2px'}}>
              {item.when&&(
                <span style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',
                  color:item.when.startsWith('Point')?C.redLt:C.amber,
                  textTransform:'uppercase',marginRight:'8px'}}>
                  ⚑ {item.when}
                </span>
              )}
              {item.note&&(
                <span style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',lineHeight:'1.35'}}>
                  {item.note}
                </span>
              )}
            </div>
          )}
        </div>
        <span style={{fontFamily:FB,fontSize:'11px',color:C.silverDm,flexShrink:0,marginTop:'3px',
          opacity:0.6}}>{item.region}</span>
      </div>
      {linkedAchs.length>0&&linkedAchs.map(achId=>(
        <AchievementBadge key={achId} achId={achId} checked={checked} onToggle={onToggle}/>
      ))}
    </div>
  );
}

/* ═══ COLLAPSIBLE SECTION ═══ */
function Section({title,items,checked,onToggle,color=C.blue,defaultOpen=true}){
  const[open,setOpen]=useState(defaultOpen);
  const done=items.filter(i=>checked[i.id]).length;
  const total=items.length;
  const allDone=done===total&&total>0;
  return(
    <div style={{marginBottom:'6px'}}>
      <div onClick={()=>setOpen(o=>!o)}
        style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 12px',
          background:allDone?`${color}0a`:C.bgHdr,cursor:'pointer',
          border:`1px solid ${allDone?color+'33':C.border}`,borderRadius:'4px',
          transition:'all 0.2s',userSelect:'none'}}>
        <span style={{color:color,fontSize:'10px',transition:'transform 0.2s',
          transform:open?'rotate(90deg)':'rotate(0deg)',display:'inline-block'}}>▶</span>
        <span style={{fontFamily:FD,fontSize:'12px',letterSpacing:'1px',
          color:allDone?C.blueLt:color,textTransform:'uppercase',flex:1}}>{title}</span>
        {allDone&&<span style={{fontSize:'9px',color:C.blueLt,border:`1px solid ${color}44`,
          borderRadius:'10px',padding:'1px 7px',fontFamily:FD}}>DONE</span>}
        <Bar done={done} total={total} color={color}/>
      </div>
      {open&&(
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,
          borderTop:'none',borderRadius:'0 0 4px 4px',paddingTop:'4px',paddingBottom:'4px'}}>
          {items.map(item=>(
            <QItem key={item.id} item={item} checked={checked} onToggle={onToggle}/>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ QUESTS TAB ═══ */
function QuestsTab({checked,onToggle,filter,onFilterChange}){
  // Group by region
  const regions=REGIONS_ORDER.filter(r=>QUESTS.some(q=>q.region===r));

  // Filter logic
  const filterFn=(q)=>{
    if(filter==='all') return true;
    if(filter==='main') return q.type==='Main Quest';
    if(filter==='side') return q.type==='Side Quest';
    if(filter==='contract') return q.type==='Contract';
    if(filter==='treasure') return q.type==='Treasure Hunt';
    if(filter==='event') return q.type==='Event';
    if(filter==='race') return q.type==='Race';
    if(filter==='wh') return q.from==='Wild Hunt';
    if(filter==='hos') return q.from==='Hearts of Stone';
    if(filter==='bw') return q.from==='Blood and Wine';
    if(filter==='incomplete') return !checked[q.id];
    return true;
  };

  const filtered=QUESTS.filter(filterFn);
  const totalDone=filtered.filter(q=>checked[q.id]).length;
  const totalAll=filtered.length;

  const FILTERS=[
    {id:'all',label:'All'},
    {id:'incomplete',label:'Incomplete'},
    {id:'main',label:'Main'},
    {id:'side',label:'Side'},
    {id:'contract',label:'Contracts'},
    {id:'treasure',label:'Treasure'},
    {id:'event',label:'Events'},
    {id:'race',label:'Races'},
    {id:'wh',label:'Wild Hunt'},
    {id:'hos',label:'Hearts of Stone'},
    {id:'bw',label:'Blood & Wine'},
  ];

  return(
    <div>
      {/* Filter bar */}
      <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'14px',
        padding:'10px 12px',background:C.bgHdr,border:`1px solid ${C.border}`,borderRadius:'5px'}}>
        <span style={{fontFamily:FD,fontSize:'10px',color:C.silverDm,letterSpacing:'1px',
          textTransform:'uppercase',alignSelf:'center',marginRight:'4px'}}>Filter:</span>
        {FILTERS.map(f=>(
          <button key={f.id} onClick={()=>onFilterChange(f.id)}
            style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',padding:'4px 10px',
              cursor:'pointer',border:`1px solid ${filter===f.id?C.blue:C.border}`,
              background:filter===f.id?C.blueDk:'transparent',
              color:filter===f.id?C.blueLt:C.silverDm,
              borderRadius:'3px',transition:'all 0.12s',textTransform:'uppercase'}}>
            {f.label}
          </button>
        ))}
        <div style={{flex:1}}/>
        <span style={{fontFamily:FD,fontSize:'11px',color:C.silv,alignSelf:'center'}}>
          {totalDone}/{totalAll} shown
        </span>
      </div>

      {/* Regions */}
      {regions.map(region=>{
        const items=filtered.filter(q=>q.region===region);
        if(items.length===0)return null;
        return(
          <Section key={region} title={region} items={items}
            checked={checked} onToggle={onToggle}
            color={C.blue} defaultOpen={true}/>
        );
      })}
    </div>
  );
}

/* ═══ ACHIEVEMENT ITEM ═══ */
function AchItem({ach,checked,onToggle}){
  const done=!!checked[ach.id];
  const col=achTypeColor(ach.type);
  const[hintOpen,setHintOpen]=useState(false);
  return(
    <div style={{padding:'6px 10px',borderRadius:'3px',
      background:done?C.doneBg:'transparent',
      borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'8px'}}>
        <div style={{marginTop:'2px',flexShrink:0}}>
          <Checkbox checked={done} onChange={()=>onToggle(ach.id)} color={col} size={15}/>
        </div>
        <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>onToggle(ach.id)}>
          <div style={{display:'flex',alignItems:'center',gap:'7px',flexWrap:'wrap'}}>
            <img src={`icons/trophy_${ach.type}.svg`} width="14" height="14" alt={ach.type}
              style={{flexShrink:0}} onError={e=>{e.target.style.display='none'}}/>
            <span style={{fontFamily:FB,fontSize:'14px',color:done?C.doneTx:col,
              textDecoration:done?'line-through':'none',transition:'all 0.15s'}}>
              {ach.name}
            </span>
            {ach.secret&&(
              <span style={{fontFamily:FD,fontSize:'9px',color:C.silverDm,
                border:`1px solid ${C.border}`,borderRadius:'2px',padding:'0 4px',
                textTransform:'uppercase'}}>Secret</span>
            )}
          </div>
        </div>
        <button onClick={e=>{e.stopPropagation();setHintOpen(o=>!o);}}
          style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',padding:'3px 8px',
            cursor:'pointer',border:`1px solid ${col}44`,background:'transparent',
            color:col,borderRadius:'3px',textTransform:'uppercase',flexShrink:0,
            transition:'all 0.12s'}}>
          {hintOpen?'▲ Hide':'▼ How'}
        </button>
        <Checkbox checked={done} onChange={()=>onToggle(ach.id)} color={col} size={15}/>
      </div>
      {hintOpen&&(
        <div style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',
          marginTop:'5px',lineHeight:'1.4',background:C.bgHdr,
          border:`1px solid ${C.border}`,borderRadius:'3px',padding:'7px 10px',
          marginLeft:'23px'}}>
          {ach.desc}
        </div>
      )}
    </div>
  );
}

/* ═══ ACHIEVEMENT CATEGORY SECTION ═══ */
function AchCategory({cat,achs,checked,onToggle}){
  const[open,setOpen]=useState(true);
  const d=achs.filter(a=>checked[a.id]).length;
  const allDone=d===achs.length&&achs.length>0;
  const catColor=cat.includes('Blood and Wine')?C.bw:cat.includes('Hearts of Stone')?C.hos:C.amber;
  return(
    <div style={{marginBottom:'6px'}}>
      <div onClick={()=>setOpen(o=>!o)}
        style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 12px',
          background:allDone?`${catColor}0a`:C.bgHdr,cursor:'pointer',
          border:`1px solid ${allDone?catColor+'33':C.border}`,borderRadius:'4px',
          userSelect:'none',transition:'all 0.2s'}}>
        <span style={{color:catColor,fontSize:'10px',transition:'transform 0.2s',
          transform:open?'rotate(90deg)':'rotate(0deg)',display:'inline-block'}}>▶</span>
        <span style={{fontFamily:FD,fontSize:'12px',letterSpacing:'1px',
          color:allDone?C.blueLt:catColor,textTransform:'uppercase',flex:1}}>{cat}</span>
        {allDone&&<span style={{fontSize:'9px',color:C.blueLt,border:`1px solid ${catColor}44`,
          borderRadius:'10px',padding:'1px 7px',fontFamily:FD}}>DONE</span>}
        <Bar done={d} total={achs.length} color={catColor}/>
      </div>
      {open&&(
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,
          borderTop:'none',borderRadius:'0 0 4px 4px'}}>
          {achs.map(ach=>(
            <AchItem key={ach.id} ach={ach} checked={checked} onToggle={onToggle}/>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══ ACHIEVEMENTS TAB ═══ */
function AchievementsTab({checked,onToggle}){
  const categories=[...new Set(ACHIEVEMENTS.map(a=>a.category))];
  const totalDone=ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  const totalAll=ACHIEVEMENTS.length;

  // Group by category
  const byCategory={};
  ACHIEVEMENTS.forEach(a=>{
    if(!byCategory[a.category])byCategory[a.category]=[];
    byCategory[a.category].push(a);
  });

  return(
    <div>
      {/* Summary bar */}
      <div style={{padding:'12px 14px',background:C.bgHdr,border:`1px solid ${C.border}`,
        borderRadius:'5px',marginBottom:'14px',display:'flex',alignItems:'center',gap:'14px'}}>
        <div>
          <div style={{fontFamily:FD,fontSize:'11px',letterSpacing:'1px',color:C.silverDm,
            textTransform:'uppercase',marginBottom:'4px'}}>Total Achievements</div>
          <Bar done={totalDone} total={totalAll} color={C.amber}/>
        </div>
        <div style={{fontFamily:FD,fontSize:'16px',color:C.amber,minWidth:'60px',textAlign:'right'}}>
          {Math.round(totalDone/totalAll*100)}%
        </div>
      </div>

      {/* Legend */}
      <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginBottom:'14px',
        padding:'8px 12px',background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'4px'}}>
        {[['platinum','#e8d0ff'],['gold',C.amber],['silver','#c8d8e8'],['bronze','#b8c8d8']].map(([t,c])=>(
          <div key={t} style={{display:'flex',alignItems:'center',gap:'5px'}}>
            <img src={`icons/trophy_${t}.svg`} width="12" height="12" alt={t}
              onError={e=>{e.target.style.display='none'}}/>
            <span style={{fontFamily:FD,fontSize:'10px',color:c,textTransform:'uppercase',
              letterSpacing:'1px'}}>{t}</span>
          </div>
        ))}
        <span style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',marginLeft:'auto'}}>
          Story-related achievements also appear on the Quests tab
        </span>
      </div>

      {/* Categories */}
      {categories.map(cat=>(
        <AchCategory key={cat} cat={cat} achs={byCategory[cat]} checked={checked} onToggle={onToggle}/>
      ))}
    </div>
  );
}

/* ═══ OVERVIEW CARD ═══ */
function OCard({label,done,total,color=C.blue}){
  const pct=total>0?Math.round(done/total*100):0;
  return(
    <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',
      padding:'12px 14px',borderTop:`2px solid ${pct===100?color:color+'44'}`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
        <span style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',
          color:pct===100?C.blueLt:C.silv,textTransform:'uppercase'}}>{label}</span>
        <span style={{fontFamily:FD,fontSize:'12px',color:pct===100?color:C.silverDm}}>
          {pct}%
        </span>
      </div>
      <Bar done={done} total={total} color={pct===100?color:color+'88'}/>
    </div>
  );
}

/* ═══ OVERVIEW TAB ═══ */
function Overview({checked,onReset}){
  // Count all quests by type
  const questDone=QUESTS.filter(q=>checked[q.id]).length;
  const questTotal=QUESTS.length;
  const mainDone=QUESTS.filter(q=>q.type==='Main Quest'&&checked[q.id]).length;
  const mainTotal=QUESTS.filter(q=>q.type==='Main Quest').length;
  const sideDone=QUESTS.filter(q=>q.type==='Side Quest'&&checked[q.id]).length;
  const sideTotal=QUESTS.filter(q=>q.type==='Side Quest').length;
  const contractDone=QUESTS.filter(q=>q.type==='Contract'&&checked[q.id]).length;
  const contractTotal=QUESTS.filter(q=>q.type==='Contract').length;
  const treasDone=QUESTS.filter(q=>q.type==='Treasure Hunt'&&checked[q.id]).length;
  const treasTotal=QUESTS.filter(q=>q.type==='Treasure Hunt').length;
  const achDone=ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  const achTotal=ACHIEVEMENTS.length;
  const overallPct=Math.round((questDone+achDone)/(questTotal+achTotal)*100);

  // DLC counts
  const wh=QUESTS.filter(q=>q.from==='Wild Hunt');
  const hos=QUESTS.filter(q=>q.from==='Hearts of Stone');
  const bw=QUESTS.filter(q=>q.from==='Blood and Wine');

  return(
    <div>
      {/* Hero row */}
      <div style={{display:'flex',alignItems:'center',gap:'20px',padding:'20px',
        background:C.bgHdr,border:`1px solid ${C.border}`,borderRadius:'6px',marginBottom:'20px',
        backgroundImage:`radial-gradient(ellipse at 0% 50%,${C.blueDk}22 0%,transparent 60%)`}}>
        <MedallionRing pct={overallPct}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:FD,fontSize:'22px',fontWeight:'700',color:C.blue,
            letterSpacing:'4px',textTransform:'uppercase',
            textShadow:`0 0 30px ${C.blue}44`}}>Overall Progress</div>
          <div style={{fontFamily:FB,fontSize:'14px',color:C.silverDm,fontStyle:'italic',marginTop:'3px'}}>
            {questDone+achDone} of {questTotal+achTotal} items completed
          </div>
          <div style={{marginTop:'10px'}}>
            <Bar done={questDone+achDone} total={questTotal+achTotal} color={C.blue}/>
          </div>
        </div>
        <button onClick={onReset}
          style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',padding:'6px 14px',
            cursor:'pointer',border:`1px solid ${C.red}55`,background:'transparent',
            color:C.redLt,borderRadius:'3px',transition:'all 0.15s',textTransform:'uppercase'}}>
          Reset
        </button>
      </div>

      {/* Stats grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'10px',marginBottom:'20px'}}>
        <OCard label="All Quests" done={questDone} total={questTotal} color={C.blue}/>
        <OCard label="Main Quests" done={mainDone} total={mainTotal} color={C.mainQ}/>
        <OCard label="Side Quests" done={sideDone} total={sideTotal} color={C.sideQ}/>
        <OCard label="Contracts" done={contractDone} total={contractTotal} color={C.contract}/>
        <OCard label="Treasure Hunts" done={treasDone} total={treasTotal} color={C.treasure}/>
        <OCard label="Achievements" done={achDone} total={achTotal} color={C.amber}/>
      </div>

      <Divider label="By DLC"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'10px',marginBottom:'20px'}}>
        <OCard label="Wild Hunt" done={wh.filter(q=>checked[q.id]).length} total={wh.length} color={C.wh}/>
        <OCard label="Hearts of Stone" done={hos.filter(q=>checked[q.id]).length} total={hos.length} color={C.hos}/>
        <OCard label="Blood and Wine" done={bw.filter(q=>checked[q.id]).length} total={bw.length} color={C.bw}/>
      </div>

      <Divider label="By Region"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'8px',marginBottom:'20px'}}>
        {REGIONS_ORDER.map(region=>{
          const rq=QUESTS.filter(q=>q.region===region);
          if(rq.length===0)return null;
          return(
            <OCard key={region} label={region}
              done={rq.filter(q=>checked[q.id]).length}
              total={rq.length} color={C.teal}/>
          );
        })}
      </div>

      {/* Tips */}
      <Divider label="Tips"/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'10px'}}>
        {[
          {icon:'⚑', title:'ASAP / Early in Story', text:"Quests tagged 'ASAP' or 'Early in story' can become unavailable. Do them before progressing the main story too far."},
          {icon:'⚠', title:'Point of No Return', text:"'Ugly Baby' and 'Isle of Mists' are major points of no return. Complete all side content in your current region first."},
          {icon:'★', title:'Story Achievements', text:"Story-related achievements are shown inline on the Quests tab next to the quest that unlocks them — you won't miss them."},
          {icon:'🗡', title:'Gwent Quests', text:"Gwent quests have tight windows — some opponents disappear after certain story beats. Follow the order on the Quests tab."},
          {icon:'🏰', title:'Witcher School Gear', text:"Start Scavenger Hunt quests early. Maps are bought from vendors and the gear scales with your level (Enhanced → Superior → Master → Grandmaster)."},
          {icon:'🍇', title:'Blood & Wine Tips', text:"Complete 'There Can Be Only One' by demonstrating all 5 virtues across multiple quests. Don't rush — collect them before 'Capture the Castle'."},
        ].map((t,i)=>(
          <div key={i} style={{padding:'12px 14px',background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px'}}>
            <div style={{fontFamily:FD,fontSize:'11px',letterSpacing:'1px',color:C.blue,
              textTransform:'uppercase',marginBottom:'5px'}}>{t.icon} {t.title}</div>
            <div style={{fontFamily:FB,fontSize:'13px',color:C.silverDm,fontStyle:'italic',lineHeight:'1.5'}}>{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ APP ═══ */
function App(){
  const[loaded,setLoaded]=useState(false);
  const[tab,setTab]=useState('overview');
  const[questFilter,setQuestFilter]=useState('all');
  const[checked,setChecked]=useState({});

  useEffect(()=>{
    async function load(){
      try{
        const r=await window.storage.get('w3v1');
        if(r){const d=JSON.parse(r.value);setChecked(d.checked??{});}
      }catch(e){}
      setLoaded(true);
    }
    load();
  },[]);

  useEffect(()=>{
    if(!loaded)return;
    window.storage.set('w3v1',JSON.stringify({checked})).catch(()=>{});
  },[checked,loaded]);

  const toggle=useCallback((id)=>{
    setChecked(prev=>{
      const next={...prev};
      if(next[id]) delete next[id];
      else next[id]=Date.now();
      return next;
    });
  },[]);

  const handleReset=()=>{
    if(confirm('Reset all progress? This cannot be undone.'))setChecked({});
  };

  const totalDone=QUESTS.filter(q=>checked[q.id]).length+ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  const totalAll=QUESTS.length+ACHIEVEMENTS.length;
  const pct=Math.round(totalDone/totalAll*100);

  return(
    <div style={{background:C.bgDk,minHeight:'100vh',color:C.silver,fontFamily:FB,
      backgroundImage:`radial-gradient(ellipse at 15% 0%,${C.blueDk}1a 0%,transparent 50%),radial-gradient(ellipse at 85% 100%,#1a0a2a1a 0%,transparent 50%)`}}>

      {/* HEADER */}
      <div style={{background:`linear-gradient(180deg,${C.bgHdr} 0%,${C.bgCard} 100%)`,
        borderBottom:`1px solid ${C.border2}`,padding:'14px 20px',
        boxShadow:'0 4px 24px #00000099'}}>
        <div style={{maxWidth:'1180px',margin:'0 auto',display:'flex',alignItems:'center',
          justifyContent:'space-between',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
            <img src="icons/medallion.svg" width="36" height="36" alt="Wolf medallion"
              style={{opacity:0.9,filter:`drop-shadow(0 0 8px ${C.blue}66)`}}
              onError={e=>{e.target.style.display='none'}}/>
            <div>
              <div style={{fontFamily:FD,fontSize:'20px',fontWeight:'700',color:C.blue,
                letterSpacing:'4px',textTransform:'uppercase',
                textShadow:`0 0 20px ${C.blue}44`}}>The Witcher 3</div>
              <div style={{fontFamily:FD,fontSize:'9px',letterSpacing:'5px',
                color:C.silverDm,textTransform:'uppercase',marginTop:'1px'}}>
                Wild Hunt — 100% Checklist
              </div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{fontFamily:FD,fontSize:'11px',color:C.silv,letterSpacing:'1px'}}>
              {pct}% <span style={{color:C.silverDm}}>complete</span>
            </div>
            <div style={{width:'100px'}}>
              <Bar done={totalDone} total={totalAll} color={C.blue}/>
            </div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{background:C.bgCard,borderBottom:`1px solid ${C.border}`,
        overflowX:'auto',whiteSpace:'nowrap',position:'sticky',top:0,zIndex:100,
        boxShadow:'0 2px 12px #00000099'}}>
        <div style={{maxWidth:'1180px',margin:'0 auto',display:'flex',padding:'0 12px'}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',padding:'11px 16px',
                cursor:'pointer',background:'transparent',border:'none',whiteSpace:'nowrap',
                borderBottom:`2px solid ${tab===t.id?C.blue:'transparent'}`,
                color:tab===t.id?C.blue:C.silverDm,
                textTransform:'uppercase',transition:'all 0.12s'}}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:'1180px',margin:'0 auto',padding:'20px 14px'}}>
        {tab!=='overview'&&(
          <div style={{marginBottom:'18px',paddingBottom:'10px',borderBottom:`1px solid ${C.border}`}}>
            <h2 style={{fontFamily:FD,fontSize:'17px',fontWeight:'600',color:C.blue,
              letterSpacing:'3px',textTransform:'uppercase',margin:0}}>
              {tab==='quests'?`Quests (${QUESTS.length})`:
               tab==='achievements'?`Achievements (${ACHIEVEMENTS.length})`:''}
            </h2>
          </div>
        )}
        {tab==='overview'&&<Overview checked={checked} onReset={handleReset}/>}
        {tab==='quests'&&<QuestsTab checked={checked} onToggle={toggle} filter={questFilter} onFilterChange={setQuestFilter}/>}
        {tab==='achievements'&&<AchievementsTab checked={checked} onToggle={toggle}/>}
      </div>

      {!loaded&&(
        <div style={{position:'fixed',inset:0,background:C.bgDk,display:'flex',
          alignItems:'center',justifyContent:'center',zIndex:9999}}>
          <div style={{fontFamily:FD,fontSize:'13px',letterSpacing:'3px',
            color:C.blue,textTransform:'uppercase'}}>Loading...</div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
