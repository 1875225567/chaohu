cc.Class({
    extends: cc.Component,

    properties: {
        _seats:[],
        _hudepai:null,
    },

    onLoad: function () {
        var listRoot = this._gameover.getChildByName("result_list");
        for(var i = 1; i <= 4; ++i){
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);
            var viewdata = {};
            viewdata.username = sn.getChildByName('name').getComponent(cc.Label);
            viewdata.headimg = sn.getChildByName('head').getChildByName('img').getComponent("ImageLoader");
            viewdata.score = sn.getChildByName('difen').getComponent(cc.Label);
            viewdata.piaozi = sn.getChildByName('piaozi').getComponent(cc.Label);
            viewdata.surplusscore = sn.getChildByName('zongdifen').getComponent(cc.Label);
            viewdata.mahjongs = sn.getChildByName('pai');
            viewdata.zhuang = sn.getChildByName('zhuang');
            viewdata.userid = sn.getChildByName('id').getComponent(cc.Label);
            viewdata.suitPatterns = sn.getChildByName('suitPatterns').getComponent(cc.Label);
            viewdata.hu = sn.getChildByName('hu');
            viewdata.zimo = sn.getChildByName('zimo');
            viewdata.pao = sn.getChildByName('pao');
            viewdata.HU = sn.getChildByName('HU');

            viewdata._pengandgang = [];
            this._seats.push(viewdata);
        }
    },

    onGameOver(data){
        cc.log("cc.vv.gameNetMgr.conf.type:"+cc.vv.gameNetMgr.conf.type);
        if(cc.vv.gameNetMgr.conf.type == 0){
            this.onGameOver_CHGZ(data);
        }
        else{
            this.onGameOver_CHGZ(data);
        }
    },

    onGameOver_CHGZ:function (data) {
        console.log('单局结算: ',data);
        this.node.active = true;

        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        for(var i = 0; i < 4; ++i) {
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            var actionArr = [];
            seatView.hu.active = false;
            seatView.zimo.active = false;
            seatView.pao.active = false;
            seatView.suitPatterns.string = "";
            seatView.HU.active = false;

            if(!userData.huinfo){
                continue;
            }
            for(var j = 0; j < userData.huinfo.length; ++j){
                var info = userData.huinfo[j];
                hued = hued || info.ishupai;

                var str = "";
                var step = "";

                if(!info.ishupai){
                    if(info.action == "fangpao"){
                        seatView.pao.active = true;
                    }
                    else if(info.action == "beiqianggang"){
                        str = "被抢杠 ";
                    }
                }
                else{
                    if(info.action == "hu"){
                        //str = "点炮胡"
                    }
                    else if(info.action == "zimo"){
                        //str = "自摸";
                        seatView.zimo.active = true;
                        if(info.isyadang){
                            str += "自摸压当 ";
                        }
                        else{
                            str += "自摸平胡 ";
                        }
                    }
                    else if(info.action == "ganghua"){
                        if(info.isyadang){
                            str += "自摸压当 杠后开花 ";
                        }
                        else{
                            str += "自摸平胡 杠后开花 ";
                        }
                    }
                    else if(info.action == "dianganghua"){
                        if(info.isyadang){
                            str += "自摸压当 点杠花 ";
                        }
                        else{
                            str += "自摸平胡 点杠花 ";
                        }
                    }
                    else if(info.action == "qiangganghu"){
                        str = "抢杠胡 ";
                    }
                    if(info.action == "zimo"){
                        var num = 2;
                    }
                    else{
                        var num = 1;
                    }
                    for(var w = 0, max = userData.holds.length;w < max;w += 1){
                        var pai = userData.holds[w];
                        if(pai === this._hudepai){
                            userData.holds.splice(w,num);
                            break;
                        }
                    }
                    seatView.HU.active = true;
                    var spri = seatView.HU.getComponent(cc.Sprite);
                    spri.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",this._hudepai);
                    this.fakeAddMagicPai(seatView.HU,this._hudepai);
                }

                if(info.isyadang){
                    if(!seatView.zimo.active){
                        str += /* step +  */"压当";
                        step = " ";
                    }
                }

                if(info.isQiangGangHu){
                    str += step + "抢杠胡";
                    step = " ";
                }

                if(userData.huinfo[0].sifacai ){
                    str += step + "四张发财";
                    step = " ";
                }
                if(userData.huinfo[0].duiduihu ){
                    str += step + "对对胡";
                    step = " ";
                }
                if(userData.huinfo[0].yitiaolong){
                    str += step + "一条龙";
                    step = " ";
                }
                if(userData.huinfo[0].sihe ){
                    str += step + "四合";
                    step = " ";
                }
                if(userData.huinfo[0].haidilao ){
                    str += step + "海底捞月";
                    step = " ";
                }
                if(userData.huinfo[0].buqiuren ){
                    str += step + "不求人";
                    step = " ";
                }
                if(userData.huinfo[0].quanqiuren ){
                    str += step + "全求人";
                    step = " ";
                }
                if(userData.huinfo[0].qingdi ){
                    str += step + "清底";
                    step = " ";
                }
                if(userData.huinfo[0].kuzhiya ){
                    str += step + "枯支压";
                    step = " ";
                }
                if(userData.huinfo[0].hunyise ){
                    str += step + "混一色";
                    step = " ";
                }
                if(userData.huinfo[0].is_QingYiSe){
                    str += step + "清一色";
                    step = " ";
                }
                if(userData.huinfo[0].duanyaojiu ){
                    str += step + "断幺九";
                    step = " ";
                }
                if(userData.huinfo[0].shiyizhi ){
                    str += step + "十一支";
                    step = " ";
                }
                if(userData.huinfo[0].shiyao ){
                    str += step + "十幺";
                    step = " ";
                }
                if(userData.huinfo[0].huangwutong ){
                    str += step + "晃五筒";
                    step = " ";
                }
                if(userData.huinfo[0].duandui ){
                    str += step + "断对";
                    step = " ";
                }
                if(userData.huinfo[0].mozi){
                    str += step + "摸子";
                    step = " ";
                }
                if(userData.huinfo[0].liulian ){
                    str += step + "六连";
                    step = " ";
                }
                if(userData.huinfo[0].duyao){
                    str += step + "独幺";
                    step = " ";
                }
                if(userData.huinfo[0].jiuzhizi ){
                    str += step + "九只子";
                    step = " ";
                }
                actionArr.push(str);
            }
            
            if(!seatView.zimo.active){
                seatView.hu.active = hued;
            }
            
            if(userData.angangs.length){
                actionArr.push("暗杠x" + userData.angangs.length);
            }
            
            if(userData.diangangs.length){
                actionArr.push("明杠x" + userData.diangangs.length);
            }
            
            if(userData.wangangs.length){
                actionArr.push("补杠x" + userData.wangangs.length);
            }
            seatView.suitPatterns.string = actionArr.join(" ");

            if(cc.vv.gameNetMgr.seats[i].name.length > 3){
                seatView.username.string = cc.vv.gameNetMgr.seats[i].name.slice(0,3) + "...";
            }
            else{
                seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            }
            
            seatView.userid.string = "id:" + userData.userId;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;

            seatView.headimg.setUserID(userData.userId);

            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;
            }
            else{
                seatView.score.string = userData.score;
            }

            if(userData.piaozi > 0){
                seatView.piaozi.string = "+" + userData.piaozi;
            }
            else{
                seatView.piaozi.string = userData.piaozi;
            }
            
            cc.vv.gameNetMgr.seats[i].totalscore = userData.totalscore;
            cc.vv.gameNetMgr.seats[i].piaozi += userData.piaozi;
            seatView.surplusscore.string = userData.totalscore;


            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }

            //cc.vv.mahjongmgr.sortMJ(userData.holds,userData.dingque);

            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;

            var lackingNum = (userData.pengs.length + numOfGangs)*3;

            //userData.holds.sort();

            //显示相关的牌
            var holds = userData.holds;
            function sortNum(a, b) { return a-b};
            holds.sort(sortNum);
            if(cc.vv.gameNetMgr.magicpai && cc.vv.gameNetMgr.conf.wanfa == 2){
                var num = holds.indexOf(cc.vv.gameNetMgr.magicpai);
                if(num !== -1){
                    var num3 = holds.lastIndexOf(cc.vv.gameNetMgr.magicpai) - num + 1;
                    var str = holds.splice(num,num3);
                    for(var x = 0; x < num3;x += 1){
                        holds.unshift(str[0]);
                    }
                }
            }
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                if(n){
                    n.active = true;
                    var sprite = n.getComponent(cc.Sprite);
                    if(sprite){
                        if(sprite.spriteFrame != null){
                            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
                            this.fakeAddMagicPai(n,pai);
                        }
                        else{
                            console.log("mahjons children n:"+n);
                        }
                    }
                }
            }


            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }

            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;
            }

            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;
            }

            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;
            }

            //初始化碰牌
            var pengs = userData.pengs;
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;
                }
            }
        }
    },

    fakeAddMagicPai:function(paiNode,pai){
        if(cc.vv.gameNetMgr.magicpai == pai && cc.vv.gameNetMgr.conf.wanfa == 2){
            if(!paiNode.getChildByName('laizi')){
                cc.loader.loadRes('prefabs/laizi',function(err,prefab){
                    var laizi = cc.instantiate(prefab);
                    paiNode.addChild(laizi);
                });
            }
        }
        else{
            if(paiNode.getChildByName('laizi')){
                paiNode.removeChild(paiNode.getChildByName('laizi'));
            }
        }
    },

    initPengAndGangs:function(seatView,index,mjid,flag){
        var pgroot = null;
        if(seatView._pengandgang.length <= index){
            pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabSelf);
            seatView._pengandgang.push(pgroot);
            seatView.mahjongs.addChild(pgroot);    
        }
        else{
            pgroot = seatView._pengandgang[index];
            pgroot.active = true;
        }

        var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        for(var s = 0; s < sprites.length; ++s){
            var sprite = sprites[s];
            if(sprite.node.name == "gang"){
                var isGang = flag != "peng";
                sprite.node.active = isGang;
                sprite.node.scaleX = 1;
                sprite.node.scaleY = 1;
                if(flag == "angang"){
                    sprite.spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame("myself");
                    sprite.node.width = 43;
                    sprite.node.height = 67;
                }   
                else{
                    sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",mjid);    
                }
            }
            else{ 
                sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",mjid);
            }
        }
        pgroot.x = -250 + (index * 43 * 3 + index * 10);
        pgroot.y = 64;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
