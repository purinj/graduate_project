var Stranger = 0;
var Employees = 0;
var Visitor = 0;
var Blacklist = 0;
var total = 0;
var mask = 0;
var nomask = 0;
var each_ip_obj = [];
var recieve_data;
place = {
    "สำนักหอสมุด": ['10.209.32.32', '10.209.32.29', '10.209.122.242',
        '10.209.122.241', '10.209.112.49', '10.209.112.45', '10.209.112.44', '10.209.112.22'
    ],
    "คณะเทคนิคการแพทย์": ['10.148.4.26', '10.148.4.241'],
    "คณะเกษตร": ['10.210.2.5', '10.210.2.241'],
    'คณะสัตว์แพทย์': ['10.115.40.227', '10.115.40.241'],
    'คณะทันตะแพทย์': ['10.146.20.24', '10.146.21.231'],
    'คณะวิศวกรรมศาสตร์': ['10.161.220.59', '10.161.220.241'],
    'คณะสถาปัตยกรรมศาสตร์': ['10.132.1.241', '10.132.0.240'],
    'คณะเภสัชศาสตร์': ['10.166.0.198'],
    'คณะศึกษาศาสตร์': ['10.131.61.9', '10.131.61.8'],
    'คณะพยาบาลศาสตร์': ['10.163.32.242', '10.163.32.243']
}
click_status = 0;
valueData = {
    "สำนักหอสมุด": 0,
    "คณะเทคนิคการแพทย์": 0,
    "คณะเกษตร": 0,
    'คณะสัตว์แพทย์': 0,
    'คณะทันตะแพทย์': 0,
    'คณะวิศวกรรมศาสตร์': 0,
    'คณะสถาปัตยกรรมศาสตร์': 0,
    'คณะเภสัชศาสตร์': 0,
    'คณะศึกษาศาสตร์': 0,
    'คณะพยาบาลศาสตร์': 0
};

function FaceAPI(start, end) {
    console.log(start);
    console.log(end);
    $.ajax({
        type: 'POST',
        async: false,
        url: 'http://10.101.118.165:9001/aiface/kku/api/inquiry',
        data: JSON.stringify({
            "Token": "cca5cce08e519430b4d0a2600ffe051db3d72a048f4f3abeece85fa68c6e0503",
            "Func": "Inquiry",
            "Data": {
                "start": start,
                "end": end
            }

        }),
        success: function (data) {
            recieve_data = data.Message.Logs;
            total = data.Message.Logs.length;
            var Stranger_count = 0;
            var Employees_count = 0;
            var Visitor_count = 0;
            var Blacklist_count = 0;
            var mask_count = 0;
            var nomask_count = 0;
            for (i = 0; i < data.Message.Logs.length; i++) {
                if (each_ip_obj.includes(data.Message.Logs[i].ipaddress) == false) {
                    each_ip_obj.push(data.Message.Logs[i].ipaddress)
                }
                if (data.Message.Logs[i].type == 'Stranger') {
                    Stranger_count += 1;
                }
                if (data.Message.Logs[i].type == 'Employee') {
                    Employees_count += 1;

                }
                if (data.Message.Logs[i].type == 'Visitor') {
                    Visitor_count += 1;

                }
                if (data.Message.Logs[i].type == 'Blacklist') {
                    Blacklist_count += 1;

                }
                if (data.Message.Logs[i].mask == 0) {
                    nomask_count += 1;

                }
                if (data.Message.Logs[i].mask == 1) {
                    mask_count += 1;

                }

            }
            Stranger = Stranger_count;
            Employees = Employees_count;
            Visitor = Visitor_count;
            Blacklist = Blacklist_count;
            mask = mask_count;
            nomask = nomask_count;
            console.log('st=', each_ip_obj);
            console.log(each_ip_obj[1]);
            console.log(recieve_data.filter(val => {
                return val.ipaddress == each_ip_obj[1]
            }));
            option_place = '<option value="all_place">ทั้งหมด</option>';
            for (i = 0; i < Object.keys(place).length; i++) {
                Keyname = Object.keys(place)[i];
                x = recieve_data.filter(val => {
                    return place[Keyname].includes(val.ipaddress);
                })
                valueData[Keyname] = x.length
                option_place += `<option value=${Keyname}>${Keyname}</option>`
                
                

            }
            // console.log('em=',Employees);
            // console.log('vi=',Visitor);
            // console.log('bl=',Blacklist);
            // document.getElementById('all_mask_data').innerHTML = total;
            document.getElementById('masked_data').innerHTML = mask;
            document.getElementById('nomask_data').innerHTML = nomask;
            document.getElementById('place_selector').innerHTML = option_place
        }
    });
}

