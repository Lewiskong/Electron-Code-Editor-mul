const $ = require('jquery')

let getById=(id)=>{
	if (typeof id !== 'string') throw new Error(`wrong id ${id}`)
	return document.getElementById(id)
}

var initLangagePanel=(editor)=>{
	// init panel events
	editor.footerLanguage.addEventListener('click',event=>{
		editor.languagePanel.style.display='block'
		
		editor.container.addEventListener('click',closeLanguagePanel)
		editor.footerInfo.addEventListener('click',closeLanguagePanel)
		editor.footerSetting.addEventListener('click',closeLanguagePanel)
		editor.titlebar.addEventListener('click',closeLanguagePanel)
	})

	//init item events
	$('#langugage-setting li').click(event=>{
		let text=event.target.innerText
		let value=event.target.dataset.value
		let content=editor.innerEditor.getValue()
		
		editor.footerLanguage.innerText=text
		closeLanguagePanel()
		// monoach editor 的bug? 改变语言没有变化,本处使用重建来代替
		// editor.innerEditor.updateOptions({
		// 	language: 'html'
		// }) 

		editor.innerEditor.dispose()
		var ed = monaco.editor.create(document.getElementById('container'), {
		    language: value,
		    theme: 'vs-dark',
		    automaticLayout: true,
		});
		ed.setValue(content)
		editor.innerEditor=ed;
		
	})


	function closeLanguagePanel(){
		editor.languagePanel.style.display='none'
		editor.container.removeEventListener('click',closeLanguagePanel)
		editor.footerInfo.removeEventListener('click',closeLanguagePanel)
		editor.footerSetting.removeEventListener('click',closeLanguagePanel)
		editor.titlebar.removeEventListener('click',closeLanguagePanel)
	}
	


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
	}



}

module.exports=EditorRenderer

