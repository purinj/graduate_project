var mymap = L.map('mapid').setView([16.476631, 102.823252], 13.5);
        const modal = {
            container : document.querySelector('#check-baby-boy-hehe-xd'),
            content : document.querySelector('#check-baby-boy-hehe-xd .content'),
            open : ()=>{
                modal.container.style.display = "block"
            },
            setText : (html)=>{
                modal.content.innerHTML = ""
                modal.content.appendChild(html)
            }
        }
        console.log(modal.container);
        const accessToken = `pk.eyJ1IjoidHNwZXRlciIsImEiOiJja2RpeTgzcGEwOWpoMzRwOXNpYmRzeXBjIn0.r4QTVks0jXkW-nRjrzpjYQ`
        L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken
        }).addTo(mymap);



        //icon
        var gold = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        var red = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        var orange = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        var green = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        var blue = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        var Color_location = [gold, gold, gold, gold, gold, gold, gold, gold, gold, gold, gold, gold, gold, gold, gold,
            gold, gold, gold
        ]
        
        let data = [{
            "lat": 16.45548,
            "long": 102.820174,
            "text": "SciParkPole3-2 CCTV08",
            "allText": ["SciParkPole3-2 CCTV08"],
            "objectAmount" : 120
        }, {
            "lat": 16.455528,
            "long": 102.819878,
            "text": "SciParkPole2-2 CCTV09",
            "allText": ["SciParkPole2-2 CCTV09"],
            "objectAmount" : 320
        }, {
            "lat": 16.455299,
            "long": 102.819863,
            "text": "SciParkPole2-1 CCTV10",
            "allText": ["SciParkPole2-1 CCTV10"],
            "objectAmount" : 1230
        }, {
            "lat": 16.45548,
            "long": 102.820174,
            "text": "SciParkPole3-1 CCTV07",
            "allText": ["SciParkPole3-1 CCTV07"],
            "objectAmount" : 12055
        }, {
            "lat": 16.465563,
            "long": 102.822023,
            "text": "WatPaAdul1 CCTV12",
            "allText": ["WatPaAdul1 CCTV12"],
            "objectAmount" : 32120
        }, {
            "lat": 16.465563,
            "long": 102.822023,
            "text": "WatPaAdul2 CCTV11",
            "allText": ["WatPaAdul2 CCTV11"],
            "objectAmount" : 2120
        }, {
            "lat": 16.464986,
            "long": 102.827652,
            "text": "KangSaDal1-1 CCTV13",
            "allText": ["KangSaDal1-1 CCTV13"],
            "objectAmount" : 12430
        }, {
            "lat": 16.464986,
            "long": 102.827652,
            "text": "KangSaDal1-2 CCTV14",
            "allText": ["KangSaDal1-2 CCTV14"],
            "objectAmount" : 1420
        }, {
            "lat": 16.455233,
            "long": 102.820228,
            "text": "SciParkPole1-1 CCTV03",
            "allText": ["SciParkPole1-1 CCTV03"],
            "objectAmount" : 150
        }, {
            "lat": 16.455233,
            "long": 102.820228,
            "text": "SciParkPole1-2 CCTV04",
            "allText": ["SciParkPole1-2 CCTV04"],
            "objectAmount" : 1201
        }, {
            "lat": 16.450709,
            "long": 102.816601,
            "text": "SatitAnuban CCTV28",
            "allText": ["SatitAnuban CCTV28"],
            "objectAmount" : 12067
        }, {
            "lat": 16.450709,
            "long": 102.816601,
            "text": "SatitAnuban CCTV27",
            "allText": ["SatitAnuban CCTV27"],
            "objectAmount" : 43120
        }, {
            "lat": 16.443118,
            "long": 102.81458,
            "text": "SritanIn CCTV21",
            "allText": ["SritanIn CCTV21"],
            "objectAmount" : 45120
        }, {
            "lat": 16.443118,
            "long": 102.81458,
            "text": "SritanIn CCTV22",
            "allText": ["SritanIn CCTV22"],
            "objectAmount" : 20120
        }, {
            "lat": 16.442441,
            "long": 102.814736,
            "text": "SritanOut CCTV23",
            "allText": ["SritanOut CCTV23"],
            "objectAmount" : 33120
        }, {
            "lat": 16.442441,
            "long": 102.814736,
            "text": "SritanOut CCTV24",
            "allText": ["SritanOut CCTV24"],
            "objectAmount" : 2120
        }, {
            "lat": 16.479158,
            "long": 102.821284,
            "text": "WaterSupply CCTV35",
            "allText": ["WaterSupply CCTV35"],
            "objectAmount" : 7120
        }, {
            "lat": 16.479158,
            "long": 102.821284,
            "text": "WaterSupply CCTV36",
            "allText": ["WaterSupply CCTV36"],
            "objectAmount" : 1520
        }]


   
        data = getAppendLocation(data)
        data.forEach(({lat,long,text,allText,objectAmount},i)=>{

            window['location' + i] = L.marker([lat,long], {
                icon: getColor(objectAmount)
            }).addTo(mymap);

            window['location' + i].bindPopup(text);

            window['location' + i].on('mouseover', function (ev) {
                ev.target.openPopup();
            });
            window['location' + i].on('mouseout', function (ev) {
                ev.target.closePopup();
            });

            window['location' + i].on('click', function (ev) {
                const haveMultipleText = allText.length > 1
                if(haveMultipleText){
                    const container = document.createElement("div")
                    for (const [i,v] of allText.entries()) {
                        const text  = document.createElement("div")
                        text.innerHTML = v
                        text.addEventListener("click",()=>{
                            console.log(v,i);
                        })
                        container.appendChild(text)
                    }
                    modal.setText(container)
                    modal.open()
                }else{
                    corelaton('linkaxxon1', 'host', 'pin')
                }
                console.log(ev);
                    ev.target.openPopup();
                });

            function corelaton(fist, second, third) {
                console.log(fist);
                console.log(second);
                console.log(third);
                window.open("http://localhost:2204/video_feed/axxon/AXXON03/23", "_blank",
                    "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400");

            }
            function getColor(count) {
                if(count < 5000){
                    return gold
                }else if(count < 10000){
                    return red
                }else if(count < 20000){
                    return orange
                }else if(count < 50000){
                    return green
                }else {
                    return blue
                }
            }
        })
        // for (i = 0; i < test_location.length; i++) {
        //     console.log(test_location[i]);
            



        //     // var popup = L.popup();
        //     // var photoImg = '<img src="https://static.pexels.com/photos/189349/pexels-photo-189349.jpeg" height="150px" width="150px"/>';
        //     // function onMapClick(e) {
        //     //     popup
        //     //         .setLatLng(e.latlng)
        //     //         .setContent("<center>My Photo </center>" + "</br>"+ photoImg)
        //     //         .openOn(mymap);
        //     // }
        //     // mymap.on('click', onMapClick);
            
        
        // }
        function getAppendLocation(data) {
            const temp = {}
            data.forEach((v, i) => {
                const location = `${v.lat}${v.long}`
                if (!temp[location]) {
                    temp[location] = i + 1
                } else {
                    data[i] = undefined
                    data[temp[location] - 1].allText.push(v.text)
                    data[temp[location] - 1].objectAmount += v.objectAmount
                    data[temp[location] - 1].text = `
                        <div style="color:red">${data[temp[location] - 1].text}</div>
                        <div style="color:blue">${v.text}</div>
                    `
                }

            })
            data = data.filter(v => v)
            return data
        }
       