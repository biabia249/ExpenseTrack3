import { createContext, useContext, useState, type ReactNode } from 'react';

export type Transaction = {id:string;description:string;amount:number;type:'expense'|'income';category:string;date:string};
export const categories=['Mâncare','Shopping','Transport','Facturi','Timp liber'];
export const money=(value:number)=>value.toLocaleString('ro-RO',{minimumFractionDigits:2,maximumFractionDigits:2})+' lei';
export function today(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
type State={user:string|null;transactions:Transaction[];signIn:(email:string)=>void;signOut:()=>void;add:(transaction:Omit<Transaction,'id'>)=>void;remove:(id:string)=>void};
const Context=createContext<State|null>(null);
export function AppStateProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<string|null>(null);
 const [accounts,setAccounts]=useState<Record<string,Transaction[]>>({});
 const transactions=user?accounts[user]??[]:[];
 const signIn=(email:string)=>setUser(email.trim().toLowerCase());
 const signOut=()=>setUser(null);
 const add=(transaction:Omit<Transaction,'id'>)=>{if(!user)return;setAccounts(current=>({...current,[user]:[{...transaction,id:Date.now().toString()+'-'+Math.random().toString(36).slice(2)},...(current[user]??[])]}));};
 const remove=(id:string)=>{if(!user)return;setAccounts(current=>({...current,[user]:(current[user]??[]).filter(t=>t.id!==id)}));};
 return <Context.Provider value={{user,transactions,signIn,signOut,add,remove}}>{children}</Context.Provider>;
}
export function useAppState(){const state=useContext(Context);if(!state)throw new Error('AppStateProvider lipsește');return state;}
