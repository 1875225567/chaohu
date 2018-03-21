//顺子的范围
var shunZiRanges = [
    [0, 8],
    [9, 17],
    [18, 26]
];

//去掉手牌中的癞子，单独记录
function copyUnLaiziToPais(seatData,pai){
    var paiData = {holds:[],countMap:{},laiZi:-1,laiziCnt:0};
    var holds = seatData.holds.slice(0);
    holds.push(pai);
    paiData.laiZi = seatData.laiZi;
    for (var i = 0; i < holds.length; i++) {//去掉手牌中的癞子
        if (holds[i] == seatData.laiZi){
            holds.splice(i,1);
            i--;
            paiData.laiziCnt++;
        }
        else {
            if(!(paiData.countMap[holds[i]]>=0))paiData.countMap[holds[i]]=0;
            paiData.countMap[holds[i]]++;
        }
    }
    paiData.holds = holds;
    return paiData;
}

function matchSingle(paiData, selected) {
	//分开匹配 A-2,A-1,A
	var matched = true;
	var v = selected % 9;
	if (v < 2) {
		matched = false;
	}
	else {
		for (var i = 0; i < 3; ++i) {
			var t = selected - 2 + i;
			var cc = paiData.countMap[t];
			if (cc == null) {
				matched = false;
				break;
			}
			if (cc == 0) {
				matched = false;
				break;
			}
		}
	}


	//匹配成功，扣除相应数值
	if (matched) {
        var index = paiData.holds.indexOf(selected-2);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected - 2]--;

        index = paiData.holds.indexOf(selected-1);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected - 1]--;

        index = paiData.holds.indexOf(selected);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected]--;

        if(minusShunzi(paiData))return true;
	}

	//分开匹配 A-1,A,A + 1
	matched = true;
	if (v < 1 || v > 7) {
		matched = false;
	}
	else {
		for (var i = 0; i < 3; ++i) {
			var t = selected - 1 + i;
			var cc = paiData.countMap[t];
			if (cc == null) {
				matched = false;
				break;
			}
			if (cc == 0) {
				matched = false;
				break;
			}
		}
	}

	//匹配成功，扣除相应数值
	if (matched) {
		var index = paiData.holds.indexOf(selected-1);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected - 1]--;

        index = paiData.holds.indexOf(selected);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected]--;

        index = paiData.holds.indexOf(selected+1);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected+1]--;

        if(minusShunzi(paiData))return true;
	}


	//分开匹配 A,A+1,A + 2
	matched = true;
	if (v > 6) {
		matched = false;
	}
	else {
		for (var i = 0; i < 3; ++i) {
			var t = selected + i;
			var cc = paiData.countMap[t];
			if (cc == null) {
				matched = false;
				break;
			}
			if (cc == 0) {
				matched = false;
				break;
			}
		}
	}

	//匹配成功，扣除相应数值
	if (matched) {
		var index = paiData.holds.indexOf(selected);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected]--;

        index = paiData.holds.indexOf(selected+1);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected+1]--;

        index = paiData.holds.indexOf(selected+2);
        if(index>=0)paiData.holds.splice(index,1);
		paiData.countMap[selected+2]--;

        if(minusShunzi(paiData))return true;
        
	}
	return false;
}

function minusShunzi(paiData){
    for(var i=0;i<paiData.pais.length;i++){
        if (0 <= i && i <= 26) {
            //按单牌处理
            return matchSingle(paiData, i);
        }
    }
}

exports.checkPengPengHu_laiZi = function(seatData, pai){
    if(seatData.chis.length>0)return -1;
    var res = copyUnLaiziToPais(seatData,pai);
    if(res==null)return -1;
    var pais = res.holds;
    var laiziCnt = res.laiziCnt;
    var keziCnt = 0, duiziCnt = 0, danziCnt = 0;
    for (var k in res.countMap) {
        if (res.countMap[k] == 4) duiziCnt += 2;
        else if (res.countMap[k] == 3) keziCnt++;
        else if (res.countMap[k] == 2) duiziCnt++;
        else if (res.countMap[k] == 1) danziCnt++;
    }

    if(danziCnt!=laiziCnt)return -1;
    else if(danziCnt==0){
        if(duiziCnt > laiziCnt+1)return -1;
        else return 0;
    }
    else if(laiziCnt>=danziCnt)return danziCnt;
    else return -1;
}

