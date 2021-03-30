var Name = []
var People_in = []
var People_out = []
var In_timeSeq = []
var Out_timeSeq = []


// Using Function FirstTime
fetchNameAndCam($('#start_date').val(), $('#end_date').val())
createStackdata('AxxonChart', Name, People_in, People_out)
add_option('Cam_Name_for_in')
add_option('Cam_Name_for_out')
// initial time seq chart
getTimeData(Name[0], $('#start_date').val(), $('#end_date').val())
create_Time_Chart("people_in_time_chart", In_timeSeq, 'people_in', '#48D1CC')
create_Time_Chart("people_out_time_chart", Out_timeSeq, 'people_out', '#FF7F50')
createTable()



// Show
// document.getElementById('loading').hidden = true;
// document.getElementById('Complete').hidden = false;


// listener Event For Date Range
document.getElementById('find_range').onclick = async function () {
  await loaderDiaplay()
  await sleep(500);
  await graphDisplay()
  await loaderNotDiaplay()

  function loaderDiaplay(){
    document.getElementById('LoadingModal').style.display = 'block'
  }
  function loaderNotDiaplay(){
    document.getElementById('LoadingModal').style.display = 'none'
  }

  function graphDisplay() {
    $('#AxxonChart').remove(); // this is my <canvas> element
    $('#Axxon_chart_container').append('<div id="AxxonChart" style="height:620px;" ></div>');
    fetchNameAndCam($('#start_date').val(), $('#end_date').val())
    console.log($('#Axxon_chart_container').html());
    createStackdata('AxxonChart', Name, People_in, People_out)
    document.getElementById('Cam_Name_for_in').selectedIndex = 0;
    $('#Cam_Name_for_in').change();
    document.getElementById('Cam_Name_for_out').selectedIndex = 0;
    $('#Cam_Name_for_out').change();
    createTable()
  }
 

}
document.getElementById('Cam_Name_for_in').onchange = function () {
  $('#people_in_time_chart').remove();
  $('#people_in_time_chart_container').append('<canvas id="people_in_time_chart"></canvas>');
  data_index = document.getElementById('Cam_Name_for_in').selectedIndex;
  getTimeData(Name[data_index], $('#start_date').val(), $('#end_date').val())
  create_Time_Chart("people_in_time_chart", In_timeSeq, 'people_in', '#48D1CC')
}

document.getElementById('Cam_Name_for_out').onchange = function () {
  $('#people_out_time_chart').remove();
  $('#people_out_time_chart_container').append('<canvas id="people_out_time_chart"></canvas>');
  data_index = document.getElementById('Cam_Name_for_out').selectedIndex;
  getTimeData(Name[data_index], $('#start_date').val(), $('#end_date').val())
  create_Time_Chart("people_out_time_chart", Out_timeSeq, 'people_in', '#FF7F50')
}


// Function 
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
    // beforeSend: function () {
    //   // setting a timeout
    //   alert("กรุณารอสักครู่")
    // },
    success: function (data) {
      json_pplIn = JSON.parse(data.peopleIn)
      json_pplOut = JSON.parse(data.peopleOut)
      console.log(json_pplIn);
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
      console.log(Name);
    }
  });
}

function createStackdata(element_id, label, normalTemp, highTemp) {
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
  if ($('#' + element_id).length) {

    var echartBar = echarts.init(document.getElementById(element_id), theme);

    echartBar.setOption({
      grid: {
        containLabel: true,
        left: 10
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['จำนวนเข้า', 'จำนวนออก']
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
        name: 'จำนวนเข้า',
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
        data: normalTemp,
        markLine: {
          data: [{
              type: 'average',
              name: 'เหตุการณ์เข้าเฉลี่ย'
          }]
      }
      }, {
        name: 'จำนวนออก',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'right',
            offset: [10, 0],
            textStyle: {
              fontSize: 16
            }
          },
        },
        data: highTemp,
        markLine: {
          data: [{
              type: 'average',
              name: 'เหตุการณ์ออกเฉลี่ย'
          }]
      }
      }]
    });

  }


  // if ($('#' + element_id).length) {
  //   var canvas = $('#' + element_id);
  //   var canvas = document.getElementById(element_id);
  //   console.log(label);
  //   console.log(normalTemp);
  //   console.log(highTemp);
  //   var AxxonChart = new Chart(canvas, {

  //     type: 'horizontalBar',
  //     data: {
  //       labels: label,
  //       datasets: [{
  //           label: 'จำนวนเข้า',
  //           backgroundColor: "#48D1CC",
  //           data: normalTemp
  //       }, {
  //           label: 'จำนวนออก',
  //           backgroundColor: "#FF7F50",
  //           data: highTemp
  //       }]
  //   },

  //     options: {
  //       legend: {
  //         display: false
  //       },"animation": {
  //         "duration": 1,
  //       "onComplete": function() {
  //         var chartInstance = this.chart,
  //           ctx = chartInstance.ctx;

  //         ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
  //         ctx.textAlign = 'center';
  //         ctx.textBaseline = 'center';

  //         this.data.datasets.forEach(function(dataset, i) {
  //           var meta = chartInstance.controller.getDatasetMeta(i);
  //           meta.data.forEach(function(bar, index) {
  //             var data = dataset.data[index];
  //             ctx.fillText(data, bar._model.x + 10, bar._model.y - 5);
  //           });
  //         });
  //       }
  //     }
  //       ,
  //         scales: {
  //             yAxes: [{
  //                 ticks: {
  //                     beginAtZero: true
  //                 }
  //             }]
  //         }
  //     }
  // });  
  //    canvas.onclick = function(evt) {
  //       var activePoint = AxxonChart.getElementAtEvent(evt)[0];
  //       console.log(activePoint);
  //       var data = activePoint._chart.data;
  //       var datasetIndex = activePoint._datasetIndex;
  //       var label = data.datasets[datasetIndex].label;
  //       var value = data.datasets[datasetIndex].data[activePoint._index];
  //       console.log(data.labels[activePoint._index],label, value);
  //       getTimeData(data.labels[activePoint._index],$('#start_date').val(),$('#end_date').val())
  //       console.log(In_timeSeq);
  //       // $('#time_Chart').remove(); // this is my <canvas> element
  //       // $('#time_Chart_container').append('<canvas class="w3-white" id="time_Chart" hidden></canvas>');
  //       // if (label == 'เข้า') {
  //       //   create_Time_Chart(In_timeSeq,'people_in','MediumTurquoise')
  //       // } else {
  //       //   create_Time_Chart(Out_timeSeq,'people_Out','LightCoral')
  //       // }

  //   }
  // } 
}


