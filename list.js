var data = null;
var xhr = new XMLHttpRequest();
xhr.open("get","jsonData.txt",false);
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)){
        var val = xhr.responseText;
        data = utils.jsonParse(val);
    }
}
xhr.send();

//数据绑定
var list = document.getElementById("list");
var picture = list.getElementsByTagName("img");
!function(){
    var str = '';
    if(data){
        for(var i = 0; i < data.length; i++){
            str += '<li>';
            str += '<div><img src="" trueImg="'+ data[i].img +'" alt=""></div>';
            str += '<div><h2>'+ data[i].title +'</h2><p>'+ data[i].desc  +'</p></div>';
        }
    }
    list.innerHTML = str;
}.call() 

//单张图片延迟加载
function lazyImg(pic){
    var img = new Image;
    img.src = pic.getAttribute("trueImg");
    img.onload = function(){
        pic.src = this.src;
        pic.style.display = "block";
        img = null;
    }
    pic.isLoad = true;
}

//多张图片延迟加载
function handleImg(){
    for(var i = 0; i < picture.length; i++){
        var curImg = picture[i];
        if(curImg.isLoad){
            continue;
        }
        var curImgHeight = curImg.parentNode.offsetHeight;
        var a = curImgHeight + offset(curImg.parentNode).top;
        var b = (document.documentElement.clientHeight || document.body.clientHeight) + (document.documentElement.scrollTop || document.body.scrollTop);
        if(a < b){
            lazyImg(curImg);
            fadeIn(curImg);
        }
    }
}
window.setTimeout(handleImg,500);
window.onscroll = handleImg;

//设置图片渐显效果
function fadeIn(a){
    var duration = 500; interval = 10; target = 1;
    var step = target / duration * interval;
    var timer = window.setInterval(function(){
        var imgOpacity = window.getComputedStyle(a,null).opacity - 0;
        if(imgOpacity >= 1){
            a.style.opacity = 1;
            clearInterval(timer);
            return;
        }
        imgOpacity += step;
        a.style.opacity = imgOpacity;
    },interval)
}

function offset(curEle){
    var totalLeft = null,totalTop = null,par = curEle.offsetParent;
    totalLeft += curEle.offsetLeft;
    totalTop += curEle.offsetTop;
    // 只要没找到 body，我们就把父级参照物的边框和偏移量也进行累加
    while(par){
        // 累加父级参照物的边框
        if(navigator.userAgent.indexOf("MISE 8.0") ===  -1){  // 兼容ie8
            totalLeft += par.clientLeft;
            totalTop += par.clientTop;
        }
        // 累加父级参照物本身的偏移量
        totalLeft += par.offsetLeft;
        totalTop += par.offsetTop;
        par = par.offsetParent;
    }
    return {left: totalLeft, top: totalTop}
}