import { useState } from 'react';
import { money, useAppState } from '@/hooks/app-state';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function Home(){
 const {user,transactions}=useAppState();
 const [balanceVisible,setBalanceVisible]=useState(true);
 const [avatarFailed,setAvatarFailed]=useState(false);
 const holder=(user?.split('@')[0]||'Alex Popescu').replace(/[._-]+/g,' ');
 const income=transactions.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0),expense=transactions.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0);
 const recent=[...transactions].sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id)).slice(0,5);
 return <ScrollView contentContainerStyle={s.content}>
  <Text style={s.title}>Bună, {user?.split('@')[0]}!</Text><Text style={s.muted}>Banii tăi, puțin mai clari în fiecare zi.</Text>
  <View style={s.cardSection}>
   <View style={s.row}><Text style={s.section}>Cardul tău</Text><View style={s.demoBadge}><Text style={s.demoBadgeText}>DEMO</Text></View></View>
   <Text style={[s.muted,{marginTop:7,marginBottom:16}]}>O privire asupra balanței tale, într-un singur loc.</Text>
   <View style={s.bankCard}>
    <View style={s.row}><Text style={s.cardBrand}>↗ ExpenseTrack</Text><Text style={s.cardType}>CARD VIRTUAL</Text></View>
    <View style={s.cardBalanceHeader}><Text style={s.light}>BALANȚĂ ÎNREGISTRATĂ</Text><Pressable accessibilityRole="button" accessibilityLabel={balanceVisible?'Ascunde balanța':'Arată balanța'} onPress={()=>setBalanceVisible(value=>!value)} style={s.visibilityButton}><Text style={s.visibilityText}>{balanceVisible?'Ascunde':'Arată'}</Text></Pressable></View>
    <Text style={s.total} accessibilityLiveRegion="polite">{balanceVisible?money(income-expense):'•••••• lei'}</Text>
    <View style={s.cardDetails}><View style={s.chip} accessible={false}><View style={s.chipLine}/><View style={s.chipLine}/></View><Text style={s.cardNumber} accessibilityLabel="Număr fictiv de card, terminat în 2048">••••  ••••  ••••  2048</Text></View>
    <View style={s.userProfile}>
     {avatarFailed?<View style={s.avatarFallback}><Text style={s.avatarInitials}>{holder.slice(0,2).toUpperCase()}</Text></View>:<Image source={require('../../assets/images/demo-user.jpg')} style={s.userAvatar} accessibilityLabel="Portret demonstrativ al utilizatorului" onError={()=>setAvatarFailed(true)}/>}
     <View style={{flex:1}}><Text style={s.cardLabel}>TITULAR DEMO</Text><Text style={s.cardHolder}>{holder}</Text><Text style={s.profileCaption}>Cont personal · Card virtual demo</Text></View>
    </View>
    <View style={s.cardFooter}>
     <View><Text style={s.cardLabel}>EMIS LA · DEMO</Text><Text style={s.cardHolder}>10/2026</Text></View>
     <View><Text style={s.cardLabel}>VALABIL PÂNĂ LA</Text><Text style={s.cardHolder}>10/2029</Text></View>
     <View><Text style={s.cardLabel}>MONEDĂ</Text><Text style={s.cardHolder}>RON</Text></View>
    </View>
   </View>
   <Text style={s.cardDisclaimer}>Fotografie și date de card demonstrative, fără conexiune bancară. Balanța reprezintă veniturile minus cheltuielile înregistrate în aplicație.</Text>
  </View>
  <View style={s.row}><View style={s.half}><Text style={s.muted}>↙ Venituri</Text><Text style={s.amount}>{money(income)}</Text></View><View style={s.half}><Text style={s.muted}>↗ Cheltuieli</Text><Text style={s.amount}>{money(expense)}</Text></View></View>
  <Pressable accessibilityRole="button" style={s.button} onPress={()=>router.navigate('./add')}><Text style={s.white}>＋ Adaugă tranzacție</Text></Pressable>
  <View style={s.card}><View style={s.row}><Text style={s.section}>Tranzacții recente</Text><Pressable onPress={()=>router.navigate('./history')}><Text style={s.link}>Vezi toate →</Text></Pressable></View>
   {recent.map(t=><View key={t.id} style={s.transaction}><View style={{flex:1}}><Text style={s.description}>{t.description}</Text><Text style={s.muted}>{t.category} · {new Date(t.date+'T12:00:00').toLocaleDateString('ro-RO')}</Text></View><Text style={[s.description,{color:t.type==='income'?'#268061':'#302A3E'}]}>{t.type==='income'?'+':'−'}{money(t.amount)}</Text></View>)}
   {!recent.length&&<Text style={[s.muted,{paddingVertical:25}]}>Nu ai tranzacții încă. Adaugă prima ta cheltuială sau primul venit.</Text>}
  </View>
  <Text style={s.note}>Mod demo · Datele sunt disponibile în sesiunea curentă. Autentificarea pe server nu este conectată.</Text>
 </ScrollView>;
}
const s=StyleSheet.create({
 userProfile:{flexDirection:'row',alignItems:'center',gap:13,marginBottom:22},
 userAvatar:{width:54,height:54,borderRadius:27,borderWidth:2,borderColor:'#D9C9FF',backgroundColor:'#8967E7'},
 avatarFallback:{width:54,height:54,borderRadius:27,backgroundColor:'#8967E7',alignItems:'center',justifyContent:'center'},
 avatarInitials:{fontSize:18,fontWeight:'700',color:'white'},
 profileCaption:{fontSize:11,lineHeight:17,color:'#E5D9FF',marginTop:5},

 cardSection:{marginTop:26,marginBottom:24},
 demoBadge:{backgroundColor:'#EDE6FF',borderRadius:7,paddingHorizontal:10,paddingVertical:5},
 demoBadgeText:{color:'#6440C5',fontSize:10,fontWeight:'700',letterSpacing:1},
 bankCard:{padding:24,borderRadius:24,backgroundColor:'#6340D9',borderWidth:1,borderColor:'#8964ED',shadowColor:'#40217F',shadowOffset:{width:0,height:10},shadowOpacity:0.16,shadowRadius:20,elevation:5},
 cardBrand:{fontSize:19,fontWeight:'800',color:'#FFFFFF',flexShrink:1},
 cardType:{fontSize:9,fontWeight:'600',letterSpacing:1,color:'#E5D9FF',flexShrink:1,textAlign:'right'},
 cardBalanceHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8,flexWrap:'wrap',marginTop:22},
 visibilityButton:{paddingVertical:8,paddingHorizontal:12,borderRadius:9,backgroundColor:'#7854E2',minHeight:40,justifyContent:'center'},
 visibilityText:{color:'#FFFFFF',fontSize:12,fontWeight:'600'},
 cardDetails:{flexDirection:'row',alignItems:'center',gap:14,marginTop:8,marginBottom:24,flexWrap:'wrap'},
 chip:{height:30,width:39,borderRadius:7,backgroundColor:'#E7CD93',borderWidth:1,borderColor:'#F3DFB5',justifyContent:'space-evenly',paddingHorizontal:5},
 chipLine:{height:1,backgroundColor:'#B29A65'},
 cardNumber:{color:'#F4EEFF',fontSize:17,letterSpacing:1,fontWeight:'500',flexShrink:1},
 cardFooter:{flexDirection:'row',justifyContent:'space-between',gap:14,flexWrap:'wrap',alignItems:'flex-end',borderTopWidth:1,borderTopColor:'#8967E7',paddingTop:17},
 cardLabel:{color:'#DCD0F9',fontSize:9,letterSpacing:1,marginBottom:6},
 cardHolder:{color:'#FFFFFF',fontWeight:'600',fontSize:14,textTransform:'uppercase'},
 cardDisclaimer:{color:'#746A80',fontSize:11,lineHeight:18,marginTop:14},
content:{padding:22,paddingBottom:36,width:'100%',maxWidth:760,alignSelf:'center'},title:{fontSize:29,fontWeight:'800',color:'#252334',marginBottom:8},muted:{fontSize:13,color:'#746A80',lineHeight:21},balance:{padding:25,borderRadius:23,backgroundColor:'#7047EB',marginVertical:24},light:{color:'#EAE0FF',fontSize:12},total:{fontSize:34,color:'white',fontWeight:'800',marginVertical:17},row:{flexDirection:'row',justifyContent:'space-between',gap:12,alignItems:'center'},half:{flex:1,padding:17,borderRadius:17,backgroundColor:'white'},amount:{fontSize:20,fontWeight:'700',color:'#302A3E',marginTop:10},button:{padding:17,backgroundColor:'#7047EB',borderRadius:13,alignItems:'center',marginVertical:23},white:{color:'white',fontWeight:'700'},card:{padding:21,backgroundColor:'white',borderRadius:20},section:{fontSize:17,fontWeight:'700',color:'#302A3E'},link:{fontSize:12,color:'#7047EB'},transaction:{flexDirection:'row',gap:10,alignItems:'center',paddingVertical:17,borderBottomWidth:1,borderBottomColor:'#F0ECF5'},description:{fontSize:14,fontWeight:'600',color:'#302A3E',marginBottom:5},note:{fontSize:11,lineHeight:18,textAlign:'center',color:'#746A80',marginTop:25}});
