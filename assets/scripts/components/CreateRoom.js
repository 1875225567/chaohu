cc.Class({
    extends: cc.Component,

    properties: {
        _leixingxuanze: null,

        _guozixuanze:null,
        _G_zhifuxuanze:null,
        _G_piaozixuanze:null,
        _G_wanfaxuanze:null,
        _G_zidingyixuanze:null,

        _quanshuxuanze:null,
        _Q_zhifuxuanze:null,
        _Q_piaozixuanze:null,
        _Q_wanfaxuanze:null,
        _Q_zidingyixuanze:null,
        _game_list:null,
        _game_conf:null,
    },

    // use this for initialization
    onLoad: function () {
        this.ruleWindow = cc.find('Canvas/rule');
        var btn_rule = this.node.getChildByName('btn_rule');
        cc.vv.utils.addClickEvent(btn_rule,this.node,'CreateRoom','onBtnClicked');
        this.ruleWindow.addComponent('OnBack');
        
        //cc.find("Canvas/CreateRoom1/tip").active = false;

        //锅子圈数
        this._leixingxuanze = [];
        var t = this.node.getChildByName("leixingxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._leixingxuanze.push(n);
            }
        }

        if(this.getType() == 0){//"chgz"){
            this._game_list = this.node.getChildByName("game_list").getChildByName('chgz');
        }
        else{
            this._game_list = this.node.getChildByName("game_list").getChildByName('chqz');
        }

        //-------------------------------------------------------锅子玩法------------------------------------------
        //锅子选择
        this._guozixuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chgz').getChildByName('guozi');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._guozixuanze.push(n);
            }
        }

        //支付选择
        this._G_zhifuxuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chgz').getChildByName('zhifuxuanze');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._G_zhifuxuanze.push(n);
            }
        }

        //漂子选择
        this._G_piaozixuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chgz').getChildByName('piaozixuanze');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._G_piaozixuanze.push(n);
            }
        }

        //玩法选择
        this._G_wanfaxuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chgz').getChildByName('wanfaxuanze');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._G_wanfaxuanze.push(n);
            }
        }

        //自定义
        this._G_zidingyixuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chgz').getChildByName('zidingyixuanze');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("CheckBox");
            if (n != null) {
                this._G_zidingyixuanze.push(n);
            }
        }

        //------------------------------------------------------圈数玩法-----------------------------------
        //圈数选择
        this._quanshuxuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chqz').getChildByName('quanshu');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._quanshuxuanze.push(n);
            }
        }

        //支付
        this._Q_zhifuxuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chqz').getChildByName('zhifuxuanze');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._Q_zhifuxuanze.push(n);
            }
        }

        //漂子
        this._Q_piaozixuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chqz').getChildByName('piaozixuanze');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._Q_piaozixuanze.push(n);
            }
        }

        //玩法
        this._Q_wanfaxuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chqz').getChildByName('wanfaxuanze');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._Q_wanfaxuanze.push(n);
            }
        }

        //自定义
        this._Q_zidingyixuanze = [];
        var t = this.node.getChildByName("game_list").getChildByName('chqz').getChildByName('zidingyixuanze');
        for (var i = 0; i < t.childrenCount; ++i) {
            var n = t.children[i].getComponent("CheckBox");
            if (n != null) {
                this._Q_zidingyixuanze.push(n);
            }
        }
        
        this.roomCardShow();
    },

    numberOfGames:function(){
        var self = this;
        var onFakeGet = function(ret){
            var data = ret.data;
            var gzNum = cc.find("game_list/chgz/number",this.node);
            var qzNum = cc.find("game_list/chqz/number",this.node);
            for(var i = 0, max = gzNum.childrenCount; i < max; i += 1){
                var gzNode = gzNum.children[i].getComponent(cc.Label);
                var qzNode = qzNum.children[i];
                var multiple = i + 1;
                if(multiple % 2 === 0){ 
                    data.guozi[i] = data.guozi[i] / 4;
                }
                gzNode.string = data.guozi[i];
                if(qzNode){
                    if(multiple % 2 === 0){ 
                        data.quanzi[i] = data.quanzi[i] / 4;
                    }
                    qzNode.getComponent(cc.Label).string = data.quanzi[i];
                }
            }
            self._game_conf = data;
        };
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_game_conf",data,onFakeGet.bind(this));
    },

    onBtnBack: function () {
        this.node.active = false;
    },

    onBtnOK: function () {
        this.node.active = false;
        this.createRoom();
        var roomOption = JSON.parse(cc.sys.localStorage.getItem("roomOption"));
        var roomData = this.constructSCMJConf();
        var option = [];
        roomData.zhifu === 0 ? option.push("AA") : option.push("fangzhu");
        if(roomData.facaidaikao === 1) option.push("facaidaikao");
        if(roomData.duanyaojiu === 1) option.push("duanyao9");
        if(roomData.shiyao === 1) option.push("10yao");
        if(roomData.duandui === 1) option.push("duandui");
        if(roomData.shiyizhi === 1) option.push("shiyizhi");
        if(roomData.zengzhizi === 1) option.push("zengzhizi");

        if(roomData.wanfa === 0){
            option.push("changguimoshi");
        }else if(roomData.wanfa === 1){
            option.push("wuyabukai");
        }else{
            option.push("baidahu");
        }

        if(roomData.piaozifen === 0){
            option.push("3");
        }else if(roomData.piaozifen === 1){
            option.push("5");
        }else if(roomData.piaozifen === 2){
            option.push("10");
        }else{
            option.push("20");
        }

        console.log(this.getType());
        if(this.getType() === 0){
            if(roomData.difen === 0){
                option.push("30");
            }else if(roomData.difen === 1){
                option.push("50");
            }else{
                option.push("100");
            }

            roomOption.chgz = option;
        }else{
            if(roomData.jushuxuanze === 0){
                option.push("2");
            }else if(roomData.jushuxuanze === 1){
                option.push("4");
            }
            
            if(roomData.huangwutong === 1) option.push("huangwutong");
            if(roomData.erjiatou === 1) option.push("erjiatou");

            roomOption.chqz = option;
        }
        cc.sys.localStorage.setItem("roomOption", JSON.stringify(roomOption));
        console.log(roomOption);
    },

    viewTips:function(){
        //cc.find("Canvas/CreateRoom1/tip").active = true;
    },

    closeTips:function(){
        //cc.find("Canvas/CreateRoom1/tip").active = false;
    },

    getType: function () {
        var type = 0;
        for (var i = 0; i < this._leixingxuanze.length; ++i) {
            if (this._leixingxuanze[i].checked) {
                type = i;
                break;
            }
        }
        if (type == 0) {
            return 0;//'chgz';
        }
        else if (type == 1) {
            return 1;//'chqz';
        }
        return 0;//'chgz';
    },

    createRoom: function () {
        var self = this;
        var roomCard = cc.find("Canvas/top_left/headinfo/card/label").getComponent(cc.Label);
        if(parseInt(roomCard.string) > 0){
            var onCreate = function (ret) {
                if (ret.errcode !== 0) {
                    cc.vv.wc.hide();
                    //console.log(ret.errmsg);
                    if (ret.errcode == 2222) {
                        cc.vv.alert.show("提示", "房卡不足，创建房间失败！请充值。");
                    }
                    else {
                        cc.vv.alert.show("提示", "创建房间失败,错误码:" + ret.errcode);
                    }
                }
                else {
                    cc.vv.gameNetMgr.connectGameServer(ret);
                }
            };
    
            var type = this.getType();
            var conf = null;
            if (type == 0){//'chgz') {
                conf = this.constructSCMJConf();
            }
            else if (type == 1){//'chqz') {
                conf = this.constructSCMJConf();
            }
            conf.type = type;
    
            var data = {
                account: cc.vv.userMgr.account,
                sign: cc.vv.userMgr.sign,
                conf: JSON.stringify(conf)
            };
            // console.log(conf);
            cc.vv.wc.show("正在创建房间");
            cc.vv.http.sendRequest("/create_private_room", data, onCreate);
        }
        else{
            cc.vv.alert.show("提示", "房卡不足，创建房间失败！请充值。");
        }
    },

    constructSCMJConf: function () {
        //-----------------------------------------锅子玩法-------------------------------------
        let difen = 0;
        for(var i = 0; i < this._guozixuanze.length; ++i){
            if(this._guozixuanze[i].checked){
                difen = i;
                break;
            }
        }

        let G_zhifu = 0;
        for(var i = 0; i < this._G_zhifuxuanze.length; ++i){
            if(this._G_zhifuxuanze[i].checked){
                G_zhifu = i;
                break;
            }
        }

        let G_piaozifen = 0;
        for(var i = 0; i < this._G_piaozixuanze.length; ++i){
            if(this._G_piaozixuanze[i].checked){
                G_piaozifen = i;
                break;
            }
        }

        let G_wanfa = 0;
        for(var i = 0; i < this._G_wanfaxuanze.length; ++i){
            if(this._G_wanfaxuanze[i].checked){
                G_wanfa = i;
                break;
            }
        }

        let G_facaidaikao = this._G_zidingyixuanze[0].checked ? 1 : 0;
        let G_duanyaojiu = this._G_zidingyixuanze[1].checked ? 1 : 0;
        let G_shiyao = this._G_zidingyixuanze[2].checked ? 1 : 0;
        let G_duandui = this._G_zidingyixuanze[3].checked ? 1 : 0;
        let G_shiyizhi = this._G_zidingyixuanze[4].checked ? 1 : 0;
        let G_zengzhizi = this._G_zidingyixuanze[5].checked ? 1 : 0;


        //--------------------------------------------------圈数玩法---------------------------------------
        let jushu = 0;
        for(var i = 0; i < this._quanshuxuanze.length; ++i){
            if(this._quanshuxuanze[i].checked){
                jushu = i;
                break;
            }
        }

        let Q_zhifu = 0;
        for(var i = 0; i < this._Q_zhifuxuanze.length; ++i){
            if(this._Q_zhifuxuanze[i].checked){
                Q_zhifu = i;
                break;
            }
        }

        let Q_piaozifen = 0;
        for(var i = 0; i < this._Q_piaozixuanze.length; ++i){
            if(this._Q_piaozixuanze[i].checked){
                Q_piaozifen = i;
                break;
            }
        }

        let Q_wanfa = 0;
        for(var i = 0; i < this._Q_wanfaxuanze.length; ++i){
            if(this._Q_wanfaxuanze[i].checked){
                Q_wanfa = i;
                break;
            }
        }

        let Q_facaidaikao = this._Q_zidingyixuanze[0].checked ? 1 : 0;
        let Q_duanyaojiu = this._Q_zidingyixuanze[1].checked ? 1 : 0;
        let Q_shiyao = this._Q_zidingyixuanze[2].checked ? 1 : 0;
        let Q_duandui = this._Q_zidingyixuanze[3].checked ? 1 : 0;
        let Q_shiyizhi = this._Q_zidingyixuanze[4].checked ? 1 : 0;
        let Q_zengzhizi = this._Q_zidingyixuanze[5].checked ? 1 : 0;
        let huangwutong = this._Q_zidingyixuanze[6].checked ? 1 : 0;
        let erjiatou = this._Q_zidingyixuanze[7].checked ? 1 : 0;

        if(this.getType() === 0){//'chgz'
            var conf = {
                type:0,//'chgz',//巢湖锅子:"chgz"，巢湖圈子:"chqz"
                difen:difen,
                jushuxuanze:-1,//锅子发0，圈子发1或2
                zhifu:G_zhifu, //支付方式 0：AA支付 1：房主支付
                piaozifen:G_piaozifen, //飘子分 0：3，1：5，2：10，3：20
                wanfa:G_wanfa, //玩法  0小倒模式，1无压不开，2百搭胡，3定缺胡
                facaidaikao:G_facaidaikao, //发财带靠 0否，1是
                duanyaojiu:G_duanyaojiu, //断幺九 0否，1是
                shiyao:G_shiyao, //十幺 0否，1是
                duandui:G_duandui, //断对 0否，1是
                shiyizhi:G_shiyizhi, //十一只 0否，1是
                zengzhizi:G_zengzhizi, //增志子 0否，1是
                huangwutong:0,
                erjiatou:0
            };
            if(G_zengzhizi === 1){
                cc.vv.zengzhizi = true;
            }
            return conf;
        }
        else{
            var conf = {
                type:0,//'chqz',//巢圈子:"chgz"，巢湖圈子:"chqz"
                difen:-1,
                jushuxuanze:jushu,//锅子发0，圈子发1或2
                zhifu:Q_zhifu, //支付方式 0：AA支付 1：房主支付
                piaozifen:Q_piaozifen, //飘子分 0：3，1：5，2：10，3：20
                wanfa:Q_wanfa, //玩法  0小倒模式，1无压不开，2百搭胡，3定缺胡
                facaidaikao:Q_facaidaikao, //发财带靠 0否，1是
                duanyaojiu:Q_duanyaojiu, //断幺九 0否，1是
                shiyao:Q_shiyao, //十幺 0否，1是
                duandui:Q_duandui, //断对 0否，1是
                shiyizhi:Q_shiyizhi, //十一只 0否，1是
                zengzhizi:Q_zengzhizi, //增志子 0否，1是
                huangwutong:huangwutong,
                erjiatou:erjiatou
            };
            if(Q_zengzhizi === 1){
                cc.vv.zengzhizi = true;
            }
            return conf;
        }
    },

    onBtnClicked:function () {
        this.ruleWindow.active = true;
    },

    selectGuoZi:function(){
        this.node.getChildByName("game_list").getChildByName('chgz').active = true;
        this.node.getChildByName("game_list").getChildByName('chqz').active = false;
        this.judge(true);
    },
    selectQuanZi:function(){
        this.node.getChildByName("game_list").getChildByName('chgz').active = false;
        this.node.getChildByName("game_list").getChildByName('chqz').active = true;
        this.judge(false);
    },

    judge:function(bool){
        if(bool){
            var media = cc.find("game_list/chgz/zidingyixuanze",this.node);
            var baida = cc.find("game_list/chgz/wanfaxuanze/baidahu",this.node);
        }
        else{
            var media = cc.find("game_list/chqz/zidingyixuanze",this.node);
            var baida = cc.find("game_list/chqz/wanfaxuanze/baidahu",this.node);
        }
        var baida1 = baida.getComponent("RadioButton");
        if(baida1.checked){
            for(var i = 0, max = media.childrenCount; i < max; i += 1){
                var act = media.children[i].getChildByName("shade");
                if(act){
                    act.active = true;
                }
            }
        }
    },

    roomCardShow:function(){
        var tip = cc.find("Canvas/CreateRoom1/tip/Label");
        var edit = tip.getComponent(cc.Label);
        var _list = this.node.getChildByName("game_list");
        var guo = _list.getChildByName("chgz");
        var _num = [];
        if(guo.active){
            var _zhifu = this._G_zhifuxuanze;
            var _jushu = this._guozixuanze;
            _num[0] = this._game_conf.guozi[1];
            _num[1] = this._game_conf.guozi[3];
            _num[2] = this._game_conf.guozi[5];
        }
        else{
            var _zhifu = this._Q_zhifuxuanze;
            var _jushu = this._quanshuxuanze;
            _num[0] = this._game_conf.quanzi[1];
            _num[1] = this._game_conf.quanzi[3];
        }
        for(var i = 0, max1 = _jushu.length; i < max1; i += 1){
            if(_jushu[i].checked){
                if(_zhifu[0].checked){
                    edit.string = "扣除房卡 × " + _num[i];
                }
                else{
                    edit.string = "扣除房卡 × " + (_num[i] * 4);
                }
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
});