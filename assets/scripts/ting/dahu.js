exports.isDaHu = function(conf,sd,pai){
    console.log("isdahu");
    var conf = conf;
    var wanfa = conf.wanfa;
    var facaidaikao = conf.facaidaikao;
    if(wanfa == 2){
        facaidaikao = false;
    }
    var name ="chmj";
    if(buqiuren(sd,name))return true;
    if(quanqiuren(sd,name))return true;
    // if(dahu_func.yitiaolong(game,sd,pai,name))return true;
    // if(dahu_func.sihe(game,sd,pai,name))return true;
    if(hunyise(sd,name))return true;
    if(duidui (sd,name))return true;
    if(qingyise(sd,name))return true;

    if(conf.duanyaojiu==1 && duanyaojiu(sd,facaidaikao,name))return true;
    if(conf.shiyizhi==1 && shiyizhi (sd,facaidaikao,name))return true;
    if(conf.shiyao==1 && shiyao (sd,facaidaikao,name))return true;
    if(conf.duandui==1 && duandui(sd,facaidaikao,name) && info.duiduihu)return true;

    var yadang = yadang(sd,name)>-1;
    if(yadang)return true;

    if(zengzhizi_has(sd,1)){
        if(jiuzhizi(sd,name))return true;
    }
    if(zengzhizi_has(sd,2)){
        if(duyao(sd,name))return true;
    }
    if(zengzhizi_has(sd,3)){
        if(liulian(sd,name))return true;
    }
};

function liulian(sd,name){
    var tmp=-2;  
    var count =0;
    var real_count = 0;
    for(var k in sd.countMap){
        if(sd.countMap[k]==null||sd.countMap[k]==0) continue;
        if(tmp == parseInt(k)-1 && sd.countMap[k] == sd.countMap[tmp] )count++;
        else                    count=0;
        if(parseInt(k)==0||parseInt(k)==9||parseInt(k)==18)count=0;
        if(real_count<=count)real_count=count;
        tmp = parseInt(k);
    }
    return real_count>=5;
};

function duyao(sd,name){
    var count =0;
    for(var i=0;i<=18;i+=9) {
        count+=hasSomeCard(sd.holds,i);
        if(hasSomeCard(sd.pengs,i)>0)    return false;
        if(hasSomeCard(sd.diangangs,i)>0)return false;
        if(hasSomeCard(sd.wangangs,i)>0) return false;
        if(hasSomeCard(sd.angangs,i)>0)  return false;
    }
    return count==1;
};

function jiuzhizi(sd,name){
    for(var i=0;i<=18;i+=9){
        var count =0;
        for(var j=0;j<9;++j) {
            count += hasSomeCard(sd.holds,i+j);
            count += hasSomeCard(sd.pengs,i+j)*3;
            count += hasSomeCard(sd.wangangs,i+j)*4;
            count += hasSomeCard(sd.diangangs,i+j)*4;
            count += hasSomeCard(sd.angangs,i+j)*4;
        }
        
        if(count==9) return true;
    }
    return false;
};

function yadang(sd,name){
    var count = 0;
    var card = -1;
    for(var k in sd.tingMap){
        count++;
        card = parseInt(k);
    }
    if( count == 1 ){
        return card;
    }
    return -1;
};

function zengzhizi_has(sd,choice){
    for(var i=0;i<sd.que.length;++i){
        if(sd.que[i] == choice){
            return true;
        }
    }
    return false;
};

function buqiuren(sd,name){
    return (sd.pengs.length + sd.wangangs.length + sd.diangangs.length) == 0
};

function quanqiuren(sd,name){
    return sd.holds.length <= 2 && sd.angangs.length == 0;
};

function yitiaolong(game,sd,pai,name){
    // var long = function(sd,begin,end){
    //     for(var i=begin; i<end; ++i){
    //         if(sd.countMap[i+""]==null||sd.countMap[i+""]==0) return false
    //     }
    //     return true;
    // }
    // var tong =long(sd,0,9);
    // var tiao =long(sd,9,18);
    // var wan =long(sd,18,27);
    // var wipe = function(sd,beign,end){
    //     for(var i=beign; i<end; ++i){
    //         sd.countMap[i+""]-=1;
    //         var index = sd.holds.indexOf(i);
    //         sd.holds.splice(index,1);
    //     }
    // }
    // var plus = function(sd,beign,end){
    //     for(var i=beign; i<end; ++i){
    //         sd.countMap[i+""]+=1;
    //         sd.holds.push(i);
    //     }
    // }
    // if(!tong&&!tiao&&!wan) return false;
    // if(tong)wipe(sd,0,9);
    // if(tiao)wipe(sd,9,18);
    // if(wan)wipe(sd,18,27);
    // var canHu = configs_utils.checkCanTingPai_func(sd,pai,name)
    // //var canHu = configs_utils.checkCanHu_func( tingMap ,pai);
    // if(tong)plus(sd,0,9);
    // if(tiao)plus(sd,9,18);
    // if(wan)plus(sd,18,27);
    // return canHu;
};

