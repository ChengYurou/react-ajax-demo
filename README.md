#2016-08-06总结（关于React Ajax）

------

## Ajax是一门快速创建**动态网页**的技术，学习的过程中我遇到了如下问题：

 - 下面是一段纯Ajax请求的代码
 ```javascript
 if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
    }else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
 xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
        document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
        }
    }
    xmlhttp.open("GET","./ajax/test.txt",true);
    xmlhttp.send();
 ```
我们知道readyState中保存了xmlhttpRequest的五种状态，状态改变就会触发onreadystatechange事件，分别是
 
 - 0：请求未初始化
 - 1：服务器已建立连接
 - 2：请求已接收
 - 3：请求正在处理
 - 4：请求完成并响应就绪
 
 但我对这五种状态分别位于代码中的哪个时刻依然不是很理解，于是我做了下面的实验
首先在第6行代码下添加`console.log(xmlhttp.readyState);`可以看到请求发出后控制台打印出了1，2，3，4状态。那么0状态在哪里？哪句代码实现了请求的初始化。
这次我在第5行,第11行,和12行下面分别添加`console.log(xmlhttp.readyState);`，控制台输出0，1，1状态，也就是说`xmlhttp.open`和`xmlhttp.send`就是初始化请求的过程

## 组件的数据来源，通常是通过 Ajax 请求从服务器获取，可以使用 componentDidMount 方法设置 Ajax 请求，等到请求成功，再用 this.setState 方法重新渲染 UI 
可以看我在github上的例子[react-ajax.js](https://github.com/ChengYurou/react-ajax-demo/blob/master/react-ajax.js),以下为代码片段：
```javascript
componentDidMount: function() {
        $.get(this.props.source, function(result) {
            var user = result[0];
            if (this.isMounted()) {
                this.setState({
                    username: user.name,
                    url: user.items.html_url
                });
            }
        }.bind(this));
    },
```
在写这个例子时针对这段代码我存在以下疑惑：

 - componentDidMount是发生在组建挂载之后，渲染之前的为什么还要判断`if (this.isMounted())`
 
 这个问题我在[官网](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html)上找到了解答，意思是执行异步请求的响应时，在更新 `state` 前， 一定要先通过 `this.isMounted()` 来检测组件的状态是否还是 `mounted`。
 - 为什么要用`bind(this)`,有没有别的方式可以替代它
 
 实验后发现，在`$get`的callback中，`this`的值会被更改为传进来的数据，而我们希望this依然是`App`组件，因此要使用`bind(this)`。还有一种简单的方法就是使用`ES6`中的`=>`来保证this的值不被更改，即：
```javascript
$.get(this.props.source, (result)=> {
            var user = result[0];
            if (this.isMounted()) {
                this.setState({
                    username: user.name,
                    url: user.items.html_url
                });
            }
        });
```
