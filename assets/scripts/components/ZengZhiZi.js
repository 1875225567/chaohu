cc.Class({
    extends: cc.Component,

    properties: {
        checked:false,
        target:cc.Node,
        sprite_shade:cc.SpriteFrame,
        sprite_light:cc.SpriteFrame,
        sprite:cc.SpriteFrame,
        checkedSprite:cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function () {
    },
    refresh:function () {
        let targetSprite = this.target.getComponent(cc.Sprite);
        let childSprite = this.target.getChildByName('sp').getComponent(cc.Sprite);
        if(this.checked){
            targetSprite.spriteFrame = this.sprite_light;
            childSprite.spriteFrame = this.checkedSprite;
        }else{
            targetSprite.spriteFrame = this.sprite_shade;
            childSprite.spriteFrame = this.sprite;
        }
    },
    onClicked:function () {
        this.checked = !this.checked;
        this.refresh();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
