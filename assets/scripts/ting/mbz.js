
exports.manbazhi = function(sd,wanfa,magicCard){
    var type = analyzeCard(sd);
    if(wanfa==2){
        var magic = sd.countMap[magicCard];
        if(magic>0){
            type.count+=magic;
        }
    }
    var facai = analyzeFaCai(sd);
    if(facai>0 && type.que == true){
        type.count+=facai;
    }
    return type.count>=8;
};

function analyzeCard(sd,pai){
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

function statistics(sd){
    
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

function single(typeMap,arr,count){
    for(var i=0;i<arr.length;i++){
        var type = getMJType(arr[i])
        var pai = typeMap[type];
        if(pai==null)pai=0;
        pai+=count;
        typeMap[type]=pai;
    }
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

