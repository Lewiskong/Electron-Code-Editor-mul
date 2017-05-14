import loader from 'monaco-loader';
import { remote } from 'electron';
import FileManager from './util/filemanager';
import EditorRenderer from './core/editorrender'
import dataX from './util/datax'
const {Menu}=remote
import Menur from './core/menu'

loader().then((monaco) => {
  var editor = monaco.editor.create(document.getElementById('container'), {
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
  });

  dataX.__setEditor(editor)
  
  // const fileManager = new FileManager({ editor, monaco });

  remote.getCurrentWindow().show();
  
  var render=new EditorRenderer(editor)
});






