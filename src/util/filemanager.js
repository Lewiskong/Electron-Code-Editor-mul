import { ipcRenderer, remote } from 'electron';
import fs from 'fs';
import path from 'path'
import FolderItem from '../bean/FolderItem'
import dataX from './datax'

class FileManager {
    constructor({ editor, monaco }) {
        this.editor = editor;
        this.monaco = monaco;

        // When we receive a 'open-file' message, open the file
        // ipcRenderer.on('open-file', (e, url) => this.openFile(url));

        // document.querySelector('#save').onclick = () => this.saveFile();
    }

    openFile(url) {
        // fs.readFile doesn't know what `file://` means
        // const parsedUrl = (url.slice(0, 7) === 'file://') ? url.slice(7) : url;

        // fs.readFile(parsedUrl, 'utf-8', (err, data) => {
        //   this.editor.setModel(this.monaco.editor.createModel(data, 'javascript'));
        // });
    }

    saveFile() {
        // remote.dialog.showSaveDialog((filename) => {
        //   if (!filename) return;

        //   const model = this.editor.getModel();
        //   let data = '';

        //   model._lines.forEach((line) => {
        //     data += line.text + model._EOL;
        //   });

        //   fs.writeFile(filename, data, 'utf-8');
        // });
    }

    openFolder(url) {
        let folderItem=this.convert2FolderItem(url)
        dataX.__folders.push(folderItem)
    }
        // var folder=[{
        //  name:'lxeditor',
        //  type:'folder',
        //  state:'open',
        //  son:[]
        // }]
        //name,url,type,state,son
    convert2FolderItem(url) {
        if (typeof url !== 'string') throw new Error(`${url} must be string`)
        if (!fs.existsSync(url)) throw new Error(`${url} not exist`)

        if (url.endsWith('/')) url = url.substring(0, url.length - 1)
        let name=url.substring(url.lastIndexOf('/')+1)
        let item=convertFolder2FolderItem(url,name)
        item.state='open'
        return item
        
    }
}

function convertFolder2FolderItem(url,filename){
    let name=filename
    let folderItem=null
    const state=fs.lstatSync(url)
    if (state.isFile() || state.isSymbolicLink()){
        let type='file'
        let state='closed'
        let son=[]
        folderItem=new FolderItem(name,url,type,state,son)
    }else if (state.isDirectory()){
        let type='dir'
        let state='closed'
        let son=[]
        let files = fs.readdirSync(url)
        files.forEach((v,i,a)=>{
            // son.push(v,path.join(url,v))
            son.push(convertFolder2FolderItem(path.join(url,v),v))
        })
        folderItem=new FolderItem(name,url,type,state,son)
    }else{
        throw new Error(`parse file ${url} error!`)
    }
    return folderItem
}





module.exports = new FileManager({});
