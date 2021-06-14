var snake=[];
var game_rows=30;
var game_columns=30;
var snake_direction="up";
var snake_skin="";
var game_direction=snake_direction;

var food=[];
var start_speed=150;
var speed=start_speed;
var paused=false;
var game_over=false;
document.addEventListener("keydown", keypress);

function change_skin(skin){
    snake_skin=skin;
    close_snake_skins();
}

function do_refresh(){
    localStorage.setItem("leader_board_time",Date.now());
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            
            var string;
            
            
            string=obj[0].email+" - "+obj[0].high;
            localStorage.setItem("first_place",string);
            
            string=obj[1].email+" - "+obj[1].high;
            localStorage.setItem("second_place",string);
            
            string=obj[2].email+" - "+obj[2].high;
            localStorage.setItem("third_place",string);
            
            string=obj[3].email+" - "+obj[3].high;
            localStorage.setItem("fourth_place",string);
            
            string=obj[4].email+" - "+obj[4].high;
            localStorage.setItem("fifth_place",string);
            
            
            
            string=obj[5].email+" - "+obj[5].high;
            localStorage.setItem("sixth_place",string);
            
            string=obj[6].email+" - "+obj[6].high;
            localStorage.setItem("seventh_place",string);
            
            string=obj[7].email+" - "+obj[7].high;
            localStorage.setItem("eighth_place",string);
            
            string=obj[8].email+" - "+obj[8].high;
            localStorage.setItem("ninth_place",string);
            
            string=obj[9].email+" - "+obj[9].high;
            localStorage.setItem("tenth_place",string);
            
            
            
            string=obj[10].email+" - "+obj[10].high;
            localStorage.setItem("eleventh_place",string);
            
            string=obj[11].email+" - "+obj[11].high;
            localStorage.setItem("twelth_place",string);
            
            string=obj[12].email+" - "+obj[12].high;
            localStorage.setItem("thirteenth_place",string);
            
            string=obj[13].email+" - "+obj[13].high;
            localStorage.setItem("fourteenth_place",string);
            
            string=obj[14].email+" - "+obj[14].high;
            localStorage.setItem("fifteenth_place",string);
            
            
            
            string=obj[15].email+" - "+obj[15].high;
            localStorage.setItem("sixteenth_place",string);
            
            string=obj[16].email+" - "+obj[16].high;
            localStorage.setItem("seventeenth_place",string);
            
            string=obj[17].email+" - "+obj[17].high;
            localStorage.setItem("eighteenth_place",string);
            
            string=obj[18].email+" - "+obj[18].high;
            localStorage.setItem("ninteenth_place",string);
            
            string=obj[19].email+" - "+obj[19].high;
            localStorage.setItem("twentyith_place",string);
        }
    };
    xhttp.open("GET", `https://sheetdb.io/api/v1/${SHEETDB_API_KEY}?sheet=${SHEETDB_LEADERBOARD_SHEET}&sort_by=high&sort_order=desc`, true);
    xhttp.send();
}

