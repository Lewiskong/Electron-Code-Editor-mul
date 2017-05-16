const $ = require('jquery')
const dataX=require('../util/datax')
const el=require('../util/el')
const TitleItem = require('../bean/TitleItem')
const fm=require('../util/filemanager')
const fs=require('fs')
const config=require('../config')

let getById=(id)=>{
	if (typeof id !== 'string') throw new Error(`wrong id ${id}`)
	return document.getElementById(id)
}

let initLangagePanel=(editor)=>{
	// init panel events
	editor.footerLanguage.addEventListener('click',event=>{
		editor.languagePanel.style.display='block'
		
		editor.container.addEventListener('click',closeLanguagePanel)
		editor.footerInfo.addEventListener('click',closeLanguagePanel)
		editor.footerSetting.addEventListener('click',closeLanguagePanel)
		editor.titlebar.addEventListener('click',closeLanguagePanel)
	})

	//语言选择响应事件
	el.languageSettingItems.click(event=>{
		let value=event.target.dataset.value
		//plain text 处理
		if (!value || value==='null') value=null

		dataX.__currentLang=value

		closeLanguagePanel()
		
		// editor.innerEditor=dataX.__editor;
		
	})

	function closeLanguagePanel(){
		editor.languagePanel.style.display='none'
		editor.container.removeEventListener('click',closeLanguagePanel)
		editor.footerInfo.removeEventListener('click',closeLanguagePanel)
		editor.footerSetting.removeEventListener('click',closeLanguagePanel)
		editor.titlebar.removeEventListener('click',closeLanguagePanel)
	}

}

let test=function(){
	const url='/Users/nirvana/Documents/web/lxeditor/src/bean'
	const url2='/Users/nirvana/Documents/web/lxeditor/src/core'
	let folderItem=fm.openFolder(url)
	let folderItem2=fm.openFolder(url2)
}

let initTitlePanel=(editor)=>{
	test()
	//标题title-item响应事件
	$(document).on('click','.title-item',event=>{
		let url
		if (event.target.classList.contains('title-item-close')){
			// X的响应事件
			url=event.target.parentElement.dataset.url
			dataX.removeItem(url)
			return ;
		}else{

			if (event.target.classList.contains('title-item')){
				url=event.target.dataset.url
			}else{
				url=event.target.parentElement.dataset.url
			}
		}

		let content=dataX.__editor.getValue()

		dataX.__currentTag.content=content
		dataX.__currentTag.language=dataX.__currentLang

		

		var result=dataX.findItem(url)

		dataX.__currentTag=result
		// dataX.__editor.setValue(result.content)
		// dataX.__currentContent=result.content
		// dataX.__currentLang=result.language
	})
}

let initFolderPanel=(editor)=>{
	$(document).on('click','.item',function(event){
		if (this.dataset.open==='false'){
			$(this).find('>.item').removeClass('closed')
			$(this).find('>.folder-item-title>i').removeClass('fa-folder')
			$(this).find('>.folder-item-title>i').addClass('fa-folder-open')
			// $(this).find('>.item').slideDown()
			this.dataset.open='true'	
		}else{
			$(this).find('>.item').addClass('closed')
			// $(this).find('>.item').slideUp()
			this.dataset.open='false'
			$(this).find('>.folder-item-title>i').removeClass('fa-folder-open')
			$(this).find('>.folder-item-title>i').addClass('fa-folder')
		}
		event.stopPropagation()
		//TODO 
		//如果是文件，执行打开操作处理
		if (this.classList.contains('file')){
			//如果不存在 则新增
			let url=this.dataset.url
			let item=dataX.findItem(url)
			if (item) {
				dataX.__currentTag=item;
				return ;
			}

			let name=$(this).find('>.folder-item-title>span').text()
			//just read the file
			let content=fs.readFileSync(url).toString()
			let language=config.getFileLanguage(name)
			// let language=getFileLanguage(name)
			let titleItem=new TitleItem(url,content,language,name)
			dataX.__allTags.push(titleItem)

			dataX.__currentTag=titleItem
		}
	})
	$(document).on('click','.open-file-item-close',function(event){
		let url=event.target.parentElement.dataset.url
		dataX.removeItem(url)
	})
	// function getFileLanguage(name){
	// 	//根据文件名解析文件语言
	// 	let index=name.lastIndexOf('.')
	// 	//不存在返回默认
	// 	if (index===-1) return ""
	// 	let suffix=name.substring(index+1)
	// 	let result=''
	// 	switch(suffix){
	// 		case 'js':
	// 		case 'json':
	// 			result='javascript';break;
	// 		case 'css':
	// 			result='css';break;
	// 		case 'c':
	// 			result='c';break;
	// 		case 'html':
	// 			result='html';break;
	// 		case 'java':
	// 			result='java';break;
	// 		case 'cpp':
	// 		case 'h':
	// 		case 'hpp':
	// 			result='cpp';break;
	// 		case 'py':
	// 			result='python';break;
	// 		case 'php':
	// 			result='php';break;
	// 		case 'sh':
	// 			result='shell';break;
	// 		case 'bat':
	// 			result='bat';break;
	// 		default:
	// 			result=null
	// 			// console.log(`file ${suffix} not support`)
	// 	}
	// 	return result
	// }
}

class EditorRenderer{
	constructor(editor){
		this.innerEditor=editor
		this.footerInfo=getById('footer-info')
		this.footerSetting=getById('footer-setting')
		this.footerLanguage=getById('footer-language')
		this.languagePanel=getById('langugage-setting')
		this.container=getById('container')
		this.footerbar=getById('footerbar')
		this.titlebar=getById('titlebar')

		initLangagePanel(this)
		initTitlePanel(this)
		initFolderPanel(this)
	}



}

module.exports=EditorRenderer

