// class TitleItem{
// 	constructor(url,content,language){
// 		this.url=url;
// 		this.content=content;
// 		this.language=language;
// 	}
// }

class TitleItem{
	constructor(url,content,language,name){
		this.url=url;
		this.content=content;
		this.language=language;
		if (name) this.name=name
	};


}

module.exports=TitleItem;