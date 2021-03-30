
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


document.getElementById('add_axxon_complete').onclick = function() {
    $.ajax({
        type: 'POST',
        async: false,
        url: host_url + "api/AxxonCameraTable",
        data: {
            host_id: document.getElementById('add_axxon_host_id').value,
            display_idx: document.getElementById('add_axxon_display_idx').value,
            display_name: document.getElementById('add_axxon_display_name').value,
            ip: document.getElementById('add_axxon_ip').value,
            latitude: document.getElementById('add_axxon_latitude').value,
            longtitude: document.getElementById('add_axxon_longtitude').value,
            model: document.getElementById('add_axxon_model').value,
            vendor: document.getElementById('add_axxon_vendor').value,
            created_at: document.getElementById('add_axxon_created_at').value,
            updated_at: document.getElementById('add_axxon_updated_at').value,
            thai_name: document.getElementById('add_axxon_thai_name').value,
        },
        success: function(data) {
         console.log(data);
      }
      });
}

document.getElementById('edit_complete').onclick = function() {
    console.log(document.querySelector("#edit_id").value);
    $.ajax({
        type: 'PUT',
        async: false,
        url: host_url + "api/AxxonCameraTable" ,
        data: {
            host_id: document.querySelector("#edit_host_id").value,
            display_idx: document.querySelector("#edit_display_idx").value,
            display_name: document.querySelector("#edit_display_name").value,
            ip: document.querySelector("#edit_ip").value,
            latitude: document.querySelector("#edit_latitude").value,
            longtitude: document.querySelector("#edit_longitude").value,
            model: document.querySelector("#edit_model").value,
            vendor: document.querySelector("#edit_vendor").value,
            created_at: document.querySelector("#edit_created_at").value,
            updated_at: document.querySelector("#edit_updated_at").value,
            thai_name: document.querySelector("#edit_thai_name").value,
            idIndex: document.querySelector("#edit_id").value
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
        url: host_url + "api/AxxonCameraTable" ,
        data: {
            idIndex:document.querySelector("#displayId").innerHTML
        },
        success: function(data) {
         console.log(data);
         window.location.reload()
      }
      });
}


function edit_open_modal(ip_value,typeoftable) {
    if (typeoftable == 'Axxon') {
        modal.style.display = "block";
        document.querySelector("#edit_id").value = document.getElementById('id_rows' + ip_value).innerHTML;
        document.querySelector("#edit_id").disabled = true
        document.querySelector("#edit_host_id").value = document.getElementById('host_id_rows' + ip_value).innerHTML;
        document.querySelector("#edit_display_idx").value = document.getElementById('display_idx_rows' + ip_value).innerHTML;
        document.querySelector("#edit_display_name").value = document.getElementById('display_name_rows' + ip_value).innerHTML;
        document.querySelector("#edit_ip").value = document.getElementById('ip_rows' + ip_value).innerHTML;
        document.querySelector("#edit_latitude").value = document.getElementById('latitude_rows' + ip_value).innerHTML;
        document.querySelector("#edit_longitude").value = document.getElementById('longitude_rows' + ip_value).innerHTML;
        document.querySelector("#edit_model").value = document.getElementById('model_rows' + ip_value).innerHTML;
        document.querySelector("#edit_vendor").value = document.getElementById('vendor_rows' + ip_value).innerHTML;
        document.querySelector("#edit_created_at").value = document.getElementById('created_at_rows' + ip_value).innerHTML;
        document.querySelector("#edit_created_at").disabled = true
        document.querySelector("#edit_updated_at").value = document.getElementById('updated_at_rows' + ip_value).innerHTML;
        document.querySelector("#edit_updated_at").disabled = true
        document.querySelector("#edit_thai_name").value = document.getElementById('thai_name_rows' + ip_value).innerHTML;
    }
       
}
function delete_open_modal(ip_value,typeoftable) {
    del_modal.style.display = "block";
    document.getElementById('displayId').innerHTML = document.getElementById('id_rows' + ip_value).innerHTML 
    document.getElementById('display_name_for_del').innerHTML = ' ' + document.getElementById('display_name_rows' + ip_value).innerHTML + ' '
}




