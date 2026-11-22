import React, {useEffect, useMemo, useState} from "react";
import {Alert, SafeAreaView, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {cards, Card, Category} from "./src/data/cards";
import {Lang, languages, t} from "./src/i18n/translations";

const C = {bg:"#11101B",panel:"#211B30",panel2:"#302442",gold:"#C5A66A",ivory:"#F1E7D2",muted:"#B7A9C8",line:"#493B59"};
type Reading = {id:string; date:string; question:string; cards:Card[]; note?:string};
const pick = (arr:Card[]) => arr[Math.floor(Math.random()*arr.length)];
const todayKey = () => { const d=new Date(); return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`; };

function Btn({title,onPress,secondary=false}:{title:string;onPress:()=>void;secondary?:boolean}) {
 return <TouchableOpacity onPress={onPress} style={{backgroundColor:secondary?C.panel2:C.gold,padding:15,borderRadius:14,alignItems:"center",borderWidth:secondary?1:0,borderColor:C.line}}>
  <Text style={{color:secondary?C.ivory:"#17111F",fontWeight:"800",letterSpacing:1}}>{title}</Text>
 </TouchableOpacity>;
}
function CardTile({card,onPress}:{card:Card;onPress:()=>void}) {
 return <TouchableOpacity onPress={onPress} style={{width:"47%",backgroundColor:C.panel,padding:12,borderRadius:16,borderWidth:1,borderColor:C.line,marginBottom:12}}>
  <View style={{height:145,borderRadius:11,backgroundColor:"#30233F",alignItems:"center",justifyContent:"center",marginBottom:10,borderWidth:1,borderColor:C.gold}}>
   <Text style={{fontSize:42}}>🐈‍⬛</Text><Text style={{fontSize:24,marginTop:4}}>✦</Text><Text style={{color:C.gold,fontSize:10,letterSpacing:2}}>{card.category}</Text>
  </View>
  <Text style={{color:C.ivory,fontWeight:"700"}}>{card.name}</Text>
  <Text style={{color:C.muted,fontSize:11,marginTop:4}}>{card.cat}</Text>
 </TouchableOpacity>;
}
export default function App() {
 const [lang,setLang]=useState<Lang>("en");
 const [tab,setTab]=useState<"home"|"ask"|"collection"|"journal"|"profile">("home");
 const [daily,setDaily]=useState<Card|null>(null);
 const [dailyDate,setDailyDate]=useState("");
 const [active,setActive]=useState<Card|null>(null);
 const [readings,setReadings]=useState<Reading[]>([]);
 const [question,setQuestion]=useState("");
 const [topic,setTopic]=useState("general");
 const [spread,setSpread]=useState<1|3>(1);
 const [result,setResult]=useState<Card[]>([]);
 const [filter,setFilter]=useState<"ALL"|Category>("ALL");
 const [favorites,setFavorites]=useState<string[]>([]);
 const [note,setNote]=useState("");
 const [saved,setSaved]=useState(false);
 const [ready,setReady]=useState(false);
 const tr=(k: any)=>t(lang,k);

 useEffect(()=>{(async()=>{
  try {
   const l=await AsyncStorage.getItem("lang"); if(l && languages.some(x=>x.code===l))setLang(l as Lang);
   const r=await AsyncStorage.getItem("readings"); if(r)setReadings(JSON.parse(r));
   const f=await AsyncStorage.getItem("favorites"); if(f)setFavorites(JSON.parse(f));
   const d=await AsyncStorage.getItem("daily"); const dd=await AsyncStorage.getItem("dailyDate");
   if(d && dd===todayKey()){setDaily(JSON.parse(d));setDailyDate(dd||"");}
  } catch(e){} finally {setReady(true);}
 })();},[]);
 const saveReadings=async(next:Reading[])=>{setReadings(next);await AsyncStorage.setItem("readings",JSON.stringify(next));};
 const drawDaily=async()=>{
  if(daily && dailyDate===todayKey()){setActive(daily);return;}
  const c=pick(cards);setDaily(c);setDailyDate(todayKey());setActive(c);
  await AsyncStorage.setItem("daily",JSON.stringify(c));await AsyncStorage.setItem("dailyDate",todayKey());
 };
 const drawSpread=()=>{
  const pool=[...cards];const chosen:Card[]=[];
  for(let i=0;i<spread;i++){const index=Math.floor(Math.random()*pool.length);chosen.push(pool.splice(index,1)[0]);}
  setResult(chosen);setSaved(false);
 };
 const saveCurrent=async()=>{
  const cs=result.length?result:(active?[active]:[]);
  if(!cs.length)return;
  const item:Reading={id:String(Date.now()),date:new Date().toISOString(),question:question||"Daily card",cards:cs,note};
  await saveReadings([item,...readings]);setSaved(true);Alert.alert(tr("saved"));
 };
 const toggleFav=async(id:string)=>{const next=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];setFavorites(next);await AsyncStorage.setItem("favorites",JSON.stringify(next));};
 const openCard=(c:Card)=>{setActive(c);setTab("home");};
 const titleStyle={color:C.ivory,fontSize:25,fontWeight:"800" as const,letterSpacing:1};
 const subStyle={color:C.muted,fontSize:13,lineHeight:20};
 const cardBody=(c:Card)=> <View style={{backgroundColor:C.panel,padding:18,borderRadius:18,borderWidth:1,borderColor:C.gold,marginTop:14}}>
   <View style={{alignItems:"center",padding:18,backgroundColor:"#30233F",borderRadius:14,marginBottom:16}}>
    <Text style={{fontSize:76}}>🐈‍⬛</Text><Text style={{color:C.gold,letterSpacing:3,fontSize:11}}>{c.category} · {String(c.number).padStart(2,"0")}</Text>
    <Text style={{color:C.ivory,fontSize:23,fontWeight:"800",marginTop:8,textAlign:"center"}}>{c.name}</Text>
    <Text style={{color:C.muted,fontSize:12,marginTop:5}}>{c.cat} · {c.symbol}</Text>
   </View>
   <Text style={{color:C.gold,fontWeight:"800",letterSpacing:1}}>{tr("meaning").toUpperCase()}</Text>
   <Text style={{color:C.ivory,fontSize:16,lineHeight:24,marginTop:6}}>{c.meaning}</Text>
   <Text style={{color:C.gold,fontWeight:"800",marginTop:16}}>{tr("light").toUpperCase()}</Text><Text style={subStyle}>{c.light}</Text>
   <Text style={{color:C.gold,fontWeight:"800",marginTop:14}}>{tr("shadow").toUpperCase()}</Text><Text style={subStyle}>{c.shadow}</Text>
   <Text style={{color:C.gold,fontWeight:"800",marginTop:14}}>{tr("advice").toUpperCase()}</Text><Text style={{color:C.ivory,lineHeight:22,marginTop:5}}>{c.advice}</Text>
   <Text style={{color:C.muted,fontSize:12,marginTop:16}}>{tr("love")}: {c.love}</Text>
   <Text style={{color:C.muted,fontSize:12,marginTop:6}}>{tr("career")}: {c.career}</Text>
   <Text style={{color:C.muted,fontSize:12,marginTop:6}}>{tr("money")}: {c.finance}</Text>
   <View style={{marginTop:16}}><Btn title={favorites.includes(c.id)?"★ FAVORITED":"☆ ADD TO FAVORITES"} secondary onPress={()=>toggleFav(c.id)}/></View>
  </View>;

 const header=(heading:string,sub?:string)=><View style={{marginBottom:22}}><Text style={titleStyle}>{heading}</Text>{sub?<Text style={[subStyle,{marginTop:6}]}>{sub}</Text>:null}</View>;
 const screen=()=>{
  if(active && tab==="home") return <>{header(active.name,"YOUR REVEALED CARD")}{cardBody(active)}<View style={{marginTop:12}}><Btn title={tr("back")} secondary onPress={()=>setActive(null)}/></View></>;
  if(tab==="home") return <>
   <View style={{alignItems:"center",marginTop:18,marginBottom:28}}>
    <Text style={{color:C.gold,fontSize:13,letterSpacing:5}}>✦ CAT ARCANA ✦</Text>
    <Text style={{color:C.ivory,fontSize:30,fontWeight:"800",marginTop:12}}>Mystical Cat Oracle</Text>
    <Text style={[subStyle,{marginTop:8}]}>{tr("tagline")}</Text>
   </View>
   <View style={{backgroundColor:C.panel,padding:22,borderRadius:20,borderWidth:1,borderColor:C.line}}>
    <Text style={{color:C.gold,letterSpacing:2,fontWeight:"800",textAlign:"center"}}>{tr("daily")}</Text>
    <Text style={{fontSize:78,textAlign:"center",marginVertical:18}}>🐈‍⬛</Text>
    <Text style={{color:C.ivory,textAlign:"center",marginBottom:18}}>{daily&&dailyDate===todayKey()?daily.name:tr("choose")}</Text>
    <Btn title={tr("draw")} onPress={drawDaily}/>
   </View>
   <View style={{marginTop:18,gap:12}}><Btn title={tr("ask")} secondary onPress={()=>{setActive(null);setTab("ask");}}/><Btn title={tr("collection")} secondary onPress={()=>setTab("collection")}/></View>
   <Text style={[subStyle,{textAlign:"center",marginTop:20,fontSize:11}]}>{tr("disclaimer")}</Text>
  </>;
  if(tab==="ask") return <>
   {header(tr("ask"),tr("choose"))}
   <Text style={{color:C.gold,fontWeight:"800",marginBottom:8}}>{tr("question")}</Text>
   <TextInput value={question} onChangeText={setQuestion} placeholder={tr("placeholder")} placeholderTextColor={C.muted} multiline style={{backgroundColor:C.panel,color:C.ivory,padding:14,borderRadius:12,minHeight:90,textAlignVertical:"top",borderWidth:1,borderColor:C.line}}/>
   <Text style={{color:C.gold,fontWeight:"800",marginTop:18,marginBottom:8}}>{tr("topic")}</Text>
   <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>{(["general","love","career","money","growth"] as const).map(k=><TouchableOpacity key={k} onPress={()=>setTopic(k)} style={{padding:10,borderRadius:20,backgroundColor:topic===k?C.gold:C.panel}}><Text style={{color:topic===k?C.bg:C.ivory}}>{tr(k)}</Text></TouchableOpacity>)}</View>
   <View style={{flexDirection:"row",gap:10,marginTop:18}}><View style={{flex:1}}><Btn title={tr("one")} secondary={spread!==1} onPress={()=>setSpread(1)}/></View><View style={{flex:1}}><Btn title={tr("three")} secondary={spread!==3} onPress={()=>setSpread(3)}/></View></View>
   <View style={{marginTop:16}}><Btn title={tr("reveal")} onPress={drawSpread}/></View>
   {result.map((c,i)=><View key={c.id}>{header(spread===3?[tr("situation"),tr("hidden"),tr("direction")][i]:c.name)}{cardBody(c)}</View>)}
   {result.length>0?<View style={{marginTop:14}}><TextInput value={note} onChangeText={setNote} placeholder={tr("note")} placeholderTextColor={C.muted} style={{backgroundColor:C.panel,color:C.ivory,padding:12,borderRadius:10,marginBottom:10}}/><Btn title={saved?tr("saved"):tr("save")} onPress={saveCurrent}/></View>:null}
  </>;
  if(tab==="collection") return <>
   {header(tr("collection"),`${cards.length} ORIGINAL CARDS`)}
   <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{maxHeight:48,marginBottom:12}}>{(["ALL","COSMOS","NATURE","SHADOW","SPIRIT"] as const).map(x=><TouchableOpacity key={x} onPress={()=>setFilter(x)} style={{padding:10,marginRight:8,borderRadius:18,backgroundColor:filter===x?C.gold:C.panel}}><Text style={{color:filter===x?C.bg:C.ivory,fontSize:11}}>{x==="ALL"?tr("all"):x}</Text></TouchableOpacity>)}</ScrollView>
   <View style={{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between"}}>{cards.filter(c=>filter==="ALL"||c.category===filter).map(c=><CardTile key={c.id} card={c} onPress={()=>openCard(c)}/>)}</View>
  </>;
  if(tab==="journal") return <>
   {header(tr("journal"))}
   {readings.length===0?<Text style={subStyle}>{tr("empty")}</Text>:readings.map(r=><View key={r.id} style={{backgroundColor:C.panel,padding:15,borderRadius:14,marginBottom:10,borderWidth:1,borderColor:C.line}}>
    <Text style={{color:C.gold,fontSize:11}}>{new Date(r.date).toLocaleString()}</Text>
    <Text style={{color:C.ivory,fontWeight:"700",fontSize:16,marginTop:5}}>{r.question}</Text>
    <Text style={subStyle}>{r.cards.map(c=>c.name).join(" · ")}</Text>
    {r.note?<Text style={[subStyle,{marginTop:6}]}>{r.note}</Text>:null}
   </View>)}
  </>;
  return <>
   {header(tr("profile"),tr("settings"))}
   <Text style={{color:C.gold,fontWeight:"800",marginBottom:12}}>{tr("language")}</Text>
   {languages.map(l=><TouchableOpacity key={l.code} onPress={async()=>{setLang(l.code);await AsyncStorage.setItem("lang",l.code);}} style={{padding:14,backgroundColor:lang===l.code?C.panel2:C.panel,borderRadius:12,marginBottom:8,flexDirection:"row",justifyContent:"space-between"}}>
    <Text style={{color:C.ivory}}>{l.flag}  {l.label}</Text><Text style={{color:C.gold}}>{lang===l.code?"✓":""}</Text>
   </TouchableOpacity>)}
   <View style={{backgroundColor:C.panel,padding:16,borderRadius:14,marginTop:12}}><Text style={{color:C.ivory,fontWeight:"700"}}>{tr("about")}</Text><Text style={[subStyle,{marginTop:8}]}>{tr("disclaimer")}</Text></View>
  </>;
 };
 const nav:[typeof tab,string][]=[["home","✦"],["ask","☾"],["collection","▤"],["journal","♡"],["profile","⚙"]];
 const labels:Record<string,string>={home:"HOME",ask:"ASK",collection:"DECK",journal:"LOG",profile:"MORE"};
 return <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
  <StatusBar barStyle="light-content"/>
  <ScrollView contentContainerStyle={{padding:20,paddingBottom:30}}>{ready?screen():<Text style={{color:C.ivory}}>Loading Cat Arcana…</Text>}</ScrollView>
  <View style={{flexDirection:"row",backgroundColor:"#171322",borderTopWidth:1,borderTopColor:C.line,paddingTop:10,paddingBottom:8}}>
   {nav.map(([key,icon])=><TouchableOpacity key={key} onPress={()=>{setActive(null);setTab(key);}} style={{flex:1,alignItems:"center",gap:3}}>
    <Text style={{color:tab===key?C.gold:C.muted,fontSize:20}}>{icon}</Text><Text style={{color:tab===key?C.gold:C.muted,fontSize:9,letterSpacing:1}}>{labels[key]}</Text>
   </TouchableOpacity>)}
  </View>
 </SafeAreaView>;
}
