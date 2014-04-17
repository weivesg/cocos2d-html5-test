/**
 * Created by okapi on 25/2/14.
 */
var StartScene = cc.Scene.extend({
    bgLayer:null,
    onEnter:function () {
        this._super();
        this.bgLayer = new this.BgLayer();
        this.addChild(this.bgLayer,0);
        this.bgLayer.init(1);

    }
});

StartScene.prototype.BgLayer = cc.LayerGradient.extend({


});

StartScene.preload = function (resources, selector, target) {

    this._instance.initWithResources(resources, selector, target);

    var director = cc.Director.getInstance();
    if (director.getRunningScene()) {
        director.replaceScene(this._instance);
    } else {
        director.runWithScene(this._instance);
    }

    return this._instance;
};