exports.checkQiDui_laiZi = function(seatData, pai){
    var res = copyUnLaiziToPais(seatData,pai);
    if(res==null)return -1;
    var pais = res.holds;
    var laiziCnt = res.laiziCnt;
    var duiziCnt = 0, danziCnt = 0;
    for(var k in res.countMap){
        if(res.countMap[k]==2)duiziCnt++;
        else if(res.countMap[k]==4)duiziCnt+=2;
        else if(res.countMap[k]==1)danziCnt++;
        else if(res.countMap[k]==3){
            duiziCnt++;
            danziCnt++;
        }
    }

    if(duiziCnt<3)return -1;
    else if(duiziCnt==3 ){
        if(laiziCnt<4)return -1;
        else return 4;
    }
    else if(duiziCnt==4 && danziCnt>=3){
        if(laiziCnt<3)return -1;
        else return 3;
    }
    else if(duiziCnt==5 && danziCnt>=2){
        if(laiziCnt<2)return -1;
        else return 2;
    }
    else if(duiziCnt==6 && danziCnt>=1){
        if(laiziCnt<1)return -1;
        else return 1;
    }
    else if(duiziCnt==7 && danziCnt==0){
        return 0;
    }
}

//callback(isPingHu, allKeZi, laiZiReplacePais,replacedpais) laiZiReplacePais:赖子替换的牌的数组
function isPingHuUseLaiZi(pais, laiZi,useLaiZiCount,getAllResult,callback) {
    var callbackCount = 0;
    //找出赖子可能替代的牌
    var basePais = [];
    for (var i = 0; i < pais.length; i++) {
        var l1 = pais[i];
        var donotchange =[0, 8, 9, 17, 18, 26, 28];
        if (basePais.indexOf(l1) < 0 && l1 != laiZi) {
            var swi =true;
            for(var j=0; j<donotchange.length ;++j){
                if(donotchange[j]==l1){
                   swi=false;
                   break;  
                }
            }
            if(swi){
                basePais.push(l1);
            }
        }
        var l2 = pais[i] - 1;
        if (l2 >= 0 && basePais.indexOf(l2) < 0 && l2 != laiZi) {
            var swi =true;
            for(var j=0; j<donotchange.length ;++j){
                if(donotchange[j]==l2){
                   swi=false;
                   break;  
                }
            }
            if(swi){
                basePais.push(l2);
            }
        }
        var l3 = pais[i] + 1;
        if (l3 < 34 && basePais.indexOf(l3) < 0 && l3 != laiZi) {
            var swi =true;
            for(var j=0; j<donotchange.length ;++j){
                if(donotchange[j]==l3){
                   swi=false;
                   break;  
                }
            }
            if(swi){
                basePais.push(l3);
            }
        }
    }

    if (useLaiZiCount == 0) {
        pingHuCheck(pais, function (isPingHu, allKeZi,keZis,duiZi,shunZis) {
            if (isPingHu) {
                callback(isPingHu, allKeZi, [],pais,keZis,duiZi,shunZis);
                callbackCount++;
            }
        });
        if((!getAllResult)&&callbackCount>0) return;
    } else if (useLaiZiCount == 1) {
        for (var p1 = 0; p1 < basePais.length; p1++) {
            var newPais = replaceLaiZi(pais, laiZi, basePais[p1]);
            pingHuCheck(newPais, function (isPingHu, allKeZi,keZis,duiZi,shunZis) {
                if (isPingHu) {
                    callback(isPingHu, allKeZi, [basePais[p1]],newPais,keZis,duiZi,shunZis);
                    callbackCount++;
                }
            });
            if((!getAllResult)&&callbackCount>0) return;
        }
    } else if (useLaiZiCount == 2) {
        for (var p1 = 0; p1 < basePais.length; p1++) {
            for (var p2 = p1; p2 < basePais.length; p2++) {
                var newPais = replaceLaiZi(pais, laiZi, basePais[p1], basePais[p2]);
                pingHuCheck(newPais, function (isPingHu, allKeZi,keZis,duiZi,shunZis) {
                    if (isPingHu) {
                        callback(isPingHu, allKeZi, [basePais[p1], basePais[p2]],newPais,keZis,duiZi,shunZis);
                        callbackCount++;
                    }
                });
                if((!getAllResult)&&callbackCount>0) return;
            }
        }
    } else if (useLaiZiCount == 3) {
        for (var p1 = 0; p1 < basePais.length; p1++) {
            for (var p2 = p1; p2 < basePais.length; p2++) {
                for (var p3 = p2; p3 < basePais.length; p3++) {
                    var newPais = replaceLaiZi(pais, laiZi, basePais[p1], basePais[p2], basePais[p3]);
                    pingHuCheck(newPais, function (isPingHu, allKeZi,keZis,duiZi,shunZis) {
                        if (isPingHu) {
                            callback(isPingHu, allKeZi, [basePais[p1], basePais[p2], basePais[p3]],newPais,keZis,duiZi,shunZis);
                            callbackCount++;
                        }
                    });
                    if((!getAllResult)&&callbackCount>0) return;
                }
            }
        }
    } else if (useLaiZiCount == 4) {
        for (var p1 = 0; p1 < basePais.length; p1++) {
            for (var p2 = p1; p2 < basePais.length; p2++) {
                for (var p3 = p2; p3 < basePais.length; p3++) {
                    for (var p4 = p3; p4 < basePais.length; p4++) {
                        var newPais = replaceLaiZi(pais, laiZi, basePais[p1], basePais[p2], basePais[p3], basePais[p4]);
                        pingHuCheck(newPais, function (isPingHu, allKeZi,keZis,duiZi,shunZis) {
                            if (isPingHu) {
                                callback(isPingHu, allKeZi, [basePais[p1], basePais[p2], basePais[p3], basePais[p4]],newPais,keZis,duiZi,shunZis);
                                callbackCount++;
                            }
                        });
                        if((!getAllResult)&&callbackCount>0) return;
                    }
                }
            }
        }
    }
    callback(false);
}

