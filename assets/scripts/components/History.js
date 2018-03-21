
cc.Class({
    extends: cc.Component,

    properties: {
        title1:cc.SpriteFrame,
        title2:cc.SpriteFrame,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _history:null,
        _viewlist:null,
        _content:null,
        _viewitemTemp:null,
        _viewDetailTemp:null,
        _detailTitle:null,
        _itemTitle:null,
        _historyData:null,
        _curRoomInfo:null,
        _emptyTip:null,
        _historySeat:null,
        _fakeRoomId:null,
    },

    // use this for initialization
    onLoad: function () {
        this._historySeat = {};
        this._history = this.node.getChildByName("history");
        this._history.active = false;
        
        this._emptyTip = this._history.getChildByName("emptyTip");
        this._emptyTip.active = true;
        
        this._viewlist = this._history.getChildByName("view1");
        this._content = cc.find("viewlist/view/content",this._viewlist);

        this._itemTitle = this._history.getChildByName("viewLabel1");
        this._detailTitle = this._history.getChildByName("viewLabel2");
        this._itemTitle.active = false;
        this._detailTitle.active = false;
        
        this._viewitemTemp = this._content.children[0];
        this._viewDetailTemp = this._content.children[1];
        this._content.removeChild(this._viewitemTemp);
        this._content.removeChild(this._viewDetailTemp);

        var node = cc.find("Canvas/right_bottom/btn_zhanji");
        this.addClickEvent(node,this.node,"History","onBtnHistoryClicked");
        
        var node = cc.find("Canvas/history/btn_back");  
        this.addClickEvent(node,this.node,"History","onBtnBackClicked");
    },
    
    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    onBtnBackClicked:function(){
        if(this._curRoomInfo == null){
            this._historyData = null;
            this._history.active = false;
        }
        else{
            this.initRoomHistoryList(this._historyData);   
        }
    },
    
    onBtnHistoryClicked:function(){
        this._history.active = true;
        var self = this;
        cc.vv.userMgr.getHistoryList(function(data){
            data.sort(function(a,b){
                return a.time < b.time; 
            });
            self._historyData = data;
            self._historySeat = {};
            for (let i = 0; i < data.length; i++) {
                for (let y = 0; y < data[i].seats.length; y++) {
                    if(self._historySeat[data[i].seats[y].userid]){
                        self._historySeat[data[i].seats[y].userid] += data[i].seats[y].score;
                    }
                    else{
                        self._historySeat[data[i].seats[y].userid] = data[i].seats[y].score;
                    }
                }
            }

            self.initRoomHistoryList(data);
        });
    },
    //处理转换后端发来的时间
    dateFormat:function(time){
        var date = new Date(time);
        var datetime = "{0}-{1}-{2}{3}{4}:{5}:{6}";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month >= 10? month : ("0"+month);
        var day = date.getDate();
        day = day >= 10? day : ("0"+day);
        var h = date.getHours();
        h = h >= 10? h : ("0"+h);
        var m = date.getMinutes();
        m = m >= 10? m : ("0"+m);
        var s = date.getSeconds();
        s = s >= 10? s : ("0"+s);
        datetime = datetime.format(year,month,day,"\n",h,m,s);
        return datetime;
    },
    //显示各房间战绩
    initRoomHistoryList:function(data){
        this._content.removeAllChildren();
        this._detailTitle.active = false;
        this._itemTitle.active = true;
        cc.find('Canvas/history/bg/title').getComponent(cc.Sprite).spriteFrame = this.title1;
        for(var i = 0; i < data.length; ++i){
            var node = this.getViewItem(i);
            node.y = -87 - i * 140;
            this._content.height = -(node.y) + 140;
            node.idx = i;
            var titleId = "" + (i + 1);
            node.getChildByName("roomID").getChildByName("label").getComponent(cc.Label).string = data[i].id;
            for(var j = 0; j < data[i].seats.length; ++j){
                if(cc.vv.userMgr.userId === data[i].seats[j].userid){
                    node.getChildByName("score").getChildByName("label").getComponent(cc.Label).string = data[i].seats[j].score;
                }
            }
            //node.getChildByName("score").getChildByName("label").getComponent(cc.Label).string = this._historySeat[cc.vv.userMgr.userId];

            var datetime = this.dateFormat(data[i].time * 1000);
            node.getChildByName("time").getChildByName("label").getComponent(cc.Label).string = datetime;
            
            var btnOp = node.getChildByName("btnOp");
            btnOp.idx = i;
            
            //node.getChildByName("jushu").getChildByName("label").getComponent(cc.Label).string = data[i].seats[0].jushu - 1;
            node.getChildByName("result").getChildByName("label").getComponent(cc.Label).string = this._historySeat[cc.vv.userMgr.userId] > 0 ? "赢" : "输";
        }
        this._emptyTip.active = data.length == 0;
        this.shrinkContent(data.length);
        this._curRoomInfo = null;
    },
    //显示房间内各局战绩详情
    initGameHistoryList:function(roomInfo,data){
        data.sort(function(a,b){
           return a.create_time > b.create_time; 
        });
        this._content.removeAllChildren();
        this._itemTitle.active = false;
        this._detailTitle.active = true;
        cc.find('Canvas/history/bg/title').getComponent(cc.Sprite).spriteFrame = this.title2;
        for(var i = 0; i < data.length; ++i){
            var node = this.getGameItem(i);
            node.active = true;
            node.y = -87 - i * 140;
            this._content.height = -(node.y) + 140;
            var idx = data.length - i/*  - 1 */;
            node.idx = idx/*  + 1 */;
            var titleId = "" + (idx/*  + 1 */);
            node.getChildByName("xuhao").getChildByName("label").getComponent(cc.Label).string = data[i].game_index;
            var datetime = this.dateFormat(data[i].create_time * 1000);
            node.getChildByName("time").getChildByName("label").getComponent(cc.Label).string = datetime;

            var btnOp = node.getChildByName("btnOp");
            btnOp.idx = idx;
            this.addClickEvent(btnOp,this.node,"History","onBtnOpClicked");

            var result = data[i].result;
            for(var j = 0; j < 4; ++j){
                var s = roomInfo.seats[j];
                var info = s.name;
                if(info.length > 2){
                    this._detailTitle.getChildByName("player" + (j + 1)).getComponent(cc.Label).string = info.slice(0,2) + "...";
                }
                else{
                    this._detailTitle.getChildByName("player" + (j + 1)).getComponent(cc.Label).string = info;
                }
                node.getChildByName("player" + (j + 1)).getChildByName("label").getComponent(cc.Label).string = result[j];
            }
        }
        this.shrinkContent(data.length);
        this._curRoomInfo = roomInfo;
    },
    
    getViewItem:function(i){
        var content = this._content;
        if(content.childrenCount > i){
            return content.children[i];
        }
        var node = cc.instantiate(this._viewitemTemp);
        content.addChild(node);
        return node;
    },
    getGameItem:function(i){
        var content = this._content;
        if(content.childrenCount > i){
            return content.children[i];
        }
        var node = cc.instantiate(this._viewDetailTemp);
        content.addChild(node);
        return node;
    },
    shrinkContent:function(num){
        while(this._content.childrenCount > num){
            var lastOne = this._content.children[this._content.childrenCount -1];
            this._content.removeChild(lastOne,true);
        }
    },
    
    getGameListOfRoom:function(idx){
        var self = this;
        var roomInfo = this._historyData[idx];        
        cc.vv.userMgr.getGamesOfRoom(roomInfo.uuid,function(data){
            if(data != null && data.length > 0){
                self.initGameHistoryList(roomInfo,data);
            }
        });
    },
    
    getDetailOfGame:function(idx){
        var self = this;
        var roomUUID = this._curRoomInfo.uuid;
        cc.vv.userMgr.getDetailOfGame(roomUUID,idx,function(data){
            data.base_info = JSON.parse(data.base_info);
            data.action_records = JSON.parse(data.action_records);
            cc.vv.gameNetMgr.prepareReplay(self._curRoomInfo,data);
            cc.vv.replayMgr.init(data);
            cc.director.loadScene("mjgame"); 
        });
    },
    
    onViewItemClicked:function(event){
        var idx = event.target.idx;
        if(this._curRoomInfo == null){
            this.getGameListOfRoom(idx);
        }
        else{
            this.getDetailOfGame(idx);      
        }
    },
    
    onBtnOpClicked:function(event){
        var idx = event.target.parent.idx;
        if(this._curRoomInfo == null){
            this.getGameListOfRoom(idx);
        }
        else{
            this.getDetailOfGame(idx);      
        }
    },

    onBtnShareClicked:function(event){
        var idx = event.target.parent.name;
        var roomId = event.target.parent.getChildByName("roomID").getChildByName("label").getComponent(cc.Label).string;
        //console.log(this._curRoomInfo);
        if(idx == "HistoryItem"){
            var self = this;
            var onCreate = function(ret){
                var big = cc.find("Canvas/bigClearing").getComponent("bigClearing");
                big.onGameEnd(ret.data);
                //console.log(ret.data);
            };
            var data = {
                account:cc.vv.userMgr.account,
                sign:cc.vv.userMgr.sign,
                roomid:parseInt(roomId),
            };
            cc.vv.http.sendRequest("/get_all_history",data,onCreate);
        }
        else{
            //cc.vv.anysdkMgr.shareResult();
        }
        //cc.vv.anysdkMgr.shareResult();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
