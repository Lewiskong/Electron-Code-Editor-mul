/**
 *  A overall state manager
 *  named like redux or vuex
 *  
 *  @author [lewiskong]
 */

const el = require('./el')
const TitleItem = require('../bean/TitleItem')
const FolderItem = require('../bean/FolderItem')
const config=require('../config')
const fs=require('fs')
const fileUtil=require('./file-io')

/**
 * [observe description]	a easy hijack function to realize MVVM
 * @param  {[type]}   obj      [description]
 * @param  {[type]}   key      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function observe(obj,key,callback){
	let old=obj[key]
	Object.defineProperty(obj,key,{
		get(){
			return old;
		},
		set(now){
			if (now!==old){
				callback(old,now,obj)
			}
			old=now
		}
	})
}

class DataX{
	constructor(){
		// 当前active状态的tag
		this.__currentTag={url:'',content:''}
		observe(this,'__currentTag',setCurrentTag)
		// 当前所使用的语言
		this.__currentLang=''
		observe(this,'__currentLang',setCurrentLang)
		// 所有处于打开状态的tag
		this.__allTags=[]
		observe(this,'__allTags',setAllTags)
		// 目录树结构，内部为FolderItem
		this.__folders=[]

		const __push=Array.prototype.push
		//劫持folders的push函数
		this.__folders.push=function(){
			if (arguments.length!==1 || !arguments[0] || typeof arguments[0]!=='object' || arguments[0].constructor!==FolderItem){
				return __push.apply(this,arguments)
			}
			let folderItem=arguments[0]
			pushFolderItem(folderItem)
			
			return __push.apply(this,arguments) 
		}

		// var folder=[{
		// 	name:'lxeditor',
		// 	type:'folder',
		// 	state:'open',
		// 	son:[]
		// }]
	}

	__setEditor(editor){
		this.__editor=editor
	}

	findItem(url){
		let item=this.__allTags.filter(function(v){
			return v.url===url
		})[0]
		return item
	}



}

function setCurrentTag(oldTag,newTag){
	if (typeof newTag!=='object' || newTag.constructor!=TitleItem) throw new Error(`wrong parameter ${newTag}`)
	//去除之前高亮
	el.activeTitleItem.removeClass('item-active')
	el.titleItems.filter((index,value)=>{
			return value.dataset.url==newTag.url
		})
		.addClass('item-active')
}

function setAllTags(oldTags,newTags){

}

function setCurrentLang(oldLang,newLang,data){
	if (!newLang) return ;
	if (typeof newLang!=='string') throw new Error(`wrong parameter ${newLang}`)
	//改变语言显示
	el.languageText.text(config.language[newLang])
	//更改编辑器显示样式
	// debugger;
	// let content=data.__editor.getValue()
	let content=data.__currentContent
	data.__editor.dispose()
	data.__editor= monaco.editor.create(document.getElementById('container'), {
	    language: newLang,
	    theme: 'vs-dark',
	    automaticLayout: true,
	});
	data.__editor.setValue(content)
}

function pushFolderItem(folderItem){
	// TODO
	// 构建目录树
	let $html=folder2dom(folderItem)
	el.folder.append($html)
}

function folder2dom(folder){
	//name,url,type,state,son
	var $html
	if (folder.type==='file'){
		$html=el.folderItemFile
		$html.find('span').text(folder.name)
	}else if (folder.type==='dir'){
		_sortSon(folder)
		$html=el.folderItemDir
		$html.find('span').text(folder.name)
		folder.son.forEach((v,i,a)=>{
			let $sonHtml=folder2dom(v)
			$html.append($sonHtml)
		})
	}
	$html[0].dataset.url=folder.url
	if (folder.state==='closed') $html[0].classList.add('closed')
	return $html
}

//给son按照文件夹->文件，字母生序排序
function _sortSon(folder){
	folder.son.sort((a,b)=>{
	   let result
	   result=(a.type===b.type)?0:a.type>b.type?1:-1
	   if (result===0){
	     result=(a.name===b.name)?0:a.name>b.name?1:-1
	   }
	   return result
	})
}


var instance=null;

var getInstance=function(){
	instance=instance?instance:new DataX()
	return instance
}


module.exports=getInstance()