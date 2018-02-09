cc.Class({
    extends: cc.Component,

    properties: {
        target:cc.Node,
        _isShow:false
    },

    // use this for initialization
    onLoad: function () {

        cc.vv.wl = this;
        this.node.active = this._isShow;
    },

    // called every frame, uncomment this function to activate update callback
     update: function (dt) {
         this.target.rotation = this.target.rotation - dt*45;
     },

    show:function () {
        this._isShow = true;
        if(this.node){
            this.node.active = this._isShow;
        }
    },

    hide:function () {
        this._isShow = false;
        if(this.node){
            this.node.active = this._isShow;
        }
    }
});
