var Stranger = 0;
var Employees = 0;
var Visitor = 0;
var Blacklist = 0;
var total = 0;
var mask = 0;
var nomask = 0;

function FaceAPI(start,end) {
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
            console.log(data);
            total = data.Message.Logs.length;
            var Stranger_count = 0;
            var Employees_count = 0;
            var Visitor_count = 0;
            var Blacklist_count = 0;
            var mask_count = 0;
            var nomask_count = 0;
            for (i = 0 ; i < data.Message.Logs.length; i++) {
                if (data.Message.Logs[i].type == 'Stranger') {
                    Stranger_count+=1;
                }
                if (data.Message.Logs[i].type == 'Employee') {
                    Employees_count+=1;

                }
                if (data.Message.Logs[i].type == 'Visitor') {
                    Visitor_count+=1;

                }
                if (data.Message.Logs[i].type == 'Blacklist') {
                    Blacklist_count+=1;

                }
                if (data.Message.Logs[i].mask == 0) {
                    nomask_count+=1;

                }
                if (data.Message.Logs[i].mask == 1) {
                    mask_count+=1;

                }

            }
            Stranger = Stranger_count;
            Employees = Employees_count;
            Visitor = Visitor_count;
            Blacklist = Blacklist_count;
            mask = mask_count;
            nomask = nomask_count;
            console.log('st=',Stranger);
            console.log('em=',Employees);
            console.log('vi=',Visitor);
            console.log('bl=',Blacklist);
            document.getElementById('all_mask_data').innerHTML = total;
            document.getElementById('masked_data').innerHTML = mask;
            document.getElementById('nomask_data').innerHTML = nomask;
        }
    });
}



FaceAPI(document.getElementById("start_date").value,document.getElementById("end_date").value)
createGraph()
function createGraph() {
    var typeColor = {'Stranger':'#BDC3C7','Employees':'#759c6a','Visitor':'#3498DB','Blacklist':'#bfd3b7'}
    var theme = {
        color: [
            'gold', '#48D1CC', '#BDC3C7', '#3498DB',
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
                data: ['Stranger','Employees','Visitor','Blacklist']
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'ประเภท',
                type: 'bar',
                data: [Stranger,Employees,Visitor,Blacklist],
                itemStyle: {
                    color: function (param) {
                        return typeColor[param.value[3]];
                    }
                }
            }]
        });
    
    }


}
