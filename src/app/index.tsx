import { money, useAppState } from '@/hooks/app-state';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Home(){
 const {user,transactions}=useAppState();
 const income=transactions.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0),expense=transactions.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
 const recent=[...transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).slice(0,5);
 return <ScrollView contentContainerStyle={s.content}>
  <Text style={s.title}>Bună, {user?.split('@')[0]}!</Text><Text style={s.muted}>Banii tăi, puțin mai clari în fiecare zi.</Text>
  <View style={s.balance}><Text style={s.light}>SOLD ÎNREGISTRAT</Text><Text style={s.total}>{money(income-expense)}</Text><Text style={s.light}>Cont personal · RON</Text></View>
  <View style={s.row}><View style={s.half}><Text style={s.muted}>↙ Venituri</Text><Text style={s.amount}>{money(income)}</Text></View><View style={s.half}><Text style={s.muted}>↗ Cheltuieli</Text><Text style={s.amount}>{money(expense)}</Text></View></View>
  <Pressable accessibilityRole="button" style={s.button} onPress={()=>router.navigate('./add')}><Text style={s.white}>＋ Adaugă tranzacție</Text></Pressable>
  <View style={s.card}><View style={s.row}><Text style={s.section}>Tranzacții recente</Text><Pressable onPress={()=>router.navigate('./history')}><Text style={s.link}>Vezi toate →</Text></Pressable></View>
   {recent.map(t=><View key={t.id} style={s.transaction}><View style={{flex:1}}><Text style={s.description}>{t.description}</Text><Text style={s.muted}>{t.category} · {new Date(t.date+'T12:00:00').toLocaleDateString('ro-RO')}</Text></View><Text style={[s.description,{color:t.type==='income'?'#268061':'#302A3E'}]}>{t.type==='income'?'+':'−'}{money(t.amount)}</Text></View>)}
   {!recent.length&&<Text style={[s.muted,{paddingVertical:25}]}>Nu ai tranzacții încă. Adaugă prima ta cheltuială sau primul venit.</Text>}
  </View>
  <Text style={s.note}>Mod demo · Datele sunt disponibile în sesiunea curentă. Autentificarea pe server nu este conectată.</Text>
 </ScrollView>;
}
const s=StyleSheet.create({content:{padding:22,paddingBottom:36,width:'100%',maxWidth:760,alignSelf:'center'},title:{fontSize:29,fontWeight:'800',color:'#252334',marginBottom:8},muted:{fontSize:13,color:'#746A80',lineHeight:21},balance:{padding:25,borderRadius:23,backgroundColor:'#7047EB',marginVertical:24},light:{color:'#EAE0FF',fontSize:12},total:{fontSize:34,color:'white',fontWeight:'800',marginVertical:17},row:{flexDirection:'row',justifyContent:'space-between',gap:12,alignItems:'center'},half:{flex:1,padding:17,borderRadius:17,backgroundColor:'white'},amount:{fontSize:20,fontWeight:'700',color:'#302A3E',marginTop:10},button:{padding:17,backgroundColor:'#7047EB',borderRadius:13,alignItems:'center',marginVertical:23},white:{color:'white',fontWeight:'700'},card:{padding:21,backgroundColor:'white',borderRadius:20},section:{fontSize:17,fontWeight:'700',color:'#302A3E'},link:{fontSize:12,color:'#7047EB'},transaction:{flexDirection:'row',gap:10,alignItems:'center',paddingVertical:17,borderBottomWidth:1,borderBottomColor:'#F0ECF5'},description:{fontSize:14,fontWeight:'600',color:'#302A3E',marginBottom:5},note:{fontSize:11,lineHeight:18,textAlign:'center',color:'#746A80',marginTop:25}});
