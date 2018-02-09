cc.Class({
    extends: cc.Component,

    properties: {
        queYiMen:null,
        tips:[],
        selected:[],
        dingques:[],
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    start: function () {
        if(cc.vv == null){
            return;
        }
        this.initView();
        this.initDingQue();
        this.initEventHandlers();
    },
    
    initView:function(){
        let gameChild = this.node.getChildByName("game");
        this.queYiMen = gameChild.getChildByName("dingque");
        this.queYiMen.active = cc.vv.gameNetMgr.isDingQueing;
        
        let arr = ["myself","right","up","left"];
        for(let i = 0; i < arr.length; ++i){
            let side = gameChild.getChildByName(arr[i]);
            let seat = side.getChildByName("seat");
            let dingque = seat.getChildByName("que");
            this.dingques.push(dingque);
        }
        this.reset();
        
        let tips = this.queYiMen.getChildByName("tips");
        for(let i = 0; i < tips.childrenCount; ++i){
            let n = tips.children[i];
            this.tips.push(n.getComponent(cc.Label));
        }
        
        if(cc.vv.gameNetMgr.gamestate == "dingque"){
            this.showDingQueChoice();
        }
    },
    
    initEventHandlers:function(){
        let self = this;
        this.node.on('game_dingque',function(data){
            self.showDingQueChoice();
        });
        
        this.node.on('game_dingque_notify',function(data){
            let seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail);
            let localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
            console.log("game_dingque_notify:" + localIndex);
            self.tips[localIndex].node.active = true;
        });
        
        this.node.on('game_dingque_finish',function(){
            //通知每一个玩家定缺的花色
            self.queYiMen.active = false;
            cc.vv.gameNetMgr.isDingQueing = false;
            self.initDingQue();
        });
    },
    
    showDingQueChoice:function(){
        this.queYiMen.active = true;
        let sd = cc.vv.gameNetMgr.getSelfData();
        let typeCounts = [0,0,0];
        for(let i = 0; i < sd.holds.length; ++i){
            let pai = sd.holds[i];
            let type = cc.vv.mahjongmgr.getMahjongType(pai);
            typeCounts[type]++;
        }
        
        let min = 65535;
        let minIndex = 0;
        for(let i = 0; i < typeCounts.length; ++i){
            if(typeCounts[i] < min){
                min = typeCounts[i];
                minIndex = i;
            }
        }
        
        let arr = ["tong","tiao","wan"];
        for(let i = 0; i < arr.length; ++i){
            let node = this.queYiMen.getChildByName(arr[i]);
            if(minIndex == i){
                node.getComponent(cc.Animation).play("dingque_tuijian");
            }
            else{
                node.getComponent(cc.Animation).stop();
            }
            //this.queYiMen.getChildByName(arr[i]).getChildByName('jian').active = minIndex == i;    
        }
        
        this.reset();
        for(let i = 0; i < this.tips.length; ++i){
            let n = this.tips[i];
            if(i > 0){
                n.node.active = false;                
            }
            else{
                n.node.active = true;
            }
        }
    },
    
    initDingQue:function(){
        let arr = ["tong","tiao","wan"];
        let data = cc.vv.gameNetMgr.seats;
        for(let i = 0; i < data.length; ++i){
            let que = data[i].dingque;
            if(que == null || que < 0 || que >= arr.length){
                que = null;
            }
            else{
                que = arr[que]; 
            }
            
            let localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
            if(que){
                this.dingques[localIndex].getChildByName(que).active = true;    
            }
        }
    },
    
    reset:function(){
        this.setInteractable(true);
        
        this.selected.push(this.queYiMen.getChildByName("tong_selected"));
        this.selected.push(this.queYiMen.getChildByName("tiao_selected"));
        this.selected.push(this.queYiMen.getChildByName("wan_selected"));
        for(let i = 0; i < this.selected.length; ++i){
            this.selected[i].active = false;
        }        
        
        for(let i = 0; i < this.dingques.length; ++i){
            for(let j = 0; j < this.dingques[i].children.length; ++j){
                this.dingques[i].children[j].active = false;    
            }
        }
    },
    
    onQueYiMenClicked:function(event){
        let type = 0;
        if(event.target.name == "tong"){
            type = 0;
        }
        else if(event.target.name == "tiao"){
            type = 1;
        }
        else if(event.target.name == "wan"){
            type = 2;
        }
        
        for(let i = 0; i < this.selected.length; ++i){
            this.selected[i].active = false;
        }  
        this.selected[type].active = true;
        //cc.vv.gameNetMgr.dingque = type;
        cc.vv.net.send("dingque",type);
        
        //this.setInteractable(false);
    },
    
    setInteractable:function(value){
        this.queYiMen.getChildByName("tong").getComponent(cc.Button).interactable = value;
        this.queYiMen.getChildByName("tiao").getComponent(cc.Button).interactable = value;
        this.queYiMen.getChildByName("wan").getComponent(cc.Button).interactable = value;        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
