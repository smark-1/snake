let snake = [];
const game_rows = 30;
const game_columns = 30;
let snake_direction = "up";
let snake_skin = localStorage.getItem("snake_skin") || "skin6";
let game_direction = snake_direction;

let food = [];
const start_speed = 100;
let speed = start_speed;
let paused = false;
let game_over = false;
const mobile_width = 480;

function change_skin(skin){
    snake_skin=skin;
    close_snake_skins();
    localStorage.setItem("snake_skin",skin);
}

function getLeaderBoardScoresFromDB(){
    localStorage.setItem("leader_board_time",Date.now());
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            localStorage.setItem("leaderboard_scores",this.responseText.toString())
            displayLeaderBoard();
        }
    };
    xhttp.open("GET", `https://sheetdb.io/api/v1/${SHEETDB_API_KEY}?sheet=${SHEETDB_LEADERBOARD_SHEET}&sort_by=high&sort_order=desc`, true);
    xhttp.send();
}

function displayLeaderBoard(){
    if(localStorage.getItem("leader_board_time")){

        const current_leader_board_time = parseInt(localStorage.getItem("leader_board_time"));
        const current_time = Date.now();

        const next_refresh_time = current_leader_board_time + SECONDS_TILL_NEXT_REFRESH_SCORE;

        if(next_refresh_time<current_time){
            //time to refresh
            getLeaderBoardScoresFromDB();
        }
        else{
            const d = new Date(next_refresh_time);
            document.getElementById('refresh_time').innerHTML=d.toTimeString();
        }
        
    }else{
        getLeaderBoardScoresFromDB();
    }

    const leader_board = document.getElementById("leader_board_text");

    const scores = JSON.parse(localStorage.getItem("leaderboard_scores"));
    leader_board.innerHTML="";
    for (let i in scores){
        leader_board.innerHTML+= '<li>'+scores[i].name+" - "+scores[i].high+'</li>';
    }
}

function loadGame(){
    if (window.innerWidth > mobile_width){
        displayLeaderBoard();
    }
    const game_board = document.getElementById("game-board");    
    
    for (let i = 0; i < game_rows; i++){
        const row = document.createElement("div");

        game_board.appendChild(row);
        row.classList.add("game-row");
        if (i===0 || i===game_rows-1){
            row.classList.add("border");
        }
        for(let j=0; j < game_columns; j++){
            const box = document.createElement("div");
            box.classList.add("box");
            row.appendChild(box)
        }
    }
    if (window.innerWidth > mobile_width) {
        if (localStorage.getItem("user_name") == null) {
            const name = prompt("Leaderboard name? (cancel to skip)");
            if (name != null) {
                localStorage.setItem("user_name", name);
            } else {
                localStorage.setItem("user_name", "");
            }
        }
    }
    
    
    
    document.getElementById("highscore").innerHTML=localStorage.getItem("snake_game_high_score");
    add_start_snake();
    add_food();
    load_messages();
    loop();
}

function keypress(e){
    let key = e.keyCode;
    if (key===38 && game_direction!=="down"){
        snake_direction="up";
    }
    if (key===39 && game_direction!=="left"){
        snake_direction="right";
    }
    if (key===37 && game_direction!=="right"){
        snake_direction="left";
    }
    if (key===40 && game_direction!=="up"){
        snake_direction="down";
    }
    // pause
    // p
    if (key===80){
        toggle_pause();
    }
    
    //enter key restart game
    // enter or space
    if(key===13){
        if(game_over){
            restart();
        } 
    }

    // if space bar
    if(key===32){
        if(game_over){
            restart();
        }else{
            toggle_pause();
        }
    }
}

function add_start_snake(){
    add_snake_piece(Math.floor(game_rows/2),Math.floor(game_columns/2));
    add_snake_piece(Math.floor(game_rows/2),Math.floor(game_columns/2+1));
}

function add_snake_piece(row,col,end=false){
    if (end===true){
        snake.push([row,col]);
    }else{
        snake.unshift([row,col]);
    }
    getbox(row,col).className ="box snake "+snake_skin;
}

function getbox(row,col){
    const rows = document.querySelectorAll(".game-row");
    let i;
    for (i = 0; i < rows.length; i++) {
        if (i===row){
            const boxes = rows[i].querySelectorAll(".box");
            let x;
            for (x = 0; x < boxes.length; x++) {
                if(x===col){
                    return boxes[x]
                }
            }
        }
    }
    return 0;
}

