window.onload=function () {
    //准备数据
    var arr =[]
    Order=function (id,blNo,sendPort,sendPortName,sendPortShortName,recPort,recPortName,recPortShortName,
        recBlNo,type,typeName,weight){
        this.id=id
        this.blNo=blNo                                  //提单编号
        this.sendPort=sendPort                          //发货港ID
        this.sendPortShortName=sendPortShortName        //发货港名称缩写
        this.sendPortName=sendPortName                  //发货港名称
        this.recPort=recPort                            //到货港ID
        this.recPortShortName=recPortShortName          //到货港名称缩写
        this.recPortName=recPortName                    //到货港名称
        this.recBlNo=recBlNo                            //到货港提货编码
        this.type=type                                  //货物品类ID
        this.typeName=typeName                          //货物品类
        this.weight=weight                              //重量
    }

    //从后端获取订单数据
    // ajax.get("http://192.168.8.122:8080/billorder",getOrder)

    /*let order=null
    function getOrder(data) {
        let resultData = data.resultData;
        for (let element of resultData) {
            order=new Order()
            order.id=element.id
            order.blNo=element.blNo
            order.sendPort=element.sendPort
            order.recPort=element.recPort
            order.recBlNo=element.recBlNo
            order.type=element.type
            order.typeName=element.typeName
            order.weight=element.weight
            order.sendPortName=element.sendPortName
            order.sendPortShortName=element.sendPortShortName
            order.recPortName=element.recPortName
            order.recPortShortName=element.recPortShortName
            arr.push(order)
        }
    }*/
    let order = null
    for(let i=0;i<5;i++){
        order=new Order()
        order=new Order()
        order.id=i
        order.blNo="blNO-"+i
        order.sendPort=1
        order.recPort=2
        order.recBlNo="recBlNo-"+i
        order.type=i
        order.typeName="农产品"
        order.weight=1024
        order.sendPortName="大连港"
        order.sendPortShortName="DLG"
        order.recPortName="秦皇岛港"
        order.recPortShortName="QHDG"
        arr.push(order)
    }

    //拿后端“货物品类”数据
    ajax.get("http://192.168.8.122:8080/category",getGoods)
    //拿后端“发货港，到货港”数据
    ajax.get("http://192.168.8.122:8080/port",getPort)

    //给货物品类赋值
    function getGoods(data) {
        let resultData = data.resultData;
        let typeName = document.getElementById("typeName");
        for (let element of resultData){
            let option = document.createElement("option");
            option.value=element.id
            option.innerHTML=element.name
            typeName.appendChild(option)
        }
    }

    //给港口赋值
    function getPort(data) {
        let resultData = data.resultData;
        let recPortName = document.getElementById("recPortName");
        let sendPortName = document.getElementById("sendPortName");
        for (let element of resultData){
            let option = document.createElement("option");
            option.value=element.id
            option.innerHTML=element.portName
            recPortName.appendChild(option)

            option = document.createElement("option");
            option.value=element.id
            option.innerHTML=element.portName
            sendPortName.appendChild(option)
        }
    }

    //查询
    var search = document.getElementById("search")
    search.onclick=function () {
        let html=""
        let body = document.getElementById("body");
        for (let i = 0; i < arr.length; i++) {
            html+="<tr>"
            html+="<td><input type='checkbox' name='Orders' id='"+i+"'></td>"
            html+="<td>"+arr[i].blNo+"</td>"
            html+="<td>"+arr[i].sendPort+"</td>"
            html+="<td>"+arr[i].sendPortShortName+"</td>"
            html+="<td>"+arr[i].sendPortName+"</td>"
            html+="<td>"+arr[i].recPort+"</td>"
            html+="<td>"+arr[i].recPortShortName+"</td>"
            html+="<td>"+arr[i].recPortName+"</td>"
            html+="<td>"+arr[i].recBlNo+"</td>"
            html+="<td>"+arr[i].type+"</td>"
            html+="<td>"+arr[i].typeName+"</td>"
            html+="<td>"+arr[i].weight+"</td>"
            html+="</tr>"
        }
        body.innerHTML=html
        checkbox()

    }

    //复选框事件
    let orders = document.getElementsByName("Orders")
    function checkbox(){
        home = document.getElementById("home");
        home.onclick=function () {
            for (let a of orders) {
                a.checked=home.checked
            }
        }

        for (let i = 0; i < orders.length; i++) {
            orders[i].onclick=function () {
                let checkedCount=0
                for (let j of orders) {
                    if (j.checked){
                        checkedCount++
                    }
                }
                home.checked=(checkedCount==orders.length)
            }
        }
    }

    //新建订单
    let addOrder = document.getElementById("addOrder");
    let bottom = document.getElementById("bottom");
    let confirm = document.getElementById("confirm");

    let blNo = document.getElementById("blNo");
    let sendPort = document.getElementById("sendPort");
    let recPort = document.getElementById("recPort");
    let sendPortName = document.getElementById("sendPortName");
    let recPortName = document.getElementById("recPortName");
    let sendPortShortName = document.getElementById("sendPortShortName");
    let recPortShortName = document.getElementById("recPortShortName");
    let recBlNo = document.getElementById("recBlNo");
    let type = document.getElementById("type");
    let typeName = document.getElementById("typeName");
    let weight = document.getElementById("weight");
    addOrder.onclick=function () {
        bottom.style=""
        confirm.onclick=function () {
            order=new Order()
            order.blNo=blNo.value
            order.sendPort=sendPort.value
            order.recPort=recPort.value
            order.sendPortName=sendPortName.value
            order.recPortName=recPortName.value
            order.sendPortShortName=sendPortShortName.value
            order.recPortShortName=recPortShortName.value
            order.recBlNo=recBlNo.value
            order.type=type.value
            order.typeName=typeName.value
            order.weight=weight.value
            arr.push(order)
            search.click()
        }
    }

    //扩展Array数组，增加remove方法
    //删除订单
    let del = document.getElementById("del");
    del.onclick=function () {
        var selected=[]
        var noSelected=[]
        for (let o of orders) {
            if(o.checked){
                selected.push(Number(o.id));
            }
        }
        arr.forEach((value,index)=>{        //foreach函数，value就是数组中的每一个元素，即order
            if(!selected.includes(index)){          //index,数组下标
                noSelected.push(value);
            }
        })
        arr=noSelected
        search.click()
    }

    //修改订单
    let update = document.getElementById("update");
    update.onclick=function () {
        let num=0
        let id = 0      //被选中数组元素下标
        for (let o of orders) {
            if(o.checked){
               num++
               id=o.id
            }
        }
        if(num==1){
            bottom.style=""
            blNo.value=arr[id].blNo
            sendPort.value=arr[id].sendPort
            recPort.value=arr[id].recPort
            recBlNo.value=arr[id].recBlNo
            type.value=arr[id].type
            typeName.value=arr[id].typeName
            sendPortName.value=arr[id].sendPortName
            sendPortShortName.value=arr[id].sendPortShortName
            recPortName.value=arr[id].recPortName
            recPortShortName.value=arr[id].recPortShortName
            weight.value=arr[id].weight
            confirm.onclick=function () {
                arr[id].blNo=blNo.value
                arr[id].sendPort=sendPort.value
                arr[id].recPort=recPort.value
                arr[id].recBlNo=recBlNo.value
                arr[id].type=type.value
                arr[id].typeName=typeName.value
                arr[id].sendPortName=sendPortName.value
                arr[id].sendPortShortName=sendPortShortName.value
                arr[id].recPortName=recPortName.value
                arr[id].recPortShortName=recPortShortName.value
                arr[id].weight=weight.value
                search.click()
            }
        }else if(num==0){
            alert("请选择一个订单")
        }else if(num>1){
            alert("只能选一个订单")
        }
    }
}