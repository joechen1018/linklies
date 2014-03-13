app.service("link", function(uuid){

	this.getInstance = function(grid, user_id, username, id, state){
		if(state === undefined) state = "paste-url";
		return {
			grid : grid,
			uuid : uuid.create(),
			username_id : username_id,
			user_id : user_id,
			state : {
				name : state,
				focus : true
			}
		}
	}
});