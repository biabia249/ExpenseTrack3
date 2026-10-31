import { useAppState } from '@/hooks/app-state';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

// Local definitions keep this route independent of files from another project.
type Transaction = {id:string; description:string; amount:number; type:'expense'|'income'; category:string; date:string};
const categories = [
  {name:'Mâncare',icon:'🛒',color:'#7751EB'},
  {name:'Shopping',icon:'🛍',color:'#B29AF2'},
  {name:'Transport',icon:'🚕',color:'#F0B980'},
  {name:'Facturi',icon:'⌂',color:'#68BCA2'},
  {name:'Timp liber',icon:'☕',color:'#80ABE5'},
];

const money=(value:number)=>value.toLocaleString('ro-RO',{minimumFractionDigits:2,maximumFractionDigits:2})+' lei';

const purple='#7047EB';
const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:'#F7F8FC'},content:{padding:22,paddingBottom:35},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:25},brand:{fontSize:20,fontWeight:'800',color:purple},avatar:{width:43,height:43,borderRadius:22,backgroundColor:'#EBE3FF',alignItems:'center',justifyContent:'center'},title:{fontSize:28,fontWeight:'800',color:'#252334',marginBottom:7},muted:{color:'#948EA2',fontSize:13,lineHeight:20},card:{backgroundColor:'#FFF',borderRadius:20,padding:21,marginTop:17,borderWidth:1,borderColor:'#EDEAF3'},balance:{backgroundColor:purple,borderColor:purple},white:{color:'#FFF'},amount:{fontSize:32,fontWeight:'800',color:'#252334',marginVertical:12},smallAmount:{fontSize:20,fontWeight:'800',color:'#252334',marginTop:12},row:{flexDirection:'row',gap:12},half:{flex:1},label:{fontSize:12,color:'#948EA2'},section:{fontSize:17,fontWeight:'700',color:'#252334'},between:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:10},button:{backgroundColor:purple,borderRadius:13,padding:16,alignItems:'center',marginTop:20},buttonText:{color:'#FFF',fontWeight:'700',fontSize:14},link:{fontSize:12,color:purple,fontWeight:'600'},tx:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:15,borderBottomWidth:1,borderBottomColor:'#F2EFF6'},icon:{width:42,height:42,borderRadius:13,backgroundColor:'#F4EFFC',alignItems:'center',justifyContent:'center'},txTitle:{fontSize:14,fontWeight:'600',color:'#302A3E'},txAmount:{fontSize:13,fontWeight:'700',color:'#302A3E'},tabs:{flexDirection:'row',backgroundColor:'#FFF',borderTopWidth:1,borderTopColor:'#EDEAF3',paddingVertical:12},tab:{flex:1,alignItems:'center',gap:5},tabIcon:{fontSize:22},tabLabel:{fontSize:10},input:{borderWidth:1,borderColor:'#E3DEED',borderRadius:12,padding:15,backgroundColor:'#FFF',color:'#302A3E',marginTop:8,marginBottom:17,fontSize:15},field:{fontSize:13,fontWeight:'600',color:'#6E647F'},chip:{paddingHorizontal:15,paddingVertical:10,borderRadius:11,backgroundColor:'#EDE8F7'},chipActive:{backgroundColor:purple},chipText:{fontSize:12,color:'#7B6E92'},chips:{flexDirection:'row',flexWrap:'wrap',gap:9,marginVertical:12},track:{height:7,backgroundColor:'#F0EBF8',borderRadius:5,overflow:'hidden',marginTop:10},bar:{height:7,borderRadius:5},chart:{height:130,flexDirection:'row',alignItems:'flex-end',gap:10,marginTop:22},chartColumn:{flex:1,alignItems:'center',height:130,justifyContent:'flex-end',gap:8},chartBar:{backgroundColor:purple,width:'70%',borderTopLeftRadius:5,borderTopRightRadius:5},error:{color:'#C84C50',fontSize:13,marginVertical:10},center:{flex:1,justifyContent:'center',padding:28},empty:{paddingVertical:25,textAlign:'center',color:'#948EA2'},note:{backgroundColor:'#EDE7FC',padding:16,borderRadius:13,marginTop:20},delete:{padding:8},subtitle:{fontSize:10,color:'#A49BB1',marginTop:5},modal:{flex:1,backgroundColor:'#F7F8FC'},loginLogo:{fontSize:46,color:purple,fontWeight:'800',marginBottom:25}
});

