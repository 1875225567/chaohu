cc.Class({
    extends: cc.Component,

    properties: {        
        gameRoot:{
            default:null,
            type:cc.Node
        },
        
        prepareRoot:{
            default:null,
            type:cc.Node   
        },
        
        _myMJArr:[],
        _options:null,
        _selectedMJ:null,
        _chupaiSprite:[],
        _mjcount:null,
        _gamecount:null,
        _hupaiTips:[],
        _hupaiLists:[],
        _playEfxs:[],
        _opts:[],
        _tingdata:null,//zyh
        _alreadyTing:null,

        greenBg:cc.SpriteFrame,
        redBg:cc.SpriteFrame
    },
    
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
        cc.vv.MJGame = this; 
        cc.log("in inload");

        //this.addComponent("NoticeTip");
        this.addComponent("GameOver");
        this.addComponent("GameResult");
        // this.addComponent("ShowZengZhiZi");
        this.addComponent("PengGangs");
        //this.addComponent("MJRoom");
        this.addComponent("TimePointer");
        // this.addComponent("Chat");
        this.addComponent("Folds");
        this.addComponent("ReplayCtrl");
        this.addComponent("PopupMgr");
        this.addComponent("HuanSanZhang");
        this.addComponent("ReConnect");
        this.addComponent("Voice");
        this.addComponent("UserInfoShow");
        //this.addComponent("Status");

        this.settngBG();
        this.initView();
        this.initEventHandlers();
        
        this.gameRoot.active = false;
        this.prepareRoot.active = true;
        //this.initWanfaLabel();
        this.onGameBeign();
        cc.vv.audioMgr.playBGM("game.mp3");
        //cc.vv.utils.addEscEvent(this.node);
        cc.vv.utils.addClickEvent(cc.find('Canvas/btn_settings'),this.node,'MJGame','onBtnClicked');
        this._tingdata = {};//zyh
        this._alreadyTing = [];
    },

    onBtnClicked:function (event) {
        if(event.target.name === 'btn_settings'){
            cc.find('Canvas/popups').active = true;
            var set = cc.find('Canvas/popups/settings');
            set.active = true;
        }
    },

    selectBgCallback:function (event) {
        var node = event.target.parent;
        if(node.name === 'green'){
            this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.greenBg;
            var color = "green";
        }else if(node.name === 'red'){
            this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.redBg;
            var color = "red";
        }
        var tableclothData = JSON.parse(cc.sys.localStorage.getItem('tableclothData'));
        if(tableclothData.color !== color){
            tableclothData.color = color;
            cc.sys.localStorage.setItem('tableclothData', JSON.stringify(tableclothData));
        }
    },

    settngBG:function(){
        var tableclothData = JSON.parse(cc.sys.localStorage.getItem('tableclothData'));
        if(!tableclothData.newRoom){
            if(tableclothData.color === "red"){
                this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.redBg;
            }
            else if(tableclothData.color === "green"){
                this.node.getChildByName('bg').getComponent(cc.Sprite).spriteFrame = this.greenBg;
            }
        }
        else{
            tableclothData.newRoom = false;
            cc.sys.localStorage.setItem('tableclothData', JSON.stringify(tableclothData));
        }
    },

    initView:function(){
        
        //搜索需要的子节点
        var gameChild = this.node.getChildByName("game");

        //剩余牌数
        this._mjcount = cc.find('Canvas/GameInfo/mjCount/num').getComponent(cc.Label);
        this._mjcount.string = cc.vv.gameNetMgr.numOfMJ;

        var myselfChild = gameChild.getChildByName("myself");
        var myholds = myselfChild.getChildByName("holds");

        this._chupaidrag = gameChild.getChildByName('chupaidrag');
        this._chupaidrag.active = false;
        
        for(var i = 0; i < myholds.children.length; ++i){
            var sprite = myholds.children[i].getComponent(cc.Sprite);
            this._myMJArr.push(sprite);
            sprite.spriteFrame = null;
            this.initDragStuffs(sprite.node);
        }
        
        var realwidth = cc.director.getVisibleSize().width;
        myholds.scaleX *= realwidth/1280;
        myholds.scaleY *= realwidth/1280;
        
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            var side = sides[i];
            
            var sideChild = gameChild.getChildByName(side);
            this._hupaiTips.push(sideChild.getChildByName("HuPai"));
            this._hupaiLists.push(sideChild.getChildByName("hupailist"));
            this._playEfxs.push(sideChild.getChildByName("play_efx").getComponent(cc.Animation));
            this._chupaiSprite.push(sideChild.getChildByName("ChuPai").children[0].getComponent(cc.Sprite));
            
            var opt = sideChild.getChildByName("opt");
            opt.active = false;
            var sprite = opt.getChildByName("pai").getComponent(cc.Sprite);
            var data = {
                node:opt,
                sprite:sprite
            };
            this._opts.push(data);
        }
        
        var opts = gameChild.getChildByName("ops");
        this._options = opts;
        this.hideOptions();
        this.hideChupai();

        //游戏类型
        if(cc.vv.gameNetMgr.conf.type == 1){
            var juNum = cc.vv.gameNetMgr.maxNumOfGames;
            // var daNum = cc.vv.gameNetMgr.numOfGames / 4;
            // daNum = Math.ceil(daNum);
            var daNum = cc.vv.gameNetMgr.numOfGames;
            if(daNum < 1) daNum = 1;
            this._gamecount = cc.find('Canvas/GameInfo/jushu/num').getComponent(cc.Label);
            this._gamecount.string = daNum + "/" + juNum;
            cc.find('Canvas/GameInfo/guozi').active = false;
        }
        else{
            var difen = cc.vv.gameNetMgr.conf.difen
            if(difen){
                cc.find('Canvas/GameInfo/guozi/num').getComponent(cc.Label).string = difen;
            }
            else{
                cc.find('Canvas/GameInfo/guozi/num').getComponent(cc.Label).string = "0";
            }
            cc.find('Canvas/GameInfo/jushu').active = false;
            //cc.find('Canvas/GameInfo/mjCount').x = -120;
        }
    },

    start:function(){
        this.checkIp();
    },

    checkIp:function(){
        if(cc.vv.gameNetMgr.gamestate == ''){
            return;
        }
        var selfData = cc.vv.gameNetMgr.getSelfData();
        var ipMap = {};
        for(var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i){
            var seatData = cc.vv.gameNetMgr.seats[i];
            if(seatData.ip != null && seatData.userid > 0 && seatData != selfData){
                if(ipMap[seatData.ip]){
                    ipMap[seatData.ip].push(seatData.name);
                }
                else{
                    ipMap[seatData.ip] = [seatData.name];
                }
            }
        }
        
        for(var k in ipMap){
            var d = ipMap[k];
            if(d.length >= 2){
                var str = "" + d.join("\n") + "\n\n正在使用同一IP地址进行游戏!";
                cc.vv.alert.show("注意",str);
                return; 
            }
        }
    },

    initDragStuffs: function (node) {
        //break if it's not my turn.
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("cc.Node.EventType.TOUCH_START");
            if (cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) {
                return;
            }
            node.interactable = node.getComponent(cc.Button).interactable;
            if (!node.interactable) {
                return;
            }
            node.opacity = 255;
            this._chupaidrag.active = false;
            this.showAwaitHu(node.mjId);
            this._chupaidrag.getComponent(cc.Sprite).spriteFrame = node.getComponent(cc.Sprite).spriteFrame;
            this._chupaidrag.x = event.getLocationX() - cc.director.getVisibleSize().width / 2;
            this._chupaidrag.y = event.getLocationY() - cc.director.getVisibleSize().height / 2;
        }.bind(this));

        node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log("cc.Node.EventType.TOUCH_MOVE");
            if (cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) {
                return;
            }
            if (!node.interactable) {
                return;
            }
            if (Math.abs(event.getDeltaX()) + Math.abs(event.getDeltaY()) < 0.5) {
                return;
            }
            this._chupaidrag.active = true;
            node.opacity = 150;
            this._chupaidrag.opacity = 255;
            this._chupaidrag.scaleX = 1;
            this._chupaidrag.scaleY = 1;
            this._chupaidrag.x = event.getLocationX() - cc.director.getVisibleSize().width / 2;
            this._chupaidrag.y = event.getLocationY() - cc.director.getVisibleSize().height / 2;
            node.y = 0;
        }.bind(this));

        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) {
                return;
            }
            if (!node.interactable) {
                return;
            }
            console.log("cc.Node.EventType.TOUCH_END");
            this._chupaidrag.active = false;
            node.opacity = 255;
            if (event.getLocationY() >= 200) {
                this.shoot(node.mjId);
            }
        }.bind(this));

        node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if (cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) {
                return;
            }
            if (!node.interactable) {
                return;
            }
            console.log("cc.Node.EventType.TOUCH_CANCEL");
            this._chupaidrag.active = false;
            node.opacity = 255;
            if (event.getLocationY() >= 200) {
                this.shoot(node.mjId);
            } else if (event.getLocationY() >= 150) {
                //this._huadongtishi.active = true;
                //this._huadongtishi.getComponent(cc.Animation).play('huadongtishi');
            }
        }.bind(this));
    },
    
    hideChupai:function(){
        for(var i = 0; i < this._chupaiSprite.length; ++i){
            this._chupaiSprite[i].node.active = false;
        }        
    },
    
    initEventHandlers:function(){
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        
        //初始化事件监听器
        var self = this;
        
        this.node.on('game_holds',function(data){
           self.initMahjongs();
           self.checkQueYiMen();
        });
        
        this.node.on('game_begin',function(data){
            self.onGameBeign();
            //第一把开局，要提示
            if(cc.vv.gameNetMgr.numOfGames == 1){
                self.checkIp();
            }
        });
        
        this.node.on('check_ip',function(data){
            self.checkIp();
        });
        
        this.node.on('game_sync',function(data){
            if(cc.vv.gameNetMgr.gamestate == "zengzhizi"){
                var zzz = cc.find('Canvas/zengzhizi').getComponent('ShowZengZhiZi');
                zzz.show();
            }
            self.onGameBeign();
            self.checkIp();
        });
        
        this.node.on('game_chupai',function(data){
            data = data.detail;
            self.hideChupai();
            self.checkQueYiMen();
            if(data.last != cc.vv.gameNetMgr.seatIndex){
                self.initMopai(data.last,null);   
            }
            if(!cc.vv.replayMgr.isReplay() && data.turn != cc.vv.gameNetMgr.seatIndex){
                self.initMopai(data.turn,-1);
            }
        });
        
        this.node.on('game_mopai',function(data){
            self.hideChupai();
            data = data.detail;
            var pai = data.pai;
            var btn_ting = self.node.getChildByName("btn_ting");
            if(btn_ting.active) btn_ting.active = false;
            var awaitHu = self.node.getChildByName("awaitHu");
            var close = awaitHu.getChildByName("close");
            close.off("touchstart",self.closeTing);
            awaitHu.active = false;
            var arrowData = JSON.parse(cc.sys.localStorage.getItem("arrow"));
            if(arrowData.ting) arrowData.ting = false;
            cc.sys.localStorage.setItem("arrow",JSON.stringify(arrowData));
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(data.seatIndex);
            if(localIndex == 0){
                var index = 13;
                var sprite = self._myMJArr[index];
                self.setSpriteFrameByMJID("M_",sprite,pai,index);
                sprite.node.mjId = pai;
                self.hintOperation();//zyh
                self.inithint();//zyh                         
            }
            else if(cc.vv.replayMgr.isReplay()){
                self.initMopai(data.seatIndex,pai);
            }
        });
        
        this.node.on('game_action',function(data){
            self.showAction(data.detail);
        });
        
        this.node.on('hupai',function(data){
            var data = data.detail;
            //如果不是玩家自己，则将玩家的牌都放倒
            var seatIndex = data.seatindex;
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
            var hupai = self._hupaiTips[localIndex];
            hupai.active = true;
            
            if(localIndex == 0){
                self.hideOptions();
            }
            var seatData = cc.vv.gameNetMgr.seats[seatIndex];
            seatData.hued = true;
            if(cc.vv.gameNetMgr.conf.type == 0){
                hupai.getChildByName("sprHu").active = true;
                hupai.getChildByName("sprZimo").active = false;
                self.initHupai(localIndex,data.hupai);
                if(data.iszimo){
                    if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                        seatData.holds.pop();
                        self.initMahjongs();                
                    }
                    else{
                        self.initOtherMahjongs(seatData);
                    }
                } 
            }
            else{
                hupai.getChildByName("sprHu").active = !data.iszimo;
                hupai.getChildByName("sprZimo").active = data.iszimo;

                // if(cc.vv.replayMgr.isReplay() && !hupai.getChildByName("sprHu").active && !hupai.getChildByName("sprZimo").active){
                //     hupai.getChildByName("sprZimo").active = true;
                // }
                
                if(!(data.iszimo && localIndex==0))
                {
                    //if(cc.vv.replayMgr.isReplay() == false && localIndex != 0){
                    //    self.initEmptySprites(seatIndex);                
                    //}
                    self.initMopai(seatIndex,data.hupai);
                }                                         
            }
            
            if(cc.vv.replayMgr.isReplay() == true && cc.vv.gameNetMgr.conf.type != 0){
                var opt = self._opts[localIndex];
                opt.node.active = true;
                opt.sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",data.hupai);
            }

            var voice = cc.sys.localStorage.getItem("voice");
            if(data.iszimo){
                self.playEfx(localIndex,"play_zimo");
                if(data.yadang && voice !== "pu"){
                    self.addSuffix(seatIndex,"ziya");
                }
                else{
                    self.addSuffix(seatIndex,"zimo");
                }
            }
            else{
                self.playEfx(localIndex,"play_hu");
                if(voice !== "pu"){
                    var rand1 = Math.floor(Math.random() * 2 + 1);
                    if(data.yadang){
                        self.addSuffix(seatIndex,"yadang_" + rand1);
                    }
                    else{
                        self.addSuffix(seatIndex,"hu_" + rand1);
                    }
                }
                else{
                    self.addSuffix(seatIndex,"hu");
                }
            }
            var awaitHu = self.node.getChildByName("awaitHu");
            var btn_ting = self.node.getChildByName("btn_ting");
            awaitHu.active = false;
            btn_ting.active = false;
            //cc.vv.audioMgr.playSFX("nv/hu.mp3");
        });
        
        this.node.on('mj_count',function(data){
            self._mjcount.string = cc.vv.gameNetMgr.numOfMJ;
        });
        
        this.node.on('game_num',function(data){
            if(self._gamecount){
                var juNum = cc.vv.gameNetMgr.maxNumOfGames;
                // var daNum = cc.vv.gameNetMgr.numOfGames / 4;
                // daNum = Math.ceil(daNum);
                var daNum = cc.vv.gameNetMgr.numOfGames;
                if(daNum < 1) daNum = 1;
                self._gamecount.string = daNum + "/" + juNum;
            }
        });
        
        this.node.on('game_over',function(data){
            self.gameRoot.active = false;
            self.prepareRoot.active = true;
            var arrowData = JSON.parse(cc.sys.localStorage.getItem("arrow"));
            arrowData.ting = false;
            cc.sys.localStorage.setItem("arrow",JSON.stringify(arrowData));
        });
        
        
        this.node.on('game_chupai_notify',function(data){
            self.hideChupai();
            // var seatData = data.detail.seatData;
            var seatData = cc.vv.gameNetMgr.seats[data.detail.seatIndex];
            var idx = null;
            if(seatData.holds){
                idx = seatData.holds.indexOf(data.detail.pai);
            }
            //如果是自己，则刷新手牌
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                // self.doChuPaiAction(seatData,idx);
                if(seatData.holds){
                    seatData.holds.splice(idx,1);
                }
                self.initMahjongs();
            }
            else{
                if(seatData.holds){
                    seatData.holds.splice(idx,1);
                }
                self.initOtherMahjongs(seatData);
            }
            self.showChupai();
            cc.log('打出的牌是:' + data.detail.pai);
            var audioUrl = cc.vv.mahjongmgr.getAudioURLByMJID(data.detail.seatIndex,data.detail.pai);
            cc.vv.audioMgr.playSFX(audioUrl);
        });
        
        this.node.on('guo_notify',function(data){
            self.hideChupai();
            self.hideOptions();
            var seatData = data.detail;
            //如果是自己，则刷新手牌
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                self.initMahjongs();                
            }
            cc.vv.audioMgr.playSFX("give.mp3");
            self.showHuangPai(false,4);
        });
        
        this.node.on('guo_result',function(data){
            self.hideOptions();
        });
        
        this.node.on('game_dingque_finish',function(data){
            self.initMahjongs();
        });
        
        this.node.on('peng_notify',function(data){    
            self.hideChupai();
            
            var seatData = data.detail;
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                self.initMahjongs();
            }
            else{
                self.initOtherMahjongs(seatData);
            }
            var localIndex = self.getLocalIndex(seatData.seatindex);
            self.playEfx(localIndex,"play_peng");
            // cc.vv.audioMgr.playSFX("nv/peng.mp3");
            self.addSuffix(seatData.seatindex,"peng");
            self.hideOptions();
        });

        this.node.on('huang_notify',function(data){
            console.log("huang_notify");
            // self.hideChupai();
            var seatData = data.detail;
            console.log("晃：",seatData);
            self.showHuangPai(true,4);
        });
        
        this.node.on('gang_notify',function(data){
            self.hideChupai();
            var data = data.detail;
            var seatData = data.seatData;
            var gangtype = data.gangtype;
            if(seatData.seatindex == cc.vv.gameNetMgr.seatIndex){
                self.initMahjongs();                
            }
            else{
                self.initOtherMahjongs(seatData);
            }
            
            // var localIndex = self.getLocalIndex(seatData.seatindex);
            // if(gangtype == "wangang"){
                // self.playEfx(localIndex,"play_guafeng");
                // cc.vv.audioMgr.playSFX("guafeng.mp3");
            // }
            // else{
                // self.playEfx(localIndex,"play_xiayu");
                // cc.vv.audioMgr.playSFX("rain.mp3");
            // }
        });
        
        this.node.on("hangang_notify",function(data){
            var data = data.detail;
            var localIndex = self.getLocalIndex(data);
            self.playEfx(localIndex,"play_gang");
            //cc.vv.audioMgr.playSFX("nv/gang.mp3");
            self.addSuffix(data,"gang");
            self.hideOptions();
        });

        this.node.on('login_result', function () {
            self.gameRoot.active = false;
            self.prepareRoot.active = true;
            console.log('login_result');
        });

        this.node.on('game_zengzhizi',function(data){
            setTimeout(function() {
                cc.find("Canvas/zengzhizi").active = true;
            }, 500);
        });
        
        this.node.on('game_zengzhizi_notify',function(data){
            
        });
        
        this.node.on('game_zengzhizi_finish',function(data){
            //console.log(data);
        });
    },
    
    showChupai:function(){
        var pai = cc.vv.gameNetMgr.chupai; 
        if( pai >= 0 ){
            //
            var localIndex = this.getLocalIndex(cc.vv.gameNetMgr.turn);
            var sprite = this._chupaiSprite[localIndex];
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
            sprite.node.active = true;   
        }
    },
    
    hideOptions:function(data){
        this._options.active = false;
        for(var i = 0; i < this._options.childrenCount; ++i){
            var child = this._options.children[i]; 
            if(child.name == "op"){
                child.active = false;
                child.getChildByName("btnPeng").active = false;
                child.getChildByName("btnGang").active = false;
                child.getChildByName("btnHu").active = false;
                child.getChildByName("btnHuang").active = false;
            }
        }
    },
    
    showAction:function(data){
        if(this._options.active){
            this.hideOptions();
        }
        if(data && (data.hu || data.gang || data.peng || data.huang)){
            var awaitHu = this.node.getChildByName("awaitHu");
            if(awaitHu.active) awaitHu.active = false;
            this._options.active = true;
            var btn_ting = this.node.getChildByName("btn_ting");
            if(btn_ting.active) btn_ting.active = false;
            var awaitHu = this.node.getChildByName("awaitHu");
            var close = awaitHu.getChildByName("close");
            close.off("touchstart",this.closeTing);
            awaitHu.active = false;
            if(data.peng){
                this.addOption("btnPeng",data.pai);
            }

            if(data.gang){
                for(var i = 0; i < data.gangpai.length;++i){
                    var gp = data.gangpai[i];
                    this.addOption("btnGang",gp);
                }
            }

            if(data.huang){
                this.addOption("btnHuang",data.pai);
            }

            if(data.hu){
                this.addOption("btnHu",data.pai);
                this.clearArrow();
            }
        }
    },

    addOption:function(btnName,pai){
        for(var i = 0; i < this._options.childrenCount; ++i){
            var child = this._options.children[i]; 
            if(child.name == "op" && child.active == false){
                child.active = true;
                var sprite = child.getChildByName("opTarget").getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
                var btn = child.getChildByName(btnName); 
                btn.active = true;
                btn.pai = pai;
                return;
            }
        }
    },
    
    //房间顶部显示游戏玩法
    initWanfaLabel:function(){
         var wanfa = cc.find("Canvas/infobar/wanfa").getComponent(cc.Label);
         wanfa.string = cc.vv.gameNetMgr.getWanfa();
    },
    
    initHupai:function(localIndex,pai){
        if(cc.vv.gameNetMgr.conf.type == 1){
            var hupailist = this._hupaiLists[localIndex];
            for(var i = 0; i < hupailist.children.length; ++i){
                var hupainode = hupailist.children[i];
                if(hupainode.active == false){
                    var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
                    hupainode.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,pai);
                    hupainode.active = true;
                    break;
                }
            }
        }
    },
    
    playEfx:function(index,name){
        this._playEfxs[index].node.active = true;
        this._playEfxs[index].play(name);
    },

    addMagicPai:function(paiNode,pai){
        if(cc.vv.gameNetMgr.magicpai === pai && cc.vv.gameNetMgr.conf.wanfa === 2){
            if(!paiNode.getChildByName('laizi')){
                cc.loader.loadRes('prefabs/laizi',function(err,prefab){
                    var laizi = cc.instantiate(prefab);
                    paiNode.addChild(laizi);
                    // console.log(pai + "已经添加赖子标志。");
                });
            }
        }
        else{
            if(paiNode.getChildByName('laizi')){
                // paiNode.removeChild(paiNode.getChildByName('laizi'));
                for(var w = 0, max = paiNode.childrenCount; w < max; w += 1){
                    var child = paiNode.children[w];
                    if(child.name !== "arrow"){
                        paiNode.removeChild(child);
                        w -= 1;
                    }
                }
                // paiNode.removeAllChildren();
            }
        }
    },
    
    showMagicPai:function(){
        if(cc.vv.gameNetMgr.magicpai != -1 && cc.vv.gameNetMgr.conf.wanfa == 2){
            this.gameRoot.getChildByName("magicPai").active = true;
            var magicpaiNode = cc.find("magicPai/pai",this.gameRoot);
            var sprite = magicpaiNode.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",cc.vv.gameNetMgr.magicpai);
        }
        else{
            this.gameRoot.getChildByName("magicPai").active = false;
        }
    },

    showHuangPai:function(isshow,pai){
        this.gameRoot.getChildByName("huangPai").active = isshow;
        var huangpaiNode = cc.find("huangPai/pai",this.gameRoot);
        var sprite = huangpaiNode.getComponent(cc.Sprite);
        sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
    },

    onGameBeign:function(){
        for(var i = 0; i < this._playEfxs.length; ++i){
            this._playEfxs[i].node.active = false;
        }
        
        for(var i = 0; i < this._hupaiLists.length; ++i){
            for(var j = 0; j < this._hupaiLists[i].childrenCount; ++j){
                this._hupaiLists[i].children[j].active = false;
            }
        }

        for(var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i){
            var seatData = cc.vv.gameNetMgr.seats[i];
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            var hupai = this._hupaiTips[localIndex];
            hupai.getChildByName("sprHu").active = false;
            hupai.getChildByName("sprZimo").active = false;

            if(seatData.huinfo){
                for(var j = 0; j < seatData.huinfo.length; ++j){
                    var info = seatData.huinfo[j];
                    if(info.ishupai){
                        this.initHupai(localIndex,info.pai);    
                    }
                }
            }
        }

        this.hideChupai();
        this.hideOptions();
        var sides = ["right","up","left"];
        var gameChild = this.node.getChildByName("game");
        for(var i = 0; i < sides.length; ++i){
            var sideChild = gameChild.getChildByName(sides[i]);
            let holds = null;
            if(cc.vv.replayMgr.isReplay()){
                holds = sideChild.getChildByName("fakeHolds");
                var holds1 = sideChild.getChildByName("holds");
                holds1.active = false;
            }
            else{
                holds = sideChild.getChildByName("holds");
                var holds1 = sideChild.getChildByName("fakeHolds");
                holds1.active = false;
            }
            for(var j = 0; j < holds.childrenCount; ++j){
                var nc = holds.children[j];
                nc.active = true;
                nc.scaleX = 1.0;
                nc.scaleY = 1.0;
                var sprite = nc.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.vv.mahjongmgr.holdsEmpty[i+1];
            }
        }

        this.showMagicPai();
        this.showHuangPai(false,4);
        this.clearArrow();
        this.showBtnTing();

        //游戏类型
        // if(cc.vv.gameNetMgr.conf.type == 1){
        //     this._gamecount = cc.find('Canvas/GameInfo/jushu/num').getComponent(cc.Label);
        //     this._gamecount.string = cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames;
        //     cc.find('Canvas/GameInfo/guozi').active = false;
        // }
        // else{
        //     cc.find('Canvas/GameInfo/guozi/num').getComponent(cc.Label).string = cc.vv.gameNetMgr.conf.difen;
        //     cc.find('Canvas/GameInfo/jushu').active = false;
        //     cc.find('Canvas/GameInfo/mjCount').x = -120;
        // }
      
        if(cc.vv.gameNetMgr.gamestate == "" && cc.vv.replayMgr.isReplay() == false){
            return;
        }

        this.gameRoot.active = true;
        this.prepareRoot.active = false;
        //初始化手牌
        this.initMahjongs();
        //初始化碰杠牌
        var penggang = this.node.getComponent('PengGangs');
        var seats = cc.vv.gameNetMgr.seats;
        for (let i = 0; i < seats.length; i++) {
            if(penggang){
                penggang.onPengGangChanged(seats[i]);                
            }
        }
        var seats = cc.vv.gameNetMgr.seats;
        for(var i in seats){
            var seatData = seats[i];
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            if(localIndex != 0){
                // console.log("Begin initMopai seatIndex = " + i.seatIndex);
                this.initOtherMahjongs(seatData);
                if(parseInt(i) == cc.vv.gameNetMgr.turn){
                    this.initMopai(i,-1);
                }
                else{
                    this.initMopai(i,null);    
                }
            }
        }
        this.showChupai();
        if(cc.vv.gameNetMgr.curaction != null){
            this.showAction(cc.vv.gameNetMgr.curaction);
            cc.vv.gameNetMgr.curaction = null;
        }
        
    },
    
    onMJClicked:function(event){
        if(cc.vv.gameNetMgr.isHuanSanZhang){
            this.node.emit("mj_clicked",event.target);
            return;
        }
        
        //如果不是自己的轮子，则忽略
        if(cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex){
            console.log("not your turn." + cc.vv.gameNetMgr.turn);
            return;
        }
        for(var i = 0; i < this._myMJArr.length; ++i){
            if(event.target === this._myMJArr[i].node){
                //如果是再次点击，则出牌
                if(event.target == this._selectedMJ){
                    this.shoot(this._selectedMJ.mjId); 
                    this._selectedMJ.y = 0;
                    this._selectedMJ = null;
                    return;
                }
                if(this._selectedMJ != null){
                    this._selectedMJ.y = 0;
                }
                event.target.y = 15;
                this._selectedMJ = event.target;
                var obj = this.showAwaitHu(event.target.mjId);
                var awaitHu = this.node.getChildByName("awaitHu");
                if(obj){
                    var pos = event.target.position;
                    awaitHu.setPosition(pos.x - 60,-135);
                    var bg = awaitHu.getChildByName("bg");
                    var size = cc.director.getWinSize().width / 2;
                    if(Math.abs(awaitHu.x) + (bg.width) / 2 > size){
                        if(awaitHu.x > 0){
                            awaitHu.runAction(cc.moveBy(0, cc.p(20, 0)));
                        }
                        else{
                            awaitHu.runAction(cc.moveBy(0, cc.p(-20, 0)));
                        }
                    }
                }
                awaitHu.active = obj;
                return;
            }
        }
    },

    //把准备听的牌显示到awaitHu上
    showAwaitHu:function(mj){
        // var mj = event.target.mjId;
        var ting = require('../ting/tingpai');
        var tingarr = ting.checktingpai(cc.vv.gameNetMgr,mj);
        if(tingarr.length > 0){
            console.log("显示听的牌: ",tingarr);
            var seats = cc.vv.gameNetMgr.seats;
            var fold = [];
            for(var x = 0, max = seats.length; x < max; x += 1){
                var folds = seats[x].folds;
                var pengs = [];
                var angangs = [];
                var diangangs = [];
                var wangangs = [];
                if(seats[x].pengs.length > 0){
                    for(var y = 0, max1 = seats[x].pengs.length; y < max1; y += 1){
                        pengs.push(seats[x].pengs[y],seats[x].pengs[y],seats[x].pengs[y]);
                    }
                }
                fold = fold.concat(pengs);
                if(seats[x].angangs.length > 0){
                    for(var y = 0, max1 = seats[x].angangs.length; y < max1; y += 1){
                        angangs.push(seats[x].angangs[y],seats[x].angangs[y],seats[x].angangs[y],seats[x].angangs[y]);
                    }
                }
                fold = fold.concat(angangs);
                if(seats[x].diangangs.length > 0){
                    for(var y = 0, max1 = seats[x].diangangs.length; y < max1; y += 1){
                        diangangs.push(seats[x].diangangs[y],seats[x].diangangs[y],seats[x].diangangs[y],seats[x].diangangs[y]);
                    }
                }
                fold = fold.concat(diangangs);
                if(seats[x].wangangs.length > 0){
                    for(var y = 0, max1 = seats[x].wangangs.length; y < max1; y += 1){
                        wangangs.push(seats[x].wangangs[y],seats[x].wangangs[y],seats[x].wangangs[y],seats[x].wangangs[y]);
                    }
                }
                fold = fold.concat(wangangs);
                fold = fold.concat(folds);
                if(x === cc.vv.gameNetMgr.seatIndex){
                    var holds = seats[x].holds;
                    fold = fold.concat(holds);
                }
            }
            var alreadyTing = [];
            var awaitHu = this.node.getChildByName("awaitHu");
            if(awaitHu.active) awaitHu.active = false;
            var holds = awaitHu.getChildByName("holds");
            var bg = awaitHu.getChildByName("bg");
            for(var j = 0; j < holds.childrenCount; j += 1){
                var count = 4;
                var apiece = [];
                if(tingarr[j] >= 0){
                    var sprit = holds.children[j].getComponent(cc.Sprite);
                    this.setSpriteFrameByMJID("M_",sprit,tingarr[j]);
                    for(var x = 0, max = fold.length; x < max; x += 1){
                        if(fold[x] === tingarr[j]){
                            count -= 1;
                        }
                    }1
                    if(holds.children[j].color !== new cc.Color(255,255,255)){
                        holds.children[j].color = new cc.Color(255,255,255);
                    }
                    holds.children[j].getChildByName("number").active = false;
                    holds.children[j].getChildByName("label").getComponent(cc.Label).string = "";
                    if(count > 1){
                        holds.children[j].getChildByName("number").active = true;
                        holds.children[j].getChildByName("label").getComponent(cc.Label).string = count;
                    }
                    else if(count === 0){
                        holds.children[j].color = new cc.Color(128,128,128);
                    }
                    apiece.push(tingarr[j],count);2
                    alreadyTing.push(apiece);
                }
                else{
                    holds.children[j].active = false;
                }
            }
            if(this._alreadyTing !== alreadyTing){
                this._alreadyTing = alreadyTing;
                var arrowData = JSON.parse(cc.sys.localStorage.getItem("arrow"));
                arrowData.data = alreadyTing;
                cc.sys.localStorage.setItem("arrow",JSON.stringify(arrowData));
                console.log("正在听的牌。。。",alreadyTing);
            }
            bg.width = (tingarr.length - 1) * 61.5 + 110;
            // awaitHu.active = true;
            return true;
        }
        else{
            // awaitHu.active = false;
            return false;
        }
    },

    //显示自己听的牌
    showTing:function(){
        var awaitHu = this.node.getChildByName("awaitHu");
        var bg = awaitHu.getChildByName("bg");
        var posX = 599 - (bg.width) / 2 - 30;
        awaitHu.setPosition(posX,-85);
        awaitHu.active = true;
    },
    
    //出牌
    shoot:function(mjId){
        console.log("准备出的牌是：" + mjId);
        if(mjId == null){
            return;
        }
        cc.vv.net.send('chupai',mjId);
        console.log("已出牌：" + mjId);
        var tingarr = this._tingdata[mjId];
        var btn_ting = this.node.getChildByName("btn_ting");
        if(btn_ting.active) btn_ting.active = false;
        if(tingarr && tingarr.length > 0){
            var awaitHu = this.node.getChildByName("awaitHu");
            btn_ting.active = true;
            var close = awaitHu.getChildByName("close");
            close.on("touchstart",this.closeTing);
            var arrowData = JSON.parse(cc.sys.localStorage.getItem("arrow"));
            arrowData.ting = true;
            awaitHu.active = false;
            cc.sys.localStorage.setItem("arrow",JSON.stringify(arrowData));
        }
        this.inithint_close();//zyh
    },
    
    getMJIndex:function(side,index){
        if(side == "right" || side == "up"){
            return 13 - index;
        }
        return index;
    },
    
    initMopai:function(seatIndex,pai){
        if(seatIndex == -1 || seatIndex == null || !seatIndex)
        {
            return;
        }
        
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        if(side !== "myself" && cc.vv.replayMgr.isReplay()){
            var holds = sideChild.getChildByName("fakeHolds");
            var holds1 = sideChild.getChildByName("holds");
            // holds1.active = false;
        }
        else{
            var holds = sideChild.getChildByName("holds");
            var holds1 = sideChild.getChildByName("fakeHolds");
            // holds1.active = false;
        }
        if(holds1){
            holds1.active = false;
        }

        var lastIndex = this.getMJIndex(side,13);
        var nc = holds.children[lastIndex];

        nc.scaleX = 1.0;
        nc.scaleY = 1.0;
                        
        if(pai == null){
            nc.active = false;
        }
        else if(pai >= 0){
            nc.active = true;
            if(side == "up" && !cc.vv.replayMgr.isReplay()){
                nc.scaleX = 0.73;
                nc.scaleY = 0.73;                    
            }
            var sprite = nc.getComponent(cc.Sprite); 
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,pai);
        }
        else if(pai != null){
            nc.active = true;
            if(side == "up"){
                nc.scaleX = 1.0;
                nc.scaleY = 1.0;                    
            }
            var sprite = nc.getComponent(cc.Sprite); 
            sprite.spriteFrame = cc.vv.mahjongmgr.getHoldsEmptySpriteFrame(side);
        }
    },
    
    initEmptySprites:function(seatIndex){
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        if(side !== "myself" && cc.vv.replayMgr.isReplay()){
            var holds = sideChild.getChildByName("fakeHolds");
            var holds1 = sideChild.getChildByName("holds");
            holds1.active = false;
        }
        else{
            var holds = sideChild.getChildByName("holds");
            var holds1 = sideChild.getChildByName("fakeHolds");
            holds1.active = false;
        }
        var spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
        for(var i = 0; i < holds.childrenCount; ++i){
            var nc = holds.children[i];
            nc.scaleX = 1.0;
            nc.scaleY = 1.0;
            
            var sprite = nc.getComponent(cc.Sprite); 
            sprite.spriteFrame = spriteFrame;
        }
    },
    
    initOtherMahjongs:function(seatData){
        //console.log("seat:" + seatData.seatindex);
        var localIndex = this.getLocalIndex(seatData.seatindex);
        if(localIndex == 0){
            return;
        }
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        if(side !== "myself" && cc.vv.replayMgr.isReplay()){
            var sideHolds = sideRoot.getChildByName("fakeHolds");
            var sideHolds1 = sideRoot.getChildByName("holds");
            sideHolds1.active = false;
        }
        else{
            var sideHolds = sideRoot.getChildByName("holds");
            var sideHolds1 = sideRoot.getChildByName("fakeHolds");
            sideHolds1.active = false;
        }
        var num = 0;
        if(seatData.pengs){
            num += seatData.pengs.length;
        }
        if(seatData.angangs){
            num += seatData.angangs.length;
        }
        if(seatData.diangangs){
            num += seatData.diangangs.length;
        }
        if(seatData.wangangs){
            num += seatData.wangangs.length;
        }
        num *= 3;
        for(var i = 0; i < num; ++i){
            var idx = this.getMJIndex(side,i);
            sideHolds.children[idx].active = false;
        }
        
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        var holds = this.sortHolds(seatData);
        if(holds != null && holds.length > 0){
            for(var i = 0; i < holds.length; ++i){
                var idx = this.getMJIndex(side,i + num);
                var sprite = sideHolds.children[idx].getComponent(cc.Sprite); 
                if(side == "up" && !cc.vv.replayMgr.isReplay()){
                    sprite.node.scaleX = 0.73;
                    sprite.node.scaleY = 0.73;                    
                }
                sprite.node.active = true;
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,holds[i]);
            }
            
            if(holds.length + num == 13){
                var lasetIdx = this.getMJIndex(side,13);
                sideHolds.children[lasetIdx].active = false;
            }
        }
    },
    
    sortHolds:function(seatData){
        var holds = seatData.holds;
        if(holds == null){
            return null;
        }
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var mopai = null;
        var l = holds.length 
        if( l === 2 || l === 5 || l === 8 || l === 11 || l === 14){
            mopai = holds.pop();
        }

        var dingque = seatData.dingque;
        cc.vv.mahjongmgr.sortMJ(holds,dingque);

        //将摸牌添加到最后
        if(mopai != null){
            holds.push(mopai);
        }
        return holds;
    },

    doChuPaiAction:function(seatData,index){
        var myMJArr = cc.find('Canvas/game/myself/holds');
        var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length)*3;
        this._myMJArr[lackingNum+index].spriteFrame = null;
        for (var i = lackingNum; i < myMJArr.childrenCount; i++) {
            if(this._myMJArr[i].spriteFrame != null && i < lackingNum+index){
                var move = cc.moveTo(0.3,cc.p(myMJArr.children[i].x+75,myMJArr.children[i].y));
                myMJArr.children[i].runAction(move);
            }
        }
    },
    
    initMahjongs:function(){
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if(holds == null){
            return;
        }
        console.log('初始手牌:', holds);

        //初始化手牌
        // console.log('wangangs:', seatData.wangangs);
        var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length) * 3;
        //把赖子挪到牌组的最前边
        var num = holds.indexOf(cc.vv.gameNetMgr.magicpai);
        if(num !== -1 && cc.vv.gameNetMgr.conf.wanfa === 2){
            var num3 = holds.lastIndexOf(cc.vv.gameNetMgr.magicpai) - num + 1;
            var str = holds.splice(num,num3);
            for(var i = 0; i < num3;i += 1){
                holds.unshift(str[0]);
            }
        }
        //显示牌
        for(var i = 0; i < holds.length; ++i){
            var mjid = holds[i];
            var sprite = this._myMJArr[i + lackingNum];
            sprite.node.mjId = mjid;
            sprite.node.y = 0;
            this.setSpriteFrameByMJID("M_",sprite,mjid);
            // console.log("initMahjongs holds i = ", i);
        }

        for(var i = 0; i < lackingNum; ++i){
            var sprite = this._myMJArr[i]; 
            sprite.node.mjId = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }

        if(holds.length + lackingNum == 13)
        {
            // console.log("initMahjongs myMJArr.active = false");
            var sprite = this._myMJArr[13];
            sprite.node.active = false;
            sprite.spriteFrame = null;
            sprite.node.mjId = null;
        }

        //for(var i = lackingNum + holds.length; i < this._myMJArr.length; ++i){
        //    var sprite = this._myMJArr[i]; 
        //    sprite.node.mjId = null;
        //    sprite.spriteFrame = null;
        //    sprite.node.active = false;
        //}

        //var myMJArr = cc.find('Canvas/game/myself/holds');
        //for (var i = 0; i < myMJArr.childrenCount; i++) {
        //    myMJArr.children[i].x = -497 + i * 75;
        //    // console.log("牌号码。", i, myMJArr.children[i].mjId);
        //}

        //var l = myMJArr.childrenCount;
        //if( l === 2 || l === 5 || l === 8 || l === 11 || l === 14){
        //    myMJArr.children[l - 1].x += 26;
        //    if(!myMJArr.children[l - 1].active) myMJArr.children[l - 1].active = true;
        //    console.log("摸牌啦。。", myMJArr.children[l - 1]);
        //}
        this.hintOperation();//zyh
        this.inithint();//zyh
    },
    hintOperation:function(){
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if(holds == null){
            return;
        }
        var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length) * 3;
        this._tingdata={};
        for(var i = 0; i < holds.length; ++i){
            var mjid = holds[i];
            var sprite = this._myMJArr[i + lackingNum];
            sprite.node.mjId = mjid;
            sprite.node.y = 0;
            var ting = require('../ting/tingpai');
            var tingarr = ting.checktingpai(cc.vv.gameNetMgr,mjid);
            if(tingarr.length > 0){
                this._tingdata[mjid] = tingarr;
            }
        }
    },
    inithint:function(){
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if(holds == null){
            return;
        }
        var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length)*3;

        var awaitHu = this.node.getChildByName("awaitHu");
        var close = awaitHu.getChildByName("close");
        var closeOff = true;
        for(var i = 0; i < holds.length; ++i){
            var mjid = holds[i];
            var sprite = this._myMJArr[i + lackingNum];
            sprite.node.mjId = mjid;
            sprite.node.y = 0;
            var tingarr = this._tingdata[mjid];
            if(tingarr && tingarr.length > 0 && !cc.vv.replayMgr.isReplay()){
                this.setArrowPosition(sprite.node,true);
                if(closeOff){
                    close.off("touchstart",this.closeTing);
                    awaitHu.active = false;
                    closeOff = false;
                }
            }
        }
    },

     inithint_close:function(){
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if(holds == null){
            return;
        }
        var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length)*3;
        var num = holds.indexOf(cc.vv.gameNetMgr.magicpai);
        if(num !== -1 && cc.vv.gameNetMgr.conf.wanfa === 2){
            var num3 = holds.lastIndexOf(cc.vv.gameNetMgr.magicpai) - num + 1;
            var str = holds.splice(num,num3);
            for(var i = 0; i < num3;i += 1){
                holds.unshift(str[0]);
            }
        }
  
        for(var i = 0; i < holds.length; ++i){
            var mjid = holds[i];
            var sprite = this._myMJArr[i + lackingNum];
            sprite.node.mjId = mjid;
            sprite.node.y = 0;
            this.setArrowPosition(sprite.node,false);
        }
    },


    setArrowPosition:function(index,obj){
        index.getChildByName("arrow").active = obj;
    },

    clearArrow:function(){
        var myArrows = cc.find('Canvas/game/myself/holds');
        for(var w = 0, max = myArrows.childrenCount; w < max; w += 1){
            var arrow = myArrows.children[w];
            arrow.getChildByName("arrow").active = false;
        }
    },
    
    showBtnTing:function(){
        var arrowData = JSON.parse(cc.sys.localStorage.getItem("arrow"));
        if(arrowData.ting){
            var tingarr = arrowData.data;
            var awaitHu = this.node.getChildByName("awaitHu");
            var holds = awaitHu.getChildByName("holds");
            var bg = awaitHu.getChildByName("bg");
            var btn_ting = this.node.getChildByName("btn_ting");
            for(var j = 0; j < holds.childrenCount; j += 1){
                if(tingarr[j] && tingarr[j][0] >= 0){
                    var sprit = holds.children[j].getComponent(cc.Sprite);
                    this.setSpriteFrameByMJID("M_",sprit,tingarr[j][0]);
                    if(holds.children[j].color !== new cc.Color(255,255,255)){
                        holds.children[j].color = new cc.Color(255,255,255);
                    }
                    holds.children[j].getChildByName("number").active = false;
                    holds.children[j].getChildByName("label").getComponent(cc.Label).string = "";
                    if(sprit,tingarr[j][1] > 1){
                        holds.children[j].getChildByName("number").active = true;
                        holds.children[j].getChildByName("label").getComponent(cc.Label).string = tingarr[j][1];
                    }
                    else if(sprit,tingarr[j][1] === 0){
                        holds.children[j].color = new cc.Color(128,128,128);
                    }
                }
                else{
                    holds.children[j].active = false;
                }
            }
            if(!btn_ting.active) btn_ting.active = true;
            var close = awaitHu.getChildByName("close");
            close.on("touchstart",this.closeTing);
            bg.width = (tingarr.length - 1) * 61.5 + 110;
        }
    },

    setSpriteFrameByMJID:function(pre,sprite,mjid){
        sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,mjid);
        this.addMagicPai(sprite.node,mjid);
        sprite.node.active = true;
    },
    
    //如果玩家手上还有缺的牌没有打，则只能打缺牌
    checkQueYiMen:function(){
        if(cc.vv.gameNetMgr.conf==null || cc.vv.gameNetMgr.conf.type != 1 || !cc.vv.gameNetMgr.getSelfData().hued){
            //遍历检查看是否有未打缺的牌 如果有，则需要将不是定缺的牌设置为不可用
            var dingque = cc.vv.gameNetMgr.dingque;
            // console.log(dingque)
            var hasQue = false;
            if(cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn){
                for(var i = 0; i < this._myMJArr.length; ++i){
                    var sprite = this._myMJArr[i];
                    // console.log("sprite.node.mjId:" + sprite.node.mjId);
                    if(sprite.node.mjId != null){
                        var type = cc.vv.mahjongmgr.getMahjongType(sprite.node.mjId);
                        if(type == dingque){
                            hasQue = true;
                            break;
                        }
                    }
                }            
            }

            // console.log("hasQue:" + hasQue);
            for(var i = 0; i < this._myMJArr.length; ++i){
                var sprite = this._myMJArr[i];
                if(sprite.node.mjId != null){
                    var type = cc.vv.mahjongmgr.getMahjongType(sprite.node.mjId);
                    if(hasQue && type != dingque){
                        //sprite.node.getComponent(cc.Button).interactable = false;
                    }
                    else{
                        sprite.node.getComponent(cc.Button).interactable = true;
                    }
                }
            }   
        }
        else{
            if(cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn){
                for(var i = 0; i < 14; ++i){
                    var sprite = this._myMJArr[i]; 
                    if(sprite.node.active == true){
                        sprite.node.getComponent(cc.Button).interactable = i == 13;
                    }
                }
            }
            else{
                for(var i = 0; i < 14; ++i){
                    var sprite = this._myMJArr[i]; 
                    if(sprite.node.active == true){
                        sprite.node.getComponent(cc.Button).interactable = true;
                    }
                }
            }
        }
    },
    
    getLocalIndex:function(index){
        var ret = (index - cc.vv.gameNetMgr.seatIndex + 4) % 4;
        //console.log("old:" + index + ",base:" + cc.vv.gameNetMgr.seatIndex + ",new:" + ret);
        return ret;
    },
    
    onOptionClicked:function(event){
        console.log(event.target.pai);
        if(event.target.name == "btnPeng"){
            cc.vv.net.send("peng");
        }
        else if(event.target.name == "btnGang"){
            cc.vv.net.send("gang",event.target.pai);
        }
        else if(event.target.name == "btnHu"){
            cc.vv.net.send("hu");
        }
        else if(event.target.name == "btnGuo"){
            cc.vv.net.send("guo");
        }
        else if(event.target.name == "btnHuang"){
            cc.vv.net.send("huang");
            this.huangWuTong();
        }
    },
    
    huangWuTong:function(){

        this.hideOptions();
    },

    addSuffix:function(seatId,obj){
        var voice = cc.sys.localStorage.getItem("voice");
        var userId = cc.vv.gameNetMgr.seats[seatId].userid;
        if(cc.vv.baseInfoMap){
            var sex = cc.vv.baseInfoMap[userId].sex;
        }
        else{
            var sex = cc.vv.palyerSex;
        }
        if(voice === "pu"){
            if(sex === 1){
                var str = "pu/nan/";
            }
            else if(sex === 2 || sex === 0){
                var str = "pu/nv/";
            }
            str += obj;
            if(obj === "peng" || obj === "zimo" || obj === "hu"){
                str += ".mp3";
            }
            else{
                str += ".mp3";
            }
        }
        else if(voice === "fang"){
            if(sex === 1){
                var str = "fang/nan/";
            }
            else if(sex === 2 || sex === 0){
                var str = "fang/nv/";
            }
            if(obj === "peng" || obj === "gang"){
                var rand1 = Math.floor(Math.random() * 3 + 1);
                obj += "_";
                obj += rand1;
                if(obj === "peng"){
                    obj += ".mp3";
                }
                else{
                    obj += ".mp3";
                }
            }
            else if(obj === "zimo" || obj === "hu"){
                obj += ".mp3";
            }
            else{
                obj += ".mp3";
            }
            str += obj;
        }
        cc.vv.audioMgr.playSFX(str);
    },

    closeTing:function(){
        var btn_ting = cc.find('Canvas/btn_ting');
        var awaitHu = cc.find('Canvas/awaitHu');
        if(btn_ting.active){
            awaitHu.active = false;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
    },
    
    onDestroy:function(){
        console.log("onDestroy");
        if(cc.vv){
            cc.vv.gameNetMgr.clear();   
        }
    }
});
