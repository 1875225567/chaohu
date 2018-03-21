cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _nextPlayTime:1,
        _replay:null,
        _isPlaying:false,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this._replay = cc.find("Canvas/replay");
        this._replay.active = cc.vv.replayMgr.isReplay();
        var pause = this._replay.getChildByName("btn_pause");
        pause.active = false;
    },
    
    onBtnPauseClicked:function(){
        this._isPlaying = false;
        var pause = this._replay.getChildByName("btn_pause");
        var play = this._replay.getChildByName("btn_play");
        pause.active = false;
        play.active = true;
    },
    
    onBtnPlayClicked:function(){
        this._isPlaying = true;
        var pause = this._replay.getChildByName("btn_pause");
        var play = this._replay.getChildByName("btn_play");
        play.active = false;
        pause.active = true;
    },
    
    onBtnBackClicked:function(){
        cc.vv.replayMgr.clear();
        cc.vv.gameNetMgr.reset();
        cc.vv.gameNetMgr.roomId = null;
        cc.vv.wc.show('正在返回游戏大厅');
        cc.director.loadScene("hall");
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(cc.vv){
            if(this._isPlaying && cc.vv.replayMgr.isReplay() == true && this._nextPlayTime > 0){
                this._nextPlayTime -= dt;
                if(this._nextPlayTime < 0){
                    this._nextPlayTime = cc.vv.replayMgr.takeAction();
                }
            }
        }
    },
});