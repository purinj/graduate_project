 // data for dynamic
 var label_camNote = []
 var IPaddress = []
 var highTemp = []
 var normalTemp = []



 
  getCamData()
  highLowTemp(IPaddress)
  createStackdata('AxxonChart',label_camNote,normalTemp,highTemp)
  add_to_strem_button('stream_button',IPaddress,label_camNote)
  getDetectData(IPaddress[0])
  add_option('Cam_Name_select')

  document.getElementById('view_event_chart').onclick = function() {
    data_index = document.getElementById('Cam_Name_select').selectedIndex;
    console.log(data_index);
    console.log(IPaddress[data_index]);
    $('#genderChart').remove();
    $('#AgeGroupChart').remove();
    $('#glassChart').remove();
    $('#raceChart').remove();
    $('#hatChart').remove();
    $('#beardChart').remove();
    $('#expressionChart').remove();

    $('#genderChart_container').append('<div id="genderChart" style="width: 100%; min-height: 350px"></div>');
    $('#AgeGroupChart_container').append('<div id="AgeGroupChart" style="width: 100%; min-height: 350px"></div>');
    $('#glassChart_container').append('<div id="glassChart" style="width: 100%; min-height: 350px"></div>');
    $('#raceChart_container').append('<div id="raceChart" style="width: 100%; min-height: 350px"></div>');
    $('#hatChart_container').append('<div id="hatChart" style="width: 100%; min-height: 350px"></div>');
    $('#beardChart_container').append('<div id="beardChart" style="width: 100%; min-height: 350px"></div>');
    $('#expressionChart_container').append('<div id="expressionChart" style="width: 100%; min-height: 350px"></div>');
    getDetectData(IPaddress[data_index])

  }

