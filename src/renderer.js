import loader from 'monaco-loader';
import { remote } from 'electron';
import FileManager from './filemanager';
import EditorRenderer from './editorrender'

const {Menu}=remote
import Menur from './core/menu'


// Menur.init()
loader().then((monaco) => {
  var editor = monaco.editor.create(document.getElementById('container'), {
    language: 'html',
    theme: 'vs-dark',
    automaticLayout: true,
  });


  
  const fileManager = new FileManager({ editor, monaco });

  remote.getCurrentWindow().show();
 

  var render=new EditorRenderer(editor)
});






