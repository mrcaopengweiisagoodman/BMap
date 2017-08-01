const lngAndLatObj = {};
lngAndLatObj.obj_init = () => {
    let map = new BMap.Map("container");
    map.centerAndZoom("天津", 15);
    map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
    map.addControl(new BMap.OverviewMapControl()); //添加默认缩略地图控件
    map.addControl(new BMap.OverviewMapControl({ isOpen: true, anchor: BMAP_ANCHOR_BOTTOM_RIGHT }));   //右下角，打开

    let localSearch = new BMap.LocalSearch(map);
    localSearch.enableAutoViewport(); //允许自动调节窗体大小
    function searchByStationName() {
        map.clearOverlays();//清空原来的标注
        let keyword = $("#text_").val();
        localSearch.setSearchCompleteCallback(function (searchResult) {
            let poi = searchResult.getPoi(0),
                num = poi.point.lng + "," + poi.point.lat;
            $("#result_").val(num);
            map.centerAndZoom(poi.point, 15);
            let marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
            map.addOverlay(marker);
            let content = `
                    ${$("#result_").val()}<br /><br />
                    经度：${poi.point.lng}<br />
                    纬度：${poi.point.lat}
                `,
                infoWindow = new BMap.InfoWindow(`
                    <p style='font-size:14px;'>${content}</p>
                `);
            marker.addEventListener("click", function () { this.openInfoWindow(infoWindow); });
            marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        });
        localSearch.search(keyword);
    } 
    $('.submit').click(searchByStationName);
}