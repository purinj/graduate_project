
// LibraryCamModal
var modal = document.getElementById("myModal");
var del_modal = document.getElementById("delete_Modal");
var span = document.getElementsByClassName("close_modal")[0];
var span_del = document.getElementsByClassName("close_modal")[1];


span.onclick = function() {
    modal.style.display = "none";
}

span_del.onclick = function() {
    del_modal.style.display = "none";
}
document.getElementById('closing_modal').onclick = function() {
    modal.style.display = "none";
}
document.getElementById('closing_del_modal').onclick = function() {
    del_modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == del_modal) {
    //   modal.style.display = "none";
      del_modal.style.display = "none";
    }
}

document.getElementById('add_thermal_complete').onclick = function() {
    $.ajax({
      type: 'POST',
      async: false,
      url: host_url + "api/bluepoleManage",
      data: {
        name: document.querySelector('#add_name').value,
        latitude: document.querySelector('#add_latitude').value,
        longitude: document.querySelector('#add_longitude').value
      },
      success: function(data) {
        console.log('ok');

        
    }
    });
}

document.getElementById('edit_complete').onclick = function() {
    console.log(document.querySelector("#edit_id").value);
    $.ajax({
        type: 'PUT',
        async: false,
        url: host_url + "api/bluepoleManage" ,
        data: {
            name: document.querySelector("#edit_name").value,
            latitude: document.querySelector("#edit_latitude").value,
            longitude: document.querySelector("#edit_longitude").value,
            ID: document.querySelector("#edit_id").value
        },
        success: function(data) {
         console.log(data);
         window.location.reload()
      }
      });
}

document.getElementById('del_complete').onclick = function() {
    console.log(document.querySelector("#displayId").innerHTML);
    $.ajax({
        type: 'PATCH',
        async: false,
        url: host_url + "api/bluepoleManage" ,
        data: {
            del_id:document.querySelector("#displayId").innerHTML
        },
        success: function(data) {
         console.log(data);
         window.location.reload()
      }
      });
}

// usage
//add_data_to_table("camera_data_column","camera_data_row") // (id:table_col,id:table_row)


// function
function edit_open_modal(ip_value,typeoftable) {
    modal.style.display = "block";
    document.querySelector("#edit_id").value = document.getElementById('id_rows' + ip_value).innerHTML;
    document.querySelector("#edit_id").disabled = true
    document.querySelector("#edit_name").value = document.getElementById('name_rows' + ip_value).innerHTML;
    document.querySelector("#edit_latitude").value = document.getElementById('latitude_rows' + ip_value).innerHTML;
    document.querySelector("#edit_longitude").value = document.getElementById('longitude_rows' + ip_value).innerHTML;
       
}

function delete_open_modal(ip_value,typeoftable) {
    del_modal.style.display = "block";
    document.getElementById('displayId').innerHTML = document.getElementById('id_rows' + ip_value).innerHTML 
    document.getElementById('ip_for_del').innerHTML = ' brand_name = ' + document.getElementById('brand_name_rows' + ip_value).innerHTML + ' '

}






