import { categories, today, useAppState, type Transaction } from '@/hooks/app-state';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function AddTransaction(){
 const {add}=useAppState();const [description,setDescription]=useState(''),[amount,setAmount]=useState(''),[type,setType]=useState<Transaction['type']>('expense'),[category,setCategory]=useState(categories[0]),[date,setDate]=useState(today()),[error,setError]=useState('');
 const submit=()=>{const value=Number(amount.replace(',','.'));const parsed=new Date(date+'T12:00:00');if(!description.trim()||!Number.isFinite(value)||value<=0||value>100000000||!/^\d{4}-\d{2}-\d{2}$/.test(date)||isNaN(parsed.getTime())||parsed.getFullYear()!==Number(date.slice(0,4))||parsed.getMonth()+1!==Number(date.slice(5,7))||parsed.getDate()!==Number(date.slice(8))){setError('Completează descrierea, o sumă pozitivă și data validă (AAAA-LL-ZZ).');return;}add({description:description.trim(),amount:Math.round(value*100)/100,type,category:type==='income'?'Venit':category,date});router.replace('./history');};
 return <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
  <Text style={s.title}>Tranzacție nouă</Text><Text style={s.muted}>Se actualizează imediat în Home și Istoric.</Text>
  <View style={s.row}>{(['expense','income'] as const).map(v=><Pressable key={v} onPress={()=>setType(v)} style={[s.chip,type===v&&s.active]} accessibilityRole="button" accessibilityState={{selected:type===v}}><Text style={{color:type===v?'white':'#58496A'}}>{v==='expense'?'Cheltuială':'Venit'}</Text></Pressable>)}</View>
  <Text style={s.label}>Descriere</Text><TextInput accessibilityLabel="Descriere" style={s.input} value={description} onChangeText={setDescription} placeholder="ex. Cumpărături" maxLength={70}/>
  <Text style={s.label}>Sumă (lei)</Text><TextInput accessibilityLabel="Sumă (lei)" style={s.input} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0,00"/>
  {type==='expense'&&<><Text style={s.label}>Categorie</Text><View style={s.row}>{categories.map(c=><Pressable key={c} onPress={()=>setCategory(c)} style={[s.chip,category===c&&s.active]} accessibilityRole="button" accessibilityState={{selected:category===c}}><Text style={{color:category===c?'white':'#58496A'}}>{c}</Text></Pressable>)}</View></>}
  <Text style={s.label}>Data (AAAA-LL-ZZ)</Text><TextInput accessibilityLabel="Data" style={s.input} value={date} onChangeText={setDate} maxLength={10}/>
  {!!error&&<Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text>}
  <Pressable accessibilityRole="button" style={[s.chip,s.active,{alignItems:'center',padding:17}]} onPress={submit}><Text style={{color:'white',fontWeight:'700'}}>Salvează tranzacția</Text></Pressable><Pressable accessibilityRole="button" style={{padding:20,alignItems:'center'}} onPress={()=>router.replace('/')}><Text style={{color:'#7047EB'}}>Renunță</Text></Pressable>
 </ScrollView></KeyboardAvoidingView>;
}
const s=StyleSheet.create({content:{padding:24,width:'100%',maxWidth:650,alignSelf:'center'},title:{fontSize:28,fontWeight:'800',color:'#252334',marginBottom:8},muted:{color:'#746A80',fontSize:13,lineHeight:20},row:{flexDirection:'row',gap:9,flexWrap:'wrap',marginVertical:18},chip:{padding:12,borderRadius:11,backgroundColor:'#EDE7F7'},active:{backgroundColor:'#7047EB'},label:{color:'#58496A',fontSize:13,fontWeight:'600',marginBottom:9},input:{padding:15,borderRadius:12,borderWidth:1,borderColor:'#E3DEED',backgroundColor:'white',marginBottom:20,fontSize:16,color:'#302A3E'},error:{color:'#AB3448',marginBottom:18,lineHeight:20}});
