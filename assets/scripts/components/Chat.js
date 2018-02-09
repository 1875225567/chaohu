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
        _chatRoot:null,
        _tabQuick:null,
        _tabEmoji:null,
        _iptChat:null,
        
        _quickChatInfo:null,
        _btnChat:null,

        quickChatContent:cc.Node,
        emojiContent:cc.Node
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        cc.vv.chat = this;
        
        this._btnChat = this.node.getChildByName("btn_chat");
        this._btnChat.active = cc.vv.replayMgr.isReplay() == false;
        
        this._chatRoot = this.node.getChildByName("chat");
        this._chatRoot.active = false;
        
        this._tabQuick = this._chatRoot.getChildByName("quickchatlist");
        this._tabEmoji = this._chatRoot.getChildByName("emojis");

        var _send = this._chatRoot.getChildByName("btnSend");
        _send.on('click',this.onBtnSendChatClicked,this);

        this._iptChat = this._chatRoot.getChildByName("iptChat").getComponent(cc.EditBox);
        
        var quickChatArr = this.quickChatContent.children;
        for(let i = 0; i < quickChatArr.length; i++){
            let item = quickChatArr[i];
            item.on('click',this.onQuickChatItemClicked,this);
        }

        var emojiArr = this.emojiContent.children;
        for(let i = 0; i < emojiArr.length; i++){
            let item = emojiArr[i];
            item.on('click',this.onEmojiItemClicked,this);
        }

        this._quickChatInfo = {};
        this._quickChatInfo["item0"] = {index:0,content:"别催，慢点！",sound:"bie.wav"};
        this._quickChatInfo["item1"] = {index:1,content:"这牌真好！",sound:"zhe.wav"};
        this._quickChatInfo["item2"] = {index:2,content:"迟早都得输！",sound:"shu.wav"};
        this._quickChatInfo["item3"] = {index:3,content:"快点出牌啊！",sound:"kuai.wav"};
        this._quickChatInfo["item4"] = {index:4,content:"上对下自摸！",sound:"shang.wav"};
        this._quickChatInfo["item5"] = {index:5,content:"开心娱乐交朋友！",sound:"kai.wav"};
        this._quickChatInfo["item6"] = {index:6,content:"瞧你那开心的样！",sound:"qiao.wav"};
        this._quickChatInfo["item7"] = {index:7,content:"可不可以加个微信？",sound:"jia.wav"};
        this._quickChatInfo["item8"] = {index:8,content:"请叫我达文西！",sound:"jiao.wav"};
        this._quickChatInfo["item9"] = {index:9,content:"赢钱请吃饭！",sound:"ying.wav"};

        this._tabQuick.active = true;
        this._tabEmoji.active = false;
    },
    
    getQuickChatInfo(index){
        var key = "item" + index;
        return this._quickChatInfo[key];   
    },
    
    onBtnChatClicked:function(){
        this._chatRoot.active = true;
    },
    
    onBgClicked:function(){
        this._chatRoot.active = false;
    },
    
    onTabClicked:function(event){
        if(event.target.parent.name == "tabQuick"){
            this._tabQuick.active = true;
            this._tabEmoji.active = false;
        }
        else if(event.target.parent.name == "tabEmoji"){
            this._tabQuick.active = false;
            this._tabEmoji.active = true;
        }
    },
    
    onQuickChatItemClicked:function(event){
        this._chatRoot.active = false;
        var info = this._quickChatInfo[event.target.name];
        cc.vv.net.send("quick_chat",info.index);
    },
    
    onEmojiItemClicked:function(event){
        console.log(event.target.name);
        this._chatRoot.active = false;
        cc.vv.net.send("emoji",event.target.name);
    },
    
    onBtnSendChatClicked:function(){
        this._chatRoot.active = false;
        if(this._iptChat.string == ""){
            return;
        }
        cc.vv.net.send("chat",this._iptChat.string);
        this._iptChat.string = "";
    },

    identification:function(){
        var fangNan = {};
        fangNan["item0"] = {index:0,content:"别催，慢点！",sound:"fix_msg_1.mp3"};
        fangNan["item1"] = {index:1,content:"这牌真好！",sound:"fix_msg_4.mp3"};
        fangNan["item2"] = {index:2,content:"迟早都得输！",sound:"fix_msg_3.mp3"};
        fangNan["item3"] = {index:3,content:"快点出牌啊！",sound:"fix_msg_2.mp3"};
        fangNan["item4"] = {index:4,content:"上对下自摸！",sound:"fix_msg_5.mp3"};
        fangNan["item5"] = {index:5,content:"开心娱乐交朋友！",sound:"fix_msg_6.mp3"};
        fangNan["item6"] = {index:6,content:"瞧你那开心的样！",sound:"fix_msg_7.mp3"};
        fangNan["item7"] = {index:7,content:"可不可以加个微信？",sound:"fix_msg_8.mp3"};
        fangNan["item8"] = {index:8,content:"请叫我达文西！",sound:"fix_msg_9.mp3"};
        fangNan["item9"] = {index:9,content:"赢钱请吃饭！",sound:"fix_msg_9.mp3"};
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
