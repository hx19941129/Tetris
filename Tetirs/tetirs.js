
var gameArr=createArr() //游戏数组
var timer=null 		   //计时器
var score=0		  //分数
var status=0 		 //游戏状态：0没开始，1游戏中，2游戏停止
var  nextBlock=createBlock() 		//下一个图形
var nextBlockShow 	//预览下一个图形
var activeBlock =copyBlock(nextBlock)	//当前活动的方块

//初始化游戏界面
function Initial(){
	addId()
	addShowId()
	drawNextShowBlock()
}


//创建所有的td并添加id
function addId(){
	var table=document.getElementById("game") 	//获取到table

	for(var row=0;row<18;row++){
		var tr=document.createElement("tr") 	//创建一个tr
		table.appendChild(tr) 			//加入table中
		for(var col=0;col<10;col++){
			var td=document.createElement("td") //创建一个td
			td.setAttribute("id",row+""+col)            //设置id
			tr.appendChild(td) 		            //加入tr中

		}
	}
}

//将预览下一个图形的方块放上并且赋值id 
function addShowId(){
	var table=document.getElementById("nextShow")

	for(var row=0;row<4;row++){
		var tr=document.createElement("tr")
		table.appendChild(tr)
		for(var col=0;col<3;col++){
			var td=document.createElement("td")
			td.setAttribute("id","show"+row+""+col)
			tr.appendChild(td)
		}
	}
}

//创建游戏二维数组
function createArr(){
	var gameArr=[]
	for(row=0;row<18;row++){
		gameArr[row]=[]
		for(col=0;col<10;col++){
			gameArr[row][col]=0
		}
	}
	return gameArr
}

//生成方块,7种
function createBlock(){
	var block=new Array(4)
	var type=Math.round(Math.random()*6)%7
	switch(type){
		case 0:{ 				//这是“ | ”
			block[0]={x:0,y:1}
			block[1]={x:1,y:1}
			block[2]={x:2,y:1}
			block[3]={x:3,y:1}
			break; 			
		}
		case 1:{				//这是 "J"
			block[0]={x:0,y:1}
			block[1]={x:1,y:1}
			block[2]={x:2,y:1}
			block[3]={x:2,y:0}
			break;			
		}
		case 2:{				//这是 "L"
			block[0]={x:0,y:1}
			block[1]={x:1,y:1}
			block[2]={x:2,y:1}
			block[3]={x:2,y:2}
			break;			
		}
		case 3:{				//这是 "田"
			block[0]={x:0,y:0}
			block[1]={x:0,y:1}
			block[2]={x:1,y:0}
			block[3]={x:1,y:1}
			break;			
		}
		case 4:{				//这是 "Z"
			block[0]={x:0,y:0}
			block[1]={x:0,y:1}
			block[2]={x:1,y:1}
			block[3]={x:1,y:2}
			break;			
		}
		case 5:{				//这是倒着的"T"
			block[0]={x:0,y:1}
			block[1]={x:1,y:0}
			block[2]={x:1,y:1}
			block[3]={x:1,y:2}
			break;				
		}
		case 6:{				//这是"S"
			block[0]={x:0,y:2}
			block[1]={x:0,y:1}
			block[2]={x:1,y:1}
			block[3]={x:1,y:0}
			break;				
		}
	}
	return block
}

//擦除预览图形
function eraseNextShowBlock(){
	for(var row=0;row<4;row++){
		for(var col=0;col<3;col++){
			document.getElementById("show"+row+""+col).style.background="white"
		}
	}
}

//绘制预览图形
function drawNextShowBlock(){
	for(var i=0;i<4;i++){
		document.getElementById("show"+nextBlock[i].x+""+nextBlock[i].y).style.background="red"
	}
}

//Copy初始方块
function copyBlock(oldBlock){
	var cp=new Array(4)
	var pos=Math.round(Math.random()*6)
	for(var i=0;i<4;i++){
		cp[i]={x:0,y:0}
	}
	for(var i=0;i<4;i++){
		cp[i].x=oldBlock[i].x
		cp[i].y=oldBlock[i].y+pos
	} 
	return cp
}

//copy正常方块
function copy(oldBlock){
	var cp=new Array(4)
	for(var i=0;i<4;i++){
		cp[i]={x:0,y:0}
	}
	for(var i=0;i<4;i++){
		cp[i].x=oldBlock[i].x
		cp[i].y=oldBlock[i].y
	}
	return cp
}

var startBtn=document.getElementById("start")
startBtn.onclick=function(){
	this.disabled="true"
	this.innerHTML="正在游戏"
	this.style.color="white"
	nextBlock=createBlock()
	eraseNextShowBlock()
	drawNextShowBlock()
	start()
}
//开始游戏
function start(){
	status=1
	drawActiveBlock()
	timer=setInterval(moveDown,1000)
}

//画活动方块
function drawActiveBlock(){
	for(var i=0;i<4;i++){
		document.getElementById(activeBlock[i].x+""+activeBlock[i].y).style.background="red"
	}
}

