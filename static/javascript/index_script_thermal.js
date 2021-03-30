var label_camNote = []
var IPaddress = []
var highTemp = []
var normalTemp = []

getCamData()
highLowTemp(IPaddress)
add_option('select_thermalcam')

createStackdata('thermal_Data', label_camNote, normalTemp, highTemp)

document.getElementById('view_select_thermalcam').onclick = function () {
    data_index = document.getElementById('select_thermalcam').selectedIndex;
    console.log(data_index);
    console.log(IPaddress[data_index]);
    $('#AgeGroupChart').remove();
    $('#AgeGroupChart_container').append('<div id="AgeGroupChart" style="width: 100%; min-height: 350px"></div>');
    getDetectData(IPaddress[data_index], 'POST', {
        startDate: $('#start_date').val(),
        endDate: $('#end_date').val(),
        temperatureType: 'all',
        AgeGroup: 'all',
        gender: 'all',
        glassed: 'all',
        faceExpression: 'all',
        race: 'all',
        beard: 'all',
        hat: 'all'

    })

}
document.getElementById('view_select_thermalcam').click();

function getCamData() {
    ipAddress = []
    note = []
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/hikcameraNote",
        data: "",
        success: function (data) {
            executeData = JSON.parse(data)
            for (i = 0; i < executeData.length; i++) {
                ipAddress.push(executeData[i].ipAddress)
                note.push(executeData[i].note)
            }
            IPaddress = ipAddress
            label_camNote = note
        }
    });
}

function highLowTemp(ipdata) {
    highTemp = []
    normalTemp = []
    for (i = 0; i < ipdata.length; i++) {
        $.ajax({
            type: 'POST',
            async: false,
            url: host_url + "api/isAbnomalTemp/" + ipdata[i],
            data: {
                startDate: document.getElementById('start_date').value,
                endDate: document.getElementById('end_date').value
            },
            success: function (data) {
                pre_highTemp = []
                pre_normalTemp = []
                console.log(data);
                data = JSON.parse(data)
                highTemp.push(data.highTemp)
                normalTemp.push(data.normalTemp)

            }
        });

    }
}

function createStackdata(element_id, label, normalTemp, highTemp) {
    var theme = {
        color: [
            'green', 'red', '#BDC3C7', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#408829'
            }
        },

        dataRange: {
            color: ['#1f610a', '#97b58d']
        },

        toolbox: {
            color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: {
                    color: '#408829'
                },
                shadowStyle: {
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },

        dataZoom: {
            dataBackgroundColor: '#eee',
            fillerColor: 'rgba(64,136,41,0.2)',
            handleColor: '#408829'
        },
        grid: {
            borderWidth: 0
        },

        categoryAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },

        valueAxis: {
            axisLine: {
                lineStyle: {
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                }
            },
            splitLine: {
                lineStyle: {
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: {
                color: '#408829'
            },
            controlStyle: {
                normal: {
                    color: '#408829'
                },
                emphasis: {
                    color: '#408829'
                }
            }
        },

        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    color0: '#a9cba2',
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        color0: '#86b379'
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: {
                        color: '#ddd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                },
                emphasis: {
                    areaStyle: {
                        color: '#99d2dd'
                    },
                    label: {
                        textStyle: {
                            color: '#c12e34'
                        }
                    }
                }
            }
        },
        force: {
            itemStyle: {
                normal: {
                    linkStyle: {
                        strokeColor: '#408829'
                    }
                }
            }
        },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    color: [
                        [0.2, '#86b379'],
                        [0.8, '#68a54a'],
                        [1, '#408829']
                    ],
                    width: 8
                }
            },
            axisTick: {
                splitNumber: 10,
                length: 12,
                lineStyle: {
                    color: 'auto'
                }
            },
            axisLabel: {
                textStyle: {
                    color: 'auto'
                }
            },
            splitLine: {
                length: 18,
                lineStyle: {
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    color: 'auto'
                }
            }
        },
        textStyle: {
            fontFamily: 'Arial, Verdana, sans-serif'
        }
    };
    if ($('#' + element_id).length) {

        var echartBar = echarts.init(document.getElementById(element_id), theme);

        echartBar.setOption({
            title: {
                text: 'Thermal',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 100,
                data: ['ปกติ', 'มากกว่า 37.5']
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            calculable: true,
            xAxis: [{
                type: 'value',
                boundaryGap: [0, 0.01]
            }],
            yAxis: [{
                type: 'category',
                data: label
            }],
            series: [{
                name: 'ปกติ',
                type: 'bar',
                label: { 
                    normal:{
                        show: true,
                        position: 'right',
                        offset: [10, 0],
                        textStyle: {
                          fontSize: 16
                        }
                      }
                },
                data: normalTemp
            }, {
                name: 'มากกว่า 37.5',
                type: 'bar',
                label: { 
                    normal:{
                        show: true,
                        position: 'right',
                        offset: [10, 0],
                        textStyle: {
                          fontSize: 16
                        }
                      }
                },
                data: highTemp
            }]
        });

    }
}

