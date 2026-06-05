const{useState,useEffect,useCallback,useRef}=React;

const C={
  bg:'#06080c',bgCard:'#0c1018',bgHdr:'#0f1520',
  border:'#1a2535',border2:'#253545',
  blue:'#4a9eff',blueLt:'#7abfff',blueDk:'#0a1828',
  silver:'#b8c8d8',silv:'#8898a8',silverDm:'#4a6070',
  doneBg:'#070a0e',doneTx:'#253040',
  red:'#cc4444',amber:'#c89030',amberLt:'#e8b050',
  teal:'#2a8a8a',tealLt:'#4ababa',
  green:'#3a9a5a',orange:'#cc7030',purple:'#8a5aaa',
  hos:'#cc7a30',bw:'#8a5aaa',
};
const FD="'Cinzel','Palatino Linotype',serif";
const FB="'Crimson Text','Palatino Linotype',serif";

/* Distinct row backgrounds — carefully separated */
const ROW_BG={
  'Main Quest':    '#060f1e',  /* deep navy */
  'Side Quest':    '#041e14',  /* deep emerald-teal */
  'Contract':      '#1e1400',  /* deep amber-gold */
  'Treasure Hunt': '#100620',  /* deep violet */
  'Event':         '#0a1200',  /* deep olive-green (not teal!) */
  'Race':          '#200800',  /* deep rust-orange */
};
const TYPE_COLOR={
  'Main Quest':    '#4a9eff',  /* bright blue */
  'Side Quest':    '#28c890',  /* bright emerald */
  'Contract':      '#d4a020',  /* gold */
  'Treasure Hunt': '#a060d0',  /* violet */
  'Event':         '#80b020',  /* yellow-green */
  'Race':          '#e06020',  /* orange */
};
const LEGEND_TYPES=['Main Quest','Side Quest','Contract','Treasure Hunt','Event','Race'];

function whenConf(w){
  if(!w)return null;
  const u=w.toUpperCase();
  if(u.includes('POINT OF NO RETURN'))return{color:'#ff4444',label:'⛔ POINT OF NO RETURN'};
  if(u==='CAUTION')                    return{color:'#ff8800',label:'⚠ CAUTION'};
  if(u.startsWith('EARLY IN STORY'))   return{color:C.tealLt,label:'🕐 EARLY IN STORY'};
  if(u.startsWith('ASAP'))             return{color:C.amberLt,label:'⚡ '+w.toUpperCase()};
  return{color:C.silv,label:w};
}

function Bar({done,total,color=C.blue}){
  const pct=total>0?Math.round(done/total*100):0;
  return(
    <div style={{display:'flex',alignItems:'center',gap:'8px',width:'100%'}}>
      <div style={{flex:1,height:'4px',background:'#040608',border:`1px solid ${C.border}`,borderRadius:'3px',overflow:'hidden'}}>
        <div style={{height:'100%',width:`${pct}%`,background:`linear-gradient(90deg,${color}88,${color})`,transition:'width 0.4s',boxShadow:pct>0?`0 0 4px ${color}44`:'none'}}/>
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
      transition:'all 0.15s',boxShadow:checked?`0 0 5px ${color}55`:'none'}}>
      {checked&&<span style={{color:'#050810',fontSize:Math.floor(size*0.65)+'px',fontWeight:'800',lineHeight:1}}>✓</span>}
    </div>
  );
}