function sihe(game,seatData,pai,name){

    // for(var i = 0; i < seatData.pengs.length; ++i){
    //     var pai = seatData.pengs[i];
    //     if(seatData.countMap[pai] == 1){
    //         return true;
    //     }
    // }

    // var wipe = function(seatData,pai){
    //     for(var i=0; i<3; ++i){
    //         var index = seatData.holds.indexOf(pai);
    //         //console.assert(index > -1,"do not find sihe index")
    //         seatData.holds.splice(index,1);
    //         seatData.countMap[pai]-=1;
    //     }
    // }
    // var plus = function(seatData,pai){
    //      for(var i=0; i<3; ++i){
    //         seatData.countMap[pai]+=1;
    //         seatData.holds.push(pai);
    //      }
    // }
    // var sihearr=[];
    // for(var k in seatData.countMap){
    //     if(seatData.countMap[k]==4){
    //         sihearr.push(parseInt(k));
    //     }
    // }
    // var isSihe =false;
    // for(var i=0; i<sihearr.length; ++i){
    //     wipe(seatData,sihearr[i]);
    //     var canHu = configs_utils.checkCanTingPai_func(seatData,pai,name)
    //     //var canHu = configs_utils.checkCanHu_func( tingMap ,pai);
    //     plus(seatData,sihearr[i]);
    //     if(canHu){
    //         isSihe =true;
    //         break;
    //     }
    // }
    // return isSihe;
};

function hunyise(sd,name){
    var typeArr=statistics(sd);
    var count =0;
    for(var i=0;i<typeArr.length;++i){
        if(typeArr[3]>0&&typeArr[i]==0){
            count++;
        }
    }
    if(count==2) return true;
    return false;
};

function getMJType(id){
    if(id >= 0 && id < 9) return 0;
    else if(id >= 9 && id < 18) return 1;  
    else if(id >= 18 && id < 27)return 2;
    else if(id >= 27 && id < 30)return 3;
    else if(id >= 30 && id < 34)return 4;
    else if(id >= 34 && id < 42)return 5;
    else return -1;
};

function statistics(sd){
    var single=function(typeMap,arr,count){
        for(var i=0;i<arr.length;i++){
            var type = getMJType(arr[i])
            var pai = typeMap[type];
            if(pai==null)pai=0;
            pai+=count;
            typeMap[type]=pai;
        }
    }

    var typeMap={"0":0,"1":0,"2":0,"3":0,"4":0};
    single(typeMap,sd.holds,1);
    single(typeMap,sd.angangs,4);
    single(typeMap,sd.wangangs,4);
    single(typeMap,sd.diangangs,4);
    single(typeMap,sd.pengs,3);
    var count =0;
    var typeArr=[];
    typeArr.push(typeMap["0"]);
    typeArr.push(typeMap["1"]);
    typeArr.push(typeMap["2"]);
    typeArr.push(typeMap["3"]);
    return typeArr;
};