//擦掉活动方块
function eraseActiveBlock(){
	for(var i=0;i<4;i++){
		document.getElementById(activeBlock[i].x+""+activeBlock[i].y).style.background="white"
	}
}

//向下移动
function moveDown(){
	if(!checkBottom()){
		eraseActiveBlock()
		for(var i=0;i<4;i++){
			activeBlock[i].x+=1
		}
		drawActiveBlock()
	}else{
		clearInterval(timer)
		updateArray()
		var line=deleteLine()
		if(line!=0){
			eraseGame()
			score+=10*line
			updateScore()
			drawGame()
		}
		if(!isOver()){
			activeBlock=copyBlock(nextBlock)
			nextBlock=createBlock()
			eraseNextShowBlock()
			drawNextShowBlock()
			drawActiveBlock()
			timer=setInterval(moveDown,1000)	
		}else{
			status=2
			alert("结束")
			return;
		}

	}
}

//检查下触碰撞
function checkBottom(){
	for(var i=0;i<4;i++){
		if(activeBlock[i].x==17){
			return true
		}
		if(checkValid(activeBlock[i].x+1,activeBlock[i].y)){
			return true
		}
	}
	return false
}


//左移动
function moveLeft(){
	if(!checkLeft()){
		eraseActiveBlock()
		for(var i=0;i<4;i++){
			activeBlock[i].y-=1
		}
		drawActiveBlock()		
	}
	
}

//左侧碰撞
function checkLeft(){
	for(var i=0;i<4;i++){
		if(activeBlock[i].y==0){
			return true
		}
		if(checkValid(activeBlock[i].x,activeBlock[i].y-1)){
			return true
		}
	}
	return false
}

//向右移动
function moveRight(){
	if(!checkRight()){
		eraseActiveBlock()
		for(var i=0;i<4;i++){
			activeBlock[i].y+=1
		}
		drawActiveBlock()
	}
}

//右侧碰撞
function checkRight(){
	for(var i=0;i<4;i++){
		if(activeBlock[i].y==9){
			return true
		}
		if(checkValid(activeBlock[i].x,activeBlock[i].y+1)){
			return true
		}
	}
	return false
}

//判断移动的方向上是否有挡住的
function checkValid(x,y){
	if(x>17||x<0||y>9||y<0){
		return true
	}
	if(gameArr[x][y]==1){
		return true
	}
	return false
}

//旋转方块
function rotate(){
	var temp=copy(activeBlock) 	//复制一个当前的方块

	var cx=Math.round((temp[0].x+temp[1].x+temp[2].x+temp[3].x)/4) 	//旋转中心点的x坐标
	var cy=Math.round((temp[0].y+temp[1].y+temp[2].y+temp[3].y)/4) 	//旋转中心点的y坐标
	for(var i=0;i<4;i++){
		temp[i].x=cx + cy - activeBlock[i].y
		temp[i].y=cy-cx+activeBlock[i].x
	}

	for(var i=0;i<4;i++){
		if(checkValid(temp[i].x,temp[i].y)){
			return;
		}
	}
	eraseActiveBlock()
	for(var i=0;i<4;i++){
		activeBlock[i].x=temp[i].x
		activeBlock[i].y=temp[i].y
	}
	drawActiveBlock()
}

//操作键盘
document.onkeydown=function(ev){
	if(status!=1){
		return;
	}
	var ev=ev||event
	if(ev.keyCode==37){
		moveLeft()
	}
	if(ev.keyCode==39){
		moveRight()
	}
	if(ev.keyCode==38){
		rotate()
	}
	if(ev.keyCode==40){
		moveDown()
	}

}

//更新数组
function updateArray(){
	for(var i=0;i<4;i++){
		gameArr[activeBlock[i].x][activeBlock[i].y]=1
	}
}

//更新游戏画面
function drawGame(){
	for(row=0;row<18;row++){
		for(col=0;col<10;col++){
			if(gameArr[row][col]==1){
				document.getElementById(row+""+col).style.background="red"	
			}
		}
	}
}

//擦掉游戏画面
function eraseGame(){
	for(row=0;row<18;row++){
		for(col=0;col<10;col++){
			document.getElementById(row+""+col).style.background="white"
		}
	}
}

//更新分数
function updateScore(){
	document.getElementById("score").innerHTML=score
}

//消行
function deleteLine(){
	var lines=0
	for(var i=0;i<18;i++){
		var j=0
		for(;j<10;j++){
			if(gameArr[i][j]==0){
				break
			}
		}
		if(j==10){
			lines++
			for(var k=i;k>0;k--){
				gameArr[k]=gameArr[k-1]
			}
			gameArr[0]=BlankLine()
		}
	}
	return lines
}

//空白行
function BlankLine(){
	var blankArr=new Array(10)
	for(var i=0;i<10;i++){
		blankArr[i]=0
	}
	return blankArr
}

//游戏结束条件
function isOver(){
	for(var i=0;i<4;i++){
		if(checkValid(nextBlock[i].x,nextBlock[i].y)){
			return true
		}
	}
	return false;
}

Initial()

