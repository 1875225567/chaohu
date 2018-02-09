cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    addClickEvent:function(node,target,component,handler){
        console.log(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    addSlideEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },

    addEscEvent:function(node){
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
            },
            onKeyReleased: function(keyCode, event){
                if(keyCode == cc.KEY.back){
                    var childNodeArr = ["JoinGame","rule","CreateRoom1","settings","share","smallClearing",
                                        "scoreTask","shop","zhaomuTips","Bill","bindphone","bigClearing",
                                        "yaoqingma","gonggao","history","userinfo","alertLabel"];
                    for(var i = 0, max = node.childrenCount; i < max; i += 1){
                        var childName = node.children[i].name;
                        var number = childNodeArr.indexOf(childName);
                        if(number !== -1){
                            var _child = node.children[i];
                            if(_child.active){
                                if(childName === "history"){
                                    var history = node.getComponent("History");
                                    history.onBtnBackClicked();
                                }
                                else if(childName === "CreateRoom1"){
                                    var _child1 = node.children[i + 1];
                                    if(_child1.active){
                                        _child1.active = false;
                                    }
                                    else{
                                        _child.active = false;
                                    }
                                }
                                else{
                                    _child.active = false;
                                }
                                break;
                            }
                            else if(childName === "alertLabel" && !_child.active){
                                cc.vv.alert.show('提示','确定要退出游戏吗？',function(){
                                    cc.game.end();
                                },true);
                            }
                        }
                    }
                }
            }
        }, node);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
