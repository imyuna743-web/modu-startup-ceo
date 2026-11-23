// Keep only the changing state and list lengths; never nest snapshots inside snapshots.
// Journals and advice are prepended; monthly history is appended.
export function captureCheckpoint(state,type,title,month){
 const {rewindPoints,history,journal,adviceHistory,customPortrait,...current}=state;
 state.rewindSequence=(state.rewindSequence||0)+1;
 const id=`${type}-${month}-${state.rewindSequence}`;
 const snapshot=structuredClone({...current,rewindSequence:state.rewindSequence});
 delete snapshot.autoSummary;
 if(type==='event'&&snapshot.pending){snapshot.pending.phase='choice';delete snapshot.pending.selectedChoice;snapshot.lastScene=null;}
 state.rewindPoints=[...(rewindPoints||[]),{id,type,title,month,state:snapshot,historyLength:history?.length||0,journalLength:journal?.length||0,adviceLength:adviceHistory?.length||0}];
 return id;
}
export function restoreCheckpoint(source,id){
 const index=source.rewindPoints?.findIndex(point=>point.id===id)??-1;if(index<0)return null;
 const point=source.rewindPoints[index];
 if(point.historyLength>source.history.length||point.journalLength>source.journal.length||point.adviceLength>(source.adviceHistory?.length||0))return null;
 const s=structuredClone({...point.state,history:source.history.slice(0,point.historyLength),journal:point.journalLength?source.journal.slice(-point.journalLength):[],adviceHistory:point.adviceLength?source.adviceHistory.slice(-point.adviceLength):[],rewindPoints:source.rewindPoints.slice(0,index)});
 if(source.customPortrait)s.customPortrait=source.customPortrait;
 s.replayedFrom={name:source.name,month:point.month,title:point.title};
 return s;
}
