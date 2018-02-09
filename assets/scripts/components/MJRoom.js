cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomNo:{
            default:null,
            type:cc.Label
        },
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _seats:[],
        _seats2:[],
        _timeLabel:null,
        _voiceMsgQueue:[],
        _lastPlayingSeat:null,
        _playingSeat:null,
        _lastPlayTime:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this.initView();
        this.initSeats();
        this.initEventHandlers();
    },



    initView:function(){
        var prepare = this.node.getChildByName("prepare");
        var seats = prepare.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i].getComponent("Seat"));
        }
        
        this.refreshBtns();
        
        this.lblRoomNo = cc.find("Canvas/GameInfo/roomID/id").getComponent(cc.Label);
        // this._timeLabel = cc.find("Canvas/infobar/time").getComponent(cc.Label);
        this.lblRoomNo.string = cc.vv.gameNetMgr.roomId;
        var gameChild = this.node.getChildByName("game");
        var sides = ["myself","right","up","left"];
        for(var i = 0; i < sides.length; ++i){
            var sideNode = gameChild.getChildByName(sides[i]);
            var seat = sideNode.getChildByName("seat");
            this._seats2.push(seat.getComponent("Seat"));
        }
        
        var btnWechat = cc.find("Canvas/prepare/btnWeichat");
        if(btnWechat){
            cc.vv.utils.addClickEvent(btnWechat,this.node,"MJRoom","onBtnWeichatClicked");
        }
        var btnCopy = cc.find("Canvas/prepare/btnCopy");
        if(btnCopy){
            cc.vv.utils.addClickEvent(btnCopy,this.node,"MJRoom","onBtnCopyClicked");
        }

        this.zengzhizi = cc.find('Canvas/zengzhizi');

        if(cc.find('Canvas/prepare/btnPrepare').activeInHierarchy == false){
            if(cc.vv.replayMgr.isReplay() === false){
                cc.vv.net.send('ready');
            }
            else{
                var btn_settings = cc.find('Canvas/btn_settings').getComponent(cc.Button);
                var btn_voice = cc.find('Canvas/btn_voice');
                var btn_wanfa = cc.find('Canvas/btn_wanfa');
                btn_settings.interactable = false;
                btn_voice.active = false;
                btn_wanfa.active = false;
            }
        }

    },
    
    refreshBtns:function(){
        var prepare = this.node.getChildByName("prepare");
        var btnWeichat = prepare.getChildByName("btnWeichat");
        var btnCopy = prepare.getChildByName("btnCopy");
        var btnPrepare = prepare.getChildByName("btnPrepare");
        var isIdle = cc.vv.gameNetMgr.numOfGames == 0;
        btnWeichat.active=isIdle;
        btnCopy.active= false;
        //btnExit.active = !cc.vv.gameNetMgr.isOwner() && isIdle;
        //btnDispress.active = cc.vv.gameNetMgr.isOwner() && isIdle;
        btnPrepare.active = isIdle;
        var seats1 = cc.vv.gameNetMgr.seats;
        var myName = cc.vv.userMgr.userName;
        for(var j = 0, max1 = seats1.length; j < max1; j += 1){
            var seats1Name = seats1[j].name;
            if(myName === seats1Name){
                if(seats1[j].ready){
                    btnPrepare.active = false;
                }
                break;
            }
        }
    },
    
    initEventHandlers:function(){
        var self = this;
        this.node.on('new_user',function(data){
            self.initSingleSeat(data.detail);
        });
        
        this.node.on('user_state_changed',function(data){
            //console.log("玩家资料改变。");
            self.initSingleSeat(data.detail);
        });
        
        this.node.on('game_begin',function(data){
            self.refreshBtns();
            self.initSeats();
        });
        
        this.node.on('game_num',function(data){
            self.refreshBtns();
        });

        this.node.on('game_huanpai',function(data){
            for(var i in self._seats2){
                self._seats2[i].refreshXuanPaiState();    
            }
        });
                
        this.node.on('huanpai_notify',function(data){
            var idx = data.detail.seatindex;
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            self._seats2[localIdx].refreshXuanPaiState();
        });
        
        this.node.on('game_huanpai_over',function(data){
            for(var i in self._seats2){
                self._seats2[i].refreshXuanPaiState();    
            }
        });
        
        this.node.on('voice_msg',function(data){
            var data = data.detail;
            self._voiceMsgQueue.push(data);
            self.playVoice();
        });
        
        this.node.on('chat_push',function(data){
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            self._seats[localIdx].chat(data.content);
            self._seats2[localIdx].chat(data.content);
        });
        
        this.node.on('quick_chat_push',function(data){
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            
            var index = data.content;
            var info = cc.vv.chat.getQuickChatInfo(index);
            self._seats[localIdx].chat(info.content);
            self._seats2[localIdx].chat(info.content);
            console.log(self._seats2[localIdx].chat);

            var voice = cc.sys.localStorage.getItem("voice");
            if(cc.vv.baseInfoMap){
                var sex = cc.vv.baseInfoMap[data.sender].sex;
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
            }
            else if(voice === "fang"){
                if(sex === 1){
                    var str = "fang/nan/";
                }
                else if(sex === 2 || sex === 0){
                    var str = "fang/nv/";
                }
            }
            str += info.sound;
            cc.vv.audioMgr.playSFX(str);
        });
        
        this.node.on('emoji_push',function(data){
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            //console.log(data);
            self._seats[localIdx].emoji(data.content);
            self._seats2[localIdx].emoji(data.content);
        });

        this.node.on('game_zengzhizi',function (data) {
            var data = data.detail;
            self.zengzhizi.active = true;
        });

        this.node.on('game_sync',function () {
            self.initSeats();
        });
    },
    
    initSeats:function(){
        var seats = cc.vv.gameNetMgr.seats;
        for(var i = 0; i < seats.length; ++i){
            this.initSingleSeat(seats[i]);
            //console.log(seats[i]);
        }
    },
    
    initSingleSeat:function(seat){
        console.log(seat);
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        var isZhuang = seat.seatindex == cc.vv.gameNetMgr.button;
        var self = this;
        //console.log("isOffline:" + isOffline);
        if(seat.score){
            var score = seat.score;
        }
        else{
            var score = seat.totalscore;
        }

        this._seats[index].setInfo(seat.name,score,seat.piaozi);
        var btn = cc.find('Canvas/prepare/btnPrepare');
        if(btn){
            btn.on('click',function () {
                cc.vv.net.send('ready');
                btn.active = false;
                self._seats[index].setReady(seat.ready);
            },this);
        }
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);
        
        this._seats2[index].setInfo(seat.name,score,seat.piaozi);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].voiceMsg(false);
        this._seats2[index].refreshXuanPaiState();
    },
    
    onBtnSettingsClicked:function(){
        cc.vv.popupMgr.showSettings();   
    },

    onBtnBackClicked:function(){
        cc.vv.alert.show("返回大厅","返回大厅房间仍会保留，快去邀请大伙来玩吧！",function(){
            cc.vv.wc.show('正在返回游戏大厅');
            cc.director.loadScene("hall");    
        },true);
    },
    
    onBtnChatClicked:function(){
        
    },

    onBtnCopyClicked:function(){
        cc.vv.anysdkMgr.copyRoomID(cc.vv.gameNetMgr.roomId);
    },
    
    onBtnWeichatClicked:function(){
        // var title = "<巢湖锅子>";
        if(cc.vv.gameNetMgr.conf.type == 1){
            // var title = "<巢湖圈子>";
            var fakeType = cc.vv.gameNetMgr.conf.maxGames + "圈";
        }
        else{
            var fakeType = cc.vv.gameNetMgr.conf.difen + "锅子";
        }
        var piaozi = cc.vv.gameNetMgr.conf.piaozifen;
        var seats = cc.vv.gameNetMgr.seats;
        for(var i = 0, max = seats.length; i < max; i += 1){
            var player = 0;
            if(seats[i].name !== null){
                player += 1;
            }
        }
        var seat = 4 - player;
        // console.log(cc.vv.gameNetMgr.conf);
        // cc.vv.anysdkMgr.share("巢州麻神馆" + title,"房号:" + cc.vv.gameNetMgr.roomId + " 玩法:" + cc.vv.gameNetMgr.getWanfa(),false);
        cc.vv.anysdkMgr.share("巢州麻将 房号" + cc.vv.gameNetMgr.roomId, fakeType + "，缺" + seat +"人，" + piaozi + "漂、" + cc.vv.gameNetMgr.getWanfa() + "ip地址检测。",false);
    },
    
    onBtnDissolveClicked:function(){
        cc.vv.alert.show("解散房间","解散房间不扣房卡，是否确定解散？",function(){
            cc.vv.net.send("dispress");
        },true);
    },
    
    onBtnExit:function(){
        cc.vv.net.send("exit");
    },
    
    playVoice:function(){
        if(this._playingSeat == null && this._voiceMsgQueue.length){
            console.log("playVoice2");
            var data = this._voiceMsgQueue.shift();
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(idx);
            this._playingSeat = localIndex;
            this._seats[localIndex].voiceMsg(true);
            this._seats2[localIndex].voiceMsg(true);
            
            var msgInfo = JSON.parse(data.content);
            
            var msgfile = "voicemsg.amr";
            console.log(msgInfo.msg.length);
            cc.vv.voiceMgr.writeVoice(msgfile,msgInfo.msg);
            cc.vv.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + msgInfo.time;
        }
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var minutes = Math.floor(Date.now()/1000/60);
        if(this._lastMinute != minutes){
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10? "0"+h:h;
            
            var m = date.getMinutes();
            m = m < 10? "0"+m:m;
            //this._timeLabel.string = "" + h + ":" + m;
        }
        
        
        if(this._lastPlayTime != null){
            if(Date.now() > this._lastPlayTime + 200){
                this.onPlayerOver();
                this._lastPlayTime = null;    
            }
        }
        else{
            this.playVoice();
        }
    },
    
        
    onPlayerOver:function(){
        cc.vv.audioMgr.resumeAll();
        console.log("onPlayCallback:" + this._playingSeat);
        var localIndex = this._playingSeat;
        this._playingSeat = null;
        this._seats[localIndex].voiceMsg(false);
        this._seats2[localIndex].voiceMsg(false);
    },
    
    onDestroy:function(){
        cc.vv.voiceMgr.stop();
//        cc.vv.voiceMgr.onPlayCallback = null;
    }
});