function add_food(){
    let row = Math.floor(Math.random() * game_rows - 4);
    let column = Math.floor(Math.random() * game_columns - 4);

    row=Math.max(row, 2);
    column=Math.max(column, 2);
    let snake_col = column + 2;
    let snake_row = row + 2;
    getbox(snake_row,snake_col).classList.add("food");
    food=[snake_row,snake_col];
    
    while(snake_is_at(food[0],food[1])){
        getbox(food[0],food[1]).classList.remove("food");
        row = Math.floor(Math.random() * game_rows - 4);
        column = Math.floor(Math.random() * game_columns - 4);

        row=Math.max(row, 2);
        column=Math.max(column, 2);
        snake_col = column + 2;
        snake_row = row + 2;
        getbox(snake_row,snake_col).classList.add("food");
        food=[snake_row,snake_col];
    }
    
}

function clear_board(){
    for (let i = 0; i < game_rows; i++){
        for(let j=0; j < game_columns; j++){
            const box = getbox(i, j);
            box.classList.remove("snake");
        }
    }
}

function toggle_pause(){
    const paused_div=document.getElementById("skins")
    if(paused===true){
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
        
        //save to spreadsheet and add to local leaderboard if the user has a username
        if(localStorage.getItem("user_name")!=null && localStorage.getItem("user_name")!==""){
            axios.post(`https://sheetdb.io/api/v1/${SHEETDB_API_KEY}`,{
                "data": {
                    "name": localStorage.getItem("user_name"),
                    "score": snake.length
                    }
            });

            let scores = JSON.parse(localStorage.getItem("leaderboard_scores"));
            for(let i=0; i< scores.length;i++){
                if(scores[i].name===""+localStorage.getItem("user_name")){
                    if(parseInt(scores[i].high)<snake.length){
                        scores[i].high=snake.length;
                    }
                    break;
                }else if(parseInt(scores[i].high)<snake.length){
                    let new_leader_board = {name:localStorage.getItem("user_name"),high:""+snake.length}
                    scores.push(new_leader_board);
                    break;
                }else{

                }
            }

            scores = scores.sort((score1,score2)=>parseInt(score2.high)-parseInt(score1.high));
            localStorage.setItem("leaderboard_scores",JSON.stringify(scores));
            displayLeaderBoard();
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
    for (let i = 0; i < snake.length; i++){
        if (snake[i][1]===col&&snake[i][0]===row){
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
    let snake_head = snake[0];
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
    
    for (let i = 1; i < snake.length; i++){
        if (snake[i][1]===snake_head[1]&&snake[i][0]===snake_head[0]){
            lose();
            return 0;
        }
    }
    
    
    
    
    getbox(snake[snake.length-1][0],snake[snake.length-1][1]).classList.remove("snake");
    snake.pop();
    if (snake_direction==="up"){
        add_snake_piece(snake[0][0]-1,snake[0][1]);
    }
    if (snake_direction==="down"){
        add_snake_piece(snake[0][0]+1,snake[0][1]);
    }
    if (snake_direction==="left"){
        add_snake_piece(snake[0][0],snake[0][1]-1);
    }
    
    if (snake_direction==="right"){
        add_snake_piece(snake[0][0],snake[0][1]+1);
    }
    
    

    
    if (food[1]===snake_head[1] && food[0]===snake_head[0]){
        getbox(food[0],food[1]).classList.remove("food");
        add_food();
        speed-=1;
        speed=Math.max(50,speed);
        add_snake_piece(snake[snake.length-1][0],snake[snake.length-1][1],end=true);
        
    }

    document.getElementById("score").innerHTML=snake.length;
    setTimeout(loop , speed);
    
}

function load_messages(){

    const xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("messages").innerHTML=this.responseText;
        }
    };
    xhttp2.open("GET", "./messages.html", true);
    xhttp2.send();
}

function open_snake_skins(){
    document.getElementById("skins").classList.add("active");
    paused = true;
    const paused_div=document.getElementById("lost")
    paused_div.classList.remove("active");
}

function close_snake_skins(){
    document.getElementById("skins").classList.remove("active");
    paused=false;
    if (game_over) { 
        restart();
    } else {
        setTimeout(loop, speed);
    }
}

setInterval(function(){ load_messages();  }, 5000);
document.addEventListener("keydown", keypress);
window.addEventListener("load", () => loadGame())

// https://github.com/john-doherty/swiped-events/tree/master?tab=readme-ov-file
// mobile swipe events
document.addEventListener('swiped-left', function (e) {
    if (game_direction!=="right"){
        snake_direction="left";
    }
});

document.addEventListener('swiped-right', function (e) {
    if (game_direction!=="left"){
        snake_direction="right";
    }
});

document.addEventListener('swiped-up', function (e) {
    if (game_direction!=="down"){
        snake_direction="up";
    }
});

document.addEventListener('swiped-down', function (e) {
    if (game_direction !== "up") {
        snake_direction="down";
    }
});

