cc.Class({
    extends: cc.Component,

    properties: {
        _alert:null,
        _title:null,
        _actioning:null,
    },

    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        this._alert = cc.find("Canvas/alertLabel");
        this._content = cc.find("Canvas/alertLabel/content").getComponent(cc.Label);
        this._actioning = false;
        cc.vv.alertLabel = this;
    },

    showOneTime:function(content){
        if(this._actioning == false){
            this._actioning = true;
            this._alert.active = true;
            this._alert.opacity = 255;
            this._content.string = content;
            var call = cc.callFunc(function(terget){
                terget.opacity = 255;
                terget.active = false;
                this._actioning = false;
            },this);
            var action = cc.fadeOut(1.0);
            var cq = cc.sequence(action,call);
            this._alert.runAction(cq);
        }
        
    },

});
