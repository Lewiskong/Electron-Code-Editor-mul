/**
 *  The common doms of the App
 *  @author [lewiskong]
 */

const $=require('jquery')

const el={
	//编辑器语言选择模块
	get languageSettingItems() {return $('#langugage-setting li')},
	get titleItems() {return $('.title-item')},
	get activeTitleItem() {return $('.item-active')}
}


module.exports=el;