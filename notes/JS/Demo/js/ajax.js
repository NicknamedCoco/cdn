let ajax={
    get:function(url,callback){
        let xmlhttp=new XMLHttpRequest();
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4&&xmlhttp.status==200){
                callback(JSON.parse(xmlhttp.responseText))
            }
        }
        xmlhttp.open("get",url,true)
        xmlhttp.send()
    }
}