// ------------------------------------------------------------------------------------------------------------ //
//                                             HTML FOR FLOOD ALERT                                             //
// ------------------------------------------------------------------------------------------------------------ //
const floodWarningsHTML = `<div class="control control-group">
                                <div class="alert-panel-checkbox">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-000yr" checked>
                                        <label class="form-check-label" for="check-000yr">Sin alerta</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-002yr" checked>
                                        <label class="form-check-label" for="check-002yr">Periodo de retorno: 2 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-005yr" checked>
                                        <label class="form-check-label" for="check-005yr">Periodo de retorno: 5 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-010yr" checked>
                                        <label class="form-check-label" for="check-010yr">Periodo de retorno: 10 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-025yr" checked>
                                        <label class="form-check-label" for="check-025yr">Periodo de retorno: 25 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-050yr" checked>
                                        <label class="form-check-label" for="check-050yr">Periodo de retorno: 50 años</label>
                                    </div>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="check-100yr" checked>
                                        <label class="form-check-label" for="check-100yr">Periodo de retorno: 100 años</label>
                                    </div>
                                </div>
                            </div>
                            <br>`;

// Add HTML into the control panel
$("#flood-warnings")[0].innerHTML = floodWarningsHTML;




// ------------------------------------------------------------------------------------------------------------ //
//                                             LOAD FLOOD WARNINGS                                              //
// ------------------------------------------------------------------------------------------------------------ //
fetch("get-stations")
    .then((response) => (layer = response.json()))
    .then((layer) => {
        est_R000 = add_station_icon(layer, "R0");
        est_R000.addTo(map);
        //est_R000.on('click', showPanel)

        est_R002 = add_station_icon(layer, "R2");
        est_R002.addTo(map);
        //est_R002.on('click', showPanel)

        est_R005 = add_station_icon(layer, "R5");
        est_R005.addTo(map); 
        //est_R005.on('click', showPanel)

        est_R010 = add_station_icon(layer, "R10");
        est_R010.addTo(map);
        //est_R010.on('click', showPanel)

        est_R025 = add_station_icon(layer, "R25");
        est_R025.addTo(map);
        //est_R025.on('click', showPanel)

        est_R050 = add_station_icon(layer, "R50");
        est_R050.addTo(map);
        //est_R050.on('click', showPanel)
                
        est_R100 = add_station_icon(layer, "R100");
        est_R100.addTo(map);
        //est_R100.on('click', showPanel)
    });




// ------------------------------------------------------------------------------------------------------------ //
//                                         DINAMIC SELECT FOR WARNINGS                                          //
// ------------------------------------------------------------------------------------------------------------ //   
$('#check-000yr').on('change', function () {
    if($('#check-000yr').is(':checked')){
        est_R000.addTo(map);
    } else {
        map.removeLayer(est_R000); 
    };
});

$('#check-002yr').on('change', function () {
    if($('#check-002yr').is(':checked')){
        est_R002.addTo(map);
    } else {
        map.removeLayer(est_R002); 
    };
});
                
$('#check-005yr').on('change', function () {
    if($('#check-005yr').is(':checked')){
        est_R005.addTo(map);
    } else {
        map.removeLayer(est_R005); 
    };
});
                
$('#check-010yr').on('change', function () {
    if($('#check-010yr').is(':checked')){
        est_R010.addTo(map);
    } else {
        map.removeLayer(est_R010); 
    };
});
                
$('#check-025yr').on('change', function () {
    if($('#check-025yr').is(':checked')){
        est_R025.addTo(map);
    } else {
        map.removeLayer(est_R025); 
    };
});
                
$('#check-050yr').on('change', function () {
    if($('#check-050yr').is(':checked')){
        est_R050.addTo(map);
    } else {
        map.removeLayer(est_R050); 
    };
});
                
$('#check-100yr').on('change', function () {
    if($('#check-100yr').is(':checked')){
        est_R100.addTo(map);
    } else {
        map.removeLayer(est_R100); 
    };
});



