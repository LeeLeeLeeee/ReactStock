function read_csv(data, sep){
    var seperate = sep || ','
    if(data){
        data = data.split('\n');
        return data.map(element => {
            return element.replace(/\r/g,'').split(seperate)
        });
        
    }
    return false;
}

function forEach_promise(items,func){
    if(Array.isArray(items)){
        return items.reduce((p, ele)=>{
            return p.then(()=> func(ele));
        },Promise.resolve(""));
    } else {
        return false;
    }
}

module.exports = {
    read_csv : read_csv,
    forEach_promise : forEach_promise
};