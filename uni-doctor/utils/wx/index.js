
/* 是否在微信内置浏览器 */
export function isWeiXin() {  
	// #ifdef H5
	let ua = window.navigator.userAgent.toLowerCase()
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	  return true
	}else{
	  return false
	}
	// #endif
	// #ifndef H5
	return true
	// #endif
}