function replaceLaiZi(pais, laiZi, pai1, pai2, pai3, pai4) {
    var newPais = [];
    for(var i=0;i<pais.length;i++){
        newPais.push(pais[i]);
    }
    var index = newPais.indexOf(laiZi);
    if (index >= 0 && pai1 >= 0) {
        newPais[index] = pai1;
    }
    index = newPais.indexOf(laiZi);
    if (index >= 0 && pai2 >= 0) {
        newPais[index] = pai2;
    }
    index = newPais.indexOf(laiZi);
    if (index >= 0 && pai3 >= 0) {
        newPais[index] = pai3;
    }
    index = newPais.indexOf(laiZi);
    if (index >= 0 && pai4 >= 0) {
        newPais[index] = pai4;
    }
    return newPais;
}

//callback(allKeZi, shunZis, keZis, duiZi, laiZiReplacePais, replacedpais) 
exports.checkPingHu = function (holds, pai,laiZi,callback) {
    var resultList = [];
    var laiZiCount = 0;
    var pais = [];
    for (var i = 0; i < holds.length; i++) {
        pais.push(holds[i]);
        if (holds[i] == laiZi) {
            laiZiCount++;
        }
    }
    //pais.push(pai);
    if (laiZi == pai) {
        laiZiCount++
    }

    for (var useLaiZiCount = 0; useLaiZiCount <= laiZiCount; useLaiZiCount++) {
        isPingHuUseLaiZi(pais, laiZi, useLaiZiCount,true,function(isPingHu, allKeZi, laiZiReplacePais,replacedpais,keZis,duiZi,shunZis){
            if(isPingHu){
                callback(isPingHu,allKeZi, shunZis, keZis, duiZi, laiZiReplacePais, replacedpais) 
            }
        });
    }
}