function duidui(seatData,name){
    var magic = seatData.game.magic;
    var isMagic = seatData.countMap[magic];
    if( !isMagic ) isMagic=0;
    
    var singleCount = 0;
    var colCount = 0;
    var pairCount = 0;
    var singleArr = [];
    var pairArr = [];
    var arr = [];
    for(var k in seatData.countMap){
        var c = seatData.countMap[k];
        if(c == 1){
            singleCount++;
            singleArr.push(k);
            arr.push(k);
        }
        else if(c == 2){
            pairCount++;
            pairArr.push(k);
            arr.push(k);
        }
        else if(c == 3){
            colCount++;
        }
        else if(c == 4){
            singleCount++;
            singleArr.push(k);
            pairCount+=2;
        }
    }
    var duiduihu =false;
    if(isMagic==0){
            if((pairCount == 1 && singleCount == 0) || (pairCount == 2 && singleCount == 0) || (pairCount == 0 && singleCount == 1) ){
            for(var i = 0; i < arr.length; ++ i){
                var p = arr[i];

                if(seatData.tingMap[p] == null){
                    seatData.tingMap[p] = {
                        pattern:"duidui",
                        fan:1
                    };
                    duiduihu=true;
                }else if(seatData.tingMap[p].pattern == "duidui" || seatData.tingMap[p].pattern == "normal") {
                    duiduihu=true;
                    break;
                }
            }
        }
    }else{
        if(pairArr.length > isMagic && singleArr.length ==0){   
            for(var i = 0; i < arr.length; i++){
                var pai = arr[i];
                if(seatData.tingMap[pai] != null){
                    seatData.tingMap[pai].pattern = "duidui";    
                    
                    return true;
                }
            }
        }else if(pairArr.length == isMagic && singleArr.length == 1){
            for(var i = 0; i < arr.length; i++){
                var pai = arr[i];
                if(seatData.tingMap[pai] != null &&countMap[pai]>0 ){
                    seatData.tingMap[pai].pattern = "duidui";
        
                    return true;
                }
            }
        }else if(pairArr.length < isMagic){
            var left = isMagic - pairArr.length;
            var leftLeft = left - singleArr.length * 2;
            if(leftLeft == 1 || leftLeft == -1){
                for(var i = 0; i < arr.length; i++){
                    var pai = arr[i];
                    if(seatData.tingMap[pai] != null){
                        seatData.tingMap[pai].pattern = "duidui";
                        return true;
                    }
                }
            }
        }  

    }
    return duiduihu;
};
    
function qingyise(sd,name){
    var type = getMJType(sd.holds[0]);
    if(isSameType(type,sd.holds) == false)return false;
    if(isSameType(type,sd.angangs) == false)return false;
    if(isSameType(type,sd.wangangs) == false) return false;
    if(isSameType(type,sd.diangangs) == false)return false;
    if(isSameType(type,sd.pengs) == false) return false;
    return true;
};

function isSameType(type,arr){
    for(var i = 0; i < arr.length; ++i){
        var t = getMJType(arr[i]);
        if(type != -1 && type != t){
            return false;
        }
        type = t;
    }
    return true; 
};

function duanyaojiu(sd,facaidaikao){
    var faicai = analyzeFaCai(sd);
    var yaojiu = yaojiu_count(sd);
    if(facaidaikao==0) return yaojiu ==0 && faicai == 0;
    else               return yaojiu ==0;
};

function shiyizhi(sd,facaidaikao,name){
    var count = analyzeCard_CH(sd).count;
    var faicai = analyzeFaCai(sd);
    if(facaidaikao==0) return count>=11;
    else               return (count+faicai)>=11;
};

function shiyao(sd,facaidaikao,name){
    if(facaidaikao==0) return yaojiu_count(sd)>=10;
    else               return (yaojiu_count(sd)+analyzeFaCai(sd))>=10;
};

function duandui(sd,facaidaikao,name){
    var dyj = duanyaojiu(sd,facaidaikao);
    var faicai = analyzeFaCai(sd);
    if(facaidaikao==0)  return dyj && faicai == 0;
    else                return dyj;
};

function analyzeFaCai(sd){
    var count = 0;
    count+=hasSomeCard(sd.holds,28);
    count+=hasSomeCard(sd.pengs,28)*3;
    count+=hasSomeCard(sd.diangangs,28)*4;
    count+=hasSomeCard(sd.wangangs,28)*4;
    count+=hasSomeCard(sd.angangs,28)*4;
    return count;
};

function hasSomeCard(arr,card){
    var count=0;
    for(var i=0;i<arr.length;i++){
        if(arr[i]==card)count++;
    }
    return count;
};

function analyzeCard_CH(sd,pai){
    if(pai)sd.holds.push(pai); 
    var typeArr=statistics(sd);
    if(pai) sd.holds.pop();
    var count = 0;
    var que = false;
    for(var i=0;i<typeArr.length;++i){
        if(count<typeArr[i]){
            count = typeArr[i];
        }
        if(i<3 && typeArr[i]==0) {
            que=true;
        }
    }
    return {count:count,que:que};
};

function yaojiu_count(sd){
    var count =0;
    var youjiu=[0,8,9,17,18,26];
    for(var i=0;i<youjiu.length;i++){
        count+=hasSomeCard_all(sd,youjiu[i]);
    }
    return count;
};

function hasSomeCard_all(sd,index){
    var count = 0;
    count+=hasSomeCard(sd.holds,index);
    count+=hasSomeCard(sd.pengs,index)*3;
    count+=hasSomeCard(sd.angangs,index)*4;
    count+=hasSomeCard(sd.diangangs,index)*4;
    count+=hasSomeCard(sd.wangangs,index)*4;
    return count;
};
