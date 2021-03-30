let allRow = []
let locationAndName = []
let allCameraTableRows = []
let testType = ['normal', 'ai', 'thermal']
var overlayMaps = {};

blupole_init()
Zoning_init()
getRolesCam()
if (document.getElementById('Roles_p').innerHTML.includes("SmartCity") || document.getElementById('Roles_p').innerHTML.includes("Admin")) {
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/AxxonCameraTable",
        success: function (data) {
            console.log(data);
            allRow = data.row
            for (i = 0; i < data.row.length; i++) {
                locationAndName.push({
                    lat: data.row[i][5],
                    long: data.row[i][6],
                    text: data.row[i][3],
                    allText: [data.row[i][3]],
                })


            }

        }

    });


    let reformData = getAppendLocation(locationAndName)
    var smartPolesIcon = L.icon({
        iconUrl: 'static/image/axxon.svg',
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [35, 75], // size of the icon
        // shadowSize: [50, 64], // size of the shadow
        iconAnchor: [10, 77], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62], // the same for the shadow
        popupAnchor: [3, -79] // point from which the popup should open relative to the iconAnchor
    });
    var count = 0
    var arr_smartpole = []
    for (const v of reformData) {
        window['location' + count] = L.marker([v.lat, v.long],{icon:smartPolesIcon}).addTo(mymap);
        arr_smartpole.push(window['location' + count]),
        window['location' + count].bindPopup(v.text);
        window['location' + count].on('mouseover', function (ev) {
            ev.target.openPopup();
        });
        window['location' + count].on('mouseout', function (ev) {
            ev.target.closePopup();
        });
        console.log(v.allText);




        window['location' + count].on('click', function (ev) {
            var newBtnText = ''
            for (j = 0; j < v.allText.length; j++) {
                console.log(v.allText[j]);
                newBtnText += '<button class="form-control"' + ' onclick=clickForStream(' + "this" + ')' + '>' + v.allText[j] + '</button>'
            }
            console.log(newBtnText);
            document.getElementById('streamBtnContainer').innerHTML = newBtnText
            document.getElementById('modal_btn').click()
        });
        count += 1
    }

    // layer
    var Smartpoles = L.layerGroup(arr_smartpole);
    Smartpoles.addTo(mymap)
    overlayMaps.Smartpoles = Smartpoles
    // var overlayMaps = {
    //     "Smartpoles": Smartpoles
    // };

    // L.control.layers({
    //     ปกติ: normalLayer,
    //     ถนน: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         maxZoom: 19,
    //         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    //     })
    // }, overlayMaps).addTo(mymap);


}

addLayer() //add a Layer Control







//func

function getAppendLocation(data) {
    const temp = {}
    data.forEach((v, i) => {
        console.log(v);
        const location = `${v.lat}${v.long}`
        console.log(location);
        if (!temp[location]) {
            temp[location] = i + 1
        } else {
            data[i] = undefined
            data[temp[location] - 1].allText.push(v.text)
            data[temp[location] - 1].objectAmount += v.objectAmount
            data[temp[location] - 1].text = `
                      <div style="color:black">${data[temp[location] - 1].text}</div>
                      <div style="color:black">${v.text}</div>
                  `
        }

    })
    data = data.filter(v => v)
    return data
}

// only axxon || start
function clickForStream(streamName) {
    var find = false
    var indexVal = 0
    do {
        var finding = allRow[indexVal].includes(streamName.innerHTML);
        indexVal++;
    }
    while (indexVal < allRow.length && finding == false);

    console.log(indexVal);

    console.log(allRow[indexVal - 1][3]);
    var host = ''
    if (String(allRow[indexVal - 1][1]).length < 2) {
        host = '0' + String(allRow[indexVal - 1][1])
    } else {
        host = String(allRow[indexVal - 1][1])
    }
    var devicepin = allRow[indexVal - 1][2]
    if (String(allRow[indexVal - 1][2]).length < 2) {
        devicepin = '0' + String(allRow[indexVal - 1][2])
    } else {
        devicepin = String(allRow[indexVal - 1][2])
    }
    window.open(host_url + `video_feed/axxon/AXXON${host}/${devicepin}`, "_blank",
        "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");
}
// only axxon || end

