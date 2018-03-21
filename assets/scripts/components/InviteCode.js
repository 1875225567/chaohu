cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        _btn_bind:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this._btn_bind = this.node.getChildByName('bind');
        cc.vv.utils.addClickEvent(this._btn_bind,this.node,"InviteCode","onBtnClicked");
        // if(cc.vv.userMgr.parentid !== null){
        //     this._btn_bind.active = false;
        //     this.node.getChildByName('EditBox').active = false;
        //     this.node.getChildByName('sprite').active = false;
        //     this.node.getChildByName('label').getComponent(cc.Label).string = "邀请码已绑定！";
        // }
    },

    onEnable:function () {
        this.node.getChildByName('EditBox').getComponent(cc.EditBox).string = '';
    },

    onBtnClicked:function (event) {
        if(event.target.name === 'bind'){
            let code = this.node.getChildByName('EditBox').getComponent(cc.EditBox).string;
            if(code.length <= 8){
                this.node.active = false;
                var self = this;
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
                    parentid :parseInt(code),
                };
                cc.vv.http.sendRequest("/set_parentid",data,onGet.bind(this));
                //发送邀请码
            }else{
                let content = '邀请码错误!';
                cc.vv.alertLabel.showOneTime(content);
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
                if(ret.data.gems != null){
                    cc.vv.userMgr.parentid = ret.data.parentid;
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
