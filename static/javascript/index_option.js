function sevenDays() {
    console.log('test');
    var date = new Date();

    document.getElementById('start_date').valueAsDate = new Date(date.setDate(date.getDate() - 7));
    document.getElementById('end_date').valueAsDate = new Date();
    document.getElementById('find_range').click()
}

function thirtyDays() {
    console.log('test');
    var date = new Date();

    document.getElementById('start_date').valueAsDate = new Date(date.setDate(date.getDate() - 30));
    document.getElementById('end_date').valueAsDate = new Date();
    document.getElementById('find_range').click()
}

function yearsPass() {
    console.log('test');
    var date = new Date();

    document.getElementById('start_date').valueAsDate = new Date(date.setDate(date.getDate() - 365));
    document.getElementById('end_date').valueAsDate = new Date();
    document.getElementById('find_range').click()
}

document.getElementById('find_range').onclick = function() {
    $('#axxon_data').remove()
    $('#axxon_data_container').html('<div id="axxon_data" style="height:500px;"></div>')
    fetchNameAndCam($('#start_date').val(), $('#end_date').val())
    create_axxon_graoh(Name, People_in, People_out)
    $('#thermal_Data').remove()
    $('#thermal_Data_container').html('<div id="thermal_Data" style="height:620px;"></div>')
    highLowTemp(IPaddress)
    createStackdata('thermal_Data', label_camNote, normalTemp, highTemp)
    document.getElementById('view_select_thermalcam').click()

}