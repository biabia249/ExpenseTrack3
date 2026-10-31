import { AppStateProvider, useAppState } from '@/hooks/app-state';
import { Stack, router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

function Navigation(){
 const {user,signOut}=useAppState();const path=usePathname();
 return <SafeAreaView style={s.screen}>
  {user&&<View style={s.header}><Text style={s.brand}>↗ ExpenseTrack</Text><Pressable onPress={signOut} accessibilityRole="button"><Text style={s.link}>Deconectare</Text></Pressable></View>}
  <Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:'#F7F8FC'}}}>
   <Stack.Protected guard={!user}><Stack.Screen name="login"/></Stack.Protected>
   <Stack.Protected guard={!!user}><Stack.Screen name="index"/><Stack.Screen name="history"/><Stack.Screen name="HistoryScreen"/><Stack.Screen name="explore"/><Stack.Screen name="add"/></Stack.Protected>
  </Stack>
  {user&&<View style={s.tabs}>
   <Pressable style={s.tab} onPress={()=>router.navigate('/')} accessibilityRole="tab" accessibilityState={{selected:path==='/'}}><Text style={[s.tabText,path==='/'&&s.active]}>⌂ Home</Text></Pressable>
   <Pressable style={s.tab} onPress={()=>router.navigate('./history')} accessibilityRole="tab" accessibilityState={{selected:/history/i.test(path)}}><Text style={[s.tabText,/history/i.test(path)&&s.active]}>⇄ Istoric</Text></Pressable>
   <Pressable style={s.tab} onPress={()=>router.navigate('/explore')} accessibilityRole="tab" accessibilityState={{selected:path==='/explore'}}><Text style={[s.tabText,path==='/explore'&&s.active]}>▧ Categorii</Text></Pressable>
  </View>}
 </SafeAreaView>;
}
export default function RootLayout(){return <SafeAreaProvider><AppStateProvider><Navigation/></AppStateProvider></SafeAreaProvider>;}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:'#F7F8FC'},header:{padding:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'},brand:{fontSize:22,fontWeight:'800',color:'#7047EB'},link:{color:'#665578',fontSize:12,paddingVertical:8},tabs:{flexDirection:'row',backgroundColor:'white',borderTopWidth:1,borderColor:'#EDEAF3'},tab:{flex:1,minHeight:58,alignItems:'center',justifyContent:'center'},tabText:{color:'#776C86',fontSize:13},active:{color:'#7047EB',fontWeight:'700'}});
