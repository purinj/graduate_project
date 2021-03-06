
function add_data_test(url_request,table_column,table_rows,type_for_modal){
    $.ajax({
        type: 'GET',
        async: false,
        url: host_url + "api/"+ url_request,
        success: function(data) {
            turn_to_head = ''
            turn_to_rows = ''
            modal_body = ''
            for (i = 0; i < data.column.length ; i ++) {
                console.log(data.column[i]);
                turn_to_head += '<th>' + data.column[i]  +'</th>'
                modal_body += '<a>' + data.column[i] + '</a>' + '<input class="form-control" type="text" id="edit_' + data.column[i]  + '" >'
                

            }
            turn_to_head +=  '<th>' + 'action' +'</th>'
            document.getElementById(table_column).innerHTML += turn_to_head;
            document.getElementById("body_modal").innerHTML = '<h2>แก้ไขข้อมูล</h2>' + modal_body


            for (i = 0; i < data.row.length ; i ++) {
                turn_to_rows = ''
                for (j = 0; j < data.row[i].length ; j ++) {
                   
                    console.log(data.column[j]);
                    turn_to_rows +=  "<td id=" + data.column[j] + "_rows" + i + ' >'+ data.row[i][j] + "</td>"
                    
                }
                btn = '<td>' +  '<div class="btn-group btn-group-sm" role="group" aria-label="...">' +
                          '<button class="btn btn-warning" type="button"'+ 'onclick=edit_open_modal('+ i +','+ "'" + type_for_modal + "'"+ ") "  + '>' + 'แก้ไข</button>' +
                          '<button class="btn btn-danger" type="button"' + 'onclick=delete_open_modal('+ i +','+ "'" + type_for_modal + "'"+ ") " + ' >ลบ</button>'  +
                        '</div></td>';
                turn_to_rows += btn + '</tr>'
                document.getElementById(table_rows).innerHTML += turn_to_rows;     
            }
            
      }
      });

}