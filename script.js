////////////////////////// CONSTANTS ///////////////////////////

const T = [
    [0,0,0],
    [1,1,1],
    [0,1,0],
];


const O =[
    [1,1],
    [1,1],
    
];

const L =[
    [0,1,0],
    [0,1,0],
    [0,1,1],
];

const J =[
    [0,1,0],
    [0,1,0],
    [1,1,0],
];

const I = [
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
];

const S = [
    [0,1,1],
    [1,1,0],
    [0,0,0],
];

const Z =[
    [1,1,0],
    [0,1,1],
    [0,0,0],
];

///////////////////////////// VARIABLES /////////////////////////////////

////// Initiation
let width = 300;
let height = 600;
let square_size = 25;
let fps = 2 ;
let score_value = 0;
let level_value = 0;
let on_off = "ON";
let nbline = 0;
///// HTML objects
let grid = document.getElementById('grid');
let next_piece_container = document.getElementById("next_piece");
let replay_button = document.getElementById("replay");
let best_score = document.getElementById("best_score");
let best_score_value = localStorage.getItem("best_score");
let level = document.getElementById('level');
let score = document.getElementById('score');
let pause_button = document.getElementById("pause");

////// Lists
let current_piece = [];
let blocks =[];
let next_shape = [];
//////
let next_position = [60,145];
let current_position = [width / 2 - square_size , 0];
let shapes = [ L, T , Z ,S , O , J , I , L];
let colors = [ '#FF007F','#00aaff','#ffaa00','#aaff00','#aa00ff','#ffe700',
'#4deeea','#edaaf6','#9df4b5' , '#FF3131' , '#FAED27','#FF007F'];



////// Random index values
let new_piece_index = Math.floor(Math.random() * (shapes.length - 1));
let shape_index = Math.floor(Math.random() * (shapes.length - 1));
let new_color_index = Math.floor(Math.random() * (colors.length - 1));
let color_index = Math.floor(Math.random() * (colors.length - 1));