/* ── Quest row with inline achievement buttons ── */
function QItem({item,checked,onToggle}){
  const done=!!checked[item.id];
  const rowBg=done?C.doneBg:(ROW_BG[item.type]||C.bgCard);
  const typeCol=TYPE_COLOR[item.type]||C.blue;
  const wc=whenConf(item.when);
  const linked=QUEST_ACHIEVEMENTS[item.id]||[];
  const[openAch,setOpenAch]=useState(null);
  const fb=item.from!=='Wild Hunt'?{label:item.from==='Hearts of Stone'?'HoS':'B&W',
    color:item.from==='Hearts of Stone'?C.hos:C.bw}:null;

  const toggleAch=(id)=>setOpenAch(prev=>prev===id?null:id);

  return(
    <div style={{borderBottom:`1px solid ${C.border}`,background:rowBg,transition:'background 0.1s'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'6px 10px'}}>
        {/* Checkbox */}
        <div style={{marginTop:'3px',flexShrink:0}}>
          <Checkbox checked={done} onChange={()=>onToggle(item.id)} color={typeCol}/>
        </div>
        {/* Main content */}
        <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>onToggle(item.id)}>
          <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}>
            <span style={{fontFamily:FB,fontSize:'14px',lineHeight:'1.3',
              color:done?C.doneTx:C.silver,textDecoration:done?'line-through':'none',transition:'color 0.15s'}}>
              {item.name}
            </span>
            {fb&&<span style={{fontFamily:FD,fontSize:'9px',padding:'1px 5px',borderRadius:'2px',
              border:`1px solid ${fb.color}44`,color:fb.color,letterSpacing:'1px',flexShrink:0}}>
              {fb.label}
            </span>}
          </div>
          {!done&&(wc||item.note)&&(
            <div style={{marginTop:'2px',display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:'5px'}}>
              {wc&&<span style={{fontFamily:FD,fontSize:'10px',letterSpacing:'1px',
                color:wc.color,textTransform:'uppercase',fontWeight:'700',flexShrink:0}}>{wc.label}</span>}
              {item.note&&<span style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',lineHeight:'1.4'}}>{item.note}</span>}
            </div>
          )}
        </div>
        {/* Right-side buttons: achievements + map */}
        <div style={{display:'flex',gap:'4px',alignItems:'flex-start',flexShrink:0,flexWrap:'wrap',justifyContent:'flex-end',maxWidth:'200px'}}>
          {linked.map(achId=>{
            const ach=ACHIEVEMENTS.find(a=>a.id===achId);
            if(!ach)return null;
            const achDone=!!checked[achId];
            const isOpen=openAch===achId;
            return(
              <button key={achId}
                onClick={e=>{e.stopPropagation();toggleAch(achId);}}
                style={{fontFamily:FD,fontSize:'9px',letterSpacing:'0.5px',padding:'3px 6px',
                  cursor:'pointer',border:`1px solid ${achDone?'#4a5a20':'#6a5a10'}`,
                  background:achDone?'#0a0e06':'#0e0e04',
                  color:achDone?'#5a7030':C.amberLt,
                  borderRadius:'3px',whiteSpace:'nowrap',
                  textDecoration:achDone?'line-through':'none',
                  outline:isOpen?`1px solid ${C.amberLt}`:'none',
                  transition:'all 0.1s'}}>
                🏆 {ach.name.length>18?ach.name.slice(0,17)+'…':ach.name}
              </button>
            );
          })}
          {item.marker&&(
            <a href={item.marker} target="_blank" rel="noopener noreferrer"
              style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',padding:'3px 7px',
                border:`1px solid ${C.teal}55`,color:C.tealLt,borderRadius:'3px',
                textDecoration:'none',background:'#081414',
                textTransform:'uppercase',whiteSpace:'nowrap'}}>📍 Map</a>
          )}
        </div>
      </div>
      {/* Achievement hint dropdown */}
      {openAch&&(()=>{
        const ach=ACHIEVEMENTS.find(a=>a.id===openAch);
        const achDone=!!checked[openAch];
        if(!ach)return null;
        return(
          <div style={{display:'flex',alignItems:'flex-start',gap:'8px',
            padding:'4px 10px 6px 33px',background:'#0c0e04',
            borderTop:`1px solid #3a3010`}}>
            <Checkbox checked={achDone} onChange={()=>{onToggle(openAch);}} color={C.amberLt} size={13}/>
            <div style={{flex:1}}>
              <span style={{fontFamily:FD,fontSize:'10px',color:C.amberLt,letterSpacing:'0.5px'}}>{ach.name}</span>
              <span style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',marginLeft:'8px',lineHeight:'1.4'}}>{ach.desc}</span>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ── Quests tab ── */
function QuestsTab({checked,onToggle}){
  const unchecked=QUESTS.filter(q=>!checked[q.id]);
  const done=QUESTS.filter(q=>!!checked[q.id]);
  return(
    <div>
      <div style={{padding:'8px 12px',background:C.bgHdr,border:`1px solid ${C.border}`,
        borderRadius:'5px',marginBottom:'10px',display:'flex',alignItems:'center',gap:'12px'}}>
        <span style={{fontFamily:FD,fontSize:'10px',color:C.silverDm,letterSpacing:'1px',textTransform:'uppercase'}}>Progress</span>
        <div style={{flex:1}}><Bar done={done.length} total={QUESTS.length} color={C.blue}/></div>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'8px',marginBottom:'12px',
        padding:'7px 12px',background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'4px',alignItems:'center'}}>
        <span style={{fontFamily:FD,fontSize:'10px',color:C.silverDm,letterSpacing:'1px',textTransform:'uppercase',marginRight:'2px'}}>Legend:</span>
        {LEGEND_TYPES.map(t=>(
          <div key={t} style={{display:'flex',alignItems:'center',gap:'5px'}}>
            <div style={{width:'10px',height:'10px',borderRadius:'2px',
              background:ROW_BG[t],border:`1.5px solid ${TYPE_COLOR[t]}`,flexShrink:0}}/>
            <span style={{fontFamily:FD,fontSize:'10px',color:TYPE_COLOR[t],letterSpacing:'0.5px'}}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',overflow:'hidden'}}>
        {[...unchecked,...done].map(q=><QItem key={q.id} item={q} checked={checked} onToggle={onToggle}/>)}
      </div>
      {done.length>0&&(
        <div style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',textAlign:'center',marginTop:'8px',opacity:0.6}}>
          {done.length} completed quest{done.length!==1?'s':''} at bottom
        </div>
      )}
    </div>
  );
}

/* ── Achievement item ── */
function achBaseCat(cat){
  const parts=cat.split(' - ');
  return parts.length>1?parts[1]:cat;
}
function achColor(cat){
  const base=achBaseCat(cat);
  return ({
    'Story':C.blueLt,
    'Missable':C.amberLt,
    'Combat & Skills':'#e87040',
    'Exploration':C.tealLt,
    'Difficulty':C.amber,
    'Hearts of Stone':C.hos,
    'Blood and Wine':C.bw,
  })[base]||'#aabbcc';
}

function AchItem({ach,checked,onToggle}){
  const done=!!checked[ach.id];
  const[open,setOpen]=useState(false);
  const col=achColor(ach.cat);
  return(
    <div style={{borderBottom:`1px solid ${C.border}`,background:done?C.doneBg:'transparent'}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'7px 12px'}}>
        <div style={{marginTop:'2px',flexShrink:0}}><Checkbox checked={done} onChange={()=>onToggle(ach.id)} color={col} size={15}/></div>
        <div style={{flex:1,minWidth:0,cursor:'pointer'}} onClick={()=>onToggle(ach.id)}>
          <span style={{fontFamily:FB,fontSize:'14px',color:done?C.doneTx:col,
            textDecoration:done?'line-through':'none',transition:'all 0.15s'}}>{ach.name}</span>
        </div>
        <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}
          style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',padding:'3px 8px',cursor:'pointer',
            border:`1px solid ${col}44`,background:'transparent',color:col,borderRadius:'3px',
            textTransform:'uppercase',flexShrink:0}}>{open?'▲':'▼ how'}</button>
      </div>
      {open&&(
        <div style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',
          margin:'0 12px 8px 35px',padding:'7px 10px',lineHeight:'1.4',
          background:C.bgHdr,border:`1px solid ${C.border}`,borderRadius:'3px'}}>
          {ach.desc}
        </div>
      )}
    </div>
  );
}

