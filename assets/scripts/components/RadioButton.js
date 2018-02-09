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
        target:cc.Node,
        sprite:cc.SpriteFrame,
        checkedSprite:cc.SpriteFrame,
        checked:false,
        groupId:-1,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        if(cc.vv.radiogroupmgr == null){
            var RadioGroupMgr = require("RadioGroupMgr");
            cc.vv.radiogroupmgr = new RadioGroupMgr();
            cc.vv.radiogroupmgr.init();
        }
        console.log(typeof(cc.vv.radiogroupmgr.add));
        cc.vv.radiogroupmgr.add(this);
        if(this.node.name === "putonghua"){
            var _checked = this.node.getComponent("RadioButton");
            var voice = cc.sys.localStorage.getItem("voice");
            if(voice === "pu"){
                _checked.checked = true;
            }
            else if(voice === "fang"){
                _checked.checked = false;
            }
        }
        
        if(this.node.name === "difanghua"){
            var _checked = this.node.getComponent("RadioButton");
            var voice = cc.sys.localStorage.getItem("voice");
            if(voice === "pu"){
                _checked.checked = false;
            }
            else if(voice === "fang"){
                _checked.checked = true;
            }
        }
                
        if(this.node.name === "green"){
            var _checked = this.node.getComponent("RadioButton");
            var tableclothData = JSON.parse(cc.sys.localStorage.getItem('tableclothData'));
            if(tableclothData.color === "green"){
                _checked.checked = true;
            }
            else if(tableclothData.color === "red"){
                _checked.checked = false;
            }
        }
                
        if(this.node.name === "red"){
            var _checked = this.node.getComponent("RadioButton");
            var tableclothData = JSON.parse(cc.sys.localStorage.getItem('tableclothData'));
            if(tableclothData.color === "green"){
                _checked.checked = false;
            }
            else if(tableclothData.color === "red"){
                _checked.checked = true;
            }
        }
        this.refresh();
    },
    
    refresh:function(){
        var targetSprite = this.target.getComponent(cc.Sprite);
        if(this.checked){
            targetSprite.spriteFrame = this.checkedSprite;
        }
        else{
            targetSprite.spriteFrame = this.sprite;
        }

    },
    
    check:function(value){
        this.checked = value;
        this.refresh();
    },
    
    onClicked:function(){
        cc.vv.radiogroupmgr.check(this);
        var node = this.node.name;
        var quanOrGuo = cc.find("Canvas/CreateRoom1/game_list/chgz");
        if(node === "baidahu"){
            var bool = true;
        }
        else if(node === "changguimoshi" || node === "wuyabukai"){
            var bool = false;
        }
        else{
            return;
        }
        if(quanOrGuo){
            if(quanOrGuo.active){
                var nodeArr = cc.find("Canvas/CreateRoom1/game_list/chgz/zidingyixuanze");
            }
            else{
                var nodeArr = cc.find("Canvas/CreateRoom1/game_list/chqz/zidingyixuanze");
            }

            for(var i = 0, max = nodeArr.childrenCount; i < max; i += 1){
                var act = nodeArr.children[i].getChildByName("shade");
                if(act){
                    if(act.active === bool){
                        return;
                    }
                    else{
                        act.active = bool;
                    }
                    if(bool){
                        var btn = nodeArr.children[i].getComponent("CheckBox");
                        var btn1 = nodeArr.children[i].getChildByName("button");
                        btn.checked = false;
                        btn.pretendCheck(btn1);
                    }
                }
            }
        }
    },

    onDestroy:function(){
        if(cc.vv && cc.vv.radiogroupmgr){
            cc.vv.radiogroupmgr.del(this);            
        }
    },

    putonghua:function(){
        cc.sys.localStorage.setItem("voice","pu");
    },
    
    difanghua:function(){
        cc.sys.localStorage.setItem("voice","fang");
    },
});
