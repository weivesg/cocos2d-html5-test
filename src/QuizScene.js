var QuizScene = cc.Scene.extend({
    bgLayer:null,
    onEnter:function () {
        this._super();
        this.bgLayer = new this.BgLayer();
        this.addChild(this.bgLayer,0);
        this.bgLayer.init(1);

    }
});

QuizScene.prototype.BgLayer = cc.LayerGradient.extend({
    examTextureCache:null,
    studentSprite:null,
    teacherSprite:null,
    studentThinkingSprite:null,
    timeUpSprite:null,
    questionBgSprite:null,
    questionIndexLabel:null,
    timerSprite:null,
    init:function(category){
        var size = cc.Director.getInstance().getWinSize();
        this._super(cc.c4b(215,184,128,255),cc.c4b(177,130,79,255),cc.p(size.width,size.height));
        
        this.examTextureCache = cc.SpriteFrameCache.getInstance();
        this.examTextureCache.addSpriteFrames(res.examTexture_plist, res.examTexture);
        
        var blackBoardSprite = cc.Sprite.createWithSpriteFrameName("blackboard_bg.png");
        blackBoardSprite.setAnchorPoint(0.5,0);
        blackBoardSprite.setPosition(size.width/2,0);
        this.addChild(blackBoardSprite,0);
        
        var recordBoardSprite = cc.Sprite.createWithSpriteFrameName("kuang_bg2.png");
        recordBoardSprite.setAnchorPoint(0.5,0.5);
        recordBoardSprite.setPosition(82.5,593.5);
        this.addChild(recordBoardSprite,0);
        
        
        this.studentSprite = cc.Sprite.createWithSpriteFrameName("S_changtai_0.png");
        this.studentSprite.setAnchorPoint(0.5,0.5);
        this.studentSprite.setPosition(90,368.5);
        this.addChild(this.studentSprite,1);

        this.teacherSprite = cc.Sprite.createWithSpriteFrameName("T_changtai_0.png");
        this.teacherSprite.setAnchorPoint(0.5,0.5);
        this.teacherSprite.setPosition(870.5,415.5);
        this.addChild(this.teacherSprite,1);

        this.timeUpSprite = cc.Sprite.createWithSpriteFrameName("timeup.png");
        this.timeUpSprite.setAnchorPoint(0.5,0.5);
        this.timeUpSprite.setPosition(465.5,451);
        this.timeUpSprite.setVisible(false);
        this.addChild(this.timeUpSprite,1);

        //display subject
        this.questionBgSprite = cc.Sprite.createWithSpriteFrameName("question_bg.png");
        this.questionBgSprite.setAnchorPoint(0.5,0.5);
        this.questionBgSprite.setVisible(false);
        this.addChild(this.questionBgSprite,1);

        this.questionIndexLabel = cc.LabelTTF.create("第一题", "fzpwjt", 55);
        this.questionIndexLabel.setAnchorPoint(0.5,0.5);
        this.questionIndexLabel.setColor(cc.c3b(51,102,0));
        this.questionIndexLabel.setVisible(false);
        this.addChild(this.questionIndexLabel,2);

        //display timer
        this.timerBgSprite = cc.Sprite.create(res.timerBarBg);
        this.timerBgSprite.setAnchorPoint(0.5,0.5);
        this.timerBgSprite.setPosition(513,602);
        this.addChild(this.timerBgSprite,2);

        var bookSpriteLeft = cc.Sprite.createWithSpriteFrameName("book1.png");
        bookSpriteLeft.setAnchorPoint(0,0);
        bookSpriteLeft.setPosition(0,0);
        this.addChild(bookSpriteLeft,2);
        
        var bookSpriteRight = cc.Sprite.createWithSpriteFrameName("book2.png");
        bookSpriteRight.setAnchorPoint(1,0);
        bookSpriteRight.setPosition(size.width,0);
        this.addChild(bookSpriteRight,2);

        //random play bg music
        var i = Math.ceil(Math.random()*(4-1));
        if(i==0) cc.AudioEngine.getInstance().playMusic(res.examBg1_mp3,true);
        if(i==1) cc.AudioEngine.getInstance().playMusic(res.examBg2_mp3,true);
        if(i==2) cc.AudioEngine.getInstance().playMusic(res.examBg3_mp3,true);
        if(i==3) cc.AudioEngine.getInstance().playMusic(res.examBg4_mp3,true);

        this.setMouseEnabled(true);

        this.prepareQA();
    },
    startQA:function(){

    },
    prepareQA:function(){
        var actions = [];
        actions.push(cc.DelayTime.create(2.5));
        actions.push(cc.CallFunc.create(this.studentStartThinking, this));
        actions.push(cc.CallFunc.create(this.teacherAskQuestion, this));
        actions.push(cc.CallFunc.create(this.startQA, this));
        this.runAction(cc.Sequence.create(actions));

        this.showStudent();
        this.showQuestionIndex();
    },
    showStudent:function(){
        //display student
        this.studentSprite.setDisplayFrame(this.examTextureCache.getSpriteFrame("S_changtai_0.png"));
        var actions = [];
        actions.push(cc.ScaleTo.create(0.2, 1.01,1.01));
        actions.push(cc.ScaleTo.create(0.2, 1,1));
        actions.push(cc.ScaleTo.create(0.2, 0.99,0.99));
        actions.push(cc.ScaleTo.create(0.2, 1,1));
        this.studentSprite.runAction(cc.RepeatForever.create(cc.Sequence.create(actions)));
    },
    studentStartThinking:function(){
        this.studentSprite.cleanup();
        var ani = cc.Animation.create();   // create the animation
        ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("sikao_0.png"));
        ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("sikao_1.png"));
        ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("sikao_2.png"));
        ani.setDelayPerUnit(0.2);   // set the delay time, in seconds
        ani.setLoops(20);  // repeat the animation 20 times,
        var action = cc.Animate.create(ani);
        this.studentSprite.runAction(action);
    },
    studentStopThinking:function(){
        this.studentSprite.cleanup();
    },
    studentCry:function(){
        this.studentSprite.setDisplayFrame(this.examTextureCache.getSpriteFrame("S_ku_0.png"));
        cc.AudioEngine.getInstance().playEffect(res.playerCry_mp3,false);
        var actions = [];
        actions.push(cc.ScaleTo.create(0.2, 1.01,1.01));
        actions.push(cc.ScaleTo.create(0.2, 1,1));
        actions.push(cc.ScaleTo.create(0.2, 0.99,0.99));
        actions.push(cc.ScaleTo.create(0.2, 1,1));
        this.studentSprite.runAction(cc.RepeatForever.create(cc.Sequence.create(actions)));
    },
    studentLaugh:function(){
        this.studentSprite.setDisplayFrame(this.examTextureCache.getSpriteFrame("S_gaoxing_0.png"));
        cc.AudioEngine.getInstance().playEffect(res.playerLaugh_mp3,false);
        var actions = [];
        actions.push(cc.ScaleTo.create(0.2, 1.01,1.01));
        actions.push(cc.ScaleTo.create(0.2, 1,1));
        actions.push(cc.ScaleTo.create(0.2, 0.99,0.99));
        actions.push(cc.ScaleTo.create(0.2, 1,1));
        this.studentSprite.runAction(cc.RepeatForever.create(cc.Sequence.create(actions)));
    },
    teacherAngry:function(){
        var ani = cc.Animation.create();   // create the animation
        ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("T_shengqi_0.png"));
        ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("T_shengqi_1.png"));
        ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("T_shengqi_2.png"));
        ani.setDelayPerUnit(0.2);   // set the delay time, in seconds
        ani.setLoops(1);  // repeat the animation 20 times,
        ani.setRestoreOriginalFrame(true);
        var action = cc.Animate.create(ani);
        this.teacherSprite.runAction(action);
    },
    teacherHappy:function(){
        this.teacherSprite.setDisplayFrame(this.examTextureCache.getSpriteFrame("T_gaoxing_0.png"));
        this.teacherSprite.setPosition(920.5,415.5);
        var actions = [];
        actions.push(cc.ScaleTo.create(0.2, 1.01,1.01));
        actions.push(cc.ScaleTo.create(0.2, 1,1));
        actions.push(cc.ScaleTo.create(0.2, 0.99,0.99));
        actions.push(cc.ScaleTo.create(0.2, 1,1));
        this.teacherSprite.runAction(cc.RepeatForever.create(cc.Sequence.create(actions)));
    },
    teacherAskQuestion:function(){
        var ani = cc.Animation.create();   // create the animation
        ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("T_changtai_0.png"));
        ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("T_changtai_1.png"));
        ani.setDelayPerUnit(0.2);   // set the delay time, in seconds
        ani.setLoops(2);  // repeat the animation 20 times,
        ani.setRestoreOriginalFrame(true);
        var action = cc.Animate.create(ani);
        this.teacherSprite.runAction(action);
    },
    timeUpStart:function(){
        this.timeUpSprite.setVisible(true);
        var ani = cc.Animation.create();   // create the animation
        for(var i=0;i<8;i++) {
            ani.addSpriteFrame(this.examTextureCache.getSpriteFrame("shijian dao_"+i+".png"));
        }
        ani.setDelayPerUnit(0.1);   // set the delay time, in seconds
        ani.setRestoreOriginalFrame(true);
        var action = cc.Animate.create(ani);
        this.timeUpSprite.runAction(cc.Sequence.create(action,cc.CallFunc.create(this.timeUpStop, this)));
    },
    timeUpStop:function(){
        this.timeUpSprite.setVisible(false);
    },
    showQuestionIndex:function(){
        //display subject
        var size = cc.Director.getInstance().getWinSize();
        var actions = [];
        actions.push(cc.MoveBy.create(0.5,cc.p(499.5,0)));
        actions.push(cc.DelayTime.create(1));
        actions.push(cc.MoveBy.create(0.5,cc.p(size.width,0)));

        this.questionBgSprite.setPosition(0,448.5);
        this.questionBgSprite.setVisible(true);
        this.questionBgSprite.runAction(cc.Sequence.create(actions));

        var actions1 = [];
        actions1.push(cc.MoveBy.create(0.5,cc.p(499.5,0)));
        actions1.push(cc.DelayTime.create(1));
        actions1.push(cc.MoveBy.create(0.5,cc.p(size.width,0)));
        this.questionIndexLabel.setPosition(0,448.5);
        this.questionIndexLabel.setVisible(true);
        this.questionIndexLabel.runAction(cc.Sequence.create(actions1));
    },
    timerStart:function(){



    },
    onTouchesEnded:function(touch, event){
        this.studentStopThinking();
    },
    onMouseUp:function (event) {
        this.studentStopThinking();
        //this.teacherAngry();
        this.teacherHappy();
        this.studentLaugh();
        this.timeUpStart();
    }

});

