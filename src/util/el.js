/**
 *  The common doms of the App
 *  @author [lewiskong]
 */

const $=require('jquery')

const el={
	//编辑器头部item选择模块
	get titleItems() {return $('.title-item')},
	get activeTitleItem() {return $('.item-active')},
	get titleItem() {return $($('.template-title-file').html())},
	get titlebar() {return $('#titlebar')},

	//编辑器语言选择模块
	get languageSettingItems() {return $('#langugage-setting li')},
	get languageText() {return $('#footer-language')},
	get folderItemDir() {return $($('.template-item-dir').html())},
	get folderItemFile() {return $($('.template-item-file').html())},
	get folder() {return $('#folder-items')},

	//左侧栏目
	get openFileBar() {return $('#open-file-items')},
	get openFileItem() {return $($('.template-open-file').html())}
}


module.exports=el;

