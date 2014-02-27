var nn = nn || {};
nn.interact = nn.interact || {};

/******************************/
_n = nn.interact;
/******************************/

_n.mouse = function(){

}

_n.keyboard = function(target){
	var self = this;
	var onKeyDown = function(e){
		self.onKeyDown(self.map(e.keyCode));
	};
	var onConstructed = function(){
		$(target).keydown(onKeyDown)
	}
	var actions = {
		enter : 13,
		esc : [26, 86]
	}
	this.map = function(code){
		var command;
		//
		return command;
	}
	onConstructed();
}

_n.castReceiver = function(){

}