function add_option(option_id) {
    for (i = 0; i < label_camNote.length; i++) {
        $('#' + option_id).append("<option value=" + label_camNote[i] + ">" + label_camNote[i] + "</option>")
    }
}

function getDetectData(ip, type, data) {
    $.ajax({
        type: type,
        async: false,
        url: host_url + "api/hikVisionData/" + ip,
        data: data,
        success: function (data) {
            data = JSON.parse(data)
            console.log(data);
            table = ''
            for (var i = 0; i < Object.keys(data).length; i++) {
                table += '<tr>' + '<td>' + Object.keys(data)[i] + '</td>'
                //  console.log(Object.keys(data)[i],data[Object.keys(data)[i]]); 
                var innerObject = Object.keys(data[Object.keys(data)[i]])

                if (Object.keys(data)[i] == 'gender') {
                    var nameforsubdata = [];
                    var valueforsubdata = [];
                    var colorOfdata = ['#44a3fa', '#f721c9']

                    for (var j = 0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                        nameforsubdata.push(innerObject[j]);
                        console.log(data[Object.keys(data)[i]][innerObject[j]]);
                        valueforsubdata.push({
                            value: parseInt(data[Object.keys(data)[i]][innerObject[j]]),
                            name: innerObject[j]
                        })

                    }
                    // console.log(nameforsubdata);
                    // console.log(valueforsubdata);
                    // console.log(valueforsubdata[1].name);
                    // console.log(valueforsubdata[0].name);
                    document.getElementById('male_data').innerHTML = data[Object.keys(data)[i]]['male']
                    document.getElementById('female_data').innerHTML = data[Object.keys(data)[i]]['female']



                }




                if (Object.keys(data)[i] == 'AgeGroup') {
                    var nameforsubdata = [];
                    var valueforsubdata = [];
                    var colorOfdata = ['#D2691E', '#FF8C00', '#DAA520', '#6B8E23', '#00FF7F']

                    for (var j = 0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                        nameforsubdata.push(translate('AgeGroup', innerObject[j]));
                        console.log(data[Object.keys(data)[i]][innerObject[j]]);
                        valueforsubdata.push({
                            value: parseInt(data[Object.keys(data)[i]][innerObject[j]]),
                            name: translate('AgeGroup', innerObject[j])
                        })

                    }
                    console.log(nameforsubdata);
                    console.log(valueforsubdata);


                    //create_donut_chart('AgeGroupChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                    create_echart(Object.keys(data)[i], 'AgeGroupChart', nameforsubdata, valueforsubdata, colorOfdata, false)

                }


                for (j = 0; j < innerObject.length; j++) {
                    table += '<td>' + innerObject[j] + ':' + data[Object.keys(data)[i]][innerObject[j]] + '</td>';
                    //  console.log(innerObject[j],data[Object.keys(data)[i]][innerObject[j]]);
                }
                table += '</tr>'
                //  console.log(table);
            }
            $('#detail').html(table)
        }
    });

}

