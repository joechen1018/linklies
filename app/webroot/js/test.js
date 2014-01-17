
/*
* Rect in <- -> Push
* Rect out <- -> pull

requirements - 
every element has a root grid that's directly determined by the user, whether it was the position where user create the element,
or where the user moved it to. Every element should be positioned back to this grid point if

-an event occurred such as another window resize, which removed the cause of last movement of the element


when window resised, all elements will be pushed to a new position from left to right, from top to bottom;
when a rect is pushed in, other elements will be pushed out with the direction from the center of the rect out.
when a rect pulled out, other elements will be pulled back with the direction to the center of the rect in;

*/

var MoveHistoryLog = (function(obj){

	this.movedCause;
	this.causeRemovedCallback;
	this.moveGrid;
	this.originalGrid;
	this.timestamp;

	return this;
})();
var MoveElement = (function(){
	this.grid;
	this.moveHistory;

	return this;
})();
var MoveSystem = (function(){

	this.addElement = function(){
		var element = new MoveElement();
		return element;
	}
	return this;
})();