function getRolesCam() {
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/allCameraTable",
        success: function (data) {
            normalLocation = []
            thermalLocation = []
            allCameraTableRows = data.row
            console.log(data);
            //console.log(testType.indexOf('bison'));
            for (i = 0; i < data.row.length; i++) {
                if (data.row[i][4] == 'normal') {
                    normalLocation.push({
                        lat: data.row[i][11],
                        long: data.row[i][12],
                        text: data.row[i][5],
                        allText: [data.row[i][5]],
                    })
                } else if (data.row[i][4] == 'thermal') {
                    thermalLocation.push({
                        lat: data.row[i][11],
                        long: data.row[i][12],
                        text: data.row[i][5],
                        allText: [data.row[i][5]],
                    })

                }


            }
            let normalReformData = getAppendLocation(normalLocation)
            let thermalReformData = getAppendLocation(thermalLocation)
            var count = 0
            var arr_normalCam = []

            var normalIcon = L.icon({
                iconUrl: 'static/image/cctv.svg',
                // shadowUrl: 'leaf-shadow.png',
    
                iconSize: [35, 75], // size of the icon
                // shadowSize: [50, 64], // size of the shadow
                iconAnchor: [10, 77], // point of the icon which will correspond to marker's location
                // shadowAnchor: [4, 62], // the same for the shadow
                popupAnchor: [3, -79] // point from which the popup should open relative to the iconAnchor
            });


            for (const v of normalReformData) {
                window['Cameras' + count] = L.marker([v.lat, v.long],{icon: normalIcon}).addTo(mymap);
                arr_normalCam.push(window['Cameras' + count])
                window['Cameras' + count].bindPopup(v.text);
                window['Cameras' + count].on('mouseover', function (ev) {
                    ev.target.openPopup();
                });
                window['Cameras' + count].on('mouseout', function (ev) {
                    ev.target.closePopup();
                });
                console.log(v.allText);

                window['Cameras' + count].on('click', function (ev) {
                    var newBtnText = ''
                    for (j = 0; j < v.allText.length; j++) {
                        console.log(v.allText[j]);
                        newBtnText += '<button class="form-control"' + ' onclick=CamStreamClick(' + "this" + ')' + '>' + v.allText[j] + '</button>'
                    }
                    console.log(newBtnText);
                    document.getElementById('streamBtnContainer').innerHTML = newBtnText
                    document.getElementById('modal_btn').click()
                });
                count += 1
            }
            // layer
            var normalCamGroup = L.layerGroup(arr_normalCam);
            normalCamGroup.addTo(mymap)
            overlayMaps.กล้องปกติ = normalCamGroup
            var thermalIcon = L.icon({
                iconUrl: 'static/image/thermal.svg',
                // shadowUrl: 'leaf-shadow.png',
    
                iconSize: [35, 75], // size of the icon
                // shadowSize: [50, 64], // size of the shadow
                iconAnchor: [10, 77], // point of the icon which will correspond to marker's location
                // shadowAnchor: [4, 62], // the same for the shadow
                popupAnchor: [3, -79] // point from which the popup should open relative to the iconAnchor
            });

            count = 0
            console.log('set Zero', count);
            var arr_thermalcam = []
            for (const v of thermalReformData) {
                window['thermal' + count] = L.marker([v.lat, v.long], {icon: thermalIcon}).addTo(mymap);
                arr_thermalcam.push(window['thermal' + count])
                window['thermal' + count].bindPopup(v.text);
                window['thermal' + count].on('mouseover', function (ev) {
                    ev.target.openPopup();
                });
                window['thermal' + count].on('mouseout', function (ev) {
                    ev.target.closePopup();
                });
                console.log(v.allText);

                window['thermal' + count].on('click', function (ev) {
                    var newBtnText = ''
                    for (j = 0; j < v.allText.length; j++) {
                        console.log(v.allText[j]);
                        newBtnText += '<button class="form-control"' + ' onclick=CamStreamClick(' + "this" + ')' + '>' + v.allText[j] + '</button>'
                    }
                    console.log(newBtnText);
                    document.getElementById('streamBtnContainer').innerHTML = newBtnText
                    document.getElementById('modal_btn').click()
                });
                count += 1
            }

             // layer
             var thermalCamGroup = L.layerGroup(arr_thermalcam);
             thermalCamGroup.addTo(mymap)
             overlayMaps.กล้องวัดอุณหภูมิ = thermalCamGroup




        }

    });
}


