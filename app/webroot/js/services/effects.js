/*app.service("colorShift", function(uuid){
	var _shifts = [],
		_blue = "#4b9884", 
		_green = "#aacc8e", 
		_yellow = "#faec0a", 
		_orange = "#fe9d04",
		_colors = [blue, orange, green, yellow],
		_duration = 200;
	return {
		create : function($target, options){
			var options = options || {};
			return {
				id : uuid.create(),
				colors : options.colors || _colors,
				duration : options.duration || _duration,
				target : $target,
				state : 0,
				interal : {},
				start : function(){

				},
				stop : function(){
					
				}
			}
		}
	}
});*/