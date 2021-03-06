const position = {};
position.obj_init = () => {
// 一、出现地图
    // 创建map实例，并给于地图的级别
    let map = new BMap.Map("container"),
        holder_lng = Number($('.lng').attr('placeholder')),
        holder_lat = Number($('.lat').attr('placeholder')),
        // 默认地图中心坐标点
        point = new BMap.Point(holder_lng,holder_lat);
    // 设置默认地图中心和地图缩放比例
    map.centerAndZoom(new BMap.Point(holder_lng,holder_lat),11);
    // 启动滚轮操作（PC）/ 单点拖拽、双击缩放
    map.enableScrollWheelZoom(true);
   
    // 用经纬度设置地图中心点
    let lng,
        lat;
    function theLocation(){
        if (!$('.lng').val()) {
            lng = holder_lng;
            lat = holder_lat;
            $('.lng').val(lng);
            $('.lat').val(lat);
        } else {
            // alert('Y')
            lng = $('.lng').val();
            lat = $('.lat').val();
            // 更改地图中心点，点击marker可以弹出信息框
            point = new BMap.Point(lng,lat);
            console.log(point)
        }
        // alert(lng)
        // alert(lat)
        if(lng != "" && lat != ""){
            // 清除上次的覆盖物
            map.clearOverlays(); 
            // 重新设置地图中心点
            let new_point = new BMap.Point(lng,lat),
                // 创建标注
                marker = new BMap.Marker(new_point);  
            // 将标注添加到地图中
            map.addOverlay(marker);   
            // 将新点设为地图的中心，并会已平滑的方式进入坐标点位置
            map.panTo(new_point);   
        }
        msgObj.showInfo();
    }
    $('.search').click(theLocation);
// 二、添加控件
     // map.addControl(new BMap.NavigationControl());
        /* 控件位置
            anchor:为控件所在的地理位置
            offset:距离地图边界多少px
            type:控件类型
        */  
    let posi = {
            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
            // offset:new BMap.Size(15,15),
            type: BMAP_NAVIGATION_CONTROL_SMALL
        };
    // 1、添加比例尺
    map.addControl(new BMap.ScaleControl(posi));
    // 2、平移缩放控件
    map.addControl(new BMap.NavigationControl());
    // 3、缩略图控件
    // map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));   //右下角，打开
    
    // 4、地图类型
    map.addControl(new BMap.MapTypeControl());
    // 5、定位控件
    map.addControl(new BMap.GeolocationControl());
    // 6、版权控件
    map.addControl(new BMap.CopyrightControl());

// 三、信息窗口
    let msgObj = {};
    msgObj.showInfo = () => {
        // 3.1、信息对象
        let searchMsgWin = null,
            content = `
                <div class='marker'>
                    地址：天津市南开区黄河道</br />
                    电话：00000000<br />
                    简介：大通大厦
                </div>
            `;
            searchMsgWin = new BMapLib.SearchInfoWindow(map,content,{
                title : '大通大厦',
                width : 100,
                height: 200,
                panel : 'panel',//检索结果面板
                enableAutoPan: true,//自动平移
                searchTypes   : [
                    BMAPLIB_TAB_SEARCH,//周边检索
                    BMAPLIB_TAB_TO_HERE,//到这里去
                    BMAPLIB_TAB_FROM_HERE//从这里出发
                ]
            })
        // 2、覆盖物对象(小红点)
        let marker = new BMap.Marker(point);
        marker.enableDragging();//可拖拽
            console.log(point)
        marker.addEventListener('click',function(e){
            searchMsgWin.open(marker);
            $('.BMapLib_SearchInfoWindow').css({'position':'absolute'});
            $('.BMapLib_bubble_content').height('auto');
      
            // 移动端时
            let marker_l = e.changedTouches[0].clientX,
                marker_t = e.changedTouches[0].clientY - $('.BMapLib_SearchInfoWindow').height();
                if (marker_l + $('.BMapLib_SearchInfoWindow').width() < $(window).width()) {
                    $('.BMapLib_SearchInfoWindow').offset({'top': marker_t,'left':marker_l});
                }
            // PC时
            // $('.BMapLib_SearchInfoWindow').offset({'top':e.clientY,'left':e.clientX});
        })
        map.addOverlay(marker);//在地图上添加marker
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

    }
    msgObj.showInfo();
}
