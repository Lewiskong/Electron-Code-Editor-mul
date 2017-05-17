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
const $=require('jquery')

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

function observerPushFactory(obj,callback){
	const __push=Array.prototype.push
	return function(){
		if (arguments.length!==1 || !arguments[0] || typeof arguments[0]!=='object' || arguments[0].constructor!==obj){
			return __push.apply(this,arguments)
		}
		let item=arguments[0]
		callback(item)
		return __push.apply(this,arguments) 
	}
}

class DataX{
	constructor(){
		// 当前active状态的tag
		this.__currentTag=null
		observe(this,'__currentTag',setCurrentTag)
		// 当前所使用的语言
		this.__currentLang=''
		observe(this,'__currentLang',setCurrentLang)
		// 所有处于打开状态的tag
		this.__allTags=[]
		// 劫持tags的push函数
		this.__allTags.push=observerPushFactory(TitleItem,pushTitleItem)
		// this.__allTags.push=function(){
		// 	if (arguments.length!==1 || !arguments[0] || typeof arguments[0]!=='object' || arguments[0].constructor!==TitleItem){
		// 		return __push.apply(this,arguments)
		// 	}
		// 	let titleItem=arguments[0]
		// 	pushTitleItem(titleItem)
		// 	return __push.apply(this,arguments) 
		// }
		// observe(this,'__allTags',setAllTags)

		// 目录树结构，内部为FolderItem
		this.__folders=[]

		//劫持folders的push函数
		// this.__folders.push=function(){
		// 	if (arguments.length!==1 || !arguments[0] || typeof arguments[0]!=='object' || arguments[0].constructor!==FolderItem){
		// 		return __push.apply(this,arguments)
		// 	}
		// 	let folderItem=arguments[0]
		// 	pushFolderItem(folderItem)
			
		// 	return __push.apply(this,arguments) 
		// }
		this.__folders.push=observerPushFactory(FolderItem,pushFolderItem)

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
		})
		return item.length==1?item[0]:null
	}

	removeItem(url){
		if (typeof url !== 'string') return ;
		for (var index=0;index<this.__allTags.length;index++){
			let v=this.__allTags[index]
			if (v.url===url){
				this.__allTags.splice(index,1)
				$(`.title-item[data-url='${url}']`).remove()
				$(`.open-file-item[data-url='${url}']`).remove()
			}
		}
		if (this.__allTags.length>0) this.__currentTag=this.__allTags[0]
		else {
			el.folder.find('.active').removeClass('active')
			this.__currentTag=null
			this.__editor.setValue("")
		}
	}

	addFolderItem(url){
		let parentFolder=url.substring(0,url.lastIndexOf('/'))
        let place=el.folder.find(`.item[data-url="${parentFolder}"]`)
        let name=url.substring(url.lastIndexOf('/')+1)
        if (place.length>0){
        	//修改dom
        	let $html=el.folderItemFile
        	$html[0].dataset.url=url
        	$html.find('span').text(name)
        	place.append($html)
        	place.find('>.item.closed').removeClass('closed')
        	//修改this.__folders数据结构
        	this.__folders.forEach((v,i,a)=>{
        		var folderItem=new FolderItem(name,url,'file','closed',[])
        		insertFolderItem(v,parentFolder,folderItem)
        	})
        }

        function insertFolderItem(v,parent,folderItem){
        	if (v.url===parent){
        		v.son.push(folderItem)
        		return 
        	}else if (parent.startsWith(v)){
        		v.son.forEach((v,i,a)=>{
        			insertFolderItem(v,parent,folderItem)
        		})
        	}
        }
	}



}

function setCurrentTag(oldTag,newTag,data){
	if (newTag===null){
		el.activeTitleItem.removeClass('item-active')
		el.openFileBar.find('.active').removeClass('active')
		el.folder.find('.active').removeClass('active')
		data.__editor.setValue('')
		data.__currentLang='null'
		return 
	}
 
	if (typeof newTag!=='object' || newTag.constructor!=TitleItem) {
		throw new Error(`wrong parameter ${newTag}`)
	}
	//去除之前高亮
	el.activeTitleItem.removeClass('item-active')
	el.titleItems.filter((index,value)=>{
			return value.dataset.url==newTag.url
		})
		.addClass('item-active')
	data.__editor.setValue(newTag.content)

	//修改左边的OPEN_FILES
	el.openFileBar.find('.active').removeClass('active')
	el.openFileBar.find(`.open-file-item[data-url="${newTag.url}"]`).addClass('active')
	//修改Folder栏高亮
	el.folder.find('.active').removeClass('active')
	el.folder.find(`[data-url="${newTag.url}"]`).addClass('active')

	data.__currentLang=newTag.language

}

function setCurrentLang(oldLang,newLang,data){
	if (typeof newLang!=='string' && newLang!==null) throw new Error(`wrong parameter ${newLang}`)
	//改变语言显示
	el.languageText.text(config.language[newLang===null?'null':newLang])
	//更改编辑器显示样式
	monaco.editor.setModelLanguage(data.__editor.getModel(),newLang)
}

function pushTitleItem(titleItem){
	// 构建标题树
	let item=el.titleItem
	item[0].dataset.url=titleItem.url
	item.find('>span').text(titleItem.name)
	el.titlebar.append(item)
	// 构建openFile树
	let openItem=el.openFileItem
	openItem[0].dataset.url=titleItem.url
	openItem.find('>span').text(titleItem.name)
	el.openFileBar.append(openItem)
}

function pushFolderItem(folderItem){
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