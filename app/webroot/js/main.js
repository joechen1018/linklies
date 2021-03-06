var app = angular.module("lk", []);

//http://jsfiddle.net/firehist/nzUBg/
app.factory('keyboardManager', function ($window, $timeout) {
	var keyboardManagerService = {};

	var defaultOpt = {
		'type':             'keydown',
		'propagate':        false,
		'inputDisabled':    false,
		'target':           $window.document,
		'keyCode':          false
	};
	// Store all keyboard combination shortcuts
	keyboardManagerService.keyboardEvent = {}
	// Add a new keyboard combination shortcut
	keyboardManagerService.bind = function (label, callback, opt) {
		var fct, elt, code, k;
		// Initialize opt object
		opt   = angular.extend({}, defaultOpt, opt);
		label = label.toLowerCase();
		elt   = opt.target;
		if(typeof opt.target == 'string') elt = document.getElementById(opt.target);

		fct = function (e) {
			e = e || $window.event;

			// Disable event handler when focus input and textarea
			if (opt['inputDisabled']) {
				var elt;
				if (e.target) elt = e.target;
				else if (e.srcElement) elt = e.srcElement;
				if (elt.nodeType == 3) elt = elt.parentNode;
				if (elt.tagName == 'INPUT' || elt.tagName == 'TEXTAREA') return;
			}

			// Find out which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();

			if (code == 188) character = ","; // If the user presses , when the type is onkeydown
			if (code == 190) character = "."; // If the user presses , when the type is onkeydown

			var keys = label.split("+");
			// Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			// Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			};
			// Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,				
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,

				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,

				'pause':19,
				'break':19,

				'insert':45,
				'home':36,
				'delete':46,
				'end':35,

				'pageup':33,
				'page_up':33,
				'pu':33,

				'pagedown':34,
				'page_down':34,
				'pd':34,

				'left':37,
				'up':38,
				'right':39,
				'down':40,

				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			};
			// Some modifiers key
			var modifiers = {
				shift: {
					wanted:		false, 
					pressed:	e.shiftKey ? true : false
				},
				ctrl : {
					wanted:		false, 
					pressed:	e.ctrlKey ? true : false
				},
				alt  : {
					wanted:		false, 
					pressed:	e.altKey ? true : false
				},
				meta : { //Meta is Mac specific
					wanted:		false, 
					pressed:	e.metaKey ? true : false
				}
			};
			// Foreach keys in label (split on +)
			for(var i=0, l=keys.length; k=keys[i],i<l; i++) {
				switch (k) {
					case 'ctrl':
					case 'control':
						kp++;
						modifiers.ctrl.wanted = true;
						break;
					case 'shift':
					case 'alt':
					case 'meta':
						kp++;
						modifiers[k].wanted = true;
						break;
				}

				if (k.length > 1) { // If it is a special key
					if(special_keys[k] == code) kp++;
				} else if (opt['keyCode']) { // If a specific key is set into the config
					if (opt['keyCode'] == code) kp++;
				} else { // The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { // Stupid Shift key bug created by using lowercase
							character = shift_nums[character];
							if(character == k) kp++;
						}
					}
				}
			}

			if(kp == keys.length &&
				modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
				modifiers.shift.pressed == modifiers.shift.wanted &&
				modifiers.alt.pressed == modifiers.alt.wanted &&
				modifiers.meta.pressed == modifiers.meta.wanted) {
        $timeout(function() {
				  callback(e);
        }, 1);

				if(!opt['propagate']) { // Stop the event
					// e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;

					// e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}

		};
		// Store shortcut
		keyboardManagerService.keyboardEvent[label] = {
			'callback': fct,
			'target':   elt,
			'event':    opt['type']
		};
		//Attach the function with the event
		if(elt.addEventListener) elt.addEventListener(opt['type'], fct, false);
		else if(elt.attachEvent) elt.attachEvent('on' + opt['type'], fct);
		else elt['on' + opt['type']] = fct;
	};
	// Remove the shortcut - just specify the shortcut and I will remove the binding
	keyboardManagerService.unbind = function (label) {
		label = label.toLowerCase();
		var binding = keyboardManagerService.keyboardEvent[label];
		delete(keyboardManagerService.keyboardEvent[label])
		if(!binding) return;
		var type		= binding['event'],
		elt			= binding['target'],
		callback	= binding['callback'];
		if(elt.detachEvent) elt.detachEvent('on' + type, callback);
		else if(elt.removeEventListener) elt.removeEventListener(type, callback, false);
		else elt['on'+type] = false;
	};
	//
	return keyboardManagerService;
});

