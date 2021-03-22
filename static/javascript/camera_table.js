
function add_data_test(url_request,table_column,table_rows,type_for_modal){
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/"+ url_request,
        success: function(data) {
            turn_to_head = ''
            turn_to_rows = ''
            modal_body = ''
            if(type_for_modal == 'user') {
                for (i = 0; i < data.column.length ; i ++) {
                    console.log(data.column[i]);
                    console.log(data.role_row[i]);
                    turn_to_head += '<th>' + data.column[i]  +'</th>'
                    modal_body +=  '<div id=' + 'div_edit_' + data.column[i] +'>'+ '<a>' + data.column[i] + '</a>' + '<input class="form-control" type="text" id="edit_' + data.column[i]  + '" >' + '</div>'
                    
    
                }
                turn_to_head +=  '<th>' + 'Roles' +'</th>'
                turn_to_head +=  '<th>' + 'action' +'</th>'
                document.getElementById(table_column).innerHTML += turn_to_head;
                roleEdit = '<div id="div_edit_role"></div>'
                document.getElementById("body_modal").innerHTML = '<h2>แก้ไขข้อมูล</h2>' + modal_body + roleEdit

                for (i = 0; i < data.row.length ; i ++) {
                    turn_to_rows = '<tr>'
                    for (j = 0; j < data.row[i].length ; j ++) {
                        console.log(data.column[j]);
                        if (data.column[j] == 'password') {
                            turn_to_rows +=  "<td id=" + data.column[j] + "_rowsShow" + i + ' >'+ '*******' + `<a id=${data.column[j]}_rows${i} hidden>${data.row[i][j]}</a>` + "</td>"

                        } else {
                            turn_to_rows +=  "<td id=" + data.column[j] + "_rows" + i + ' >'+ data.row[i][j] + "</td>"
                        }
                       
                        
                    }

                    btn = '<td>' +  '<div class="btn-group btn-group-sm" role="group" aria-label="...">' +
                              '<button class="btn btn-warning" type="button"'+ 'onclick=edit_open_modal('+ i +','+ "'" + type_for_modal + "'"+ ") "  + '>' + 'แก้ไข</button>' +
                              '<button class="btn btn-danger" type="button"' + 'onclick=delete_open_modal('+ i +','+ "'" + type_for_modal + "'"+ ") " + ' >ลบ</button>'  +
                            '</div></td>';
                    role_user_row = "<td id="  + "Roles_rows" + i + ' >'+ data.role_row[i] + "</td>"
                    turn_to_rows += role_user_row + btn + '</tr>'
                    document.getElementById(table_rows).innerHTML += turn_to_rows;     
                }

            } else {
                for (i = 0; i < data.column.length ; i ++) {
                    console.log(data.column[i]);
                    turn_to_head += '<th>' + data.column[i]  +'</th>'
                    modal_body +=  '<div id=' + 'div_edit_' + data.column[i] +'>'+ '<a>' + data.column[i] + '</a>' + '<input class="form-control" type="text" id="edit_' + data.column[i]  + '" >' + '</div>'
                    
    
                }
                
                if (type_for_modal == 'brand') {
                    if (document.getElementById('Roles_p').innerHTML.includes('Admin')) {
                        turn_to_head +=  '<th>' + 'action' +'</th>'
                    } else {
                        turn_to_head += ''

                    }

                } else {
                    turn_to_head +=  '<th>' + 'action' +'</th>'

                }
                document.getElementById(table_column).innerHTML += turn_to_head;
                document.getElementById("body_modal").innerHTML = '<h2>แก้ไขข้อมูล</h2>' + modal_body

                for (i = 0; i < data.row.length ; i ++) {
                    turn_to_rows = '<tr>'
                    for (j = 0; j < data.row[i].length ; j ++) {
                       
                        console.log(data.column[j]);
                        turn_to_rows +=  "<td id=" + data.column[j] + "_rows" + i + ' >'+ data.row[i][j] + "</td>"
                        
                    }
                    btn = '<td>' +  '<div class="btn-group btn-group-sm" role="group" aria-label="...">' +
                              '<button class="btn btn-warning" type="button"'+ 'onclick=edit_open_modal('+ i +','+ "'" + type_for_modal + "'"+ ") "  + '>' + 'แก้ไข</button>' +
                              '<button class="btn btn-danger" type="button"' + 'onclick=delete_open_modal('+ i +','+ "'" + type_for_modal + "'"+ ") " + ' >ลบ</button>'  +
                            '</div></td>';
                    
                    if (type_for_modal == 'brand') {
                        if (document.getElementById('Roles_p').innerHTML.includes('Admin')) {
                            turn_to_rows += btn + '</tr>'
                        } else {
                            turn_to_rows += '</tr>'
    
                        }
    
                    } else {
                        turn_to_rows += btn + '</tr>'
    
                    }
                    document.getElementById(table_rows).innerHTML += turn_to_rows;     
                }

            }
            

            
      }
      });

}