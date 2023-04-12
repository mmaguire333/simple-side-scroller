(()=>{"use strict";class t{constructor(){this.world={backgroundColor:"rgba(0, 0, 0, 0.1)",backgroundImage:new Image,backgroundOffset:0,scrollSpeed:8,width:1e3,height:400,gravity:2.75,friction:.85,drag:.9,player:new t.Player(300,100),tileSize:16,numColumns:500,numRows:25,tilemap:[],collisionMap:[],tilePositions:[],async loadMaps(t){await fetch(t).then((t=>t.json())).then((t=>{let e=t.layers[2].data,i=t.layers[3].data;for(let t=0;t<e.length;t++)this.tilemap.push(e[t]),this.collisionMap.push(i[t]),this.tilePositions.push({x:t%this.numColumns*this.tileSize,y:Math.floor(t/this.numColumns)*this.tileSize})}))},getAdjacentIndices(t,e){let i=[],s=Math.floor(t/this.tileSize),h=Math.floor(e/this.tileSize);return i.push(s-1+(h-1)*this.numColumns),i.push(s+(h-1)*this.numColumns),i.push(s+1+(h-1)*this.numColumns),i.push(s+2+(h-1)*this.numColumns),i.push(s+3+(h-1)*this.numColumns),i.push(s+4+(h-1)*this.numColumns),i.push(s-1+h*this.numColumns),i.push(s+h*this.numColumns),i.push(s+1+h*this.numColumns),i.push(s+2+h*this.numColumns),i.push(s+3+h*this.numColumns),i.push(s+4+h*this.numColumns),i.push(s-1+(h+1)*this.numColumns),i.push(s+(h+1)*this.numColumns),i.push(s+1+(h+1)*this.numColumns),i.push(s+2+(h+1)*this.numColumns),i.push(s+3+(h+1)*this.numColumns),i.push(s+4+(h+1)*this.numColumns),i.push(s-1+(h+2)*this.numColumns),i.push(s+(h+2)*this.numColumns),i.push(s+1+(h+2)*this.numColumns),i.push(s+2+(h+2)*this.numColumns),i.push(s+3+(h+2)*this.numColumns),i.push(s+4+(h+2)*this.numColumns),i.push(s-1+(h+3)*this.numColumns),i.push(s+(h+3)*this.numColumns),i.push(s+1+(h+3)*this.numColumns),i.push(s+2+(h+3)*this.numColumns),i.push(s+3+(h+3)*this.numColumns),i.push(s+4+(h+3)*this.numColumns),i.push(s-1+(h+4)*this.numColumns),i.push(s+(h+4)*this.numColumns),i.push(s+1+(h+4)*this.numColumns),i.push(s+2+(h+4)*this.numColumns),i.push(s+3+(h+4)*this.numColumns),i.push(s+4+(h+4)*this.numColumns),i.push(s-1+(h+5)*this.numColumns),i.push(s+(h+5)*this.numColumns),i.push(s+1+(h+5)*this.numColumns),i.push(s+2+(h+5)*this.numColumns),i.push(s+3+(h+5)*this.numColumns),i.push(s+4+(h+5)*this.numColumns),i=i.filter((t=>t>=0&&t<this.numColumns*this.numRows)),i},detectIntersection(t,e,i){return!(t.x-this.backgroundOffset+t.width<=e.x||t.x-this.backgroundOffset>=e.x+i||t.y+t.height<=e.y||t.y>=e.y+i)},boundaryCollision(t){t.x<.25*this.width?(t.x=.25*this.width,t.xVelocity=0):t.x>.75*this.width-t.width&&(t.x=.75*this.width-t.width,t.xVelocity=0),t.y>this.height&&(t.x=300,t.xVelocity=0,t.y=100,t.yVelocity=0,this.backgroundOffset=0)},updateBackgroundOffset(){let t=this.getAdjacentIndices(this.player.x-this.backgroundOffset,this.player.y);if(this.player.xVelocity>0){this.backgroundOffset-=this.scrollSpeed;for(let e=0;e<t.length;e++)if(0!==this.collisionMap[t[e]]&&this.detectIntersection(this.player,this.tilePositions[t[e]],this.tileSize)){this.backgroundOffset+=this.scrollSpeed;break}}if(this.player.xVelocity<0){this.backgroundOffset+=this.scrollSpeed;for(let e=0;e<t.length;e++)if(0!==this.collisionMap[t[e]]&&this.detectIntersection(this.player,this.tilePositions[t[e]],this.tileSize)){this.backgroundOffset-=this.scrollSpeed;break}}this.backgroundOffset>0&&(this.backgroundOffset=0),this.backgroundOffset<-7e3&&(this.backgroundOffset=-7e3)},updateWorld(){this.player.yVelocity+=this.gravity,this.player.xVelocity*=this.friction,this.player.yVelocity*=this.drag,this.player.xVelocity>0?this.player.xVelocity=Math.floor(this.player.xVelocity):this.player.xVelocity=Math.ceil(this.player.xVelocity),this.player.yVelocity>0?this.player.yVelocity=Math.floor(this.player.yVelocity):this.player.yVelocity=Math.ceil(this.player.yVelocity),this.player.horizontalRect.x=this.player.x+this.player.xVelocity,this.player.horizontalRect.y=this.player.y,this.player.verticalRect.x=this.player.x,this.player.verticalRect.y=this.player.y+this.player.yVelocity;let t=this.getAdjacentIndices(this.player.x-this.backgroundOffset,this.player.y);for(let e=0;e<t.length;e++)0!==this.collisionMap[t[e]]&&(this.detectIntersection(this.player.horizontalRect,this.tilePositions[t[e]],this.tileSize)&&(this.player.xVelocity=0),this.detectIntersection(this.player.verticalRect,this.tilePositions[t[e]],this.tileSize)&&(this.player.isJumping=!1,this.player.yVelocity=0));this.player.updatePosition(),this.updateBackgroundOffset(),this.boundaryCollision(this.player)}}}updateGame(){this.world.updateWorld()}}t.Player=class{constructor(t,e){this.x=t,this.y=e,this.xVelocity=0,this.yVelocity=0,this.width=40,this.height=60,this.horizontalRect={x:0,y:0,width:this.width,height:this.height},this.verticalRect={x:0,y:0,width:this.width,height:this.height},this.isJumping=!0,this.idleSpriteSheet=new Image,this.idleBackwardsSpriteSheet=new Image,this.runSpriteSheet=new Image,this.runBackwardsSpriteSheet=new Image,this.jumpSpriteSheet=new Image,this.jumpBackwardsSpriteSheet=new Image,this.jumpFallTransitionSpriteSheet=new Image,this.jumpFallTransitionBackwardsSpriteSheet=new Image,this.spriteAnimations={},this.animationStates=[{name:"idle",frames:10},{name:"idle backwards",frames:10},{name:"jump",frames:3},{name:"jump backwards",frames:3},{name:"run",frames:10},{name:"run backwards",frames:10},{name:"jump fall transition",frames:2},{name:"jump fall transition backwards",frames:2}]}populateSpriteAnimations(){this.animationStates.forEach(((t,e)=>{let i={loc:[]};for(let s=0;s<t.frames;s++){let t=-1,h=-1;e%2==0?(t=120*s+40,h=40):(t=120*s+48,h=40),i.loc.push({x:t,y:h})}this.spriteAnimations[t.name]=i}))}jump(){this.isJumping||(this.isJumping=!0,this.yVelocity=-35)}moveLeft(){this.xVelocity-=2}moveRight(){this.xVelocity+=2}updatePosition(){this.x+=this.xVelocity,this.y+=this.yVelocity}};class e{constructor(t){this.buffer=document.createElement("canvas").getContext("2d"),this.context=t.getContext("2d"),this.tiles=new e.Tileset(16,34),this.gameFrame=0,this.staggerFrames=2}drawMap(t,e,i,s){for(let h=0;h<t.length;h++){let r=t[h]-4740,a=r%this.tiles.columns*this.tiles.tileSize,l=Math.floor(r/this.tiles.columns)*this.tiles.tileSize,n=h%e*i,o=Math.floor(h/e)*i;this.buffer.drawImage(this.tiles.image,a,l,this.tiles.tileSize,this.tiles.tileSize,n+s,o,i,i)}}drawBackground(t,e){this.buffer.drawImage(t,e,0)}drawPlayer(t,e,i,s,h,r,a,l,n){this.buffer.drawImage(t,e,i,s,h,r,a,l,n)}drawNextLevel(t,e){this.buffer.font="40px serif",this.buffer.textAlign="center",this.buffer.fillText("Next Level",t,e),this.buffer.fillText("↓",t,e+30)}fill(t){this.buffer.fillStyle=t,this.buffer.fillRect(0,0,this.buffer.canvas.width,this.buffer.canvas.height)}render(){this.context.drawImage(this.buffer.canvas,0,0,this.buffer.canvas.width,this.buffer.canvas.height,0,0,this.context.canvas.width,this.context.canvas.height)}resize(t,e,i){e/t>i?(this.context.canvas.height=t*i,this.context.canvas.width=t):(this.context.canvas.height=e,this.context.canvas.width=e/i)}}e.Tileset=class{constructor(t,e){this.image=new Image,this.tileSize=t,this.columns=e}};class i{constructor(){this.left=new i.ButtonInput,this.right=new i.ButtonInput,this.up=new i.ButtonInput}keyDownOrUp(t){let e;e="keydown"===t.type,"ArrowLeft"===t.key?this.left.getInput(e):"ArrowUp"===t.key?this.up.getInput(e):"ArrowRight"===t.key&&this.right.getInput(e)}}i.ButtonInput=class{constructor(){this.isDown=!1}getInput(t){this.isDown!=t&&(this.isDown=t)}};const s=function(){let t=0;t=document.body.clientWidth>1650?250:40,a.resize(document.body.clientWidth-t,document.body.clientHeight-t,h.world.height/h.world.width),a.render()},h=new t,r=new i,a=new e(document.querySelector("canvas")),l=new class{constructor(t,e,i){this.timeStep=t,this.accumulatedTime=0,this.animationFrameRequest=void 0,this.time=void 0,this.updated=!1,this.update=e,this.render=i,this.handleLoop=t=>{this.loop(t)}}loop(t){for(this.accumulatedTime+=t-this.time,this.time=t,this.accumulatedTime>=3*this.timeStep&&(this.accumulatedTime=this.timeStep);this.accumulatedTime>=this.timeStep;)this.accumulatedTime-=this.timeStep,this.update(),this.updated=!0;this.updated&&(this.updated=!1,this.render()),this.animationFrameRequest=window.requestAnimationFrame(this.handleLoop)}start(){this.accumulatedTime=this.timeStep,this.time=window.performance.now(),this.animationFrameRequest=window.requestAnimationFrame(this.handleLoop)}stop(){window.cancelAnimationFrame(this.animationFrameRequest)}}(1e3/30,(function(){r.left.isDown&&h.world.player.moveLeft(),r.right.isDown&&h.world.player.moveRight(),r.up.isDown&&(h.world.player.jump(),r.up.isDown=!1),h.updateGame()}),(function(){a.buffer.clearRect(0,0,a.buffer.canvas.width,a.buffer.canvas.height),a.context.clearRect(0,0,a.context.canvas.width,a.context.canvas.height),a.drawBackground(h.world.backgroundImage,h.world.backgroundOffset),a.drawMap(h.world.tilemap,500,16,h.world.backgroundOffset),a.drawNextLevel(7645+h.world.backgroundOffset,300);let t="idle",e=h.world.player.idleSpriteSheet;h.world.player.isJumping?h.world.player.xVelocity>=0?(t="jump",e=h.world.player.jumpSpriteSheet):(t="jump backwards",e=h.world.player.jumpBackwardsSpriteSheet):r.right.isDown?(t="run",e=h.world.player.runSpriteSheet):r.left.isDown?(t="run backwards",e=h.world.player.runBackwardsSpriteSheet):(t="idle",e=h.world.player.idleSpriteSheet);let i=Math.floor(a.gameFrame/a.staggerFrames)%h.world.player.spriteAnimations[t].loc.length,s=h.world.player.spriteAnimations[t].loc[i].x,l=h.world.player.spriteAnimations[t].loc[i].y;"run backwards"===t||"jump backward"===t||"idle backwards"===t?a.drawPlayer(e,120*h.world.player.spriteAnimations[t].loc.length-20-s,l,30,40,h.world.player.x,h.world.player.y,h.world.player.width,h.world.player.height):a.drawPlayer(e,s,l,30,40,h.world.player.x,h.world.player.y,h.world.player.width,h.world.player.height),a.gameFrame++,a.render()}));a.buffer.canvas.height=h.world.height,a.buffer.canvas.width=h.world.width,window.addEventListener("keydown",(t=>{r.keyDownOrUp(t)})),window.addEventListener("keyup",(t=>{r.keyDownOrUp(t)})),window.addEventListener("resize",(()=>{s()})),h.world.backgroundImage.src="./platform-sidescroller-background.png",a.tiles.image.src="./tilesets/SET1_Mainlev_build.png",h.world.player.idleSpriteSheet.src="./character_spritesheets/Idle.png",h.world.player.idleBackwardsSpriteSheet.src="./character_spritesheets/Idle_mirrored.png",h.world.player.runSpriteSheet.src="./character_spritesheets/Run.png",h.world.player.runBackwardsSpriteSheet.src="./character_spritesheets/Run_mirrored.png",h.world.player.jumpSpriteSheet.src="./character_spritesheets/Jump.png",h.world.player.jumpBackwardsSpriteSheet.src="./character_spritesheets/Jump_mirrored.png",h.world.player.jumpFallTransitionSpriteSheet.src="./character_spritesheets/JumpFallInbetween.png",h.world.player.jumpFallTransitionBackwardsSpriteSheet.src="./character_spritesheets/JumpFallInbetween_mirrored.png",h.world.player.populateSpriteAnimations(),h.world.loadMaps("./tilemaps/platform-sidescroller.json").then((()=>{s(),l.start()}))})();