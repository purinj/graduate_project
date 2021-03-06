console.log($('#start_date').val());
    console.log($('#end_date').val());
    document.getElementById('find_range').onclick = function() {
      console.log($('#start_date').val());
      console.log($('#end_date').val());
      fetchNameAndCam($('#start_date').val(),$('#end_date').val())
      $('#myChart').remove(); // this is my <canvas> element
      $('#firstChart').append('<canvas id="myChart"></canvas>');
      createStackdata(Name,People_in,People_out)
    }
    // Get the Sidebar
    var mySidebar = document.getElementById("mySidebar");
    var Name = []
    var People_in = []
    var People_out =[]
    var In_timeSeq = []
    var Out_timeSeq = []
    var tG = true

    // Get the DIV with overlay effect
    var overlayBg = document.getElementById("myOverlay");

    // Toggle between showing and hiding the sidebar, and add overlay effect
    function w3_open() {
      if (mySidebar.style.display === 'block') {
        mySidebar.style.display = 'none';
        overlayBg.style.display = "none";
      } else {
        mySidebar.style.display = 'block';
        overlayBg.style.display = "block";
      }
    }

    // Close the sidebar with the close button
    function w3_close() {
      mySidebar.style.display = "none";
      overlayBg.style.display = "none";
    }
    function tog() {
      if (tG = true) {
        tG = false

      } if (tG = false) {
        tG = true
      }

    }
    function fetchNameAndCam(start,end){
      CameraName_in = []
      ppl_in = []
      ppl_out = []
      $.ajax({
          type: 'POST',
          async: false,
          url: host_url + "api/AxxonDataWithTime",
          data: {
            startDate: start,
            endDate:end
          },
          success: function(data) {
            json_pplIn = JSON.parse(data.peopleIn)
            json_pplOut = JSON.parse(data.peopleOut)
            console.log(json_pplIn);
          for(i=0; i < json_pplIn.length ; i++) {
            CameraName_in.push(json_pplIn[i].display_name)
            ppl_in.push(json_pplIn[i].sum)
           }
           for(i=0; i <  json_pplOut.length ; i++) {
            ppl_out.push(json_pplOut[i].sum)
           }
           Name = CameraName_in
           People_in = ppl_in
           People_out = ppl_out
           console.log(Name);
        }
        });
    }
    function addTooption() {
      for (i = 0; i < Name.length; i++){
        $('#Cam').append("<option value=" + Name[i]  + ">" + Name[i] +"</option>")
      }       
    }
    function findTime() {
      data_index = document.getElementById('Cam').selectedIndex;
      console.log(Name[data_index]);

      console.log($('#type').val());

      getTimeData(Name[data_index],$('#start_date').val(),$('#end_date').val())
      $('#time_Chart').remove(); // this is my <canvas> element
      $('#time_Chart_container').append('<canvas class="w3-white" id="time_Chart" hidden></canvas>');
      if ($('#type').val() == 'เข้า') {
          create_Time_Chart(In_timeSeq,'people_in','MediumTurquoise')
        } else {
          create_Time_Chart(Out_timeSeq,'people_Out','LightCoral')
        }

    }
    
    fetchNameAndCam($('#start_date').val(),$('#end_date').val())
    createStackdata(Name,People_in,People_out)
    addTooption()
    function createStackdata(label,normalTemp,highTemp) {
    //   var chartData = {
    //     type: 'horizontalBar',
    //     data:  {
    //         labels: label,
    //         datasets: [{
    //         data: normalTemp,
    //         backgroundColor: "MediumTurquoise",
    //         hoverBackgroundColor: "LightGreen",
    //         label: "เข้า"
    //     },{
    //         data: highTemp,
    //         backgroundColor: "LightCoral",
    //         hoverBackgroundColor: "pink",
    //         label: "ออก"
    //     }
      
      
    //   ]
    //     },
    //     options: {
    //       responsive: false,
    //       legend: {
    //           display: true
    //       },
    //       scales: {
    //           yAxes: [{
    //             stacked: true
    //           }],
    //           xAxes: [{
    //             stacked: true
    //           }]
    //       },
    // plugins: {
    //   datalabels: {
    //     color: 'white',
    //     font: {
    //       weight: 'bold'
    //     },
    //     formatter: function(value, context) {
    //       return Math.round(value);
    //     }
    //   }
    // }
    
    //     }
    // }
    var chartData = {
      type: 'horizontalBar',
      data: {
          labels: label,
          datasets: [{
              label: 'เข้า',
              backgroundColor: "MediumTurquoise",
              data: normalTemp
          }, {
              label: 'ออก',
              backgroundColor: "LightCoral",
              data: highTemp
          }]
      },

      options: {
        legend: {
          display: false
        },
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: false
                  }
              }]
          }
      }
  };
    if ($('#myChart').length) {
      var canvas = document.getElementById('myChart');
      console.log(chartData);
      var myChart = new Chart(canvas, chartData);  
       canvas.onclick = function(evt) {
          var activePoint = myChart.getElementAtEvent(evt)[0];
          console.log(activePoint);
          var data = activePoint._chart.data;
          var datasetIndex = activePoint._datasetIndex;
          var label = data.datasets[datasetIndex].label;
          var value = data.datasets[datasetIndex].data[activePoint._index];
          console.log(data.labels[activePoint._index],label, value);
          getTimeData(data.labels[activePoint._index],$('#start_date').val(),$('#end_date').val())
          console.log(In_timeSeq);
          $('#time_Chart').remove(); // this is my <canvas> element
          $('#time_Chart_container').append('<canvas class="w3-white" id="time_Chart" hidden></canvas>');
          if (label == 'เข้า') {
            create_Time_Chart(In_timeSeq,'people_in','MediumTurquoise')
          } else {
            create_Time_Chart(Out_timeSeq,'people_Out','LightCoral')
          }
              
  
      }
    } 
    }
    function getTimeData(cctv_name,Start,End) {
      result_In = []
      result_Out = []
      $.ajax({
          type: 'POST',
          async: false,
          url: host_url + "api/axxonTimeScale",
          data: {
            cctvName:cctv_name,
            startDate:Start,
            endDate:End
          },
          success: function(data) {
            peopleIn_time = JSON.parse(data.ppl_in_time)
            peopleOut_time = JSON.parse(data.ppl_out_time) 
            for(i = 0 ; i < peopleIn_time.length; i++){
              result_In.push( {x:peopleIn_time[i].hh + ":" + peopleIn_time[i].mm, y:String(peopleIn_time[i].count)} )
            }
            for(i = 0 ; i < peopleOut_time.length; i++){
              result_Out.push( {x:peopleOut_time[i].hh + ":" + peopleOut_time[i].mm, y:String(peopleOut_time[i].count)} )
            }
            In_timeSeq = result_In
            Out_timeSeq = result_Out

        }
        });
    }
    function create_Time_Chart(result,nameLabel,lineColor) {
        // parse labels and data
        var labels = result.map(e => moment(e.x, 'HH:mm'));
        var data = result.map(e => +e.y);
        console.log(labels);
        console.log(data);
        var ctx = document.getElementById("time_Chart");
        var myChart = new Chart(ctx, {
           type: 'bar',
           data: {
              labels: labels,
              datasets: [{
                 label: nameLabel,
                 data: data,
                 backgroundColor: lineColor,
      }]
   },
   options: {
     responsive: true,
          legend: {
              display: true
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
   plugins: {
    datalabels: {
      align: 'start',
      anchor: 'start',
      borderRadius: 2,
      backgroundColor:lineColor,
      color: 'white',
      font: {
        weight: 'bold'
      },
        display: false,
    },
}, elements: {
                        line: {
                                fill: false
                        }
                    }
   }
});
    }

