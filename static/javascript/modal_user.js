
// LibraryCamModal
var modal = document.getElementById("myModal");
var del_modal = document.getElementById("delete_Modal");
var span = document.getElementsByClassName("close_modal")[0];
var span_del = document.getElementsByClassName("close_modal")[1];

var org_id = []

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
    roles = [] 
    if (document.getElementById('Admin_checkbox').checked == true){
        roles.push('Admin')
    }
    if (document.getElementById('Security_checkbox').checked == true){
        roles.push('Security')
    }
    if (document.getElementById('SmartCity_checkbox').checked == true){
        roles.push('SmartCity')
    } 
    if (document.getElementById('Library_checkbox').checked == true){
        roles.push('Library')
    } 
    if (document.getElementById('Viewer_checkbox').checked == true){
        roles.push('Viewer')
    }
    $.ajax({
        type: 'POST',
        async: false,
        url: host_url + "api/usermanage",
        data: {
            username: document.querySelector('#add_user_username').value,
            password: document.querySelector('#add_user_password').value,
            firstname:document.querySelector('#add_user_firstname').value,
            lastname: document.querySelector('#add_user_lastname').value,
            organization:org_id[document.querySelector('#add_user_organization').selectedIndex],
            role:roles,

        },
        success: function(data) {
         console.log(data);
      }
      });
}

document.getElementById('edit_complete').onclick = function() {
    console.log(document.querySelector("#edit_id").value);
    roles = [] 
    if (document.getElementById('edit_Admin_checkbox').checked == true){
        roles.push('Admin')
    }
    if (document.getElementById('edit_Security_checkbox').checked == true){
        roles.push('Security')
    }
    if (document.getElementById('edit_SmartCity_checkbox').checked == true){
        roles.push('SmartCity')
    } 
    if (document.getElementById('edit_Library_checkbox').checked == true){
        roles.push('Library')
    } 
    if (document.getElementById('edit_Viewer_checkbox').checked == true){
        roles.push('Viewer')
    } 
    $.ajax({
        type: 'PUT',
        async: false,
        url: host_url + "api/usermanage" ,
        data: {
            username: document.querySelector('#edit_username').value,
            password: document.querySelector('#edit_password').value,
            firstname:document.querySelector('#edit_firstname').value,
            lastname: document.querySelector('#edit_lastname').value,
            organization:org_id[document.querySelector('#edit_organization').selectedIndex],
            role:roles,
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
        url: host_url + "api/usermanage" ,
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
    modal.style.display = "block";
    document.querySelector("#edit_id").value = document.getElementById('id_rows' + ip_value).innerHTML;
    document.querySelector("#edit_id").disabled = true
    document.querySelector("#edit_username").value = document.getElementById('username_rows' + ip_value).innerHTML;
    document.querySelector("#edit_password").value = document.getElementById('password_rows' + ip_value).innerHTML;
    document.querySelector("#edit_firstname").value = document.getElementById('firstname_rows' + ip_value).innerHTML;
    document.querySelector("#edit_lastname").value = document.getElementById('lastname_rows' + ip_value).innerHTML;
    document.getElementById('div_edit_role').innerHTML = '<a>Role: </a> \
    <input type="checkbox" id="edit_Admin_checkbox" name="Admin" value="Admin"> \
    <label for="Admin">Admin</label> \
    <input type="checkbox" id="edit_Security_checkbox" name="Security" value="Security"> \
    <label for="Security">Security</label> \
    <input type="checkbox" id="edit_SmartCity_checkbox" name="SmartCity" value="SmartCity"> \
    <label for="SmartCity">SmartCity</label> \
    <input type="checkbox" id="edit_Library_checkbox" name="Library" value="Library"> \
    <label for="Library">Library</label> \
    <input type="checkbox" id="edit_Viewer_checkbox" name="Viewer" value="Viewer"> \
    <label for="edit_Viewer">Viewer</label> \
    '
    var role_for_check = document.getElementById('Roles_rows' + ip_value).innerHTML.split(',');
    if (role_for_check.includes('Admin')) {
        document.getElementById('edit_Admin_checkbox').checked = true;
    }
    if (role_for_check.includes('Security')) {
        document.getElementById('edit_SmartCity_checkbox').checked = true;
    }
    if (role_for_check.includes('SmartCity')) {
        document.getElementById('edit_SmartCity_checkbox').checked = true;
    }
    if (role_for_check.includes('Library')) {
        document.getElementById('edit_Library_checkbox').checked = true;
    }
    if (role_for_check.includes('Viewer')) {
        document.getElementById('edit_Viewer_checkbox').checked = true;
    }
    document.getElementById('div_edit_organization').innerHTML = '<a>Organization</a><select id="edit_organization"  class="form-control"> \
                                    </select>'
    addOption_organization('edit_organization')
    document.querySelector("#edit_organization").value = document.getElementById('organization_rows' + ip_value).innerHTML;
       
}

function delete_open_modal(ip_value,typeoftable) {
    del_modal.style.display = "block";
    document.getElementById('displayId').innerHTML = document.getElementById('id_rows' + ip_value).innerHTML 
    document.getElementById('ip_for_del').innerHTML = 'username= ' + document.getElementById('username_rows' + ip_value).innerHTML + ' '

}


function addOption_brand(elmid) {
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/brandManage" ,
        success: function(data) {
         option = ''
         console.log(data);
         for(i=0;i < data.row.length; i++){
             option += '<option value=' + data.row[i][1] + '>' + data.row[i][1]  + '</option>'

         }
         document.getElementById(elmid).innerHTML = option

      }
      });
}

function addOption_organization(elmid) {
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/OrganizationManage" ,
        success: function(data) {
         option = ''
         console.log(data);
         for(i=0;i < data.row.length; i++){
             org_id.push(data.row[i][0])
             option += '<option value=' + data.row[i][1] + '>' + data.row[i][1]  + '</option>'

         }
         document.getElementById(elmid).innerHTML = option

      }
      });
}


