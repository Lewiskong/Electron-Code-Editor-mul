class FolderItem{
	constructor(name,url,type,state,son){
		assert.call(this,name,'string','name')
		assert.call(this,url,'string','url')
		assert.call(this,type,'string','type')
		assert.call(this,state,'string','state')
		assert.call(this,son,'array','son')
	}
}

function assert(obj,type,key){
	if (!obj) throw new Error(`${obj} cannot be null`)
	if (typeof key!=='string') throw new Error('key must be string')
	switch(type){
		case 'string':
			if (typeof obj!=='string') throw new Error(`${obj} must be string`);break;
		case 'array':
			if (typeof obj!=='object' || obj.constructor!==Array) throw new Error(`${obj} must be Array`);break;
		default:
			throw new Error(`unsupported type ${type}`);
	}
	this[key]=obj
}

module.exports=FolderItem