var Net = require("Net")
var Global = require("Global")
cc.Class({
    extends: cc.Component,

    properties: {
        lblName:cc.Label,
        lblMoney:cc.Label,
        lblGems:cc.Label,
        lblID:cc.Label,
        lblNotice:cc.Label,
        joinGameWin:cc.Node,
        createRoomWin:cc.Node,
        settingsWin:cc.Node,
        btnJoinGame:cc.Node,
        btnReturnGame:cc.Node,
        sprHeadImg:cc.Sprite,
        shareWin:cc.Node,
        yaoqingmaWin:cc.Node,
        shopWin:cc.Node,
        gonggaoWin:cc.Node,
        jifenrenwuWin:cc.Node,
        bindphoneWin:cc.Node
    },//20161227
    
    initNetHandlers:function(){
        var self = this;
    },
    
    onShareFriendliness:function(){
        cc.vv.anysdkMgr.share("巢州麻将","巢州麻将是一款休闲类棋牌游戏平台，时尚简约，是巢湖最具特色风格的本土文化休闲手游。经典不容错过。巢州麻将，有锅子，圈子型两种房间，包括增志子，晃五筒等8种可选玩法。",false);
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(ret.data.coins != null && cc.vv.userMgr.coins !== ret.data.coins){
                    cc.vv.userMgr.coins = ret.data.coins;
                    self.lblMoney.string = ret.data.coins;
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_user_data_at_present",data,onGet.bind(this));
    },
    onShareFriend:function(){
        cc.vv.anysdkMgr.share("巢州麻将","巢州麻将是一款休闲类棋牌游戏平台，时尚简约，是巢湖最具特色风格的本土文化休闲手游。经典不容错过。巢州麻将，有锅子，圈子型两种房间，包括增志子，晃五筒等8种可选玩法。",true);
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
        this.initLabels();
        
        // if(cc.vv.gameNetMgr.roomId == null){
        //     this.btnJoinGame.active = true;
        //     this.btnReturnGame.active = false;
        // }
        // else{
        //     this.btnJoinGame.active = false;
        //     this.btnReturnGame.active = true;
        // }
        this.btnJoinGame.active = true;
        
        //var params = cc.vv.args;
        var roomId = cc.vv.userMgr.oldRoomId;
        if( roomId != null){
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId);
        }
        
        cc.vv.palyerSex = 0;
        var imgLoader = this.sprHeadImg.node.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);
        cc.vv.utils.addClickEvent(this.sprHeadImg.node,this.node,"Hall","onBtnClicked");
        
        
        this.addComponent("UserInfoShow");
        
        this.initButtonHandler("Canvas/right_bottom/btn_shezhi");
        this.initButtonHandler("Canvas/right_bottom/btn_share");
        this.initButtonHandler("Canvas/hallBg/bottom_bar/btn_yaoqingma");
        this.initButtonHandler("Canvas/hallBg/bottom_bar/btn_jifenrenwu");
        this.initButtonHandler("Canvas/hallBg/bottom_bar/btn_shop");
        this.initButtonHandler("Canvas/hallBg/bottom_bar/btn_bindphone");
        this.initButtonHandler("Canvas/right_bottom/btn_gonggao");
        this.shareWin.addComponent('OnBack');
        this.yaoqingmaWin.addComponent('OnBack');
        this.shopWin.addComponent('OnBack');
        this.gonggaoWin.addComponent('OnBack');
        this.jifenrenwuWin.addComponent('OnBack');
        this.bindphoneWin.addComponent('OnBack');

        if(!cc.vv.userMgr.notice){
            cc.vv.userMgr.notice = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        if(!cc.vv.userMgr.gemstip){
            cc.vv.userMgr.gemstip = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        this.lblNotice.string = cc.vv.userMgr.notice.msg;
        
        this.refreshInfo();
        this.refreshNotice();
        this.refreshGemsTip();
        this.gameNotice();
        this.zhaomuTipsNotice();
        
        cc.vv.audioMgr.playBGM("hall.mp3");
        cc.vv.utils.addEscEvent(this.node);

        this.pushInfo();
        var createRoom = this.node.getChildByName("CreateRoom1").getComponent("CreateRoom");
        createRoom.numberOfGames();

        cc.vv.gameNetMgr.dataEventHandler = this.node;
        var self = this;
        this.node.on('login_finished', function () {
            // var load = self.node.getChildByName("loading");
            // cc.loader.onProgress = (completedCount,totalCount,item) => {
            //     var progress = (100 * completedCount / totalCount).toFixed();
            //     load.active = true;
            //     var yidalipao = load.getChildByName("yidalipao").getComponent(cc.Sprite);
            //     var label = load.getChildByName("label").getComponent(cc.Label);
            //     yidalipao.fillRange = progress / 100;
            //     label.string = progress + "%";
            // }
            // cc.director.preloadScene("mjgame",() => {
            //     cc.loader.onProgress = null;
                cc.director.loadScene("mjgame",() => {
                    cc.vv.net.ping();
                    cc.vv.wc.hide();
                });
        //     });
        });
    },

    moreGame:function(){
        cc.vv.alertLabel.showOneTime('敬请期待...');
    },
    
    refreshInfo:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(ret.gems != null){
                    this.lblGems.string = ret.gems;
                    console.log(ret);
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_user_status",data,onGet.bind(this));
    },
    
    refreshGemsTip:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                cc.vv.userMgr.gemstip.version = ret.version;
                cc.vv.userMgr.gemstip.msg = ret.msg.replace("<newline>","\n");
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"fkgm",
            version:cc.vv.userMgr.gemstip.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
    
    refreshNotice:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                cc.vv.userMgr.notice.version = ret.version;
                cc.vv.userMgr.notice.msg = ret.msg;
                this.lblNotice.string = ret.msg;
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"notice",
            version:cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
    
    initButtonHandler:function(btnPath){
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn,this.node,"Hall","onBtnClicked");        
    },

    initLabels:function(){
        console.log("玩家昵称是:     ",cc.vv.userMgr.userName);
        console.log("cc.vv是:     ",cc.vv.userMgr);
        // if(cc.vv.userMgr.userName.length > 3){
            // this.lblName.string = cc.vv.userMgr.userName.slice(0,3) + "...";
        // }
        // else{
            this.lblName.string = cc.vv.userMgr.userName;
        // }
        this.lblMoney.string = cc.vv.userMgr.coins;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
    },
    
    onBtnClicked:function(event){
        if(event.target.name == "btn_shezhi"){
            this.settingsWin.active = true;
        }
        else if(event.target.name === 'btn_share'){
            this.shareWin.active = true;
        }
        else if(event.target.name === 'btn_gonggao'){
            this.gonggaoWin.active = true;
        }
        else if(event.target.name === 'btn_yaoqingma'){
            this.yaoqingmaWin.active = true;
            if(cc.vv.userMgr.parentid !== null){
                this.yaoqingmaWin.getChildByName('bind').active = false;
                this.yaoqingmaWin.getChildByName('EditBox').active = false;
                this.yaoqingmaWin.getChildByName('sprite').active = false;
                this.yaoqingmaWin.getChildByName('label').getComponent(cc.Label).string = "邀请码已绑定！";
            }
        }
        else if(event.target.name === 'btn_shop'){
            //this.shopWin.active = true;
        }
        else if(event.target.name === 'btn_jifenrenwu'){
            this.jifenrenwuWin.active = true;
        }
        else if(event.target.name === 'btn_bindphone'){
            // cc.vv.alertLabel.showOneTime('功能未开放...');
            this.bindphoneWin.active = true;
            if(cc.vv.userMgr.tel !== null){
                this.bindphoneWin.getChildByName('bind').active = false;
                this.bindphoneWin.getChildByName('EditBox').active = false;
                this.bindphoneWin.getChildByName('sprite').active = false;
                this.bindphoneWin.getChildByName('label').getComponent(cc.Label).string = "手机号已绑定！";
            }
        }
        else if(event.target.name == "head"){
            cc.vv.userinfoShow.show(cc.vv.userMgr.userName,cc.vv.userMgr.userId,this.sprHeadImg,cc.vv.userMgr.sex,cc.vv.userMgr.ip);
        }
    },
    
    gameNotice:function(){
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                // console.log(ret.msg);
                cc.find("Canvas/gonggao/detail").getComponent(cc.Label).string = ret.msg;
            }
        };
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"gonggao",
            version:cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },

    zhaomuTipsNotice:function(){
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                // console.log(ret.msg);
                cc.find("Canvas/zhaomuTips/content").getComponent(cc.Label).string = ret.msg;
            }
        };
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"guanzhu",
            version:cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },

    onJoinGameClicked:function(){
        this.joinGameWin.active = true;
    },
    
    onReturnGameClicked:function(){
        cc.vv.wc.show('正在返回游戏房间');
        cc.director.loadScene("mjgame");
    },
    
    onBtnAddGemsClicked:function(){
        cc.vv.alert.show("提示",cc.vv.userMgr.gemstip.msg,function(){
            this.onBtnTaobaoClicked();
        }.bind(this));
        this.refreshInfo();
    },
    
    onCreateRoomClicked:function(){
        if(cc.vv.gameNetMgr.roomId != null){
            cc.vv.alert.show("提示","房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        // console.log("onCreateRoomClicked");
        this.createRoomWin.active = true;
    },
    
    onBtnTaobaoClicked:function(){
        cc.sys.openURL('https://10086.taobao.com/');
    },

    zhaoMu:function(){
        //cc.vv.alert.show("提示","请联系微信客服\n微信号：MrLizs");
        cc.find("Canvas/zhaomuTips").active = true;
    },

    closeZhaoMu:function(){
        cc.find("Canvas/zhaomuTips").active = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var x = this.lblNotice.node.x;
        x -= dt*100;
        if(x + this.lblNotice.node.width < -1000){
            x = 500;
        }
        this.lblNotice.node.x = x;
        
        if(cc.vv && cc.vv.userMgr.roomData != null){
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
            cc.vv.userMgr.roomData = null;
        }
    },

    pushInfo:function () {
        let bg = cc.find('Canvas/hallBg/bar/maskNode/bg');
        let info = cc.find('Canvas/hallBg/bar/maskNode/info');
        let beginPos = cc.p(bg.x+bg.getContentSize().width/2+info.getContentSize().width/2, bg.y);
        info.setPosition(beginPos);

        let endPos = cc.p((bg.x - bg.getContentSize().width/2 - info.getContentSize().width/2), bg.y);

        let act1 = cc.moveTo(15, endPos);
        let act2 = cc.delayTime(1);
        let act3 = cc.callFunc(function(){
            info.setPosition(beginPos);
        },this);
        info.runAction(cc.repeatForever(cc.sequence(act1,act2,act3)));
        
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                info.getComponent(cc.Label).string = ret.msg;
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"marqueeMessage",
            version:cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
});
