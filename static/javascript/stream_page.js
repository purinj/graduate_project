var streaMer = document.getElementById('streaMer')
var streaMer_container = document.getElementById('streaMer_container')

// Get the modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close_modal")[0];


span.onclick = function() {
    modal.style.display = "none";
}
document.getElementById('closing_modal').onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}

document.getElementById('layout_table').onchange = function() {
    var layout = document.getElementById('layout_table').value
    if (layout == 4) {
        document.getElementById('table_' + layout).hidden = false
        document.getElementById('table_9').hidden = true
    }
    if (layout == 9) {
        document.getElementById('table_' + layout).hidden = false
        document.getElementById('table_4').hidden = true
    }
    

}


streaMer_container.onclick = function() {
    modal.style.display = "block";
    
}


function test_stream(stream_link) {
    streaMer_container.innerHTML = ''
    var source = stream_link
    streaMer_container.innerHTML = '<img src=' + source +' style="width: 100%; height: 100%;">'
    streaMer_container.style.borderStyle = 'none'
    modal.style.display = "none";

}