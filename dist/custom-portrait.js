export const validPortrait=value=>typeof value==='string'&&value.length<=180000&&/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(value);
export function portraitSource(state,fallback){return state?.mode==='custom'&&validPortrait(state.customPortrait)?state.customPortrait:fallback;}
export async function readPortraitFile(file){
 if(!file||!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('PNG, JPG, WebP 사진을 선택해 주세요.');
 if(file.size>8*1024*1024)throw new Error('8MB 이하의 사진을 선택해 주세요.');
 const url=URL.createObjectURL(file);
 try{const picture=new Image();picture.src=url;await picture.decode();const scale=Math.min(1,480/Math.max(picture.naturalWidth,picture.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(picture.naturalWidth*scale));canvas.height=Math.max(1,Math.round(picture.naturalHeight*scale));const ctx=canvas.getContext('2d');ctx.drawImage(picture,0,0,canvas.width,canvas.height);let result=canvas.toDataURL('image/webp',.8);if(result.length>180000)result=canvas.toDataURL('image/webp',.55);if(!validPortrait(result))throw new Error('사진 용량이 커요. 더 작은 사진을 선택해 주세요.');return result;}catch(error){throw new Error(error.message?.includes('사진')?error.message:'사진을 읽지 못했어요. 다른 파일을 선택해 주세요.');}finally{URL.revokeObjectURL(url);}
}
