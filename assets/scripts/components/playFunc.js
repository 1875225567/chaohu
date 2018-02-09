cc.Class({
    extends: cc.Component,

    properties: {
        piaozifenLabel:{
            default:null,
            type:cc.Label,
        },
        playfuncLabel:{
            default:null,
            type:cc.Label,
        },
        userdefinedLabel:{
            default:null,
            type:cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
        if(!cc.vv.gameNetMgr.conf){
            cc.director.loadScene("loading");
            return;
        }

        var conf = cc.vv.gameNetMgr.conf;
        console.log(conf);
        this.piaozifenLabel.string = "漂子分：" + conf.piaozifen;

        if(conf.wanfa == 0){
            this.playfuncLabel.string = "玩法：常规";
        }
        else if(conf.wanfa == 1){
            this.playfuncLabel.string = "玩法：无压不开";
        }
        else if(conf.wanfa == 2){
            this.playfuncLabel.string = "玩法：百搭胡";
        }

        this.userdefinedLabel.string = cc.vv.gameNetMgr.getWanfa();
    },

    clickedPlayFunc:function(){
        this.node.active = true;
    },
    closePlayFunc:function(){
        this.node.active = false;
    },
});
