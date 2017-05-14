/**
 *  The common doms of the App
 *  @author [lewiskong]
 */

const $=require('jquery')

const el={
	//编辑器头部item选择模块
	get titleItems() {return $('.title-item')},
	get activeTitleItem() {return $('.item-active')},

	//编辑器语言选择模块
	get languageSettingItems() {return $('#langugage-setting li')},
	get languageText() {return $('#footer-language')},
	get folderItemDir() {return $($('.template-item-dir').html())},
	get folderItemFile() {return $($('.template-item-file').html())},
	get folder() {return $('#folder-items')}
}


module.exports=el;

