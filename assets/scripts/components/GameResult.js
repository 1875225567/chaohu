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
        _gameresult:null,
        _seats:[],
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this._gameresult = this.node.getChildByName("GameResult");
        // this._gameresult.active = false;
        
        var seats = this._gameresult.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i]);
        }
        
        var btnClose = cc.find("Canvas/GameResult/btn_back");
        if(btnClose){
            cc.vv.utils.addClickEvent(btnClose,this.node,"GameResult","onBtnCloseClicked");
        }
        
        var btnShare = cc.find("Canvas/GameResult/btn_share");
        if(btnShare){
            cc.vv.utils.addClickEvent(btnShare,this.node,"GameResult","onBtnShareClicked");
        }
        
        //初始化网络事件监听器
        var self = this;
        this.node.on('game_end',function(data){
            self.onGameEnd(data.detail);
        });
    },

    onGameEnd:function(endinfo){
        //this._gameresult.active = true;
        cc.log('总结算:', endinfo/* JSON.stringify() */);
        var seats = cc.vv.gameNetMgr.seats;
        // var maxscore = -1;
        // var maxdianpao = 0;
        // var dianpaogaoshou = -1;
        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            // if(seat.score > maxscore){
            //     maxscore = seat.score;
            // }
            // if(endinfo[i].numdianpao > maxdianpao){
            //     maxdianpao = endinfo[i].numdianpao;
            //     dianpaogaoshou = i;
            // }
            var big = endinfo[0].big_winner;
            if(big === seats[i].userid){
                var winer = this._seats[i].getChildByName("winer");
                winer.active = true;
            };
            this.showResult(this._seats[i],seat,endinfo[i]);
        };

        // for(var i = 0; i < seats.length; ++i){
        //     var seat = seats[i];
        //     var isBigwin = false;
        //     if(seat.score > 0){
        //         isBigwin = seat.score == maxscore;
        //     }
        //     this._seats[i].setInfo(seat.name,seat.score,seat.piao,isBigwin);
        //     this._seats[i].setID(seat.userid);
        //     var isZuiJiaPaoShou = dianpaogaoshou == i;
        //     this.showResult(this._seats[i],seat,endinfo[i],isZuiJiaPaoShou);
        // }
    },

    showResult:function(seat,seatdata,info){
        //seat.getChildByName("winer").active = isZuiJiaPaoShou;
        var userName = seat.getChildByName("name").getComponent(cc.Label);
        if(seatdata.name.length > 3){
            userName.string = seatdata.name.slice(0,3) + "...";
        }
        else{
            userName.string = seatdata.name;
        }
        var userId = seat.getChildByName("id").getComponent(cc.Label);
        userId.string = "id:" + seatdata.userid;
        var userIcon = seat.getChildByName("icon").getComponent("ImageLoader");
        userIcon.setUserID(seatdata.userid);
        var userHepai = seat.getChildByName("hepai").getComponent(cc.Label);
        if(info.huednum){
            userHepai.string = info.huednum;
        }
        else{
            userHepai.string = 0;
        }
        var userZimo = seat.getChildByName("zimo").getComponent(cc.Label);
        userZimo.string = info.zimonum;
        var userPiaozi = seat.getChildByName("piaozi").getComponent(cc.Label);
        userPiaozi.string = info.piaozi;
        var userDifen = seat.getChildByName("difen").getComponent(cc.Label);
        userDifen.string = info.score;
        var userTotalScore = seat.getChildByName("totalScore").getComponent(cc.Label);
        userTotalScore.string = info.all;
    },

    onBtnCloseClicked:function(){
        cc.vv.wc.show('正在返回游戏大厅');
        cc.director.loadScene("hall");
    },
    
    onBtnShareClicked:function(){
        cc.vv.anysdkMgr.shareResult();
    }
});
