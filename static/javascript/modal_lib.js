
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
    if (event.target == modal || event.target == del_modal) {
      modal.style.display = "none";
      del_modal.style.display = "none";
    }
}

document.getElementById('add_thermal_complete').onclick = function() {
    $.ajax({
        type: 'POST',
        async: false,
        url: host_url + "api/allCameraTable",
        data: {
            ip: document.querySelector("#add_libcam_ip").value,
            user: document.querySelector("#add_libcam_user").value,
            password: document.querySelector("#add_libcam_password").value,
            brand:document.querySelector("#add_libcam_brand").value,
            model:document.querySelector("#add_libcam_model").value,
            note:document.querySelector("#add_libcam_note").value,
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
        url: host_url + "api/allCameraTable" ,
        data: {
            ip: document.querySelector("#edit_ip").value,
            user: document.querySelector("#edit_user").value,
            password: document.querySelector("#edit_password").value,
            brand:document.querySelector("#edit_brand").value,
            model:document.querySelector("#edit_model").value,
            note:document.querySelector("#edit_note").value,
            idInput: document.querySelector("#edit_id").value
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
        url: host_url + "api/allCameraTable" ,
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
    console.log(typeoftable);
    if (typeoftable == 'LibCam') {
        modal.style.display = "block";
        document.querySelector("#edit_id").value = document.getElementById('id_rows' + ip_value).innerHTML;
        document.querySelector("#edit_id").disabled = true
        document.querySelector("#edit_ip").value = document.getElementById('ip_rows' + ip_value).innerHTML;
        document.querySelector("#edit_user").value = document.getElementById('user_rows' + ip_value).innerHTML;
        document.querySelector("#edit_password").value = document.getElementById('password_rows' + ip_value).innerHTML;
        document.querySelector("#edit_brand").value = document.getElementById('brand_rows' + ip_value).innerHTML;
        document.querySelector("#edit_model").value = document.getElementById('model_rows' + ip_value).innerHTML;
        document.querySelector("#edit_note").value = document.getElementById('note_rows' + ip_value).innerHTML;
    }
       
}

function delete_open_modal(ip_value,typeoftable) {
    del_modal.style.display = "block";
    document.getElementById('displayId').innerHTML = document.getElementById('id_rows' + ip_value).innerHTML 
    document.getElementById('ip_for_del').innerHTML = ' เลข IP ' + document.getElementById('ip_rows' + ip_value).innerHTML + ' '

}






