var glob = {};
glob.clientId = "205449938055-06501obglsfmcellrtc67opqs6ogbs19.apps.googleusercontent.com";
glob.apiKey = "AIzaSyDgQMpZLRja-7wtmvfkMky_8ylI6OznE2c";
var onTranslated = function(data){
	_c.log(data);
}
var _events = {};
/*var $AnchorScrollProvider = function() {
  this.$get = ['$window', '$location', '$rootScope', function($window, $location, $rootScope) {
    function scroll() {
    }
    return scroll;
  }];
}*/

var app = angular.module("lk", ["ngRoute", "pasvaz.bindonce"], function($httpProvider){

})
.value('$anchorScroll', angular.noop)
//.provider('$anchorScroll', $AnchorScrollProvider)
.run(function($location){

    //** load google api v2
	(function() {
	    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/client.js?onload=onGApiLoaded';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	})();

    //** load open api  
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'http://www.google.com/jsapi';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();

    //** on unload
    $(window).bind("beforeunload",function(event){
        // sessionStorage.clear();
        // localStorage.clear();
       //return "";
    });
})
.config(function($routeProvider){

});
