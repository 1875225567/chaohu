cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        _btn_bind:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this._btn_bind = this.node.getChildByName('bind');
        cc.vv.utils.addClickEvent(this._btn_bind,this.node,"BindPhone","onBtnClicked");
    },

    onEnable:function () {
        this.node.getChildByName('EditBox').getComponent(cc.EditBox).string = '';
    },

    onBtnClicked:function (event) {
        if(event.target.name === 'bind'){
            let code = this.node.getChildByName('EditBox').getComponent(cc.EditBox).string;
            // var bool = /^1[3|4|5|7|8][11]\d{4,8}$/.test(code);/^[1][3,4,5,7,8][0-9]{9}$/
            var bool = /^[1][3,4,5,7,8,9][0-9]{9}$/.test(code);
            if(code.length === 11 && bool){
                this.node.active = false;
                var onGet = function(ret){
                    if(ret.errcode !== 0){
                        cc.vv.alertLabel.showOneTime(ret.errmsg);
                    }
                    else{
                        cc.vv.alertLabel.showOneTime("绑定成功");
                        this.refreshData();
                    }
                };
                
                var data = {
                    account:cc.vv.userMgr.account,
                    sign:cc.vv.userMgr.sign,
                    userid:cc.vv.userMgr.userId,
                    tel:code,
                };
                cc.vv.http.sendRequest("/set_tel",data,onGet.bind(this));
                //发送邀请码
            }else{
                let content = '手机号码输入错误!';
                cc.vv.alertLabel.showOneTime(content);
                this.node.getChildByName('EditBox').getComponent(cc.EditBox).string = '';
            }

        }
    },

    refreshData:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret);
                if(ret.data.gems !== null){
                    cc.vv.userMgr.tel = ret.data.tel;
                    console.log(cc.vv.userMgr.tel);
                    cc.find("Canvas/top_left/headinfo/card/label").getComponent(cc.Label).string = ret.data.gems;
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_user_data_at_present",data,onGet.bind(this));
    },

    closeInvite:function(){
        this.node.active = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
