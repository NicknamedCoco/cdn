window.onload=function () {
    //准备数据
    var arr =[]
    Order=function (id,port,portCode,goods,weight){
        this.id=id              //提单编号
        this.port=port          //出发港
        this.portCode=portCode  //到货港提货编码
        this.goods = goods      //品类
        this.weight=weight      //重量
    }
    let order=null
    for (let i = 0; i < 10; i++) {
        order = new Order();
        order.id=i
        order.port="大连港"
        order.portCode="DL-"+i
        order.goods="服装"
        order.weight=500
        arr.push(order)
    }
    //查询
    var search = document.getElementById("search")
    search.onclick=function () {
        let html=""
        let body = document.getElementById("body");
        for (let i = 0; i < arr.length; i++) {
            html+="<tr>"
            html+="<td><input type='checkbox' name='Orders' id='"+i+"'></td>"
            html+="<td>"+arr[i].id+"</td>"
            html+="<td>"+arr[i].port+"</td>"
            html+="<td>"+arr[i].portCode+"</td>"
            html+="<td>"+arr[i].goods+"</td>"
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

    let goPort = document.getElementById("goPort");
    let orderId = document.getElementById("orderId");
    let portCode = document.getElementById("portCode");
    let goods = document.getElementById("goods");
    let weight = document.getElementById("weight");
    addOrder.onclick=function () {
        bottom.style=""
        confirm.onclick=function () {
            order=new Order()
            order.port=goPort.value       //出发港
            order.id=orderId.value          //提单编号
            order.portCode=portCode.value   //到货港提货编码
            order.goods=goods.value      //货物类型
            order.weight=weight.value    //重量
            arr.push(order)
            search.click()
        }
    }

    //扩展Array数组，增加remove方法
    //删除订单
    let del = document.getElementById("del");       //有问题
    del.onclick=function () {       //splice
        /*for (let i = 0,j=0; i < orders.length; i++) {
            if (orders[i].checked){
                arr.splice(i,1)         //一次删一个，可以重复删
            }
        }*/
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
            goPort.value=arr[id].port       //出发港
            orderId.value=arr[id].id          //提单编号
            portCode.value=arr[id].portCode   //到货港提货编码
            goods.value=arr[id].goods      //货物类型
            weight.value=arr[id].weight    //重量
            confirm.onclick=function () {
                arr[id].port=goPort.value
                arr[id].id=orderId.value
                arr[id].portCode=portCode.value
                arr[id].goods=goods.value
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