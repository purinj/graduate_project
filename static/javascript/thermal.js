 // data for dynamic
 var label_camNote = []
 var IPaddress = []
 var highTemp = []
 var normalTemp = []
 // data for dynamic end
 console.log(host_url);
      
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

 getCamData()

 highLowTemp(IPaddress)  // Edit needed

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
                      $('#p_male').html(data[Object.keys(data)[i]][innerObject[0]])
                      $('#p_female').html(data[Object.keys(data)[i]][innerObject[1]])
                      
                    } 
                    if (Object.keys(data)[i] == 'glass') {
                      $('#p_glass_yes').html(data[Object.keys(data)[i]][innerObject[2]])
                      $('#p_glass_no').html(data[Object.keys(data)[i]][innerObject[0]])
                      
                    } 
                    if (Object.keys(data)[i] == 'beard') {
                      $('#p_beard_yes').html(data[Object.keys(data)[i]][innerObject[1]])
                      $('#p_beard_no').html(data[Object.keys(data)[i]][innerObject[0]])
                      
                    } 
                    if (Object.keys(data)[i] == 'hat') {
                      $('#p_hat_yes').html(data[Object.keys(data)[i]][innerObject[1]])
                      $('#p_hat_no').html(data[Object.keys(data)[i]][innerObject[0]])
                      
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


 createStackdata(label_camNote,normalTemp,highTemp)
 function createStackdata(label,normalTemp,highTemp) {
   var chartData = {
     type: 'horizontalBar',
     data:  {
         labels: label,
         datasets: [{
         data: normalTemp,
         backgroundColor: "green",
         hoverBackgroundColor: "LightGreen",
         label: "อุณหภูมิปกติ"
     },{
         data: highTemp,
         backgroundColor: "red",
         hoverBackgroundColor: "pink",
         label: "อุณหภูมิมากกว่า 37.5 องศา"
     }
   
   
   ]
     },
     options: {
       responsive: false,
       legend: {
           display: true
       },
       scales: {
           yAxes: [{
             stacked: true
           }],
           xAxes: [{
             stacked: true
           }]
       },
 plugins: {
   datalabels: {
     color: 'white',
     font: {
       weight: 'bold'
     },display: function(context){
       return context.dataset.data[context.dataIndex] !== 0;
     },
     formatter: function(value, context) {
       return Math.round(value) + ' คน';
     }
   }
 }
 
     }
 }
 var canvas = document.getElementById('myChart');
 var myChart = new Chart(canvas, chartData);  
  canvas.onclick = function(evt) {
     var activePoint = myChart.getElementAtEvent(evt)[0];
     console.log(activePoint);
     var data = activePoint._chart.data;
     var datasetIndex = activePoint._datasetIndex;
     var label = data.datasets[datasetIndex].label;
     var value = data.datasets[datasetIndex].data[activePoint._index];
     console.log(data.labels[activePoint._index],label, value);  
     getDetectData(IPaddress[activePoint._index])
 } 
 }
 function selectedFloor(){
   var floor = document.getElementById('floor').value;
   var img = document.getElementById('floorImage');
   console.log(floor);
   img.src =  'static/image/' + floor + '.png'
   console.log(img.src);
   
 }