const fs = require('fs')
const { ipcRenderer } = require('electron')
const { dialog } = require('electron').remote
const datax = require('./datax')
const TitleItem = require('../bean/TitleItem')
const fm=require('./filemanager')
const config=require('../config')
const Server=require('./httpUtil')

let file = {
    currentFile: undefined,

    createServer(){
        dialog.showOpenDialog({
            title: '请选择服务器的根路径',
            buttonLabel: 'Open',
            properties: ['openDirectory','createDirectory']
            // filters: [{ name: 'Text', extensions: ['txt', 'md'] }]
        }, function(filesIn) {
            if (filesIn === undefined) return
            if (Server.__server) {
                Server.__server.server.close()
                Server.__server=null
            }
            Server.createServer(filesIn[0],3333)
            // alert('服务器启动成功')
        })
    },

    createAutoRefreshServer(){
        dialog.showOpenDialog({
            title: '请选择服务器的根路径',
            buttonLabel: 'Open',
            properties: ['openDirectory','createDirectory']
        }, function(filesIn) {
            if (filesIn === undefined) return
            if (Server.__server) {
                Server.__server.server.close()
                Server.__server=null
            }
            Server.createAutoRefreshServer(filesIn[0],8080)
            // alert('服务器启动成功')
        })
    },

    open() {
        dialog.showOpenDialog({
            title: 'Open a document',
            buttonLabel: 'Open',
            properties: ['openFile','openDirectory','createDirectory','multiSelections']
            // filters: [{ name: 'Text', extensions: ['txt', 'md'] }]
        }, function(filesIn) {
            if (filesIn === undefined) return
            filesIn.forEach((v,i,a)=>{
                fm.openFolder(v)
            })
        })
    },

    saveAs(tag) {
        dialog.showSaveDialog({
                title: 'Save your document',
            buttonLabel: 'Save'
        },function(fileOut){
            if (fileOut===undefined) return
            debugger;
            fs.writeFileSync(fileOut,datax.__editor.getValue())

            //如果在打开目录，刷新文件目录
            datax.addFolderItem(fileOut)

            //更新titleItem
            let name=fileOut.substring(fileOut.lastIndexOf('/')+1)
            let content=fs.readFileSync(fileOut).toString()
            let language=config.getFileLanguage(name)
            
            if (tag==='save'){
                if (!datax.__currentTag){    
                    let titleItem=new TitleItem(fileOut,content,language,name)
                    datax.__allTags.push(titleItem)
                    datax.__currentTag=titleItem
                }else{
                    datax.__currentTag.content=content
                    datax.__currentTag.language=language
                    datax.__currentTag.name=name
                    datax.__currentTag.url=fileOut
                }    
            }else{
                 let titleItem=new TitleItem(fileOut,content,language,name)
                datax.__allTags.push(titleItem)
                datax.__currentTag=titleItem
            }
        })
    },

    save() {
        //存储文件
        if (!datax.__currentTag || datax.__currentTag.url.startsWith('null_')){
            this.saveAs('save')
            //存储新增文件
            // dialog.showSaveDialog({
            //     title: 'Save your document',
            //     buttonLabel: 'Save'
            // },function(fileOut){
            //     if (fileOut===undefined) return
            //     debugger;
            //     fs.writeFileSync(fileOut,datax.__editor.getValue())

            //     //如果在打开目录，刷新文件目录
            //     datax.addFolderItem(fileOut)

            //     //更新titleItem
            //     let name=fileOut.substring(fileOut.lastIndexOf('/')+1)
            //     let content=fs.readFileSync(fileOut).toString()
            //     let language=config.getFileLanguage(name)
            
            //     if (!datax.__currentTag){    
            //         let titleItem=new TitleItem(fileOut,content,language,name)
            //         datax.__allTags.push(titleItem)
            //         datax.__currentTag=titleItem
            //     }else{
            //         datax.__currentTag.content=content
            //         datax.__currentTag.language=language
            //         datax.__currentTag.name=name
            //         datax.__currentTag.url=fileOut
            //     }
            // })
        }else{
            fs.writeFileSync(datax.__currentTag.url,datax.__editor.getValue())
            datax.__currentTag.content=datax.__editor.getValue()
        }
    },
   
    // create a new tag
    newFile() {
        const titleItem=new TitleItem(`null_${new Date().getTime()}`,'',null,'untitled')
        console.log(datax)
        datax.__allTags.push(titleItem)
        datax.__currentTag=titleItem
    },

    // ====================================================== //
    // HELPERS FOR CHECKING FOR UNSAVED FILES, warnings, etc. //
    fileWarning(Message, OptionA, OptionB, ActionA, ActionB) {
        dialog.showMessageBox({
            type: 'warning',
            buttons: [OptionA, OptionB], // string
            title: 'Unsaved Work',
            message: Message
        }, function(rdata) {
            if (rdata === 0) {
                ActionA()
            } else if (rdata === 1) { ActionB() }
        })
    },

    hasChanged() {
        let editor = document.getElementById('editor')

        if (file.currentFile !== undefined) {
            fs.readFile(file.currentFile, 'utf-8', function(err, data) {
                if (err) throw err
                if (editor.value !== data) return true
            })
        }
    },

    editorIsEmpty() {
        let editor = document.getElementById('editor')
        if (editor.value === '') return true
    },

    isUnsaved() {
        let editor = document.getElementById('editor')
        if (file.currentFile === undefined && editor.value !== '') {
            return true
        }
    },

    windowCloseCheck() {
        window.onbeforeunload = function(e) {
            e.returnValue = false
                // window.alert('try to close me');
            if (file.isUnsaved() || file.hasChanged()) {
                // prompt - save or just quit?
                file.fileWarning('You have unsaveeed work.', 'Save', 'Quit', function() {
                    // OPTION A - save
                    file.save()
                }, function() {
                    // OPTION B: Quit.
                    ipcRenderer.send('quitter')
                })
            } else {
                // file is saved and no new work has been done:
                ipcRenderer.send('quitter')
            }
        }
    },

    parseFile2Json() {
        dialog.showOpenDialog({
            title: '请选择打开的文件/文件夹',
            buttonLabel: 'Open',
        }, function(files) {
            console.log(files)
            debugger;
        })
    }
}

module.exports = file
