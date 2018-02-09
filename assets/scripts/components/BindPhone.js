cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        _btn_bind:cc.Node
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
            var bool = /^1[3|4|5|8][11]\d{4,8}$/.test(code);
            if(code.length === 11 && bool){
                this.node.active = false;
                var onGet = function(ret){
                    if(ret.errcode !== 0){
                        cc.vv.alertLabel.showOneTime(ret.errmsg);
                    }
                    else{
                        cc.vv.alertLabel.showOneTime("绑定成功");
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

    closeInvite:function(){
        this.node.active = false;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