////// Initiate best score
if(best_score_value == null) best_score_value = 0;
best_score.innerHTML = best_score_value;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// square constructor
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function square(){
    this.element = document.createElement('div');
    this.element.classList.add('square');
    this.position = [0 , 0];
    this.color = colors[color_index];


}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// detect collision function
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function detect_collision(x,y){
    for (let k = 0; k<current_piece.length ; ++k){
        if (current_piece[k].position[1] + y  > height - square_size || current_piece[k].position[0] + x < 0 || current_piece[k].position[0] + x > width - square_size ){
            return 1;
        } 
    }
    for (let k = 0; k<blocks.length;++k){
        for(let p = 0; p<current_piece.length;++p){
            if (current_piece[p].position[0] + x == blocks[k].position[0] && current_piece[p].position[1] + y == blocks[k].position[1]){
                return 1;
            }
        }
    }
    return 0;

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// detect full line in game
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function detect_full_line(){
    let h = height - square_size ;
    let test = 0 ;
    let j=[];
    let s = 0;
    while (h != 0){
        j=[];
        s=0;
        for (let x= 0 ; x<blocks.length ; ++x){
            if (blocks[x].position[1] == h){
                s+=1;
                j.push(x);
            }

        }
        
        if (s == 12){
            for (let x = 0 ; x<12;++x){
                grid.removeChild(blocks[j[x]].element);
                
            }
            for (let i = 0 ; i<12 ; ++i){
                blocks.splice(j[i],1);
                for(let y = 0 ; y<12; ++y){
                    j[y] -= 1;
                }
            }
            for (let y = 0 ; y<blocks.length ;++y){
                if(blocks[y].position[1] < h){
                   blocks[y].position[1] += square_size;

                }

            }
          
            test += 1 ;
        } else {
            h -= square_size;
        }
        
    } 
    nbline += test;
    if (test == 1){
        score_value += 40 * (level_value + 1);
        score.innerHTML = score_value;    
    } else if (test == 2){
        score_value += 100 * (level_value + 1);
        score.innerHTML = score_value;
    } else if (test == 3){
        score_value += 300 * (level_value + 1);
        score.innerHTML = score_value;
    } else if (test >= 4){
        bonus_audio();
        score_value += 1200 * (level_value + 1);
        score.innerHTML = score_value;
    }
    
    level_value = Math.floor(nbline/5);
    level.innerHTML = level_value;
    
    return test;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create a tetrominos piece
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function create_piece(shape){
    for (let k = 0; k<current_piece.length;++k){
        blocks.push(current_piece[k]);
        
    }
    
    current_piece = [new square, new square , new square , new square];
    for (let x = 0 ; x< current_piece.length; ++x)
     grid.appendChild(current_piece[x].element);
   
     let m = 0;
    for (let y = 0; y<shape.length; ++y){
        for (let x = 0; x<shape[y].length;++x){
            if ( shape[y][x] == 1){
                current_piece[m].position[0] = current_position[0] + x * square_size;
                current_piece[m].position[1] = current_position[1] + y * square_size - square_size * (shape_index == 1);
                m++;
            }
        }
    }
       
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create the next tetrominos piece
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function create_next_piece(shape){
    
    next_piece = [new square, new square , new square , new square];
    for (let x = 0 ; x< next_piece.length; ++x)
     next_piece_container.appendChild(next_piece[x].element);
   
    let m = 0;
    for (let y = 0; y<shape.length; ++y){
        for (let x = 0; x<shape[y].length;++x){
            if ( shape[y][x] == 1){
                next_piece[m].position[0] = next_position[0] + x * square_size;
                next_piece[m].position[1] = next_position[1] + y * square_size - square_size * (shape_index == 1);
                m++;
            }
        }
    }
       
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// set the tetrominos position
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function set_position(){
    for( let x = 0; x<current_piece.length; ++x){
        current_piece[x].element.setAttribute("style","background-color:" + current_piece[x].color + ";top:" + (current_piece[x].position[1]).toString() + "px;left:" + (current_piece[x].position[0]).toString() + "px;" );
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// set the next tetrominos position
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function set_next_position(){
    for( let x = 0; x<next_piece.length; ++x){
        next_piece[x].element.setAttribute("style","background-color:" + colors[new_color_index] + ";top:" + (next_piece[x].position[1]).toString() + "px;left:" + (next_piece[x].position[0]).toString() + "px;" );
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// set the stacked tetrominos position
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function set_blocks_position(){
    for( let x = 0; x<blocks.length; ++x){
        blocks[x].element.setAttribute("style","background-color:" + blocks[x].color + ";top:" + (blocks[x].position[1]).toString() + "px;left:" + (blocks[x].position[0]).toString() + "px;" );
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// move down the piece throughout the game
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function move_down(){
    for (let x = 0; x<current_piece.length;++x)
      current_piece[x].position[1]+= square_size;
    current_position[1] += square_size;

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// move left
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function move_left(){
    for (let x = 0; x<current_piece.length;++x)
     current_piece[x].position[0]-= square_size;
    current_position[0] -= square_size;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// move right
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function move_right(){
    for (let x = 0; x<current_piece.length;++x)
     current_piece[x].position[0]+= square_size;
    current_position[0] += square_size;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// rotate the tetrominos piece
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function rotate(){
    let k = [];
    for (let x = 0; x< shapes[shape_index][0].length;++x){
        let li=[];
        for (let y=shapes[shape_index].length - 1;y>=0;--y){
            li.push(shapes[shape_index][y][x]);
        }
        k.push(li);

    }
    shapes[shape_index] = k ;
    let m = 0;
    for (let y = 0; y<shapes[shape_index].length; ++y){
        for (let x = 0; x<shapes[shape_index][y].length;++x){
            if ( shapes[shape_index][y][x] == 1){
                current_piece[m].position[0] = current_position[0] + x * square_size;
                current_piece[m].position[1] = current_position[1] + y * square_size - square_size * (shape_index == 1);
                m++;
            }
        }
    }
    if (detect_collision(0,0)){
        rotate();
    }
}



//////////// initiate the piece
create_next_piece(shapes[new_piece_index]);
set_next_position();
create_piece(shapes[shape_index]);
set_position();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// game loop function
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function game_loop(){
    if (!game_over())
    { if (on_off == "ON" && !detect_collision(0,25) ){
        move_down();
        set_position();

    } else {
        collision_audio();
        shapes = [ L, T , Z ,S , O , J , I , L];
        current_position = [width / 2 - square_size , 0];
        color_index = new_color_index;
        shape_index = new_piece_index;
        next_piece_container.innerHTML = null;
        new_color_index = Math.floor(Math.random() * (colors.length - 1));
        new_piece_index = Math.floor(Math.random() * (shapes.length - 1));
        create_next_piece(shapes[new_piece_index]);
        set_next_position();
        create_piece(shapes[shape_index]);
        set_position();
        if (detect_full_line()){
            fullLine_audio();
            set_blocks_position();
            fps += 0.2;
            clearInterval(loop);
            loop = setInterval(game_loop,1000/fps);
        }
    }

    } else {
        alert("GAME OVER");
        if(score_value>best_score_value ){
            localStorage.setItem("best_score",score_value);
            best_score_value = score_value;
            best_score.innerHTML = best_score_value;
        }
        reset_game();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// game over
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function game_over(){
    if (current_position[1] == 0 && detect_collision(0,0))
     return 1;
    return 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// user interface
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////// pause the game
function pause(){
    button_audio();
    if (on_off =="ON"){
        on_off = "OFF";
        clearInterval(loop);
        pause_button.innerHTML = "PLAY";
        pause_button.blur();
        pause_button.setAttribute("style","background-color:#34eb34;");
    } else {
        on_off = "ON";
        loop = setInterval(game_loop,1000/fps);
        pause_button.innerHTML = "PAUSE";
        pause_button.blur();
        pause_button.setAttribute("style","background-color:#FF5F1F;");
    }
}

///////// reset the game to replay it
function reset_game(){
    if(on_off = "ON"){
    grid.innerHTML = null ; 
    color_index = new_color_index;
    shape_index = new_piece_index;
    next_piece_container.innerHTML = null;        
    new_color_index = Math.floor(Math.random() * (colors.length - 1));
    new_piece_index = Math.floor(Math.random() * (shapes.length - 1));
    create_next_piece(shapes[new_piece_index]);
    set_next_position();
    create_piece(shapes[shape_index]);
    set_position();
    current_position = [width / 2 - square_size , 0];
    blocks =[];
    fps = 2;
    score_value =0;
    score.innerHTML = 0;
    level_value =0;
    level.innerHTML =0;
    clearInterval(loop);
    loop = setInterval(game_loop,1000/fps);
    replay_button.blur();
    } else {
        pause();
        reset_game();
    }
    
}

///// sound effects
function fullLine_audio(){
    var audio = new Audio("audio/level.mp3");
    audio.play();
}
function collision_audio(){
    var audio = new Audio("audio/collision.WAV");
    audio.play();

}
function button_audio(){
    var audio = new Audio("audio/button.WAV");
    audio.play();
}
function bonus_audio(){
    var audio = new Audio("audio/bonus.WAV");
    audio.play();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// game controls
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("keydown", function(event){
    if (event.keyCode == 27 ) {
        pause();
    }
    
    if (on_off == "ON"){
        if (event.keyCode == 39 && !detect_collision(25,0)){
            move_right();
            set_position();
        }
        if (event.keyCode == 37 && !detect_collision(-25,0)){
            move_left();
            set_position();
        }
        if (event.keyCode == 32 && !detect_collision(0,25)){
            move_down();
            set_position();
        }
        if (event.keyCode == 38){
            rotate();
            set_position();
        }

    }
   
 });


 //////// initiate game loop
let loop = setInterval(game_loop,1000/fps);



