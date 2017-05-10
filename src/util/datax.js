/**
 *  A overall state manager
 *  named like redux or vuex
 *  
 *  @author [lewiskong]
 */

const el = require('./el')

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
				callback(old,now)
			}
			old=now
		}
	})
}

class DataX{
	constructor(){
		//当前active状态的tag
		this.__currentTag=''
		observe(this,'__currentTag',setCurrentTag)
		// 所有处于打开状态的tag
		this.__allTags=[]
		observe(this,'__allTags',setAllTags)
	}
}

function setCurrentTag(oldTag,newTag){
	//去除之前高亮
	el.activeTitleItem.removeClass('item-active')
	el.titleItems.filter((index,value)=>{
			return value.dataset.url==newTag
		})
		.addClass('item-active')
}

function setAllTags(oldTags,newTags){

}




var instance=null;

var getInstance=function(){
	instance=instance?instance:new DataX()
	return instance
}


module.exports=getInstance()