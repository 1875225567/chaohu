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
    },

    // use this for initialization
    onLoad: function () {
        var quanOrGuo = cc.find("Canvas/CreateRoom1/game_list/chgz");
        if(quanOrGuo){
            var roomOption = JSON.parse(cc.sys.localStorage.getItem("roomOption"));
            if(quanOrGuo.active){
                var nodeData = roomOption.chgz;
            }else{
                var nodeData = roomOption.chqz;
            }

            for(var i = 0, max = nodeData.length; i < max; i += 1){
                if(this.node.name === nodeData[i]){
                    var _checked = this.node.getComponent("CheckBox");
                    _checked.checked = true;
                    break;
                }
            }
        }
        this.refresh();
    },
    
    onClicked:function(){
        this.checked = !this.checked;
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
        let scene = cc.director.getScene();
        if(scene.name === 'login'){
            let btn_yk = scene.getChildByName('Canvas').getChildByName('btn_yk');
            if(btn_yk.active){
                btn_yk.getComponent(cc.Button).interactable = this.checked;
            }
            let btn_weixin = scene.getChildByName('Canvas').getChildByName('btn_weixin');
            if(btn_weixin.active){
                btn_weixin.getComponent(cc.Button).interactable = this.checked;
            }
        }
    },
    
    pretendCheck:function(node){
        var targetSprite = node.getComponent(cc.Sprite);
        targetSprite.spriteFrame = this.sprite;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
