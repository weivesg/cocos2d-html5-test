var LevelScene = cc.Scene.extend({
    bgLayer:null,
    playerLayer:null,
    onEnter:function () {
        this._super();
        this.bgLayer = new this.BgLayer();
        this.addChild(this.bgLayer,0);
        this.bgLayer.init(1);
        this.playerLayer = new this.PlayerLayer();
        this.addChild(this.playerLayer,1);
        this.playerLayer.init(0);
    }
});

LevelScene.prototype.BgLayer = cc.Layer.extend({
    mapSprites:[],
    levelDict:null,
    bgSprites:[],
    init:function(level){
        this._super();
        var size = cc.Director.getInstance().getWinSize();
        
        var bg = cc.Sprite.create(res.background);
        bg.setAnchorPoint(0,1);
        bg.setPosition(0,size.height);
        this.addChild(bg,0);
        this.bgSprites.push(bg);
        
        var bg1 = cc.Sprite.create(res.background);
        bg1.setAnchorPoint(0,1);
        bg1.setPosition(size.width,size.height);
        this.addChild(bg1,0);
        this.bgSprites.push(bg1);
        
        var farShot = cc.Sprite.create(res.farShot);
        farShot.setAnchorPoint(0,0);
        farShot.setPosition(0,0);
        this.addChild(farShot,1);
        this.bgSprites.push(farShot);
        
        var farShot1 = cc.Sprite.create(res.farShot);
        farShot1.setAnchorPoint(0,0);
        farShot1.setPosition(size.width,0);
        this.addChild(farShot1,1);
        this.bgSprites.push(farShot1);
        
        var infantSchool = cc.Sprite.create(res.infantSchool);
        infantSchool.setAnchorPoint(0,0);
        infantSchool.setPosition(0,0);
        this.addChild(infantSchool,2);
        this.bgSprites.push(infantSchool);
        
        var juniorSchool = cc.Sprite.create(res.juniorSchool);
        juniorSchool.setAnchorPoint(0,0);
        juniorSchool.setPosition(size.width,0);
        this.addChild(juniorSchool,2);
        this.bgSprites.push(juniorSchool);
        
        var closeShot = cc.Sprite.create(res.closeShot);
        closeShot.setAnchorPoint(0,0);
        closeShot.setPosition(0,0);
        this.addChild(closeShot,3);
        this.bgSprites.push(closeShot);
        
        var closeShot1 = cc.Sprite.create(res.closeShot);
        closeShot1.setAnchorPoint(0,0);
        closeShot1.setPosition(size.width,0);
        this.addChild(closeShot1,3);
        this.bgSprites.push(closeShot1);
        
        var mapTextureCache = cc.SpriteFrameCache.getInstance();
        mapTextureCache.addSpriteFrames(res.mapTexture_plist, res.mapTexture);
        var fileUtils = cc.FileUtils.getInstance();
        this.levelDict = fileUtils.dictionaryWithContentsOfFileThreadSafe(fileUtils.fullPathForFilename(res.level1_plist));
        
        this.generateMap();
        for (var i in this.mapSprites) {
            this.addChild(this.mapSprites[i],4);
        }
        cc.AudioEngine.getInstance().playMusic(res.background_mp3,true);
        //this.scrollBg(10);
    },
    scrollBg:function(x) {
        for (var i in this.bgSprites) {
            this.bgSprites[i].setPositionX(this.bgSprites[i].getPositionX()-x);
        }
        for (var i in this.mapSprites) {
            this.mapSprites[i].setPositionX(this.mapSprites[i].getPositionX()-x);
        }
    },
    createMapSprite:function(textureID,position,offset){
        var mapSprite = cc.Sprite.createWithSpriteFrameName(textureID+".png");
        mapSprite.setAnchorPoint(0,0);
        mapSprite.setPosition((position.x+offset.x),(position.y+offset.y));
        return mapSprite;
    },
    generateMap:function() {
        var nodes = this.levelDict['Node'];
        for (var i in nodes) {
            var position = JSON.parse(nodes[i]['Position']);
            var offset = JSON.parse(nodes[i]['Offset']);
            this.mapSprites.push(this.createMapSprite(nodes[i]['TextureID'],cc.p(position[0],position[1]),cc.p(offset[0],offset[1])));
        }
    }
});

