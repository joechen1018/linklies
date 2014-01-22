$(document).ready(function(){
	init();
	
	$("#input").change(function(){
		var val = $(this).val();
		val = convert(val);
		//console.debug(val);
	});
	
});

function convert(coord){
	if(coord.length != 2) return;
	var a = parseInt(coord.charAt(0), 10);
	var b = parseInt(coord.charAt(1), 10);
	var ay = Math.floor((a-1)/3);
	var ry = Math.floor((b-1)/3);
	var ax = a%3-1 == -1 ? 2 : a%3-1;
	var rx = b%3;
	
	
	var rs = ay*27 + ry*9 + ax*3 + rx ;
	console.debug(rs, ay, ry, ax, rx);
	return rs;
}

var store, board;
function init(){
	if(typeof(localStorage) !== undefined){
		initBoard();
	}else{
		alert("Your browser does not support the application");
	}
}

function initBoard(){
	
	store = new BoardStorage();
	//store.destroy("tagBoard.data");
	var tagData = store.read("tagBoard.data");
	
	board = new TagBaord(tagData);
	$(document).keydown(onKeyDown);
	$(document).keyup(onKeyUp);
}

function saveBoard(){
	store.save("tagBoard.data",{
		tags:board.tags
	});
	console.debug(store.read("tagBoard.data"));
}

function clearBoard(){
	var ans = confirm("Clear Board?");
	if(ans){
		store.destroy("tagBoard.data");
		location.reload();
	}
}

function onKeyDown(e){
	
}

function onKeyUp(e){
	
}

function TagBaord(data){
	
	var self = this;
	function onBoardClick(e){
		if($(e.target).attr("id") == "board"){
			self.addTag({
				x : e.clientX,
				y : e.clientY
			});
		}
	}
	
	this.tags = Array();
	this.init = function(){
		if(!data){
			store.save("tagBoard.data",{
				tags:[],
			});
		}
		var tags = store.read("tagBoard.data").tags;
		var tag, newTag;
		for(var i = 0; i<tags.length; i++){
			tag = tags[i];
			this.addTag(tag);
		}
		$("#board").click(onBoardClick);
	}
	this.addTag = function(data){
		
		var newTag = new Tag(data);
		this.tags.push(newTag);
		$(newTag).bind("onEnterEditMode", function(){
			$("#board").unbind("click");
		});
		$(newTag).bind("onLeaveEditMode", function(){
			$("#board").click(onBoardClick);
		});
		$(newTag).bind("closed", function(e, t){
			for(var i = 0; i<self.tags.length; i++){
				if(self.tags[i] == t){
					$("#tag-"+self.tags[i].id).remove();
					self.tags.splice(i,1);
				}
			}
		});
	}
	this.init();
}

function Tag(data){
	
	var template =  "<div class='tag' id='tag-{id}'>";
	    template += "<div class='icon icon-tag'></div>";
	    template += "<div class='icon icon-drag'></div>";
	    template += "<div class='btn-close'></div>";
	    template += "<div class='btn-down'></div>";
	    template += "<div class='btn-up'></div>";
	    template += "<a href='#' target='_blank' class='icon icon-link'></a>";
	    template += "<div class='inputs'>";
	    template += "<input class='tag-name' />";
	    template += "<textarea></textarea>";
	    template += "</div>";
	    template += "</div>";
	    
	var tagTypes = {
		"link" : {},
		"text" : {},
		"html" : {}
	};
	var source, textarea, btn_close;
	var self = this;
	function init(){
		
		if(!data.id){
			self.id = uuid();
		}else{
			self.id = data.id;
		}
		self.x = data.x;
		self.y = data.y;
		
		//create dom
		source = $(template.replace("{id}", self.id));
		$("#board").append(source);
		
		
		source = $("#tag-" + self.id);
		$(source).css("left", data.x).css("top", data.y);
		$(source).draggable({
			"addClasses" : false,
			"handle" : ".icon-drag",
			"stop" : function(e, ui){
				self.x = ui.position.left;
				self.y = ui.position.top;
			}
		});
		
		//tag
		$(source).focusin(onFocusIn);
		$(source).focusout(onFocusOut);
		
		//content
		textarea = $(source).find("textarea"); 
		textarea.focus();
		textarea.change(function(){
			var val = textarea.val();
			self.value = val;
		});
		
		$(source).find(".tag-name").change(function(){
			var val = $(this).val();
			self.name = val;
			console.debug(self.name);
		});
		
		//close button
		btn_close = $(source).find(".btn-close");
		btn_close.click(function(){
			if(self.value == ""){
				$(self).trigger("closed", [self]);
			}else{
				var ans = confirm("Remove?");
				if(ans){
					$(self).trigger("closed", [self]);
				}
			}
		});
		
		$(".btn-up").click(toggleFolding);
		$(".btn-down").click(toggleFolding);
		
		setTimeout(function(){
			$(self).trigger("onEnterEditMode");
		},100);
		
		if(data.name){
			source.find(".tag-name").val(data.name);
			self.name = data.name;
		}
		if(data.value){
			source.find("textarea").html(data.value);
			self.value = data.value;
		}
	}
	
	function toggleFolding(e){
		
		var c = $(e.currentTarget).attr("class");
		if(c == "btn-up"){
			//收合
			source.animate({
				height : 20
			}, 200);
			source.find(".btn-up").hide();
			source.find(".btn-down").show();
			
		}else{
			//展開
			source.animate({
				height : 30 + textarea.height() 
			}, 200, function(){
				$(source).css("height", "auto");
			});
			source.find(".btn-up").show();
			source.find(".btn-down").hide();
		}
	}
	
	function onFocusIn(){
		$(self).trigger("onEnterEditMode");
	}
	
	function onFocusOut(){
		var val = self.value;
		var tag = $("#tag-" + self.id); 
		if(val == ""){
			//$(source).remove();
		}else if(val.indexOf("http://") != -1 || val.indexOf("https://") != -1){
			tag.addClass("link").find(".icon-link").attr("href", val);
		}
		
		setTimeout(function(){
			$(self).trigger("onLeaveEditMode");
		},100);
	}
	
	this.x = 0;
	this.y = 0;
	this.name = "";
	this.value = "";
	this.remove = function(){
		$(source).remove();
	}
	
	init();
}

function BoardStorage(){
	
	this.read = function(key){
		var str = localStorage[key];
		if(str){
			return JSON.parse(str);
		}else{
			return {};
		}
	}
	this.save = function(key, obj){
		localStorage[key] = JSON.stringify(obj);
	}
	this.destroy = function(key){
		localStorage[key] = null;
	}
}

function uuid(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};

$(document).ready(function(){
	var css = '';
	var sheet = document.createElement('style')
	sheet.innerHTML = css;
	document.body.appendChild(sheet);
});