document.getElementById('faceScan_query').onclick = function () {
    console.log(document.getElementById('place_selector').value);
    console.log(document.getElementById('mask_seletor').value);
    if (document.getElementById('place_selector').value != 'all_place') {
        if (document.getElementById('mask_seletor').value != 'all_mask') {
            subData = recieve_data.filter(val => {
                return place[document.getElementById('place_selector').value].includes(val.ipaddress) && val.mask == parseInt(document.getElementById('mask_seletor').value);
            })
            if (parseInt(document.getElementById('mask_seletor').value) == 0) {
                document.getElementById('masked_data').innerHTML = 0;
                document.getElementById('nomask_data').innerHTML = subData.length;
                
            } else {
                document.getElementById('masked_data').innerHTML = subData.length;
                document.getElementById('nomask_data').innerHTML = 0;
    
            }
    
        } else {
            click_status = 0
            document.getElementById('masked_data_container').style = ''
            document.getElementById('nomask_data_container').style = ''
            subData = recieve_data.filter(val => {
                return place[document.getElementById('place_selector').value].includes(val.ipaddress);
            })
            console.log('all len = ',subData.length);
    
        }
        subData_mask = subData.filter(val => {
            return val.mask == 1;
        })
        subData_nomask = subData.filter(val => {
            return val.mask == 0;
        })
        subData_Stranger = subData.filter(val => {
            return val.type == "Stranger";
        })
        subData_Employee = subData.filter(val => {
            return val.type == "Employee";
        })
        subData_Visitor = subData.filter(val => {
            return val.type == "Visitor";
        })
        subData_Blacklist = subData.filter(val => {
            return val.type == "Blacklist";
        })
        $('#pplType_ai').remove()
        $('#pplType_ai_container').html('<div id="pplType_ai" style="height: 400px;"></div>')
        createFace_echart('ประเภทบุคคล', 'pplType_ai', ['นักศึกษา', 'บุคลากร', 'ผู้เยี่ยมชม', 'บัญชีดำ'], [{
          value: subData_Stranger.length,
          name: "นักศึกษา"
        }, {
          value: subData_Employee.length,
          name: "บุคลากร"
        }, {
          value: subData_Visitor.length,
          name: "ผู้เยี่ยมชม"
        }, {
          value: subData_Blacklist.length,
          name: "บัญชีดำ"
        }], ['#D2691E', '#FF8C00', '#DAA520', '#6B8E23', '#00FF7F'], false)
        document.getElementById('masked_data').innerHTML =  subData_mask.length;
        document.getElementById('nomask_data').innerHTML =  subData_nomask.length;
    

    }
    else {
        NewvalueData = {
            "สำนักหอสมุด": 0,
            "คณะเทคนิคการแพทย์": 0,
            "คณะเกษตร": 0,
            'คณะสัตว์แพทย์': 0,
            'คณะทันตะแพทย์': 0,
            'คณะวิศวกรรมศาสตร์': 0,
            'คณะสถาปัตยกรรมศาสตร์': 0,
            'คณะเภสัชศาสตร์': 0,
            'คณะศึกษาศาสตร์': 0,
            'คณะพยาบาลศาสตร์': 0
        };
        if (document.getElementById('mask_seletor').value != 'all_mask') {
            subData = recieve_data.filter(val => {
                return val.mask == parseInt(document.getElementById('mask_seletor').value);
            })
            if (parseInt(document.getElementById('mask_seletor').value) == 0) {
                document.getElementById('masked_data').innerHTML = 0;
                document.getElementById('nomask_data').innerHTML = subData.length;
                
            } else {
                document.getElementById('masked_data').innerHTML = subData.length;
                document.getElementById('nomask_data').innerHTML = 0;
    
            }
           
    
        } else {
            click_status = 0
            document.getElementById('masked_data_container').style = ''
            document.getElementById('nomask_data_container').style = ''
            subData = recieve_data
            document.getElementById('masked_data').innerHTML =  mask;
            document.getElementById('nomask_data').innerHTML =  nomask;
            NewvalueData = valueData
    
        }
        console.log(subData);
        console.log(NewvalueData);
        subData_Stranger = subData.filter(val => {
            return val.type == "Stranger";
        })
        subData_Employee = subData.filter(val => {
            return val.type == "Employee";
        })
        subData_Visitor = subData.filter(val => {
            return val.type == "Visitor";
        })
        subData_Blacklist = subData.filter(val => {
            return val.type == "Blacklist";
        })
        $('#pplType_ai').remove()
        $('#pplType_ai_container').html('<div id="pplType_ai" style="height: 400px;"></div>')
        createFace_echart('ประเภทบุคคล', 'pplType_ai', ['นักศึกษา', 'บุคลากร', 'ผู้เยี่ยมชม', 'บัญชีดำ'], [{
          value: subData_Stranger.length,
          name: "นักศึกษา"
        }, {
          value: subData_Employee.length,
          name: "บุคลากร"
        }, {
          value: subData_Visitor.length,
          name: "ผู้เยี่ยมชม"
        }, {
          value: subData_Blacklist.length,
          name: "บัญชีดำ"
        }], ['#D2691E', '#FF8C00', '#DAA520', '#6B8E23', '#00FF7F'], false)

        for (i = 0; i < Object.keys(place).length; i++) {
            Keyname = Object.keys(place)[i];
            x = subData.filter(val => {
                return place[Keyname].includes(val.ipaddress);
            })
            NewvalueData[Keyname] = x.length
        }
        function newlistOfData() {
            valueList = []
            for (i = 0; i < Object.keys(NewvalueData).length; i++) {
                valueList.push(NewvalueData[Object.keys(NewvalueData)[i]])
            }
            return valueList
        }
        
        $('#face_data').remove()
        $('#faceGraph').html('<div id="face_data" style="height:800px;"></div>')
        createFaceStackdata('face_data', Object.keys(place), newlistOfData())


    }

    
}



