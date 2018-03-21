cc.Class({
    extends: cc.Component,

    properties: {
       _component:null,
       _info:null,
       _ZengZhiZi:null,
    },

    // use this for initialization
    onLoad: function () {
        this._ZengZhiZi = cc.find("Canvas/zengzhizi");
        let select = this._ZengZhiZi.getChildByName('select');
        this._component = [];
        for(let i = 0; i < select.childrenCount; i++){
            let n = select.children[i].getComponent('ZengZhiZi');
            if(n !== null){
                this._component.push(n);
            }
        }
        
        // if(cc.vv.gameNetMgr.conf.type !== 1){
            var gray = this._ZengZhiZi.getChildByName('gray');
            for(var i = 0, max = gray.childrenCount; i < max; i += 1){
                var child = gray.children[i];
                if(child.name !== "lantern0"){
                    child.active = true;
                }
            }
        // }
        //this.initEventHandlers();
    },

    SelectFinshed:function () {
        this._info = [];
        for(let i = 0; i < this._component.length; i++){
            if( this._component[i].checked){
                this._info.push(i);
            }
        }
        cc.vv.net.send("zengzhizi",this._info);
        console.log("已发送增志子。");
        this._ZengZhiZi.active = false;
    },

    
    initEventHandlers:function(){
        let self = this;
    },

    show:function(){
        cc.find("Canvas/zengzhizi").active = true;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