function blupole_init() {
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/bluepoleManage",
        success: function (data) {
            console.log(data);
            bluePoleRows = data.row
            bluepoleLocation = []
            // thermalLocation = []
            for (i = 0; i < data.row.length; i++) {
                bluepoleLocation.push({
                        lat: data.row[i][2],
                        long: data.row[i][3],
                        text: data.row[i][1],
                        allText: [data.row[i][1]],
                    })

            }
            let bluePoleReformData = getAppendLocation(bluepoleLocation)
            var count = 0
            var arr_bluepole = []
            var BIcon = L.icon({
                iconUrl: 'static/image/blue.svg',
                // shadowUrl: 'leaf-shadow.png',
    
                iconSize: [35, 75], // size of the icon
                // shadowSize: [50, 64], // size of the shadow
                iconAnchor: [10, 77], // point of the icon which will correspond to marker's location
                // shadowAnchor: [4, 62], // the same for the shadow
                popupAnchor: [3, -79] // point from which the popup should open relative to the iconAnchor
            });
            for (const v of bluePoleReformData) {
                window['bluePole' + count] = L.marker([v.lat, v.long], {icon: BIcon}).addTo(mymap);
                arr_bluepole.push(window['bluePole' + count])
                window['bluePole' + count].bindPopup(v.text);
                window['bluePole' + count].on('mouseover', function (ev) {
                    ev.target.openPopup();
                });
                window['bluePole' + count].on('mouseout', function (ev) {
                    ev.target.closePopup();
                });
                console.log(v.allText);
                // window['bluePole' + count].on('click', function (ev) {
                //     var newBtnText = ''
                //     for (j = 0; j < v.allText.length; j++) {
                //         console.log(v.allText[j]);
                //         newBtnText += '<button class="form-control"' + ' onclick=CamStreamClick(' + "this" + ')' + '>' + v.allText[j] + '</button>'
                //     }
                //     console.log(newBtnText);
                //     document.getElementById('streamBtnContainer').innerHTML = newBtnText
                //     document.getElementById('modal_btn').click()
                // });
                count += 1
            }
            // layer
            var bluepoleGroup = L.layerGroup(arr_bluepole);
            bluepoleGroup.addTo(mymap)
            overlayMaps.bluepole = bluepoleGroup




        }

    });
}






function CamStreamClick(someInput) {
    console.log(someInput);
    console.log(allCameraTableRows);
    var find = false
    var indexVal = 0
    do {
        var finding = allCameraTableRows[indexVal].includes(someInput.innerHTML);
        indexVal++;
    }
    while (finding == false);
    console.log(indexVal -1);
    console.log(allCameraTableRows[indexVal -1][1].replaceAll(".", "_"));
    window.open(host_url + `api/stream/${allCameraTableRows[indexVal - 1][1].replaceAll(".", "_")}`, "_blank",
    "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");

}

function addLayer () {
    L.control.layers({
        ดาวเทียม: normalLayer,
        เฉพาะแผนที่: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
        })
    }, overlayMaps).addTo(mymap);

    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         maxZoom: 19,
    //         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    //     })


}


function Zoning_init() {
    var arr_zoning = []
    for (i = 0; i < zone_area.length; i++) {
        console.log(zone_area[i]);
        window['zone' + i] = L.polygon(zone_area[i]).addTo(mymap);
        arr_zoning.push(window['zone' + i])
        window['zone' + i].setStyle(Color_zone[i]);
        window['zone' + i].bindPopup(Name_zone[i]);
        window['zone' + i].on('mouseover', function (ev) {
            ev.target.openPopup();
        });
        window['zone' + i].on('mouseout', function (ev) {
            ev.target.closePopup();
        });
    }
    var zoning = L.layerGroup(arr_zoning);
        zoning.addTo(mymap)
        overlayMaps.zoning = zoning

}