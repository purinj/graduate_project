var date = new Date();
document.getElementById('start_date').valueAsDate = new Date(date.setDate(date.getDate() - 7));
document.getElementById('end_date').valueAsDate = new Date();

var Name = []
var People_in = []
var People_out = []
var In_timeSeq = []
var Out_timeSeq = []
var solve_unresponsive;


function customRange() {
    $('#li_7d').hide()
    $('#li_30d').hide()
    $('#li_1y').hide()
    $('#li_custom').hide()
    document.getElementById('li_startdate').hidden = false;
    document.getElementById('li_enddate').hidden = false;
    document.getElementById('li_ok').hidden = false;
    document.getElementById('li_backto').hidden = false;
    

}
function backTOnormal() {
    $('#li_7d').show()
    $('#li_30d').show()
    $('#li_1y').show()
    $('#li_custom').show()
    document.getElementById('li_startdate').hidden = true;
    document.getElementById('li_enddate').hidden = true;
    document.getElementById('li_ok').hidden = true;
    document.getElementById('li_backto').hidden = true;
    

}

// fetchNameAndCam($('#start_date').val(), $('#end_date').val())
// create_axxon_graoh(Name, People_in, People_out)

// console.log('yo', Name);
// console.log('yo', People_in);
// console.log('yo', People_out);

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
        beforeSend: function () {
            solve_unresponsive = setInterval(function () {
              console.log('each');
            },2000)
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
            '#48D1CC', '#FF7F50', '#BDC3C7', '#3498DB',
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
            // axisLabel : {//Relevant settings of coordinate axis calibration labels.
            //     formatter : function(params){
            //        var newParamsName = "";// The final concatenated string
            //                 var paramsNameNumber = params.length;// Number of actual labels
            //                 var provideNumber = 5;// Number of words per line
            //                 var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// If you change lines, you need to show a few lines and take them up.
            //                 /**
            //                  * Determine whether the number of tags is greater than the specified number, and if it is greater than the number of new lines, if it is not greater than, that is, equal to or less than, return to the original tag.
            //                  */
            //                 // The condition is equal to rowNumber > 1
            //                 if (paramsNameNumber > provideNumber) {
            //                     /** Loop each row, p represents the row */
            //                     for (var p = 0; p < rowNumber; p++) {
            //                         var tempStr = "";// A string representing each intercept
            //                         var start = p * provideNumber;// Starting interception position
            //                         var end = start + provideNumber;// End Interception Position
            //                         // The index value of the last row is specially handled here
            //                         if (p == rowNumber - 1) {
            //                             // No change of line for the last time
            //                             tempStr = params.substring(start, paramsNameNumber);
            //                         } else {
            //                             // Each concatenation of strings and line breaks
            //                             tempStr = params.substring(start, end) + "\n";
            //                         }
            //                         newParamsName += tempStr;// The final string
            //                     }

            //                 } else {
            //                     // Assign the value of the old tag to the new tag
            //                     newParamsName = params;
            //                 }
            //                 //Returns the final string
            //                 return newParamsName
            //     }

            // },
            title: {
                text: 'SmartPole',
                subtext: 'SmartCity'
            },
            tooltip: {
                trigger: 'axis'
            },grid: {
                containLabel: true
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
                axisLabel: {
                    interval: 0,
                    rotate: 30 //If the label names are too long you can manage this by rotating the label.
                  },
                data: catetgoly_data
            }],
            yAxis: [{
                type: 'value'
            }],
            series: [{
                name: 'เข้า',
                type: 'bar',
                label: { 
                    normal:{
                        show: true,
                        position: 'top',
                        offset: [10, 0],
                        textStyle: {
                          fontSize: 16
                        }
                      }
                },
                data: InData,
                // markPoint: {
                //     data: [{
                //         type: 'max',
                //         name: 'เหตุการณ์เข้ามากที่สุด'
                //     }, {
                //         type: 'min',
                //         name: 'เหตุการณ์เข้าน้อยที่สุด'
                //     }]
                // },
                markLine: {
                    data: [{
                        type: 'average',
                        name: 'เหตุการณ์เข้าเฉลี่ย'
                    }]
                }
            }, {
                name: 'ออก',
                type: 'bar',
                label: {
                    normal:{
                        show: true,
                        position: 'top',
                        offset: [10, 0],
                        textStyle: {
                          fontSize: 16
                        }
                      }
                },
                data: OutData,
                // markPoint: {
                //     data: [{
                //         type: 'max',
                //         name: 'เหตุการณ์ออกมากที่สุด'
                //     }, {
                //         type: 'min',
                //         name: 'เหตุการณ์ออกน้อยที่สุด'
                //     }]
                // },
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