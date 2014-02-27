var nn = nn || {};
var _n = nn; 
nn.global = nn.global || {};
nn.core = nn.core || {};

/******************************/
_n = nn.global;
/******************************/

_n.msoList = ["cts","cts40","tzuchi","tzuchi40", "fcu", "ddtv", "goodtv"];
_n.getMso = function(){
	var hostname = location.hostname;
	var arr = hostname.split(".");
	var m = "9x9";
	var msoList = nn.global.msoList;
	for(var i = 0; i<arr.length; i++){
		for(var j = 0; j<msoList.length; j++){
			if(arr[i] == msoList[j]){
				m = msoList[j];
				m = m.replace("40","");
				break;
			}
		}
	}
	return m;
}
_n.mso = _n.getMso();
_n.v = "40";

/******************************/
_n = nn.core;
/******************************/

_n.NnApp = function(){
	var comps;
	this.mso = nn.global.mso;
	this.v = nn.global.v;
	this.init = function(){

	}
}

//nn.global.app = new _n.nnApp();
