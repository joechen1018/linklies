var nn = nn || {};
nn.utils =  nn.utils || {};

/******************************/
_n = nn.utils;
/******************************/
_n.uuid=function(){var b=new Date().getTime();var a="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var d=(b+Math.random()*16)%16|0;b=Math.floor(b/16);return(e=="x"?d:(d&7|8)).toString(16)});return a};
_n.NnArray = function(arr, circular){
    this.circular = circular === undefined ? true : circular;
    this.index = 0;
    this.array = arr;
    this.findByAttr = function(attr, val, doChange){
        doChange = doChange === undefined ? true : doChange;
        var item;
        for(var i = 0; i<this.array.length; i++){
            item = this.array[i];
            if(item[attr]){
                if(item[attr] == val){
                    if(doChange){
                        this.index = i;
                    }
                    return item;
                }
            }
        }
        return undefined;
    }
    this.findAllByAttr = function(attr, val){
        var arr = [], item;
        for(var i = 0; i<this.array.length; i++){
            item = this.array[i];
            if(item[attr]){
                if(item[attr] == val){
                    arr.push(item);
                }
            }
        }
        if(arr.length>0){
            return arr;
        }
        return undefined;
    }
    this.findIndex = function(ele){

        for(var i = 0; i<this.array.length; i++){
            if(this.array[i] == ele){
                return i;
            }
        }
        return -1;
    }
    this.length = function(){
        return this.array.length;
    }
    this.goto = function(num, doChange){
        doChange = doChange === undefined ? true : doChange;
        if(num > -1 && num < this.length()){
            if(doChange){
                this.index = num;
            }
            return this.array[num];
        }else{
            return false;
        }
    }
    this.each = function(fn){
        for(var i = 0; i<this.array.length; i++){
            fn(i, this.array[i]);
        }
    }
    this.next = function(doChange){
        doChange = doChange === undefined ? true : doChange;
        var i = this.index, r;
        i++;
        r = this.array[i];
        if(i === this.length()){
            if(this.circular){
                i = 0;
                r = this.array[i];
            }else{
                i = this.length() - 1;
                r = false;
            }
        }
        if(doChange){
            this.index = i;
        }
        return r;
    }
    this.prev = function(doChange){
        doChange = doChange === undefined ? true : doChange;
        var i = this.index, r;
        i--;
        r = this.array[i];
        if(i === -1){
            if(this.circular){
                i = this.length() - 1;
                r = this.array[i];
            }else{
                i = 0;
                r = false;
            }
        }
        if(doChange){
            this.index = i;
        }
        return r;
    }
    this.current = function(){
        return this.array[this.index];
    }
    this.first = function(doChange){
        doChange = doChange === undefined ? true : doChange;
        if(doChange === true){
            this.index = 0;
        }
        return this.array[0];
    }
    this.last = function(doChange){
        doChange = doChange === undefined ? true : doChange;
        if(doChange === true){
            this.index = this.length() - 1;
        }
        return this.array[this.index];
    }
    this.go = function(num, doChange){
        doChange = doChange === undefined ? true : doChange;
        var diff, i;
        if(this.circular){
            diff = (num + this.index) % this.length();
            i = diff >= 0 ? diff : this.length() + diff;
        }else{
            i = this.index;
            i+=num;
            if(i<0) i = 0;
            if(i>this.length()-1) i = this.length() - 1;
        }
        if(doChange){
            this.index = i;
        }
        return this.array[i];
    }
    this.random = function(){
        var min = 0;
        var max = this.length() - 1;
        var ran = Math.floor(Math.random() * (max - min + 1)) + min;
        return this.array[ran];
    }
}

_n.Grid = function(col, row){

    var colLabels = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    this.col = 0;
    this.row = 0;
    this.cols = col;
    this.rows = row;

    this.pos = function(col, row){
        //getter
        if(col === undefined && row === undefined){
            return [this.col, this.row];
        }else{
        //setter    
            if((col>=-1 && col<this.cols) && (row>=-1 && row<this.rows)){
                this.col = col;
                this.row = row;
                return true;
            }
            return false;
        }
    }
    //left to right
    this.lrIndex = function(){

    }
    //right to left
    this.rlIndex = function(){

    }
    //up-down-right
    this.udrIndex = function(){

    }
    //up-down-left
    this.udlIndex = function(){

    }
    this.xlsLabel = function(){
        var pos = this.pos();
        return colLabels[pos[0]] + "-" + (pos[1] + 1);
    }
    this.left = function(){
        this.col--;
        if(this.col === -1){
            this.col = 0;
            $(this).trigger("outOfRange");
        }else if(this.col < -1){
            this.col = -1;
        }
    }
    this.right = function(){
        this.col++;
        if(this.col === this.cols){
            this.col = this.cols - 1;
            $(this).trigger("outOfRange");
        }
    }
    this.up = function(){
        this.row--;
        if(this.row === -1){
            this.row = 0;
            $(this).trigger("outOfRange");
        }else if(this.row < -1){
            this.row = -1;
        }
    }
    this.down = function(){
        this.row++;
        if(this.row === this.rows){
            this.row = this.rows-1;
            $(this).trigger("outOfRange");
        }
    }
}

_n.History = function(){

    this.index = 0;
    this.queue = [];
    this.save = function(historyObj){

    }
    this.go = function(num){

    }
    this.current = function(){
        
    }
    this.prev = function(){

    }
}

_n.convertTimestamp = function(timestamp){

    var current = new Date();
    var previous = timestamp;

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
         return Math.round(elapsed/1000) //+ ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) //+ ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) //+ ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) //+ ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) //+ ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) //+ ' years ago';   
    }
}