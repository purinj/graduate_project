// LibraryCamModal
var modal = document.getElementById("myModal");
var del_modal = document.getElementById("delete_Modal");
var span = document.getElementsByClassName("close_modal")[0];
var span_del = document.getElementsByClassName("close_modal")[1];

var brand_id = []
var org_id = []
var cam_id = []

span.onclick = function () {
    modal.style.display = "none";
}

span_del.onclick = function () {
    del_modal.style.display = "none";
}
document.getElementById('closing_modal').onclick = function () {
    modal.style.display = "none";
}
document.getElementById('closing_del_modal').onclick = function () {
    del_modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal || event.target == del_modal) {
        modal.style.display = "none";
        del_modal.style.display = "none";
    }
}

document.getElementById('add_thermal_complete').onclick = function () {
    roles = []
    if (document.getElementById('Admin_checkbox').checked == true) {
        roles.push('Admin')
    }
    if (document.getElementById('Security_checkbox').checked == true) {
        roles.push('Security')
    }
    if (document.getElementById('SmartCity_checkbox').checked == true) {
        roles.push('SmartCity')
    }
    if (document.getElementById('Library_checkbox').checked == true) {
        roles.push('Library')
    }
    $.ajax({
        type: 'POST',
        async: false,
        url: host_url + "api/allCameraTable",
        data: {
            ip: document.querySelector("#add_all_ip").value,
            brand: brand_id[document.querySelector("#add_all_brand").selectedIndex],
            model: document.querySelector("#add_all_model").value,
            camera_name: document.querySelector("#add_all_camera_name").value,
            user: document.querySelector("#add_all_user").value,
            password: document.querySelector("#add_all_password").value,
            auth_type: document.querySelector("#add_all_Auth_type").value,
            stream_url: document.querySelector("#add_all_stream_url").value,
            location_name: document.querySelector("#add_all_location_name").value,
            latitude: document.querySelector("#add_all_latitude").value,
            longitude: document.querySelector("#add_all_longitude").value,
            organization: org_id[document.querySelector("#add_all_organization").selectedIndex],
            manage_role: roles,
            cam_type: cam_id[document.querySelector("#add_all_cam_type").selectedIndex]

        },
        success: function (data) {
            console.log(data);
        }
    });
}

document.getElementById('edit_complete').onclick = function () {
    console.log(document.querySelector("#edit_id").value);
    roles = []
    if (document.getElementById('edit_Admin_checkbox').checked == true) {
        roles.push('Admin')
    }
    if (document.getElementById('edit_Security_checkbox').checked == true) {
        roles.push('Security')
    }
    if (document.getElementById('edit_SmartCity_checkbox').checked == true) {
        roles.push('SmartCity')
    }
    if (document.getElementById('edit_Library_checkbox').checked == true) {
        roles.push('Library')
    }
    $.ajax({
        type: 'PUT',
        async: false,
        url: host_url + "api/allCameraTable",
        data: {
            ip: document.querySelector("#edit_ip").value,
            brand: brand_id[document.querySelector("#edit_all_brand").selectedIndex],
            model: document.querySelector("#edit_model").value,
            camera_name: document.querySelector("#edit_camera_name").value,
            user: document.querySelector("#edit_user").value,
            password: document.querySelector("#edit_password").value,
            auth_type: document.querySelector("#edit_all_Auth_type").value,
            stream_url: document.querySelector("#edit_stream_url").value,
            location_name: document.querySelector("#edit_location_name").value,
            latitude: document.querySelector("#edit_latitude").value,
            longitude: document.querySelector("#edit_longitude").value,
            organization: org_id[document.querySelector("#edit_all_organization").selectedIndex],
            manage_role: roles,
            id_Index: document.querySelector("#edit_id").value,
            cam_type: cam_id[document.querySelector("#edit_cam_type").selectedIndex]
        },
        success: function (data) {
            console.log(data);
            window.location.reload()
        }
    });
}

document.getElementById('del_complete').onclick = function () {
    console.log(document.querySelector("#displayId").innerHTML);
    $.ajax({
        type: 'PATCH',
        async: false,
        url: host_url + "api/allCameraTable",
        data: {
            del_id: document.querySelector("#displayId").innerHTML
        },
        success: function (data) {
            console.log(data);
            window.location.reload()
        }
    });
}

// usage
//add_data_to_table("camera_data_column","camera_data_row") // (id:table_col,id:table_row)


// function
function edit_open_modal(ip_value, typeoftable) {
    console.log(typeoftable);
    modal.style.display = "block";
    document.querySelector("#edit_id").value = document.getElementById('id_rows' + ip_value).innerHTML;
    document.querySelector("#edit_id").disabled = true
    document.querySelector("#edit_ip").value = document.getElementById('ip_rows' + ip_value).innerHTML;
    document.querySelector("#edit_all_brand").value = document.getElementById('brand_rows' + ip_value).innerHTML;
    document.querySelector("#edit_model").value = document.getElementById('model_rows' + ip_value).innerHTML;
    document.querySelector("#edit_camera_name").value = document.getElementById('camera_name_rows' + ip_value).innerHTML;
    document.querySelector("#edit_user").value = document.getElementById('user_rows' + ip_value).innerHTML;
    document.querySelector("#edit_password").value = document.getElementById('password_rows' + ip_value).innerHTML;
    document.querySelector("#edit_all_Auth_type").select = document.getElementById('auth_type_rows' + ip_value).innerHTML;
    document.querySelector("#edit_stream_url").value = document.getElementById('stream_url_rows' + ip_value).innerHTML;
    document.querySelector("#edit_location_name").value = document.getElementById('location_name_rows' + ip_value).innerHTML;
    document.querySelector("#edit_latitude").value = document.getElementById('latitude_rows' + ip_value).innerHTML;
    document.querySelector("#edit_longitude").value = document.getElementById('longitude_rows' + ip_value).innerHTML;
    document.querySelector("#edit_all_organization").value = document.getElementById('organization_rows' + ip_value).innerHTML;
    document.querySelector("#edit_cam_type").value = document.getElementById('cam_type_rows' + ip_value).innerHTML;
}

function delete_open_modal(ip_value, typeoftable) {
    del_modal.style.display = "block";
    document.getElementById('displayId').innerHTML = document.getElementById('id_rows' + ip_value).innerHTML
    document.getElementById('ip_for_del').innerHTML = ' เลข IP ' + document.getElementById('ip_rows' + ip_value).innerHTML + ' '

}


function addOption_brand(elmid) {
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/brandManage",
        success: function (data) {
            option = ''
            console.log(data);
            for (i = 0; i < data.row.length; i++) {
                brand_id.push(data.row[i][0])
                option += '<option value=' + data.row[i][1] + '>' + data.row[i][1] + '</option>'

            }
            document.getElementById(elmid).innerHTML = option

        }
    });
}

function addOption_organization(elmid) {
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/OrganizationManage",
        success: function (data) {
            option = ''
            console.log(data);
            for (i = 0; i < data.row.length; i++) {
                org_id.push(data.row[i][0])
                option += '<option value=' + data.row[i][1] + '>' + data.row[i][1] + '</option>'

            }
            document.getElementById(elmid).innerHTML = option

        }
    });
}


function addOption_type(elmid) {
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/camerasTypeManage",
        success: function (data) {
            option = ''
            console.log(data);
            for (i = 0; i < data.row.length; i++) {
                cam_id.push(data.row[i][0])
                option += '<option value=' + data.row[i][1] + '>' + data.row[i][1] + '</option>'

            }
            document.getElementById(elmid).innerHTML = option

        }
    });
}