FaceAPI(document.getElementById("start_date").value, document.getElementById("end_date").value)
createFace_echart('ประเภทบุคคล', 'pplType_ai', ['นักศึกษา', 'บุคลากร', 'ผู้เยี่ยมชม', 'บัญชีดำ'], [{
    value: Stranger,
    name: "นักศึกษา"
}, {
    value: Employees,
    name: "บุคลากร"
}, {
    value: Visitor,
    name: "ผู้เยี่ยมชม"
}, {
    value: Blacklist,
    name: "บัญชีดำ"
}], ['#D2691E', '#FF8C00', '#DAA520', '#6B8E23', '#00FF7F'], false)

function listOfData() {
    valueList = []
    for (i = 0; i < Object.keys(valueData).length; i++) {
        valueList.push(valueData[Object.keys(valueData)[i]])
    }
    return valueList
}


createFaceStackdata('face_data', Object.keys(place), listOfData())
// createGraph(Object.keys(place),[1,2,3,4,5,6,7,8,9,10])
function createGraph(categoly, data) {
    var theme = {
        color: [
            'gold', '#48D1CC', '#BDC3C7', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: 'gold'
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
    if ($('#face_data').length) {

        var echartBar = echarts.init(document.getElementById('face_data'), theme);

        echartBar.setOption({
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['ประเภท']
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                data: categoly
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'ประเภท',
                type: 'bar',
                data: data,
            }]
        });

    }


}

document.getElementById('masked_data_container').onclick = function() {
    if (click_status == 0) {
        click_status = 1
        document.getElementById('masked_data_container').style = 'border-left: 5px solid #077BFF'
        document.getElementById('nomask_data_container').style = ''
        document.getElementById('mask_seletor').value = 1

    } else if (click_status == 1 && document.getElementById('mask_seletor').value == 0) {
        click_status = 1
        document.getElementById('masked_data_container').style = 'border-left: 5px solid #077BFF'
        document.getElementById('nomask_data_container').style = ''
        document.getElementById('mask_seletor').value = 1
    }
    else if (click_status == 1 && document.getElementById('mask_seletor').value == 1) {
        click_status = 0
        document.getElementById('masked_data_container').style = ''
        document.getElementById('mask_seletor').value = 'all_mask'

    }

    document.getElementById('faceScan_query').click()
    
    
}

document.getElementById('nomask_data_container').onclick = function() {
    if (click_status == 0) {
        click_status = 1
        document.getElementById('masked_data_container').style = ''
        document.getElementById('nomask_data_container').style = 'border-left: 5px solid #077BFF'
        document.getElementById('mask_seletor').value = 0

    } else if (click_status == 1 && document.getElementById('mask_seletor').value == 1) {
        click_status = 1
        document.getElementById('masked_data_container').style = ''
        document.getElementById('nomask_data_container').style = 'border-left: 5px solid #077BFF'
        document.getElementById('mask_seletor').value = 0
    }else if (click_status == 1 && document.getElementById('mask_seletor').value == 0)  {
        click_status = 0
        document.getElementById('nomask_data_container').style = ''
        document.getElementById('mask_seletor').value = 'all_mask'

    }
    document.getElementById('faceScan_query').click()
    
}





function createFace_echart(chart_name, chart_elm_id, nameOfdata, valueDataset, color) {
    if ($('#' + chart_elm_id).length) {
        var theme = {
            color: [
                '#3498DB', '#1ABB9C', '#BDC3C7', 'black',
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



function createFaceStackdata(element_id, label, normalTemp) {
    var theme = {
        color: [
            'orange', 'red', '#BDC3C7', '#3498DB',
            '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: 'orange'
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
        echartBar.on('click', function(params) {
            console.log(params.name)
            document.getElementById('place_selector').value = params.name
            document.getElementById('faceScan_query').click()
        });
        

        echartBar.setOption({
            title: {
                text: 'FaceScan',
                subtext: ''
            },
            grid: {
                containLabel: true
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                x: 100,
                data: ['จำนวน']
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
                name: 'จำนวน',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        offset: [10, 0],
                        textStyle: {
                            fontSize: 16
                        }
                    }
                },
                data: normalTemp
            }]
        });

    }
}