function AchCategory({cat,achs,checked,onToggle}){
  const saved=sessionStorage.getItem('achopen_'+cat);
  const[open,setOpen]=useState(saved===null?true:saved==='1');
  const toggle=()=>{const n=!open;sessionStorage.setItem('achopen_'+cat,n?'1':'0');setOpen(n);};
  const done=achs.filter(a=>checked[a.id]).length;
  const allDone=done===achs.length&&achs.length>0;
  const col=achColor(cat);
  return(
    <div style={{marginBottom:'6px'}}>
      <div onClick={toggle} style={{display:'flex',alignItems:'center',gap:'8px',padding:'7px 12px',
        background:allDone?`${col}0a`:C.bgHdr,cursor:'pointer',userSelect:'none',
        border:`1px solid ${allDone?col+'44':C.border}`,borderRadius:'4px',transition:'all 0.2s'}}>
        <span style={{color:col,fontSize:'10px',display:'inline-block',transition:'transform 0.2s',
          transform:open?'rotate(90deg)':'none'}}>▶</span>
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

function AchievementsTab({checked,onToggle}){
  const cats=[...new Set(ACHIEVEMENTS.map(a=>a.cat))];
  const bycat={};
  ACHIEVEMENTS.forEach(a=>{if(!bycat[a.cat])bycat[a.cat]=[];bycat[a.cat].push(a);});
  const done=ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  return(
    <div>
      <div style={{padding:'10px 14px',background:C.bgHdr,border:`1px solid ${C.border}`,
        borderRadius:'5px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'14px'}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:FD,fontSize:'10px',color:C.silverDm,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'4px'}}>Steam Achievements</div>
          <Bar done={done} total={ACHIEVEMENTS.length} color={C.amber}/>
        </div>
        <span style={{fontFamily:FD,fontSize:'16px',color:C.amber}}>{Math.round(done/ACHIEVEMENTS.length*100)}%</span>
      </div>
      <div style={{fontFamily:FB,fontSize:'12px',color:C.silverDm,fontStyle:'italic',
        marginBottom:'12px',padding:'6px 10px',background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'4px'}}>
        Story & missable achievements also appear on the Quests tab as 🏆 buttons next to the relevant quest.
      </div>
      {cats.map(cat=><AchCategory key={cat} cat={cat} achs={bycat[cat]} checked={checked} onToggle={onToggle}/>)}
    </div>
  );
}

/* ── Builds tab ── */
function SkillCard({skill}){
  const treeColor={'Fast Attack':'#e87040','Strong Attack':'#e84040','Combat':'#4080e8',
    'Alchemy':'#60b840','Signs':'#9040e8','General':'#e8b040'}[skill.tree]||C.silv;
  return(
    <div style={{display:'flex',alignItems:'flex-start',gap:'8px',padding:'6px 8px',
      background:'#09100c',border:`1px solid ${treeColor}33`,borderRadius:'4px',borderLeft:`3px solid ${treeColor}88`}}>
      <div style={{width:32,height:32,flexShrink:0,background:'#0c1410',border:`1px solid ${treeColor}44`,
        borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <img src={`icons/builds/skill_${skill.id}.png`} width="30" height="30" alt={skill.name}
          onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}} style={{objectFit:'cover'}}/>
        <div style={{display:'none',width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
          fontFamily:FD,fontSize:'8px',color:treeColor,textAlign:'center',lineHeight:'1.1',padding:'2px'}}>
          {skill.name.split(' ').slice(0,2).join('\n')}
        </div>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:'5px',flexWrap:'wrap'}}>
          <span style={{fontFamily:FD,fontSize:'11px',color:treeColor}}>{skill.name}</span>
          <span style={{fontFamily:FD,fontSize:'9px',color:C.silverDm,border:`1px solid ${treeColor}33`,borderRadius:'2px',padding:'0 4px'}}>{skill.lv}</span>
          <span style={{fontFamily:FB,fontSize:'10px',color:C.silverDm,fontStyle:'italic'}}>{skill.tree}</span>
        </div>
        <div style={{fontFamily:FB,fontSize:'12px',color:C.silv}}>{skill.desc}</div>
      </div>
    </div>
  );
}
function GearCard({item}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'5px 8px',
      background:'#0a0c10',border:`1px solid ${C.border}`,borderRadius:'3px'}}>
      <div style={{width:28,height:28,flexShrink:0,background:C.bgCard,border:`1px solid ${C.border2}`,
        borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <img src={`icons/builds/gear_${item.id}.png`} width="26" height="26" alt={item.name}
          onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='block';}} style={{objectFit:'cover'}}/>
        <span style={{display:'none',fontSize:'10px'}}>⚔</span>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <span style={{fontFamily:FD,fontSize:'11px',color:C.silver}}>{item.name}</span>
        <span style={{fontFamily:FD,fontSize:'9px',color:C.silverDm,marginLeft:'6px',
          border:`1px solid ${C.border}`,borderRadius:'2px',padding:'0 4px'}}>{item.slot}</span>
        <div style={{fontFamily:FB,fontSize:'11px',color:C.silverDm,fontStyle:'italic'}}>{item.note}</div>
      </div>
    </div>
  );
}
function DecCard({dec}){
  return(
    <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'5px 8px',
      background:'#06100a',border:`1px solid ${C.green}33`,borderRadius:'3px'}}>
      <div style={{width:26,height:26,flexShrink:0,background:'#08140a',border:`1px solid ${C.green}44`,
        borderRadius:'3px',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <img src={`icons/builds/dec_${dec.id.replace('dec_','')}.png`} width="24" height="24" alt={dec.name}
          onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='block';}} style={{objectFit:'cover'}}/>
        <span style={{display:'none',fontSize:'12px'}}>🧪</span>
      </div>
      <div>
        <span style={{fontFamily:FD,fontSize:'11px',color:C.green}}>{dec.name} Decoction</span>
        <div style={{fontFamily:FB,fontSize:'11px',color:C.silverDm,fontStyle:'italic'}}>{dec.desc}</div>
      </div>
    </div>
  );
}
function BuildsTab(){
  const[phase,setPhase]=useState('early');
  const b=BUILDS[phase];
  const phases=[{id:'early',label:'Early Game',sub:'Lvl 1–11'},{id:'mid',label:'Mid Game',sub:'Lvl 12–34'},{id:'end',label:'End Game',sub:'Lvl 35+'}];
  return(
    <div>
      <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
        {phases.map(p=>(
          <button key={p.id} onClick={()=>setPhase(p.id)}
            style={{fontFamily:FD,cursor:'pointer',padding:'10px 18px',borderRadius:'4px',
              border:`1px solid ${phase===p.id?C.blue:C.border}`,
              background:phase===p.id?C.blueDk:'transparent',
              color:phase===p.id?C.blueLt:C.silverDm,transition:'all 0.15s',textAlign:'left'}}>
            <div style={{fontSize:'12px',letterSpacing:'1px',textTransform:'uppercase'}}>{p.label}</div>
            <div style={{fontSize:'10px',opacity:0.7,marginTop:'1px'}}>{p.sub}</div>
          </button>
        ))}
      </div>
      <div style={{padding:'14px 16px',background:C.bgHdr,border:`1px solid ${C.border}`,
        borderRadius:'5px',marginBottom:'14px',borderTop:`2px solid ${C.blue}`}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'12px',flexWrap:'wrap'}}>
          <div>
            <div style={{fontFamily:FD,fontSize:'16px',color:C.blue,letterSpacing:'2px',textTransform:'uppercase'}}>{b.title}</div>
            <div style={{fontFamily:FD,fontSize:'10px',color:C.silverDm,letterSpacing:'1px',marginTop:'2px'}}>{b.level}</div>
          </div>
          <a href={b.source} target="_blank" rel="noopener noreferrer"
            style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',padding:'4px 10px',
              border:`1px solid ${C.teal}55`,color:C.tealLt,borderRadius:'3px',
              textDecoration:'none',textTransform:'uppercase',background:'#081414',whiteSpace:'nowrap'}}>
            📖 Source
          </a>
        </div>
        <div style={{fontFamily:FB,fontSize:'14px',color:C.silver,marginTop:'8px',lineHeight:'1.5'}}>{b.summary}</div>
        <div style={{fontFamily:FB,fontSize:'13px',color:C.amberLt,marginTop:'6px',lineHeight:'1.4',
          padding:'6px 10px',background:'#0e0c04',border:`1px solid ${C.amber}33`,borderRadius:'3px',fontStyle:'italic'}}>
          ⚙ Key Mechanic: {b.mechanic}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'12px',marginBottom:'14px'}}>
        <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',overflow:'hidden'}}>
          <div style={{padding:'8px 12px',background:C.bgHdr,borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontFamily:FD,fontSize:'11px',color:C.silver,letterSpacing:'2px',textTransform:'uppercase'}}>Skills</span>
          </div>
          <div style={{padding:'8px',display:'flex',flexDirection:'column',gap:'5px'}}>
            {b.skills.map(s=><SkillCard key={s.id} skill={s}/>)}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',overflow:'hidden'}}>
            <div style={{padding:'8px 12px',background:C.bgHdr,borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontFamily:FD,fontSize:'11px',color:C.silver,letterSpacing:'2px',textTransform:'uppercase'}}>Gear</span>
            </div>
            <div style={{padding:'8px',display:'flex',flexDirection:'column',gap:'5px'}}>
              {b.gear.map(g=><GearCard key={g.id} item={g}/>)}
            </div>
          </div>
          <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',overflow:'hidden'}}>
            <div style={{padding:'8px 12px',background:C.bgHdr,borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontFamily:FD,fontSize:'11px',color:C.green,letterSpacing:'2px',textTransform:'uppercase'}}>Decoctions (run all 5)</span>
            </div>
            <div style={{padding:'8px',display:'flex',flexDirection:'column',gap:'5px'}}>
              {b.decoctions.map(d=><DecCard key={d.id} dec={d}/>)}
            </div>
          </div>
        </div>
      </div>
      <div style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',overflow:'hidden'}}>
        <div style={{padding:'8px 12px',background:C.bgHdr,borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontFamily:FD,fontSize:'11px',color:C.amber,letterSpacing:'2px',textTransform:'uppercase'}}>Tips</span>
        </div>
        <div style={{padding:'10px 14px',display:'flex',flexDirection:'column',gap:'6px'}}>
          {b.tips.map((t,i)=>(
            <div key={i} style={{display:'flex',gap:'8px',alignItems:'flex-start'}}>
              <span style={{color:C.amber,flexShrink:0,marginTop:'2px'}}>▸</span>
              <span style={{fontFamily:FB,fontSize:'13px',color:C.silver,lineHeight:'1.5'}}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Progress ring ── */
function ProgressRing({pct}){
  const r=42,circ=2*Math.PI*r,offset=circ*(1-pct/100);
  return(
    <svg viewBox="0 0 100 100" width="90" height="90" style={{filter:`drop-shadow(0 0 12px ${C.blue}44)`,flexShrink:0}}>
      <circle cx="50" cy="50" r={r} fill="none" stroke={C.blueDk} strokeWidth="3"/>
      <circle cx="50" cy="50" r={r} fill="none" stroke={C.blue} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{transform:'rotate(-90deg)',transformOrigin:'50% 50%',transition:'stroke-dashoffset 0.8s'}}/>
      <image href="icons/medallion.png" x="20" y="20" width="60" height="60" style={{opacity:0.85}}/>
    </svg>
  );
}

/* ── Overview ── */
function Overview({checked,onReset}){
  const qDone=QUESTS.filter(q=>checked[q.id]).length;
  const qTotal=QUESTS.length;
  const aDone=ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  const aTotal=ACHIEVEMENTS.length;
  const overall=Math.round((qDone+aDone)/(qTotal+aTotal)*100);
  const byType=[
    {l:'Main Quests',    t:'Main Quest',    col:TYPE_COLOR['Main Quest']},
    {l:'Side Quests',    t:'Side Quest',    col:TYPE_COLOR['Side Quest']},
    {l:'Contracts',      t:'Contract',      col:TYPE_COLOR['Contract']},
    {l:'Treasure Hunts', t:'Treasure Hunt', col:TYPE_COLOR['Treasure Hunt']},
    {l:'Events',         t:'Event',         col:TYPE_COLOR['Event']},
    {l:'Races',          t:'Race',          col:TYPE_COLOR['Race']},
  ].map(x=>({...x,done:QUESTS.filter(q=>q.type===x.t&&checked[q.id]).length,total:QUESTS.filter(q=>q.type===x.t).length}));
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'20px',padding:'20px',
        background:C.bgHdr,border:`1px solid ${C.border}`,borderRadius:'6px',marginBottom:'18px',
        backgroundImage:`radial-gradient(ellipse at 0% 50%,${C.blueDk}66 0%,transparent 60%)`}}>
        <ProgressRing pct={overall}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:FD,fontSize:'22px',fontWeight:'700',letterSpacing:'4px',
            textTransform:'uppercase',color:C.blue,textShadow:`0 0 30px ${C.blue}44`,marginBottom:'4px'}}>
            Overall Progress
          </div>
          <div style={{fontFamily:FB,fontSize:'14px',color:C.silverDm,fontStyle:'italic',marginBottom:'10px'}}>
            {qDone+aDone} of {qTotal+aTotal} items completed
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <div style={{flex:1}}><Bar done={qDone+aDone} total={qTotal+aTotal} color={C.blue}/></div>
            <button onClick={onReset} style={{fontFamily:FD,fontSize:'9px',letterSpacing:'1px',
              padding:'4px 10px',cursor:'pointer',border:`1px solid #cc444455`,
              background:'transparent',color:C.red,borderRadius:'3px',
              textTransform:'uppercase',flexShrink:0,whiteSpace:'nowrap'}}>Reset</button>
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px'}}>
        {[{l:'Quests',done:qDone,total:qTotal,col:C.blue},{l:'Achievements',done:aDone,total:aTotal,col:C.amber}].map(x=>(
          <div key={x.l} style={{background:C.bgCard,border:`1px solid ${C.border}`,borderRadius:'5px',padding:'12px 14px'}}>
            <div style={{fontFamily:FD,fontSize:'10px',color:C.silv,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'5px'}}>{x.l}</div>
            <Bar done={x.done} total={x.total} color={x.col}/>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))',gap:'8px'}}>
        {byType.map(t=>(
          <div key={t.l} style={{background:C.bgCard,border:`1px solid ${C.border}`,
            borderTop:`2px solid ${t.done===t.total&&t.total>0?t.col:t.col+'55'}`,
            borderRadius:'0 0 5px 5px',padding:'10px 12px'}}>
            <div style={{fontFamily:FD,fontSize:'10px',color:C.silv,letterSpacing:'1px',textTransform:'uppercase',marginBottom:'4px'}}>{t.l}</div>
            <Bar done={t.done} total={t.total} color={t.col}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── App ── */
const TABS=[{id:'overview',label:'Overview'},{id:'quests',label:'Quests'},{id:'achievements',label:'Achievements'},{id:'builds',label:'Builds'}];

function App(){
  const[loaded,setLoaded]=useState(false);
  const[tab,setTab]=useState('overview');
  const[checked,setChecked]=useState({});
  const prevTab=useRef('overview');

  useEffect(()=>{
    try{const r=localStorage.getItem('w3v2');if(r)setChecked(JSON.parse(r).checked||{});}catch(e){}
    setLoaded(true);
  },[]);
  useEffect(()=>{
    if(!loaded)return;
    try{localStorage.setItem('w3v2',JSON.stringify({checked}));}catch(e){}
  },[checked,loaded]);
  useEffect(()=>{
    if(!loaded)return;
    const prev=prevTab.current;
    if(prev!==tab){
      sessionStorage.setItem('scroll_'+prev,String(window.scrollY));
      prevTab.current=tab;
      const s=parseInt(sessionStorage.getItem('scroll_'+tab)||'0',10);
      requestAnimationFrame(()=>window.scrollTo(0,s));
    }
  },[tab,loaded]);

  const toggle=useCallback((id)=>{
    setChecked(prev=>{const n={...prev};if(n[id])delete n[id];else n[id]=Date.now();return n;});
  },[]);
  const reset=()=>{if(confirm('Reset all progress?'))setChecked({});};

  const qDone=QUESTS.filter(q=>checked[q.id]).length;
  const aDone=ACHIEVEMENTS.filter(a=>checked[a.id]).length;
  const total=QUESTS.length+ACHIEVEMENTS.length;
  const pct=Math.round((qDone+aDone)/total*100);

  return(
    <div style={{background:C.bg,minHeight:'100vh',color:C.silver,fontFamily:FB}}>
      <div style={{background:`linear-gradient(180deg,${C.bgHdr} 0%,${C.bgCard} 100%)`,
        borderBottom:`1px solid ${C.border2}`,padding:'14px 20px',boxShadow:'0 4px 24px #00000099'}}>
        <div style={{maxWidth:'1180px',margin:'0 auto',display:'flex',alignItems:'center',
          justifyContent:'space-between',gap:'16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
            <img src="icons/medallion.png" width="36" height="36" alt=""
              style={{opacity:0.9,filter:`drop-shadow(0 0 8px ${C.blue}66)`}}
              onError={e=>{e.target.style.display='none'}}/>
            <div>
              <div style={{fontFamily:FD,fontSize:'20px',fontWeight:'700',color:C.blue,
                letterSpacing:'4px',textTransform:'uppercase',textShadow:`0 0 20px ${C.blue}44`}}>The Witcher 3</div>
              <div style={{fontFamily:FD,fontSize:'9px',letterSpacing:'5px',color:C.silverDm,textTransform:'uppercase',marginTop:'1px'}}>Wild Hunt — 100% Checklist</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            <span style={{fontFamily:FD,fontSize:'11px',color:C.silv}}>{pct}%</span>
            <div style={{width:'90px'}}><Bar done={qDone+aDone} total={total} color={C.blue}/></div>
          </div>
        </div>
      </div>
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
      <div style={{maxWidth:'1180px',margin:'0 auto',padding:'18px 14px'}}>
        {tab!=='overview'&&(
          <div style={{marginBottom:'14px',paddingBottom:'10px',borderBottom:`1px solid ${C.border}`}}>
            <h2 style={{fontFamily:FD,fontSize:'16px',fontWeight:'600',color:C.blue,
              letterSpacing:'3px',textTransform:'uppercase',margin:0}}>
              {tab==='quests'?`Quests (${QUESTS.length})`:tab==='achievements'?`Achievements (${ACHIEVEMENTS.length})`:'Builds'}
            </h2>
          </div>
        )}
        {tab==='overview'    &&<Overview checked={checked} onReset={reset}/>}
        {tab==='quests'      &&<QuestsTab checked={checked} onToggle={toggle}/>}
        {tab==='achievements'&&<AchievementsTab checked={checked} onToggle={toggle}/>}
        {tab==='builds'      &&<BuildsTab/>}
      </div>
      {!loaded&&(
        <div style={{position:'fixed',inset:0,background:C.bg,display:'flex',
          alignItems:'center',justifyContent:'center',zIndex:9999}}>
          <div style={{fontFamily:FD,fontSize:'13px',letterSpacing:'3px',color:C.blue,textTransform:'uppercase'}}>Loading...</div>
        </div>
      )}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
