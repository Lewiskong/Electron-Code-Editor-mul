const $ = require('jquery')
const dataX=require('../util/datax')
const el=require('../util/el')
const TitleItem = require('../bean/TitleItem')
const fm=require('../util/filemanager')

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
	dataX.__allTags.push(new TitleItem('/users/lewiskong/index.html','','javascript'))
	dataX.__allTags.push(new TitleItem('/users/lewiskong/test.html','','javascript'))
	const url='/Users/nirvana/Documents/web/lxeditor/'
	let folderItem=fm.openFolder(url)
}

let initTitlePanel=(editor)=>{
	test()
	//标题title-item响应事件
	el.titleItems.click(event=>{
		let content=dataX.__editor.getValue()
		let url=event.target.dataset.url

		dataX.__currentTag.content=content
		dataX.__currentTag.language=dataX.__currentLang
		var result=dataX.findItem(url)

		// debugger;

		dataX.__currentTag=result
		dataX.__editor.setValue(result.content)
		dataX.__currentContent=result.content
		dataX.__currentLang=result.language
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
		debugger;
	})
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