function leader_board_refresh(){
    if(localStorage.getItem("leader_board_time")){
        
        var current_leader_board_time=parseInt(localStorage.getItem("leader_board_time"));
        var current_time=Date.now();
        
        var next_refresh_time=parseInt(current_leader_board_time)+SECONDS_TILL_NEXT_REFRESH_SCORE;
        
        if(next_refresh_time<current_time){
            //time to refresh
            do_refresh();
            
            
        }
        else{
            var d = new Date(next_refresh_time);
            // alert("refreshing in "+d);
            document.getElementById('refresh_time').innerHTML=d.toTimeString();;
            }
        
    }else{
        do_refresh();
    }
    
    var leader_board=document.getElementById("leader_board_text");
    
    leader_board.innerHTML='<li>'+localStorage.getItem("first_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("second_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("third_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("fourth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("fifth_place")+'</li>';
    
    leader_board.innerHTML+='<li>'+localStorage.getItem("sixth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("seventh_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("eighth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("ninth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("tenth_place")+'</li>';
    
    leader_board.innerHTML+='<li>'+localStorage.getItem("eleventh_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("twelth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("thirteenth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("fourteenth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("fifteenth_place")+'</li>';
    
    leader_board.innerHTML+='<li>'+localStorage.getItem("sixteenth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("seventeenth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("eighteenth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("ninteenth_place")+'</li>';
    leader_board.innerHTML+='<li>'+localStorage.getItem("twentyith_place")+'</li>';
    
    
}

function loadGame(){
    
    leader_board_refresh();
    
    
    for (var i = 0;i < game_rows;i++){
        var row = document.createElement("div");
        
        document.body.appendChild(row);
        row.classList.add("game-row");
        if (i==0 || i==game_rows-1){
            row.classList.add("border");
        }
        for(var j=0;j < game_columns;j++){
            var box = document.createElement("div");
            box.classList.add("box");
            row.appendChild(box)
        }
    }
    if (localStorage.getItem("user_name")==null){
        var name = prompt("What is your name?");
        if(name!=null){
            localStorage.setItem("user_name",name);
        }
    }
    
    
    
    document.getElementById("highscore").innerHTML=localStorage.getItem("snake_game_high_score");
    add_start_snake();
    add_food();
    load_highscores();
    loop();
}

function keypress(e){
    key=e.keyCode;
    if (key==38 && game_direction!="down"){
        snake_direction="up";
    }
    if (key==39 && game_direction!="left"){
        snake_direction="right";
    }
    if (key==37 && game_direction!="right"){
        snake_direction="left";
    }
    if (key==40 && game_direction!="up"){
        snake_direction="down";
    }
    // pause
    if (key==80){
        toggle_pause();
    }
    
    //enter key restart game
    if(key==13){
        if(game_over){
            restart();
        } 
    }
}

function add_start_snake(){
    add_snake_piece(Math.floor(game_rows/2),Math.floor(game_columns/2));
    add_snake_piece(Math.floor(game_rows/2),Math.floor(game_columns/2+1));
}

function add_snake_piece(row,col,end=false){
    if (end==true){
        snake.push([row,col]);
    }else{
        snake.unshift([row,col]);
    }
    getbox(row,col).className ="box snake "+snake_skin;
}

function remove_snake_piece(row,col){
    getbox(row,col).className ="box";
}

function getbox(row,col){
    var rows = document.querySelectorAll(".game-row");
    var i;
    for (i = 0; i < rows.length; i++) {
        if (i==row){
            var boxes = rows[i].querySelectorAll(".box");
            var x;
            for (x = 0; x < boxes.length; x++) {
                if(x==col){
                    return boxes[x]
                }
            }
        }
    }
    return 0;
}

function add_food(){
    var row=Math.floor(Math.random() * game_rows-4);
    var column=Math.floor(Math.random() * game_columns-4);

    row=Math.max(row, 2);
    column=Math.max(column, 2);
    var snake_col=column+2;
    var snake_row=row+2;
    getbox(snake_row,snake_col).classList.add("food");
    food=[snake_row,snake_col];
    
    while(snake_is_at(food[0],food[1])){
        getbox(food[0],food[1]).classList.remove("food");
        var row=Math.floor(Math.random() * game_rows-4);
        var column=Math.floor(Math.random() * game_columns-4);
    
        row=Math.max(row, 2);
        column=Math.max(column, 2);
        var snake_col=column+2;
        var snake_row=row+2;
        getbox(snake_row,snake_col).classList.add("food");
        food=[snake_row,snake_col];
    }
    
}

function clear_board(){
    for (var i = 0;i < game_rows;i++){
        for(var j=0;j < game_columns;j++){
            var box = getbox(i,j);
            box.classList.remove("snake");
        }
    }
}

function toggle_pause(){
    paused_div=document.getElementById("skins")
    if(paused==true){
        paused_div.classList.remove("active");
        paused=false;
        setTimeout(loop , speed);
    }else{
        paused_div.classList.add("active");
        paused=true;
    }
}

function lose(){
    // update high score
    if(snake.length>document.getElementById("highscore").innerHTML){
        localStorage.setItem("snake_game_high_score", snake.length);
        document.getElementById("highscore").innerHTML=snake.length;
        
        //save to spread sheet
        if(localStorage.getItem("user_name")!=null){
            axios.post(`https://sheetdb.io/api/v1/${SHEETDB_API_KEY}`,{
                "data": {
                    "name": localStorage.getItem("user_name"),
                    "score": snake.length
                    }
            });
            
        }
        

        
        
    }
    document.getElementById("lastscore").innerHTML=snake.length;
    clear_board()
    
    document.getElementById("lost_score").innerHTML=snake.length;
    snake=[];
    game_over=true;
    document.getElementById("lost").classList.add("active");
    
}

function restart(){
    game_over=false;
    document.getElementById("lost").classList.remove("active");
    add_start_snake();
    loop();
    
    
    speed=start_speed;
}

function snake_is_at(row,col){
    for (var i = 0;i < snake.length;i++){
        if (snake[i][1]==col&&snake[i][0]==row){
            return true;
        }
    }
    return false;    
}

function loop(){
    if (paused){
        return 0;
    }
    game_direction=snake_direction;
    snake_head=snake[0];
    if(snake_head[0]<=0){
        lose();
        return 0;
    }else if(snake_head[1]<=0){
        lose();
        return 0;
    }else if(snake_head[0]>=game_rows-1){
        lose();
        return 0;
    }else if(snake_head[1]>=game_columns-1){
        lose();
        return 0;
    }
    
    for (var i = 1;i < snake.length;i++){
        if (snake[i][1]==snake_head[1]&&snake[i][0]==snake_head[0]){
            lose();
            return 0;
        }
    }
    
    
    
    
    getbox(snake[snake.length-1][0],snake[snake.length-1][1]).classList.remove("snake");
    snake.pop();
    if (snake_direction=="up"){
        add_snake_piece(snake[0][0]-1,snake[0][1]);
    }
    if (snake_direction=="down"){
        add_snake_piece(snake[0][0]+1,snake[0][1]);
    }
    if (snake_direction=="left"){
        add_snake_piece(snake[0][0],snake[0][1]-1);
    }
    
    if (snake_direction=="right"){
        add_snake_piece(snake[0][0],snake[0][1]+1);
    }
    
    

    
    if (food[1]==snake_head[1] && food[0]==snake_head[0]){
        getbox(food[0],food[1]).classList.remove("food");
        add_food();
        speed-=1;
        speed=Math.max(50,speed);
        add_snake_piece(snake[snake.length-1][0],snake[snake.length-1][1],end=true);
        
    }

    document.getElementById("score").innerHTML=snake.length;
    setTimeout(loop , speed);
    
}

function load_highscores(){
    
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var d = new Date();
            var n = d.toLocaleString();
            
            document.getElementById("messages").innerHTML=this.responseText;
        }
    };
    xhttp2.open("GET", "/messages.html", true);
    xhttp2.send();
}

function open_snake_skins(){
    var skins=document.getElementById("skins").classList.add("active");
    paused=true;
}

function close_snake_skins(){
    var skins=document.getElementById("skins").classList.remove("active");
    paused=false;
    setTimeout(loop , speed);
}

setInterval(function(){ load_highscores();  }, 5000);