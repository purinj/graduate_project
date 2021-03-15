document.getElementById('start_date').value = "2020-07-10";
document.getElementById('end_date').value = "2020-07-11";
var Name = []
var People_in = []
var People_out = []
var In_timeSeq = []
var Out_timeSeq = []


function customRange() {
    $('#li_7d').hide()
    $('#li_30d').hide()
    $('#li_1y').hide()
    $('#li_custom').hide()
    document.getElementById('li_startdate').hidden = false;
    document.getElementById('li_enddate').hidden = false;

}

fetchNameAndCam($('#start_date').val(), $('#end_date').val())
create_axxon_graoh(Name, People_in, People_out)

console.log('yo', Name);
console.log('yo', People_in);
console.log('yo', People_out);

function fetchNameAndCam(start, end) {
    CameraName_in = []
    ppl_in = []
    ppl_out = []

    $.ajax({
        type: 'POST',
        async: false,
        url: host_url + "api/AxxonDataWithTime",
        data: {
            startDate: start,
            endDate: end
        },
        success: function (data) {
            json_pplIn = JSON.parse(data.peopleIn)
            json_pplOut = JSON.parse(data.peopleOut)
            for (i = 0; i < json_pplIn.length; i++) {
                CameraName_in.push(json_pplIn[i].display_name)
                ppl_in.push(json_pplIn[i].sum)
            }
            for (i = 0; i < json_pplOut.length; i++) {
                ppl_out.push(json_pplOut[i].sum)
            }
            Name = CameraName_in
            People_in = ppl_in
            People_out = ppl_out
        }
    });
}

function findMinMaxAvg(arr) {
    var min = arr[0]; // min
    var max = arr[0]; // max
    var sum = arr[0]; // sum

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
        if (arr[i] > max) {
            max = arr[i];
        }
        sum = sum + arr[i];
    }
    return [min, max, sum / arr.length]
}

function create_axxon_graoh(catetgoly_data, InData, OutData) {



    console.log('func', catetgoly_data);
    console.log('func', InData);
    console.log('func', OutData);
    console.log(findMinMaxAvg(InData));
    console.log(findMinMaxAvg(OutData));

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

    if ($('#axxon_data').length) {

        var echartBar = echarts.init(document.getElementById('axxon_data'), theme);

        echartBar.setOption({
            title: {
                text: 'SmartPole Axxon',
                subtext: 'SmartCity'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['เข้า', 'ออก']
            },
            toolbox: {
                show: false
            },
            calculable: false,
            xAxis: [{
                type: 'category',
                data: catetgoly_data
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'เข้า',
                type: 'bar',
                data: InData,
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'เหตุการณ์เข้ามากที่สุด'
                    }, {
                        type: 'min',
                        name: 'เหตุการณ์เข้าน้อยที่สุด'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'เหตุการณ์เข้าเฉลี่ย'
                    }]
                }
            }, {
                name: 'ออก',
                type: 'bar',
                data: OutData,
                markPoint: {
                    data: [{
                        type: 'max',
                        name: 'เหตุการณ์ออกมากที่สุด'
                    }, {
                        type: 'min',
                        name: 'เหตุการณ์ออกน้อยที่สุด'
                    }]
                },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'เหตุการณ์ออกเฉลี่ย'
                    }]
                }
            }]
        });

    }



}