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
        _popuproot:null,
        _settings:null,
        _dissolveNotice:null,
        
        _endTime:-1,
        _extraInfo:null,
        _noticeLabel:null,
        _showName:null,

        agreeSp:cc.SpriteFrame,
        rejectSp:cc.SpriteFrame,
        okspriteFrame:null,
        nospriteFrame:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.popupMgr = this;
        
        this._popuproot = cc.find("Canvas/popups");
        this._settings = cc.find("Canvas/popups/settings");
        this._dissolveNotice = cc.find("Canvas/popups/dissolve_notice");
        this._noticeLabel = this._dissolveNotice.getChildByName("info").getComponent(cc.Label);
        this._showName = this._dissolveNotice.getChildByName("name").getComponent(cc.Label);
        
        this.closeAll();
        
        this.addBtnHandler("settings/btn_back");
        this.addBtnHandler("settings/btn_sqjsfj");
        this.addBtnHandler("dissolve_notice/btn_agree");
        this.addBtnHandler("dissolve_notice/btn_reject");
        this.addBtnHandler("dissolve_notice/btn_ok");
        
        var self = this;

        cc.loader.loadRes("textures/dissolve/同意",cc.SpriteFrame,function(err,spriteFrame){
            self.okspriteFrame = spriteFrame;
        });

        cc.loader.loadRes("textures/dissolve/问号",cc.SpriteFrame,function(err,spriteFrame){
            self.nospriteFrame = spriteFrame;
        });
        
        this.node.on("dissolve_notice",function(event){
            // var data = event.detail;
            self.start();
        });
        
        this.node.on("dissolve_cancel",function(event){
            self.closeAll();
            var btn_agree = self._dissolveNotice.getChildByName("btn_agree").getComponent(cc.Button);
            var btn_reject = self._dissolveNotice.getChildByName("btn_reject").getComponent(cc.Button);
            btn_agree.interactable = true;
            btn_reject.interactable = true;
        });
    },
    
    start:function(){
        if(cc.vv.gameNetMgr.dissoveData){
            this.showDissolveNotice(cc.vv.gameNetMgr.dissoveData);
        }
    },
    
    addBtnHandler:function(btnName){
        var btn = cc.find("Canvas/popups/" + btnName);
        this.addClickEvent(btn,this.node,"PopupMgr","onBtnClicked");
    },
    
    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    onBtnClicked:function(event){
        this.closeAll();
        var btnName = event.target.name;
        if(btnName == "btn_agree"){
            cc.vv.net.send("dissolve_agree");
            var btn_agree = this._dissolveNotice.getChildByName("btn_agree").getComponent(cc.Button);
            var btn_reject = this._dissolveNotice.getChildByName("btn_reject").getComponent(cc.Button);
            btn_agree.interactable = false;
            btn_reject.interactable = false;
        }
        else if(btnName == "btn_reject"){
            cc.vv.net.send("dissolve_reject");
        }
        else if(btnName == "btn_sqjsfj"){
            var content = '是否确定解散房间？';
            var isIdle = cc.vv.gameNetMgr.numOfGames == 0;
            if(!isIdle)
            {
                // if(cc.vv.gameNetMgr.isOwner()){
                    cc.vv.net.send("dissolve_request");
                // }
                // else{
                //     cc.vv.alert.show('提示','只有房主才能解散房间');
                // }
            }
            else{
                cc.vv.net.send("exit");
            }
        }
    },
    
    closeAll:function(){
        this._popuproot.active = false;
        this._settings.active = false;
        this._dissolveNotice.active = false;
    },
    
    showSettings:function(){
        this.closeAll();
        this._popuproot.active = true;
        this._settings.active = true;
    },
    
    showDissolveRequest:function(data){
        this.closeAll();
        var shut = data.states.indexOf(false);
        if(shut !== -1 && !cc.vv.replayMgr.isReplay()){
            this._popuproot.active = true;
            this._dissolveNotice.active = true;
        }
    },

    //弹出解散框

    showDissolveNotice:function(data){
        var num = data.states.indexOf(true);
        var lastNum = data.states.lastIndexOf(true);
        if(num === lastNum){
            var leaverName = cc.vv.gameNetMgr.seats[num].name;
            if(leaverName.length > 3){
                this._showName.string = leaverName.slice(0,3) + "...";
            }
            else{
                this._showName.string = leaverName;
            }
            if(leaverName === cc.vv.userMgr.userName){
                var btn_agree = this._dissolveNotice.getChildByName("btn_agree").getComponent(cc.Button);
                var btn_reject = this._dissolveNotice.getChildByName("btn_reject").getComponent(cc.Button);
                btn_agree.interactable = false;
                btn_reject.interactable = false;
            }
        }
        this._endTime = Date.now()/1000 + data.time;
        this._extraInfo = "";
        var players = this._dissolveNotice.getChildByName('players');
        for(var i = 0; i < data.states.length; i++){
            var player = players.children[i];
            var b = data.states[i];
            var p = player.getChildByName('name').getComponent(cc.Label);
            if(cc.vv.gameNetMgr.seats[i].name.length > 3){
                p.string = cc.vv.gameNetMgr.seats[i].name.slice(0,3) + "...";
            }
            else{
                p.string = cc.vv.gameNetMgr.seats[i].name;
            }
            var state = player.getChildByName('state').getComponent(cc.Sprite);
            if(b){
                state.spriteFrame = this.okspriteFrame;
            }else{
                state.spriteFrame = this.nospriteFrame;
            }
        }
        this.showDissolveRequest(data);
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._endTime > 0){
            var lastTime = this._endTime - Date.now() / 1000;
            if(lastTime < 0){
                this._endTime = -1;
                this._dissolveNotice.active = false;
            }
            
            var m = Math.floor(lastTime / 60);
            var s = Math.ceil(lastTime - m*60);
            
            var str = "";
            if(m > 0){
                str += m + "分"; 
            }
            
            this._noticeLabel.string = str + s + "秒后房间将自动解散" + this._extraInfo;
        }
    },
});
