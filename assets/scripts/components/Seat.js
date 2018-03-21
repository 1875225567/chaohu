cc.Class({
    extends: cc.Component,

    properties: {
        _sprIcon:null,
        _zhuang:null,
        _ready:null,
        _offline:null,
        _lblName:null,
        _lbldi:null,
        _lblPiao:null,
        _scoreBg:null,
        _nddayingjia:null,
        _voicemsg:null,
        
        _chatBubble:null,
        _emoji:null,
        _lastChatTime:-1,
        
        _userName:"",
        _piao:0,
        _di:0,
        _dayingjia:false,
        _isOffline:false,
        _isReady:false,
        _isZhuang:false,
        _userId:null,

        _emojisArr:null
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this._sprIcon = this.node.getChildByName("icon").getComponent("ImageLoader");
        this._lblName = this.node.getChildByName("name").getComponent(cc.Label);
        //this._lblScore = this.node.getChildByName("score").getComponent(cc.Label);
        this._lblPiao = this.node.getChildByName("piao").getComponent(cc.Label);
        this._lbldi = this.node.getChildByName("di").getComponent(cc.Label);

        this._voicemsg = this.node.getChildByName("voicemsg");
        this._xuanpai = this.node.getChildByName("xuanpai");
        this.refreshXuanPaiState();
        
        if(this._voicemsg){
            this._voicemsg.active = false;
        }
        
        if(this._sprIcon && this._sprIcon.getComponent(cc.Button)){
            cc.vv.utils.addClickEvent(this._sprIcon,this.node,"Seat","onIconClicked");
        }
        
        
        this._offline = this.node.getChildByName("offline");
        
        this._ready = this.node.getChildByName("ready");
        
        this._zhuang = this.node.getChildByName("zhuang");
        
        this._scoreBg = this.node.getChildByName("Z_money_frame");
        this._nddayingjia = this.node.getChildByName("dayingjia");
        
        this._chatBubble = this.node.getChildByName("ChatBubble");
        if(this._chatBubble != null){
            this._chatBubble.active = false;            
        }
        
        this._emoji = this.node.getChildByName("emoji");
        if(this._emoji != null){
            this._emoji.active = false;
        }
        
        this.refresh();
        
        if(this._sprIcon && this._userId){
            this._sprIcon.setUserID(this._userId);
        }

        var self = this;
        this._emojisArr = {};
        var emojiItem = cc.find("Canvas/chat/emojis");
        for (let i = 0; i < emojiItem.childrenCount; i++) {
            this._emojisArr["item"+i] = emojiItem.children[i].getComponent(cc.Sprite).spriteFrame;
            
        }
    },
    
    onIconClicked:function(){
        var iconSprite = this._sprIcon.node.getComponent(cc.Sprite);
        if(this._userId != null && this._userId > 0){
           var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
            var sex = 0;
            if(cc.vv.baseInfoMap){
                var info = cc.vv.baseInfoMap[this._userId];
                if(info){
                    sex = info.sex;
                }                
            }
            cc.vv.userinfoShow.show(seat.name,seat.userid,iconSprite,sex,seat.ip);         
        }
    },
    

    refresh:function(){
        if(this._lblName != null){
            if(this._userName.length > 4){
                this._lblName.string = this._userName.slice(0,3) + "...";
            }
            else{
                this._lblName.string = this._userName;
            }
        }
        
        if(this._lblPiao != null){
            this._lblPiao.string = '漂: ' + this._piao;
        }
        
        if(this._lbldi != null){
            this._lbldi.string = '底: ' + this._di;
        }
        
        if(this._nddayingjia != null){
            this._nddayingjia.active = this._dayingjia == true;
        }
        
        if(this._offline){
            this._offline.active = this._isOffline && this._userName != "";
        }
        
        // if(this._ready){
        //     this._ready.active = this._isReady && (cc.vv.gameNetMgr.numOfGames > 0); 
        // }
        
        if(this._zhuang){
            this._zhuang.active = this._isZhuang;    
        }
        
        // this.node.active = this._userName != null && this._userName != "";

        // var seats = cc.find("Canvas/prepare/seats");
        // var seats1 = cc.vv.gameNetMgr.seats;
        // for(var i = 0, max = seats.children.length; i < max; i += 1){
        //     var seatName = seats.children[i].getChildByName("name");
        //     var ready = seats.children[i].getChildByName("ready");
        //     var seatName1 = seatName.getComponent(cc.Label);
        //     for(var j = 0, max1 = seats1.length; j < max1; j += 1){
        //         var seats1Name = seats1[j].name;
        //         if(seatName1.string === seats1Name){
        //             var netReady = seats1[j].ready;
        //             if(ready.active !== seats1[j].ready){
        //                 ready.active = seats1[j].ready;
        //                 break;
        //             }
        //         }
        //     }
        // }
    },
    
    setInfo(name,score,fan,dayingjia){
        this._userName = name;
        this._piao = fan;
        this.node.active = this._userName != null && this._userName != "";
        if(this._piao == null){
            this._piao = 0;
        }
        this._di = score;
        if(this._di == null){
            this._di = 0;
        }
        this._dayingjia = dayingjia;
        
        if(this._scoreBg != null){
            this._scoreBg.active = this._di != null;            
        }

        if(this._lblPiao != null){
            this._lblPiao.node.active = this._piao != null;            
        }

        if(cc.vv.replayMgr.isReplay()){
            if(this.node.getChildByName("di").active){
                this.node.getChildByName("piao").active = false;
                this.node.getChildByName("di").active = false;
            }
            if(cc.find('Canvas/GameInfo/mjCount').active){
                cc.find('Canvas/GameInfo/jushu').active = false;
                cc.find('Canvas/GameInfo/mjCount').active = false;
                cc.find('Canvas/GameInfo/guozi').active = false;
                cc.find('Canvas/GameInfo/bg').active = false;
                // var arr = ["right","up","left","myself"];
                // for(var i = 0, max = arr.length; i < max; i += 1){
                //     var piao = cc.find("Canvas/game/" + arr[i] + "/seat/piao");
                //     piao.active = false;
                //     var di = cc.find("Canvas/game/" + arr[i] + "/seat/di");
                //     di.active = false;
                // }
            }
        }
        this.refresh();    
    },
    
    setZhuang:function(value){
        this._isZhuang = value;
        if(this._zhuang){
            this._zhuang.active = value;
        }
    },
    
    setReady:function(isReady){
        // console.log("是否已准备：" + isReady);
        // this._isReady = isReady;
        // if(this._ready){
        //     this._ready.active = this._isReady && (cc.vv.gameNetMgr.numOfGames > 0);
        // }
        var ready = this.node.getChildByName("ready");
        ready.active = isReady;
    },
    
    setID:function(id){
        var idNode = this.node.getChildByName("id");
        if(idNode){
            var lbl = idNode.getComponent(cc.Label);
            lbl.string = "ID:" + id;            
        }
        
        this._userId = id;
        if(this._sprIcon){
            this._sprIcon.setUserID(id); 
        }
    },
    
    setOffline:function(isOffline){
        this._isOffline = isOffline;
        if(this._offline){
            this._offline.active = this._isOffline && this._userName != "";
        }
    },
    
    chat:function(content){
        if(this._chatBubble == null || this._emoji == null){
            return;
        }
        this._emoji.active = false;
        this._chatBubble.active = true;
        this._chatBubble.getComponent(cc.Label).string = content;
        this._chatBubble.getChildByName("New Label").getComponent(cc.Label).string = content;
        this._lastChatTime = 3;
    },
    
    emoji:function(emoji){
        //emoji = JSON.parse(emoji);
        if(this._emoji == null || this._emoji == null){
            return;
        }
        console.log(emoji);
        this._chatBubble.active = false;
        this._emoji.active = true;
        this._emoji.getComponent(cc.Sprite).spriteFrame = this._emojisArr[emoji];
        //this._emoji.getComponent(cc.Animation).play(emoji);
        this._lastChatTime = 3;
    },
    
    voiceMsg:function(show){
        if(this._voicemsg){
            this._voicemsg.active = show;
        }
    },
    
    refreshXuanPaiState:function(){
        if(this._xuanpai == null){
            return;
        }
        
        this._xuanpai.active = cc.vv.gameNetMgr.isHuanSanZhang;
        if(cc.vv.gameNetMgr.isHuanSanZhang == false){ 
            return;
        }
       
        this._xuanpai.getChildByName("xz").active = false;
        this._xuanpai.getChildByName("xd").active = false;
        
        var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
        if(seat){
            if(seat.huanpais == null){
                this._xuanpai.getChildByName("xz").active = true;
            }
            else{
                this._xuanpai.getChildByName("xd").active = true;
            }
        }
    },
   
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._lastChatTime > 0){
            this._lastChatTime -= dt;
            if(this._lastChatTime < 0){
                this._chatBubble.active = false;
                this._emoji.active = false;
                //this._emoji.getComponent(cc.Animation).stop();
            }
        }
    },
});