function create_echart(chart_name, chart_elm_id, nameOfdata, valueDataset, color) {
    console.log('echart', chart_elm_id);
    if ($('#' + chart_elm_id).length) {
        var theme = {
            color: [
                '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
                '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
            ],

            title: {
                itemGap: 8,
                textStyle: {
                    fontWeight: 'normal',
                    color: '#408829'
                }
            },

            dataRange: {
                color: ['#1f610a', '#97b58d']
            },

            toolbox: {
                color: ['#408829', '#408829', '#408829', '#408829']
            },

            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.5)',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: '#408829',
                        type: 'dashed'
                    },
                    crossStyle: {
                        color: '#408829'
                    },
                    shadowStyle: {
                        color: 'rgba(200,200,200,0.3)'
                    }
                }
            },

            dataZoom: {
                dataBackgroundColor: '#eee',
                fillerColor: 'rgba(64,136,41,0.2)',
                handleColor: '#408829'
            },
            grid: {
                borderWidth: 0
            },

            categoryAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#408829'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee']
                    }
                }
            },

            valueAxis: {
                axisLine: {
                    lineStyle: {
                        color: '#408829'
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: ['#eee']
                    }
                }
            },
            timeline: {
                lineStyle: {
                    color: '#408829'
                },
                controlStyle: {
                    normal: {
                        color: '#408829'
                    },
                    emphasis: {
                        color: '#408829'
                    }
                }
            },

            k: {
                itemStyle: {
                    normal: {
                        color: '#68a54a',
                        color0: '#a9cba2',
                        lineStyle: {
                            width: 1,
                            color: '#408829',
                            color0: '#86b379'
                        }
                    }
                }
            },
            map: {
                itemStyle: {
                    normal: {
                        areaStyle: {
                            color: '#ddd'
                        },
                        label: {
                            textStyle: {
                                color: '#c12e34'
                            }
                        }
                    },
                    emphasis: {
                        areaStyle: {
                            color: '#99d2dd'
                        },
                        label: {
                            textStyle: {
                                color: '#c12e34'
                            }
                        }
                    }
                }
            },
            force: {
                itemStyle: {
                    normal: {
                        linkStyle: {
                            strokeColor: '#408829'
                        }
                    }
                }
            },
            chord: {
                padding: 4,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        },
                        chordStyle: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    },
                    emphasis: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        },
                        chordStyle: {
                            lineStyle: {
                                width: 1,
                                color: 'rgba(128, 128, 128, 0.5)'
                            }
                        }
                    }
                }
            },
            gauge: {
                startAngle: 225,
                endAngle: -45,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [0.2, '#86b379'],
                            [0.8, '#68a54a'],
                            [1, '#408829']
                        ],
                        width: 8
                    }
                },
                axisTick: {
                    splitNumber: 10,
                    length: 12,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: 'auto'
                    }
                },
                splitLine: {
                    length: 18,
                    lineStyle: {
                        color: 'auto'
                    }
                },
                pointer: {
                    length: '90%',
                    color: 'auto'
                },
                title: {
                    textStyle: {
                        color: '#333'
                    }
                },
                detail: {
                    textStyle: {
                        color: 'auto'
                    }
                }
            },
            textStyle: {
                fontFamily: 'Arial, Verdana, sans-serif'
            }
        };

        var echartDonut = echarts.init(document.getElementById(chart_elm_id), theme);

        echartDonut.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            legend: {
                x: 'center',
                y: 'bottom',
                data: nameOfdata
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                x: '25%',
                                width: '50%',
                                funnelAlign: 'center',
                                max: 1548
                            }
                        }
                    },
                    restore: {
                        show: true,
                        title: "Restore"
                    },
                    saveAsImage: {
                        show: true,
                        title: "Save Image"
                    }
                }
            },
            series: [{
                name: chart_name,
                type: 'pie',
                radius: ['35%', '55%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        },
                        labelLine: {
                            show: true
                        }
                    },
                    emphasis: {
                        label: {
                            show: true,
                            position: 'center',
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'normal'
                            }
                        }
                    }
                },
                data: valueDataset
            }]
        });

    }

}



function translate(name, data) {
    obj_test = {
        "gender": {
            "male": "ผู้ชาย",
            "female": "ผู้หญิง"
        },
        'beard': {
            'no': 'ไม่มีหนวด',
            'yes': 'มีหนวด'
        },
        'race': {
            'asians': 'เอเชีย',
            'white': 'ผิวขาว',
            'black': 'ผิวสี'
        },
        'hat': {
            'no': 'ไม่สวม',
            'yes': 'สวม'
        },
        'glass': {
            'no': 'ไม่สวม',
            'yes': 'สวม',
            'sunglasses': 'แว่นกันแดด'
        },
        'AgeGroup': {
            'young': 'วันรุ่น',
            'prime': 'วัยทำงาน',
            'middle': 'วัยผู้ใหญ่',
            'middleAged': 'วัยกลางคน',
            'old': 'วัยสูงอายุ'
        },
        'faceExpression': {
            'panic': 'ตื่นตระหนก',
            'angry': 'โกรธ',
            'surprised': 'ประหลาดใจ',
            'happy': 'มีความสุข',
            'disgusted': 'รังเกียจ',
            'poker-faced': 'นิ่งเฉย',
            'sad': 'เศร้า'
        }
    }
    if (name in obj_test === false) {
        result = name


    } else {
        if (data in obj_test[name] === false) {
            result = data

        } else {
            result = obj_test[name][data]

        }


    }



    return result

}