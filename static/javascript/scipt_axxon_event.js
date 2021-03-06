var Name = []
var People_in = []
var People_out =[]
var In_timeSeq = []
var Out_timeSeq = []


// Using Function FirstTime
fetchNameAndCam($('#start_date').val(),$('#end_date').val())
createStackdata('AxxonChart',Name,People_in,People_out)
add_option('Cam_Name_for_in')
add_option('Cam_Name_for_out')
// initial time seq chart
getTimeData(Name[0],$('#start_date').val(),$('#end_date').val())
create_Time_Chart("people_in_time_chart",In_timeSeq,'people_in','#48D1CC')
create_Time_Chart("people_out_time_chart",Out_timeSeq,'people_out','#FF7F50')



// Show
document.getElementById('loading').hidden = true;
document.getElementById('Complete').hidden = false;

    
// listener Event For Date Range
document.getElementById('find_range').onclick = function() {
  fetchNameAndCam($('#start_date').val(),$('#end_date').val())
  $('#AxxonChart').remove(); // this is my <canvas> element
  $('#Axxon_chart_container').append('<canvas id="AxxonChart"></canvas>');
  console.log($('#Axxon_chart_container').html());
  createStackdata('AxxonChart',Name,People_in,People_out)
}
document.getElementById('Cam_Name_for_in').onchange = function() {
  data_index = document.getElementById('Cam_Name_for_in').selectedIndex;
  getTimeData(Name[data_index],$('#start_date').val(),$('#end_date').val())
  $('#people_in_time_chart').remove();
  $('#people_in_time_chart_container').append('<canvas id="people_in_time_chart"></canvas>');
  create_Time_Chart("people_in_time_chart",In_timeSeq,'people_in','#48D1CC')
}

document.getElementById('Cam_Name_for_out').onchange = function() {
  data_index = document.getElementById('Cam_Name_for_out').selectedIndex;
  getTimeData(Name[data_index],$('#start_date').val(),$('#end_date').val())
  $('#people_out_time_chart').remove();
  $('#people_out_time_chart_container').append('<canvas id="people_out_time_chart"></canvas>');
  create_Time_Chart("people_out_time_chart",Out_timeSeq,'people_in','#FF7F50')
}


// Function 
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
            label: 'จำนวนเข้า',
            backgroundColor: "#48D1CC",
            data: normalTemp
        }, {
            label: 'จำนวนออก',
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


  function add_option(option_id) {
    for (i = 0; i < Name.length; i++){
      $('#' + option_id).append("<option value=" + Name[i]  + ">" + Name[i] +"</option>")
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
  
function create_Time_Chart(idOfChart,result,nameLabel,lineColor) {
    // parse labels and data
    var labels = result.map(e => moment(e.x, 'HH:mm'));
    var data = result.map(e => +e.y);
    console.log(labels);
    console.log(data);
    if ($('#' + idOfChart).length) {
      var ctx = document.getElementById(idOfChart).getContext('2d');
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