var wall;
$(document).ready(function(){
	
	return;
	wall = new Wall($("#desktop-view"));
	
	function Wall(context){
		this.context = context;
		
		var linky;
		var self = this;
		function onWallClick(e){
			clearEmptyLinks();
			createLinky(e.clientX, e.clientY);
		}
		
		function createLinky(x, y){
			
			var c = linkyTmp.clone();
			linky = new Linky({
				context : c
			});
			
			self.context.append(c);
			$(c).css("left", x).css("top", y);
			$(c).data("classReference", linky);
			
			linky.init();
		}
		
		function clearEmptyLinks(){
			for(var i = $(".link").length-1 ; i>-1; i--){
				if($(".link").eq(i).find(".input input").val() == ""){
					$(".link").eq(i).remove();
				}
			}
		}
		this.init = function(){
			$(context).click(onWallClick);
		}
		this.init();
	}
	
	function yqlUrl(url){
		
		//console.debug(url);
		//url = "http://www.books.com.tw/books/new/79newbooks.php";
		// url = 'http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text="sunnyvale, ca"&format=json&callback=yqlcallback';
		// var yql = encodeURI(url);
		
		// $.ajax({
			// method : "get",
			// url : src,
			// success : function(res){
				// console.debug(res);
			// },
			// error : function(e){
				// console.debug(e);
			// }
		// });
		return;
		//console.debug(yql);
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = yql;
		var b = document.getElementsByTagName('script')[0]; 
		b.parentNode.insertBefore(s, b);
	}
	
	function Linky(data){
		
		var context;
		var input;
		function onPasted(e){
			this.data = input.val();
			setTimeout(function(){
				var url = input.val();
				// yqlUrl(url);
				// url = "http://finance.yahoo.com/q?s=yhoo";
				// url = "http://clayliao.blogspot.tw/2011/03/yqlintroduxtion.html";
				// url = "http://ku-group.com/";
				// var yturl = "http://www.youtube.com/watch?v=Z_ARdc526qY&list=RD02UeW-8PMjL1E";
				// //var sql = "select * from html where url='"+url+"'";
				// var txt = "美國地廣物博，因各地產出的農畜產品不同與烹調手法有異，產生許多特色「美」食。美式料理以「南方紐奧良」和「西部加州菜」為指標，常用燴、烤方式來烹調。位於台北的飯店業者，在一樓凱菲屋，從即日起至5月14日與美國西部農業貿易協會合作，以美牛、鮮蝦、肥蟹、生蠔等多款「美式海鮮」舉辦「美國美食節」，呈現「美國頂級烤牛肉洋芋」、「德州辣味豆」等四十幾道「美」食，另外，在享受美食的同時，民眾還有機會抽中美國達美航空從台北至美國任一城市來回機票與飯店館內各餐廳雙人餐券等多項大獎。";
				// var sql = 'select * from contentanalysis.analyze where url="yahoo.com"';
				// url = "http://query.yahooapis.com/v1/public/yql?q=" + encodeURI(sql) + "&format=json";
				// url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20contentanalysis.analyze%20where%20text%3D%22%E7%BE%8E%E5%9C%8B%E5%9C%B0%E5%BB%A3%E7%89%A9%E5%8D%9A%EF%BC%8C%E5%9B%A0%E5%90%84%E5%9C%B0%E7%94%A2%E5%87%BA%E7%9A%84%E8%BE%B2%E7%95%9C%E7%94%A2%E5%93%81%E4%B8%8D%E5%90%8C%E8%88%87%E7%83%B9%E8%AA%BF%E6%89%8B%E6%B3%95%E6%9C%89%E7%95%B0%EF%BC%8C%E7%94%A2%E7%94%9F%E8%A8%B1%E5%A4%9A%E7%89%B9%E8%89%B2%E3%80%8C%E7%BE%8E%E3%80%8D%E9%A3%9F%E3%80%82%E7%BE%8E%E5%BC%8F%E6%96%99%E7%90%86%E4%BB%A5%E3%80%8C%E5%8D%97%E6%96%B9%E7%B4%90%E5%A5%A7%E8%89%AF%E3%80%8D%E5%92%8C%E3%80%8C%E8%A5%BF%E9%83%A8%E5%8A%A0%E5%B7%9E%E8%8F%9C%E3%80%8D%E7%82%BA%E6%8C%87%E6%A8%99%EF%BC%8C%E5%B8%B8%E7%94%A8%E7%87%B4%E3%80%81%E7%83%A4%E6%96%B9%E5%BC%8F%E4%BE%86%E7%83%B9%E8%AA%BF%E3%80%82%E4%BD%8D%E6%96%BC%E5%8F%B0%E5%8C%97%E7%9A%84%E9%A3%AF%E5%BA%97%E6%A5%AD%E8%80%85%EF%BC%8C%E5%9C%A8%E4%B8%80%E6%A8%93%E5%87%B1%E8%8F%B2%E5%B1%8B%EF%BC%8C%E5%BE%9E%E5%8D%B3%E6%97%A5%E8%B5%B7%E8%87%B35%E6%9C%8814%E6%97%A5%E8%88%87%E7%BE%8E%E5%9C%8B%E8%A5%BF%E9%83%A8%E8%BE%B2%E6%A5%AD%E8%B2%BF%E6%98%93%E5%8D%94%E6%9C%83%E5%90%88%E4%BD%9C%EF%BC%8C%E4%BB%A5%E7%BE%8E%E7%89%9B%E3%80%81%E9%AE%AE%E8%9D%A6%E3%80%81%E8%82%A5%E8%9F%B9%E3%80%81%E7%94%9F%E8%A0%94%E7%AD%89%E5%A4%9A%E6%AC%BE%E3%80%8C%E7%BE%8E%E5%BC%8F%E6%B5%B7%E9%AE%AE%E3%80%8D%E8%88%89%E8%BE%A6%E3%80%8C%E7%BE%8E%E5%9C%8B%E7%BE%8E%E9%A3%9F%E7%AF%80%E3%80%8D%EF%BC%8C%E5%91%88%E7%8F%BE%E3%80%8C%E7%BE%8E%E5%9C%8B%E9%A0%82%E7%B4%9A%E7%83%A4%E7%89%9B%E8%82%89%E6%B4%8B%E8%8A%8B%E3%80%8D%E3%80%81%E3%80%8C%E5%BE%B7%E5%B7%9E%E8%BE%A3%E5%91%B3%E8%B1%86%E3%80%8D%E7%AD%89%E5%9B%9B%E5%8D%81%E5%B9%BE%E9%81%93%E3%80%8C%E7%BE%8E%E3%80%8D%E9%A3%9F%EF%BC%8C%E5%8F%A6%E5%A4%96%EF%BC%8C%E5%9C%A8%E4%BA%AB%E5%8F%97%E7%BE%8E%E9%A3%9F%E7%9A%84%E5%90%8C%E6%99%82%EF%BC%8C%E6%B0%91%E7%9C%BE%E9%82%84%E6%9C%89%E6%A9%9F%E6%9C%83%E6%8A%BD%E4%B8%AD%E7%BE%8E%E5%9C%8B%E9%81%94%E7%BE%8E%E8%88%AA%E7%A9%BA%E5%BE%9E%E5%8F%B0%E5%8C%97%E8%87%B3%E7%BE%8E%E5%9C%8B%E4%BB%BB%E4%B8%80%E5%9F%8E%E5%B8%82%E4%BE%86%E5%9B%9E%E6%A9%9F%E7%A5%A8%E8%88%87%E9%A3%AF%E5%BA%97%E9%A4%A8%E5%85%A7%E5%90%84%E9%A4%90%E5%BB%B3%E9%9B%99%E4%BA%BA%E9%A4%90%E5%88%B8%E7%AD%89%E5%A4%9A%E9%A0%85%E5%A4%A7%E7%8D%8E%E3%80%82%22&format=json&diagnostics=true";
				// $.ajax({
				// 	method:"get",
				// 	url : url,
				// 	dataType : "json",
				// 	success : function(data){
				// 		console.debug(data);
				// 	}
				// });
				// return;
				$.ajax({
					method : "post",
					url : root + "api/fetch/",
					data : {url : url},
					success : function(data){
						
						//console.debug(data);
						var ico = $(context).find(".icon img");
						$(context).data("data", data);
						$(context).find(".input").hide();
						$(context).find(".link-title").html(data.res.title).attr("href", data.res.url);
						ico.attr("src", data.res.icon).
							css("left", (35 - ico.width())/2).
							css("top", (30 - ico.height())/2);
						$(context).draggable({
							"handel" : ".ico"
						});
					}
				});
			},100);
			
			
		}
		this.init = function(){
			this.context = data.context;
			context = data.context;
			
			this.label = "";
			this.data = "";
			this.url = "";
			
			input = $(context).find(".url"); 
			input.focus();
			input.bind("paste", onPasted);
			input.val("");
		}
	}
});
