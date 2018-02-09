cc.Class({
    extends: cc.Component,

    properties: {
        _seats:[],
    },

    onLoad: function () {
        var seats = this.node.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i]);
        }
    },

    onGameEnd:function(endinfo){
        this.node.active = true;
        var seats = endinfo.seats;
        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            var big = endinfo.big_winner;
            if(big === seats[i].userId){
                var winer = this._seats[i].getChildByName("winer");
                winer.active = true;
            }
            this.showResult(this._seats[i],seat);
        }
    },

    showResult:function(seat,seatdata){
        if(seatdata.name.length > 3){
            seat.getChildByName("name").getComponent(cc.Label).string = seatdata.name.slice(0,3) + "...";
        }
        else{
            seat.getChildByName("name").getComponent(cc.Label).string = seatdata.name;
        }
        seat.getChildByName("id").getComponent(cc.Label).string = "id:" + seatdata.userId;
        seat.getChildByName("icon").getComponent("ImageLoader").setUserID(seatdata.userId);
        if(seatdata.huednum){
            seat.getChildByName("hepai").getChildByName("New Label").getComponent(cc.Label).string = seatdata.huednum;
        }
        else{
            seat.getChildByName("hepai").getChildByName("New Label").getComponent(cc.Label).string = 0;
        }
        seat.getChildByName("zimo").getChildByName("New Label").getComponent(cc.Label).string = seatdata.zimonum;
        seat.getChildByName("piaozi").getChildByName("New Label").getComponent(cc.Label).string = seatdata.piaozi;
        seat.getChildByName("difen").getChildByName("New Label").getComponent(cc.Label).string = seatdata.score;
        seat.getChildByName("total score").getComponent(cc.Label).string = seatdata.score;
        cc.vv.anysdkMgr.shareResult();
    },

    close:function(){
        this.node.active = false;
    },
});