// function
  function getCamData() {
    ipAddress = []
    note = []
      $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/hikcameraNote",
        data: "",
        success: function(data) {
          executeData = JSON.parse(data)
        for(i=0; i < executeData.length ; i++) {
          ipAddress.push(executeData[i].ipAddress)
          note.push(executeData[i].note)
         }
         IPaddress = ipAddress
         label_camNote = note
      }
      });
  } 
 
  function highLowTemp(ipdata) {
    for(i=0; i < ipdata.length ; i++) {
          $.ajax({
                type: 'GET',
                async: false,
                url: host_url + "api/isAbnomalTemp/" + ipdata[i],
                data: "",
              success: function(data) {
                  data = JSON.parse(data)
                  highTemp.push(data.highTemp) 
                  normalTemp.push(data.normalTemp)
                  
              }
              });
 
        }
  }


 function createStackdata(element_id,label,normalTemp,highTemp) {
    if ($('#' + element_id).length) {
      var canvas = $('#' + element_id);
      var canvas = document.getElementById(element_id);
      console.log(label);
      console.log(normalTemp);
      console.log(highTemp);
      var AxxonChart = new Chart(canvas, {
        
        type: 'horizontalBar',
        data: {
          labels: label,
          datasets: [{
              label: 'ปกติ',
              backgroundColor: "#48D1CC",
              data: normalTemp
          }, {
              label: 'มากกว่า 37.5',
              backgroundColor: "#FF7F50",
              data: highTemp
          }]
      },
  
        options: {
          legend: {
            display: false
          },"animation": {
            "duration": 1,
          "onComplete": function() {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
  
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'center';
  
            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x + 10, bar._model.y - 5);
              });
            });
          }
        }
          ,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });  
       canvas.onclick = function(evt) {
          var activePoint = AxxonChart.getElementAtEvent(evt)[0];
          console.log(activePoint);
          var data = activePoint._chart.data;
          var datasetIndex = activePoint._datasetIndex;
          var label = data.datasets[datasetIndex].label;
          var value = data.datasets[datasetIndex].data[activePoint._index];
          console.log(data.labels[activePoint._index],label, value);
          getTimeData(data.labels[activePoint._index],$('#start_date').val(),$('#end_date').val())
          console.log(In_timeSeq);
          // $('#time_Chart').remove(); // this is my <canvas> element
          // $('#time_Chart_container').append('<canvas class="w3-white" id="time_Chart" hidden></canvas>');
          // if (label == 'เข้า') {
          //   create_Time_Chart(In_timeSeq,'people_in','MediumTurquoise')
          // } else {
          //   create_Time_Chart(Out_timeSeq,'people_Out','LightCoral')
          // }
              
      }
    } 
    }

    function add_to_strem_button(elm_id,ipForlink,labelToDisplay) {
        var btncontainner = document.getElementById(elm_id);
        
        for (i = 0; i < ipForlink.length; i++) {
           let ip_parse_to_func = ipForlink[i]
           window['btn' + i] = document.createElement('button');
           window['btn' + i].className  = 'form-control';
           window['btn' + i].onclick = function () {
            stream_page(ip_parse_to_func)
        };
           window['btn' + i].innerHTML = labelToDisplay[i]
           btncontainner.appendChild(window['btn' + i]);

        }
    }

    function stream_page(ip) {
        const ip_to_link = ip.replaceAll(".", "_");
        window.open(host_url + 'video_feed/hikvision/' + ip_to_link , "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=500,height=500");
    }



    function getDetectData(ip) {
      $.ajax({
                  type: 'GET',
                  async: false,
                  url: host_url + "api/hikVisionData/" + ip,
                  data: "",
                success: function(data) {
                    data = JSON.parse(data)
                    console.log(data);
                    table  =''
                    for(var i=0; i<Object.keys(data).length; i++){
                      table += '<tr>' + '<td>' + Object.keys(data)[i] +'</td>'
                       //  console.log(Object.keys(data)[i],data[Object.keys(data)[i]]); 
                        var innerObject = Object.keys(data[Object.keys(data)[i]])
                       if (Object.keys(data)[i] == 'gender') {
                         var nameforsubdata = [];
                         var valueforsubdata= [];
                         var colorOfdata = ['#44a3fa','#f721c9']

                         for(var j=0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                          nameforsubdata.push(innerObject[j]);
                          console.log(data[Object.keys(data)[i]][innerObject[j]]);
                          valueforsubdata.push({value:parseInt(data[Object.keys(data)[i]][innerObject[j]]),name:innerObject[j]})
                             
                         }
                         console.log(nameforsubdata);
                         console.log(valueforsubdata);
                         

                        create_echart(Object.keys(data)[i],'genderChart',nameforsubdata,valueforsubdata,colorOfdata,false)

            
                         
                       } 
                       if (Object.keys(data)[i] == 'glass') {
                        var nameforsubdata = [];
                        var valueforsubdata= [];
                        var colorOfdata = ['#008080','#FFFF00','#3CB371']

                        for(var j=0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                         nameforsubdata.push(innerObject[j]);
                         console.log(data[Object.keys(data)[i]][innerObject[j]]);
                         valueforsubdata.push({value:parseInt(data[Object.keys(data)[i]][innerObject[j]]),name:innerObject[j]})
                            
                        }
                        console.log(nameforsubdata);
                        console.log(valueforsubdata);
                        

                       //create_donut_chart('glassChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                       create_echart(Object.keys(data)[i],'glassChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                         
                       } 
                       if (Object.keys(data)[i] == 'beard') {
                        var nameforsubdata = [];
                        var valueforsubdata= [];
                        var colorOfdata = ['#FFB6C1','#90EE90']

                        for(var j=0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                         nameforsubdata.push(innerObject[j]);
                         console.log(data[Object.keys(data)[i]][innerObject[j]]);
                         valueforsubdata.push({value:parseInt(data[Object.keys(data)[i]][innerObject[j]]),name:innerObject[j]})
                            
                        }
                        console.log(nameforsubdata);
                        console.log(valueforsubdata);
                        

                      // create_donut_chart('beardChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                       create_echart(Object.keys(data)[i],'beardChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                         
                       } 
                       if (Object.keys(data)[i] == 'hat') {
                        var nameforsubdata = [];
                        var valueforsubdata= [];
                        var colorOfdata = ['#FFB6C1','#90EE90']

                        for(var j=0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                         nameforsubdata.push(innerObject[j]);
                         console.log(data[Object.keys(data)[i]][innerObject[j]]);
                         valueforsubdata.push({value:parseInt(data[Object.keys(data)[i]][innerObject[j]]),name:innerObject[j]})
                            
                        }
                        console.log(nameforsubdata);
                        console.log(valueforsubdata);
                        

                       //create_donut_chart('hatChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                       create_echart(Object.keys(data)[i],'hatChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                        
                         
                       }
                       if (Object.keys(data)[i] == 'race') {
                        var nameforsubdata = [];
                        var valueforsubdata= [];
                        var colorOfdata = ['#FFE4C4','#000000','#F0FFFF']

                        for(var j=0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                         nameforsubdata.push(innerObject[j]);
                         console.log(data[Object.keys(data)[i]][innerObject[j]]);
                         valueforsubdata.push({value:parseInt(data[Object.keys(data)[i]][innerObject[j]]),name:innerObject[j]})
                            
                        }
                        console.log(nameforsubdata);
                        console.log(valueforsubdata);
                        

                       //create_donut_chart('raceChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                       create_echart(Object.keys(data)[i],'raceChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                         
                       } 
                       if (Object.keys(data)[i] == 'AgeGroup') {
                        var nameforsubdata = [];
                        var valueforsubdata= [];
                        var colorOfdata = ['#D2691E','#FF8C00','#DAA520','#6B8E23','#00FF7F']

                        for(var j=0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                         nameforsubdata.push(innerObject[j]);
                         console.log(data[Object.keys(data)[i]][innerObject[j]]);
                         valueforsubdata.push({value:parseInt(data[Object.keys(data)[i]][innerObject[j]]),name:innerObject[j]})
                            
                        }
                        console.log(nameforsubdata);
                        console.log(valueforsubdata);
                        

                       //create_donut_chart('AgeGroupChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                       create_echart(Object.keys(data)[i],'AgeGroupChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                         
                       }
                       
                       if (Object.keys(data)[i] == 'faceExpression') {
                        var nameforsubdata = [];
                        var valueforsubdata= [];
                        var colorOfdata = ['#32CD32','#FFA07A','#FFF0F5','#FFFF00','#6A5ACD','#4169E1','#87CEFA']

                        for(var j=0; j < Object.keys(data[Object.keys(data)[i]]).length; j++) {
                         nameforsubdata.push(innerObject[j]);
                         console.log(data[Object.keys(data)[i]][innerObject[j]]);
                         valueforsubdata.push({value:parseInt(data[Object.keys(data)[i]][innerObject[j]]),name:innerObject[j]})
                            
                        }
                        console.log(nameforsubdata);
                        console.log(valueforsubdata);
                        

                        //create_donut_chart('expressionChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                        create_echart(Object.keys(data)[i],'expressionChart',nameforsubdata,valueforsubdata,colorOfdata,false)
                         
                       }
                       
                        for (j=0;j<innerObject.length;j++){
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


    function create_echart(chart_name,chart_elm_id,nameOfdata,valueDataset,color) {
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
                  normal: { color: '#408829' },
                  emphasis: { color: '#408829' }
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
                      color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
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

    function create_donut_chart(chart_elm_id,nameOfdata,valueDataset,color,islegendDisplay) {
      if ($('#' + chart_elm_id).length) {

        var ctx = $('#' + chart_elm_id);
        var ctx = document.getElementById(chart_elm_id);
        var data = {
            labels: nameOfdata,
            datasets: [{
                data: valueDataset,
                backgroundColor: color,
                hoverBackgroundColor: color

            }]
        }
        var canvasDoughnut = new Chart(ctx, {
          type: 'doughnut',
          tooltipFillColor: "rgba(51, 51, 51, 0.55)",
          data: data,
          options: {
            legend: {
              display: true,
              position:'bottom'
            }
          }
      });
    }
  }


  function add_option(option_id) {
    for (i = 0; i < label_camNote.length; i++){
      $('#' + option_id).append("<option value=" + label_camNote[i]  + ">" + label_camNote[i] +"</option>")
    }       
  }





  