//callback(isPingHu,allKeZi)
function pingHuCheck(pais,callback) {

    pais.sort(function (a, b) { return a - b; });

    var duiZiMap = buildDuiZiMap(pais);

    for (var k in duiZiMap) {
        var pais1 = duiZiMap[k];
        if (pais1.length > 0) {
            checkKeZiAndShunZi(pais1, shunZiRanges,function(result,allKeZi,keZis,shunZis){
                if(result){
                    callback(result,allKeZi,keZis,parseInt(k),shunZis);
                    return;
                }
            })
        } else {
            callback(true,true,[],parseInt(k),[]);
            return;
        }
    }
    callback(false,false);
    return;
}

//找出所有对子
function buildDuiZiMap(pais) {
    var map = {};
    for (var i = 0; i < pais.length - 1; i++) {
        var p1 = pais[i];
        var p2 = pais[i + 1];
        if (p1 == p2) {
            if (!map[p1]) {
                var pais1 = [];
                for (var j = 0; j < pais.length; j++) {
                    if (j != i && j != i + 1) {
                        pais1.push(pais[j]);
                    }
                }
                map[p1] = pais1;
            }
        }
    }
    return map;
}

//callback(result,allKeZi) result:都是刻子或顺子  allKeZi:都是刻子
function checkKeZiAndShunZi(pais, shunZiRanges,callback) {//pais 必须是从小到大排序好的
    if (pais.length % 3 != 0){//必须是3的倍数
        callback(false,false);
        return;
    }
    var checkCount = 0;
    var keZiCount = 0;
    var shunZis = [];
    var keZis = [];
    var countMap = getCountMap(pais);
    for(var i = 0;i<pais.length;i++){
        var p = pais[i];
        var count = countMap[p];
        if (count == 4 || count == 3) {
            countMap[p] -= 3;
            checkCount += 3;
            keZiCount +=1;
            keZis.push(p);
        } else if (countMap[p] > 0 && countMap[p + 1] > 0 && countMap[p + 2] > 0 && checkShunZiRanges(p, p + 1, p + 2)) {
            countMap[p]--;
            countMap[p + 1]--;
            countMap[p + 2]--;
            checkCount += 3;
            shunZis.push([p,p+1,p+2]);
        // } else if (p == 30 && countMap[p] > 0 && countMap[p + 1] > 0 && countMap[p + 3] > 0) { //东南北算顺子
        //     countMap[p]--;
        //     countMap[p + 1]--;
        //     countMap[p + 3]--;
        //     checkCount += 3;
        //     shunZis.push([p, p + 1, p + 3]);
        // } else if (p == 30 && countMap[p] > 0 && countMap[p + 2] > 0 && countMap[p + 3] > 0) { //东西北算顺子
        //     countMap[p]--;
        //     countMap[p + 2]--;
        //     countMap[p + 3]--;
        //     checkCount += 3;
        //     shunZis.push([p, p + 1, p + 3]);
        }
    }
    callback(checkCount==pais.length,keZiCount*3==pais.length,keZis,shunZis);
    return;
}

function checkShunZiRange(p1, p2, p3, min, max) {
    return min <= p1 && p3 <= max;
}

function checkShunZiRanges(p1, p2, p3) {
    var inRange = false;
    for (var j = 0; j < shunZiRanges.length; j++) {
        if (checkShunZiRange(p1, p2, p3, shunZiRanges[j][0], shunZiRanges[j][1])) {
            inRange = true;
            break;
        }
    }
    return inRange;
}

function getCountMap(pais){
    var countMap = {};
    for(var i = 0;i<pais.length;i++){
        if(!(countMap[pais[i]]>=0))
            countMap[pais[i]]=0;
        countMap[pais[i]]++;
    }
    return countMap;
}

exports.getCountMap=getCountMap;