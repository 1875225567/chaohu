exports.checktingpai = function(gameNetMgr,mjid){
    var data = gameNetMgr.conf;
      
    var player = gameNetMgr.seats[gameNetMgr.seatIndex];
    var pai = mjid;
    var magicCard = gameNetMgr.magicpai;
    var tingCard = [];
    var tmp=[].concat(player.holds);
    var sd ={
        holds:tmp,
        folds:player.folds,
        pengs:player.pengs,
        angangs:player.angangs,
        diangangs:player.diangangs,
        wangangs:player.wangangs,
        countMap:{},
        tingMap:{},
        game:{
            magic:magicCard,
        }
    };
    var index = sd.holds.indexOf(pai);
    sd.holds.splice(index,1);
    for(var i=0;i<sd.holds.length;++i){
        var t = sd.holds[i];
        var c = sd.countMap[t];
        if(c == null) c = 0;
        sd.countMap[t] = c + 1;
    }
    var mbz = require('./mbz');
    var dh = require('./dahu');
    var mjutillaizi = require('./mjutils');
    mjutillaizi.checkTingPai(sd,0,30); 
    for(var k in sd.tingMap){
        var card = parseInt(k);
        var canting = false;
        sd.holds.push(card);
        var c = sd.countMap[card];
        if(c == null) c = 0;
        sd.countMap[card] = c + 1;
        if(mbz.manbazhi(sd,data.wanfa,magicCard)) canting = true;
        sd.holds.pop();
        sd.countMap[card] -= 1;
        // if(data.wanfa == 1 ){
        //     if(!dh.isDaHu(data,sd,card)) 
        //         canting = false;
        // }
        if(canting)tingCard.push(card);
    }
    return tingCard;
}