function TransactionRow({transaction:t,onDelete}:{transaction:Transaction;onDelete?:(id:string)=>void}){return <View style={s.tx}><View style={s.icon}><Text style={{fontSize:20}}>{t.type==='income'?'↙':categories.find(c=>c.name===t.category)?.icon||'◈'}</Text></View><View style={{flex:1}}><Text style={s.txTitle}>{t.description}</Text><Text style={s.subtitle}>{t.category} · {new Date(t.date+'T12:00:00').toLocaleDateString('ro-RO')}</Text></View><Text style={[s.txAmount,t.type==='income'&&{color:'#379B7C'}]}>{t.type==='income'?'+':'−'} {money(t.amount)}</Text>{onDelete&&<Pressable onPress={()=>onDelete(t.id)} style={s.delete} accessibilityLabel={'Șterge '+t.description}><Text style={{color:'#AA9BB7'}}>×</Text></Pressable>}</View>}

const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('ro');
export default function HistoryScreen(){
 const {transactions,remove}=useAppState();
 const params=useLocalSearchParams<{category?:string}>();
 const [pending,setPending]=useState<string|null>(null);
 const onAdd=()=>router.navigate('./add');
 const onDelete=(id:string)=>setPending(id);
 const [query,setQuery]=useState(''),[type,setType]=useState(''),[month,setMonth]=useState('');
 const category=typeof params.category==='string'?params.category:'';
 const setCategory=(value:string)=>router.setParams({category:value});
 const months=[...new Set([...transactions.map(t=>t.date.slice(0,7)),...(month?[month]:[])])].sort().reverse();
 const monthLabel=(key:string)=>new Date(key+'-01T12:00:00').toLocaleDateString('ro-RO',{month:'long',year:'numeric'});
 const filtered=[...transactions].filter(t=>(!month||t.date.startsWith(month))&&(!type||t.type===type)&&(!category||t.category===category)&&normalize(t.description+' '+t.category).includes(normalize(query.trim()))).sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
 const income=filtered.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0),expense=filtered.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
 const days=[...new Set(filtered.map(t=>t.date))];
 const active=!!(query||month||type||category);
 const reset=()=>{setQuery('');setCategory('');setType('');setMonth('')};
 return <ScrollView style={{flex:1}} contentContainerStyle={[s.content,{width:'100%',maxWidth:760,alignSelf:'center'}]} keyboardShouldPersistTaps="handled">
  <Text style={s.title}>Istoric tranzacții</Text><Text style={s.muted}>Fiecare tranzacție spune o parte din poveste.</Text>
  <View style={h.summary}><Text style={h.caption}>CHELTUIELI ÎN SELECȚIE</Text><Text style={h.total}>{money(expense)}</Text><View style={s.between}><Text style={h.detail}>↙ Venituri: {money(income)}</Text><Text style={h.detail}>{filtered.length} {filtered.length===1?'tranzacție':'tranzacții'}</Text></View></View>
  <TextInput style={[s.input,{marginTop:22}]} value={query} onChangeText={setQuery} placeholder="Caută după nume sau categorie…" accessibilityLabel="Caută tranzacții"/>
  <Text style={h.filterLabel}>Perioadă</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={h.scroller}><View style={s.row}>{['',...months].map(m=><Pressable key={m} style={[s.chip,month===m&&s.chipActive]} onPress={()=>setMonth(m)} accessibilityRole="button" accessibilityState={{selected:month===m}}><Text style={[s.chipText,month===m&&s.white]}>{m?monthLabel(m):'Toată perioada'}</Text></Pressable>)}</View></ScrollView>
  <View style={h.segment}>{[{value:'',label:'Toate'},{value:'expense',label:'Cheltuieli'},{value:'income',label:'Venituri'}].map(t=><Pressable key={t.value} style={[h.segmentButton,type===t.value&&h.selected]} onPress={()=>setType(t.value)} accessibilityRole="button" accessibilityState={{selected:type===t.value}}><Text style={{color:type===t.value?purple:'#948EA2',fontWeight:'600'}}>{t.label}</Text></Pressable>)}</View>
  <Text style={h.filterLabel}>Categorie</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={h.scroller}><View style={s.row}>{['',...categories.map(c=>c.name),'Venit'].map(c=><Pressable key={c} style={[s.chip,category===c&&s.chipActive]} onPress={()=>setCategory(c)} accessibilityRole="button" accessibilityState={{selected:category===c}}><Text style={[s.chipText,category===c&&s.white]}>{c||'Toate categoriile'}</Text></Pressable>)}</View></ScrollView>
  <View style={[s.between,{marginTop:12}]}><Text style={s.section}>Tranzacțiile tale</Text>{active&&<Pressable onPress={reset} hitSlop={12}><Text style={s.link}>Resetează filtrele</Text></Pressable>}</View>
  {days.map(day=>{const rows=filtered.filter(t=>t.date===day);const net=rows.reduce((a,t)=>a+(t.type==='income'?t.amount:-t.amount),0);return <View key={day} style={s.card}><View style={s.between}><Text style={h.day}>{new Date(day+'T12:00:00').toLocaleDateString('ro-RO',{day:'numeric',month:'long',year:'numeric'})}</Text><Text style={s.label}>{net>0?'+':''}{money(net)}</Text></View>{rows.map(t=><TransactionRow key={t.id} transaction={t} onDelete={onDelete}/>)}</View>})}
  {!filtered.length&&<View style={s.card}><Text style={h.emptyIcon}>⌕</Text><Text style={[s.section,{textAlign:'center'}]}>{active?'Niciun rezultat':'Istoricul tău începe aici'}</Text><Text style={s.empty}>{active?'Încearcă altă căutare sau resetează filtrele.':'Adaugă prima tranzacție pentru a-ți urmări cheltuielile.'}</Text>{active&&<Pressable onPress={reset}><Text style={[s.link,{textAlign:'center'}]}>Resetează filtrele</Text></Pressable>}</View>}
  {onAdd&&<Pressable accessibilityRole="button" style={s.button} onPress={onAdd}><Text style={s.buttonText}>＋ Adaugă tranzacție</Text></Pressable>}
 <Modal visible={pending!==null} transparent animationType="fade" onRequestClose={()=>setPending(null)}><View style={{flex:1,justifyContent:'center',padding:26,backgroundColor:'#211B3866'}}><View style={s.card}><Text style={s.section}>Ștergi tranzacția?</Text><Text style={[s.muted,{marginTop:12}]}>Această acțiune elimină tranzacția din sesiunea curentă.</Text><Pressable accessibilityRole="button" style={s.button} onPress={()=>{if(pending)remove(pending);setPending(null)}}><Text style={s.buttonText}>Șterge tranzacția</Text></Pressable><Pressable accessibilityRole="button" style={{padding:18,alignItems:'center'}} onPress={()=>setPending(null)}><Text style={s.link}>Renunță</Text></Pressable></View></View></Modal>
 </ScrollView>;
}
const h=StyleSheet.create({summary:{backgroundColor:purple,borderRadius:22,padding:23,marginTop:22},caption:{color:'#DDD0FF',fontSize:11,letterSpacing:1.2},total:{color:'white',fontSize:32,fontWeight:'800',marginVertical:15},detail:{color:'#EBE3FF',fontSize:11},filterLabel:{fontSize:12,fontWeight:'600',color:'#6E647F',marginBottom:10},scroller:{marginBottom:18,flexGrow:0},segment:{flexDirection:'row',backgroundColor:'#EDE8F7',padding:5,borderRadius:14,marginBottom:19},segmentButton:{flex:1,paddingVertical:12,alignItems:'center',borderRadius:10},selected:{backgroundColor:'white'},day:{fontSize:12,fontWeight:'700',color:'#6E647F'},emptyIcon:{fontSize:38,color:purple,textAlign:'center',marginBottom:14}});

