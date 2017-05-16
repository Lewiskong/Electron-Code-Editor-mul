
// const config={
// 	'language':{
// 		'bat':'Batch File',
// 		'c':'C',
// 		'cpp':'C++',
// 		'css':'CSS',
// 		'html':'HTML',
// 		'java':'Java',
// 		'javascript':'JavaScript',
// 		'php':'PHP',
// 		'python':'Python',
// 		'shell':'Shell'
// 	}
// };


const config={
	'language':{
		'bat':'Batch File',
		'c':'C',
		'cpp':'C++',
		'css':'CSS',
		'html':'HTML',
		'java':'Java',
		'javascript':'JavaScript',
		'php':'PHP',
		'python':'Python',
		'shell':'Shell',
		'null':'Plain Text'
	},
	'suffix':{
		'js':'javascript',
		'json':'javascript',
		'css':'css',
		'scss':'scss',
		'html':'html',
		'java':'java',
		'c':'c',
		'cpp':'cpp',
		'h':'cpp',
		'hpp':'cpp',
		'py':'python',
		'php':'php',
		'sh':'shell',
		'bat':'bat'
	},

	getFileLanguage:function(name){
		let index=name.lastIndexOf('.')
		if (index===-1) return 'null'
		let suffix=name.substring(index+1)
		let lang=config.suffix[suffix]
		return lang?lang:null
	}	
}

module.exports=config