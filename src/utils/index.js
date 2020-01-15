import languageDataList from './locale';

export const $getLanguage = function () {
  const currentLanguage = localStorage.getItem('language')
  if(currentLanguage){
    return currentLanguage
  }else {
    const navLang = navigator.language
    const langList = languageDataList.map((item)=>{
        return item.language
    }) || []
    const localLang = langList.indexOf(navLang) > -1 ? navLang : "zh-CH"
    localStorage.setItem('language', localLang)
    return localLang
  }
}

export function isAuth(key){
  return sessionStorage.getItem('permissions').indexOf(key) !== -1 || false;
} 