app.service("apiService", function($http){
	return {
		getFolders : function(){

			return $http.get("json/folders.json").then(function(rs){
				return rs.data;
			})
		}
	}
});