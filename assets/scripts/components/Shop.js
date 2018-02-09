cc.Class({
    extends: cc.Component,

    properties: {
        _verify:null,
    },

    // use this for initialization
    onLoad: function () {
        this._verify = false;
    },

    openUrl1:function(){
        // if(this._verify == true){
        //     cc.sys.openURL("https://cn.bing.com");
        // }
        // else{
        //     cc.vv.alertLabel.showOneTime('请绑定代理');
        // }
        this.goToPay(0);
    },
    openUrl2:function(){
        // if(this._verify == true){
        //     cc.sys.openURL("https://cn.bing.com");
        // }
        // else{
        //     cc.vv.alertLabel.showOneTime('请绑定代理');
        // }
        this.goToPay(1);
    },
    openUrl3:function(){
        // if(this._verify == true){
        //     cc.sys.openURL("https://cn.bing.com");
        // }
        // else{
        //     cc.vv.alertLabel.showOneTime('请绑定代理');
        // }
        this.goToPay(2);
    },
    openUrl4:function(){
        // if(this._verify == true){
        //     cc.sys.openURL("https://cn.bing.com");
        // }
        // else{
        //     cc.vv.alertLabel.showOneTime('请绑定代理');
        // }
        this.goToPay(3);
    },
    openUrl5:function(){
        // if(this._verify == true){
        //     cc.sys.openURL("https://cn.bing.com");
        // }
        // else{
        //     cc.vv.alertLabel.showOneTime('请绑定代理');
        // }
        this.goToPay(4);
    },
    openUrl6:function(){
        // if(this._verify == true){
        //     cc.sys.openURL("https://cn.bing.com");
        // }
        // else{
        //     cc.vv.alertLabel.showOneTime('请绑定代理');
        // }
        this.goToPay(5);
    },

    goToPay:function(idx){
        var onGet = function(ret){
            if(ret.errcode !== 0){
                cc.vv.alertLabel.showOneTime('错误');
            }
            else{
                console.log(ret);
                cc.sys.openURL(ret.url);
            }
        };
        var data = {
            index: idx,
            userId: cc.vv.userMgr.userId,
        };
        cc.vv.http.sendRequest("/gotoPay",data,onGet.bind(this));
    },
    
    verifyBind:function(){
        // var onGet = function(ret){
        //     if(ret.errcode !== 0){
        //         cc.vv.alertLabel.showOneTime('错误');
        //     }
        //     else{
        //         if(ret.data.parentid){
        //             this._verify = true;
        //         }
        //         else{
        //             this._verify = false;
        //         }
        //     }
        // };
        // var data = {
        //     account:cc.vv.userMgr.account,
        //     sign:cc.vv.userMgr.sign,
        //     userid:cc.vv.userMgr.userId,
        // };
        // cc.vv.http.sendRequest("/get_user_data_by_userid",data,onGet.bind(this));

        var self = this;
        var onFakeGet = function(ret){
            self.recorData(ret.data);
        };
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_shop_conf",data,onFakeGet.bind(this));
    },

    recorData:function(data){
        for(var i = 0, max = 6; i < max; i += 1){
            var childName = "card" + (i + 1);
            var child = this.node.getChildByName(childName);
            var count = child.getChildByName("count").getComponent(cc.Label);
            var price = child.getChildByName("price").getComponent(cc.Label);
            var gift = child.getChildByName("gift");
            for(var j = 0, max1 = data.length; j < max1; j += 1){
                if(data[j].index === i){
                    count.string = data[j].count + "张房卡";
                    price.string = "￥" + data[j].price;
                    var gifts = parseInt(data[j].gift);
                    if(gifts > 0){
                        gift.active = true;
                        gift.children[0].getComponent(cc.Label).string = "×" + gifts;
                    }
                }
                // break;
            }
        }
        this.node.active = true;
    },
});