LevelScene.prototype.PlayerLayer = cc.Layer.extend({
    dice:[],
    diceIndex:0,
    diceStopped:false,
    diceSpeed:document.ccConfig.frameRate,
    diceFrames:6,
    diceRadius:105*Math.sin(45*Math.PI/180),
    playerSprite:null,
    playerTextureCache:null,
    playerPosition:0,
    bgOffset:0,
    followMode:false,
    init:function(step){
        this._super();
        this.playerTextureCache = cc.SpriteFrameCache.getInstance();
        this.playerTextureCache.addSpriteFrames(res.playerTexture_plist, res.playerTexture);
        this.playerSprite = cc.Sprite.createWithSpriteFrameName("normal.png");
        this.playerSprite.setAnchorPoint(0,0);
        this.playerSprite.setPosition(30,55);
        this.addChild(this.playerSprite);
        
        this.setMouseEnabled(true);
        
        this.dice.push(cc.Sprite.create(res.dice1));
        this.dice.push(cc.Sprite.create(res.dice2));
        this.dice.push(cc.Sprite.create(res.dice3));
        this.dice.push(cc.Sprite.create(res.dice4));
        for (var i in this.dice) {
            this.addChild(this.dice[i]);
        }
        this.diceInit();
    },
    scrollBg:function() {
        var offset = 0;
        if (this.playerSprite.getPositionX()>=512&&!this.followMode&&this.bgOffset<963) {
            this.followMode = true;
            offset = this.playerSprite.getPositionX()-512;
            this.playerSprite.runAction(cc.MoveBy.create(0,cc.p(-offset,0)));
            cc.Director.getInstance().getRunningScene().bgLayer.scrollBg(offset);
            this.bgOffset = offset;
        } else if (this.followMode&&this.bgOffset<963) {
            this.playerSprite.runAction(cc.MoveBy.create(0,cc.p(-61,0)));
            cc.Director.getInstance().getRunningScene().bgLayer.scrollBg(61);
            this.bgOffset += 61;
        } else if (this.followMode&&this.bgOffset>=963) {
            this.followMode = false;
            offset = 1024-this.bgOffset;
            this.playerSprite.runAction(cc.MoveBy.create(0,cc.p(-offset,0)));
            cc.Director.getInstance().getRunningScene().bgLayer.scrollBg(offset);
            this.bgOffset = 1024;
        }
    },
    playerMove:function(steps,duration){
        var actions = [];
        var happy =cc.CallFunc.create(this.runPlayerAction, this, "happy");
        var laugh = cc.CallFunc.create(this.runPlayerAction, this, "laugh");
        var jump = cc.CallFunc.create(this.runPlayerAction, this, "jump");
        var normal = cc.CallFunc.create(this.runPlayerAction, this, "normal");
        var surprise = cc.CallFunc.create(this.runPlayerAction, this, "surprise");
        var stand = cc.CallFunc.create(this.runPlayerAction, this, "stand");
        
        var scroll = cc.CallFunc.create(this.scrollBg, this);
        var next = cc.CallFunc.create(this.diceInit,this);
        
        var delay = cc.DelayTime.create(duration);
        var halfDelay = cc.DelayTime.create(duration/2);
        actions.push(normal);
        actions.push(delay);
        actions.push(happy);
        actions.push(delay);
        for (var i=0;i<steps;i++) {
            actions.push(cc.Spawn.create(cc.MoveBy.create(0,cc.p(61,50)),jump));
            actions.push(halfDelay);
            actions.push(cc.Spawn.create(cc.MoveBy.create(0,cc.p(61,-50)),stand));
            actions.push(halfDelay);
        }
        actions.push(surprise);
        actions.push(delay);
        actions.push(normal);
        actions.push(next);
        this.playerSprite.runAction(cc.Sequence.create(actions));
    },
    runPlayerAction:function(sender,action) {
        if (action=='surprise') {
            cc.AudioEngine.getInstance().playEffect(res.playerCry_mp3,false);
        } else if (action=='jump') {
            this.scrollBg();
            cc.AudioEngine.getInstance().playEffect(res.playerMove_mp3,false);
        } else if (action=='laugh') {
            cc.AudioEngine.getInstance().playEffect(res.playerLaugh_mp3,false);
        } else if (action=='stand') {
            this.scrollBg();
            action = 'normal';
        }
        this.playerSprite.setDisplayFrame(this.playerTextureCache.getSpriteFrame(action+".png"));
        //this.playerSprite.setAnchorPoint(0,0);
    },
    diceInit:function() {
        for (var i in this.dice) {
            this.dice[i].setVisible(false);
            this.dice[i].setAnchorPoint(0,1);
        }
        this.diceStopped = false;
        this.schedule(this.diceStart,1/this.diceSpeed,cc.RepeatForever,0);
        cc.AudioEngine.getInstance().playEffect(res.diceStart_mp3,false);
    },
    diceStart:function(){
        if (!this.diceStopped) {
            if(this.diceIndex==4*this.diceFrames) this.diceIndex=0;
            var i = Math.floor(this.diceIndex/this.diceFrames);
            var j = i+1;
            var k = i-1;
            if (j==4) j=0;
            if (k==-1) k=3;
            var angle = 90*(this.diceIndex-i*this.diceFrames)/this.diceFrames;
            if(this.dice[k].isVisible()) this.dice[k].setVisible(false);
            this.dice[i].setScaleX(Math.sin((90-angle)*Math.PI/180));
            if(!this.dice[i].isVisible()) this.dice[i].setVisible(true);
            this.dice[i].setPosition(492.5-Math.abs(this.diceRadius*Math.cos((angle-45)*Math.PI/180)),cc.Director.getInstance().getWinSize().height-150);
            this.dice[j].setScaleX(Math.cos((90-angle)*Math.PI/180));
            if(!this.dice[j].isVisible()) this.dice[j].setVisible(true);
            this.dice[j].setPosition(492.5-this.diceRadius*Math.sin((angle-45)*Math.PI/180),cc.Director.getInstance().getWinSize().height-150);
            this.diceIndex++;
        }
    },
    diceStop:function(){
        this.unschedule(this.diceLoop);
        this.diceStopped = true;
        this.diceIndex = Math.ceil(Math.random()*(4-1));
        for (var i in this.dice) {
            this.dice[i].setVisible(false);
        }
        this.dice[this.diceIndex].setScaleX(1);
        this.dice[this.diceIndex].setVisible(true);
        this.dice[this.diceIndex].setAnchorPoint(0,1);
        this.dice[this.diceIndex].setPosition(440,cc.Director.getInstance().getWinSize().height-150);
        cc.AudioEngine.getInstance().playEffect(res.diceStop_mp3,false);
        if ((this.playerPosition+this.diceIndex+2)>=cc.Director.getInstance().getRunningScene().bgLayer.mapSprites.length) {       
            this.playerMove((cc.Director.getInstance().getRunningScene().bgLayer.mapSprites.length-1-this.playerPosition),0.8);
            this.playerPosition = cc.Director.getInstance().getRunningScene().bgLayer.mapSprites.length-1;
        } else {
            this.playerPosition += this.diceIndex+1;
        this.playerMove((this.diceIndex+1),0.8);
        }
        //this.playerMove(15,0.8);
    },
    onTouchesEnded:function(touch, event){
        this.diceStop();
    },
    onMouseUp:function (event) {
        this.diceStop();
    }
});