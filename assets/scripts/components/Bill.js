cc.Class({
    extends: cc.Component,

    properties: {
        billItem:{
            default:null,
            type:cc.Prefab,
        },
        money:cc.Label,
        billContent:cc.Node,
        _billData:null,
    },

    // use this for initialization
    onLoad: function () {
/*         cc.vv.net.addHandler("get_game_conf",function(data){
            console.log(data);
        }); */
    },

    clickedBill:function(){
        //cc.vv.net.send("get_shop_conf",cc.vv.userMgr.userId);
        //cc.vv.net.send("get_game_conf",cc.vv.userMgr.userId);
        this.request();
        this.node.active = true;
    },
    closeBill:function(){
        this.node.active = false;
    },

    initBillView:function(){
        if(this._billData.money){
            this.money.string = '余额：' + this._billData.money;
        }
        else{
            this.money.string = '余额：0';
        }
        var billdatalist = this._billData.bill;
        if(billdatalist.length > 0){
            this.billContent.removeAllChildren();
        }
        if(this._billData){
            var billdatalist = this._billData.bill;
            for (let i = 0; i < billdatalist.length; i++) {
                var node = cc.instantiate(this.billItem);
                this.billContent.addChild(node);
                if(billdatalist[i].type === "buy"){
                    var str = "充值";
                }
                else if(billdatalist[i].type === "brokerage "){
                    var str = "分成";
                }
                node.getChildByName('typeLabel').getComponent(cc.Label).string = str;
                node.getChildByName('number').getComponent(cc.Label).string = billdatalist[i].count;
                node.getChildByName('userid').getComponent(cc.Label).string = "ID："+billdatalist[i].source;
                node.getChildByName('time').getComponent(cc.Label).string = billdatalist[i].time;
                node.y = -25 - (i * 50);
            }
            this.billContent.height = billdatalist.length * 50;
        }
    },

    request:function(){
        var self = this;
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                self._billData = ret;
                self.initBillView();
                console.log(ret);
            }
        };

        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            userid:cc.vv.userMgr.userId,
        };
        cc.vv.http.sendRequest("/get_bill",data,onCreate);
    },
});