function add_option(option_id) {
  for (i = 0; i < Name.length; i++) {
    $('#' + option_id).append("<option value=" + Name[i] + ">" + Name[i] + "</option>")
  }
}

function getTimeData(cctv_name, Start, End) {
  result_In = []
  result_Out = []
  $.ajax({
    type: 'POST',
    async: false,
    url: host_url + "api/axxonTimeScale",
    data: {
      cctvName: cctv_name,
      startDate: Start,
      endDate: End
    },
    success: function (data) {
      peopleIn_time = JSON.parse(data.ppl_in_time)
      peopleOut_time = JSON.parse(data.ppl_out_time)
      for (i = 0; i < peopleIn_time.length; i++) {
        result_In.push({
          x: peopleIn_time[i].hh + ":" + peopleIn_time[i].mm,
          y: String(peopleIn_time[i].count)
        })
      }
      for (i = 0; i < peopleOut_time.length; i++) {
        result_Out.push({
          x: peopleOut_time[i].hh + ":" + peopleOut_time[i].mm,
          y: String(peopleOut_time[i].count)
        })
      }
      In_timeSeq = result_In
      Out_timeSeq = result_Out

    }
  });
}

function create_Time_Chart(idOfChart, result, nameLabel, lineColor) {
  // parse labels and data
  var labels = result.map(e => moment(e.x, 'HH:mm'));
  var data = result.map(e => +e.y);
  console.log(labels);
  console.log(data);
  if ($('#' + idOfChart).length) {
    var ctx = document.getElementById(idOfChart);
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: nameLabel,
          data: data,
          borderWidth: 1,
          backgroundColor: lineColor

        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm'
              }
            }
          }]
        },
      }
    });
  }
}


function sevenDays() {
  console.log('test');
  var date = new Date();

  document.getElementById('start_date').valueAsDate = new Date(date.setDate(date.getDate() - 7));
  document.getElementById('end_date').valueAsDate = new Date();
  document.getElementById('find_range').click()
}

function thirtyDays() {
  console.log('test');
  var date = new Date();

  document.getElementById('start_date').valueAsDate = new Date(date.setDate(date.getDate() - 30));
  document.getElementById('end_date').valueAsDate = new Date();
  document.getElementById('find_range').click()
}

function yearsPass() {
  console.log('test');
  var date = new Date();

  document.getElementById('start_date').valueAsDate = new Date(date.setDate(date.getDate() - 365));
  document.getElementById('end_date').valueAsDate = new Date();
  document.getElementById('find_range').click()
}


function createTable() {
  //   var Name = []
  // var People_in = []
  // var People_out = []
  clumnstr = "<tr><th>ชื่อกล้อง</th><th>จำนวนเหตุการณ์เข้า</th><th>จำนวนเหตุการณ์ออก</th><th>รวม</th></tr>"
  for (i = 0; i < Name.length; i++) {
    polename = `<td>${Name[i]}</td>`
    In = `<td>${People_in[i]}</td>`
    Out = `<td>${People_out[i]}</td>`
    totalEvent = `<td>${ parseFloat(People_in[i])+parseFloat(People_out[i]) }</td>`
    row = '<tr>' + polename + In + Out + totalEvent + '</tr>'
    clumnstr += row
  }

  document.getElementById("to_csv_table").innerHTML = clumnstr

}

function exportCsv() {
  let data = ''
  const tableData = []
  const rows = document.querySelectorAll('table#' + 'to_csv_table' + ' tr')
  for (const row of rows) {
    const rowData = []
    for (const [index, column] of row.querySelectorAll('td,th').entries()) {
      if ((index + 1) % 3 === 0) {
        rowData.push('"' + column.innerText + '"')
      } else {
        rowData.push(column.innerText)
      }
    }
    tableData.push(rowData.join(','))
  }
  data += tableData.join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob(['\uFEFF' + data], { type: 'text/csv;charset=utf-8' }))
  a.setAttribute('download', 'smartPole.csv')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}