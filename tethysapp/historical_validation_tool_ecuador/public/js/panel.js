// ------------------------------------------------------------------------------------------------------------ //
//                                            PANEL DATA INFORMATION                                            //
// ------------------------------------------------------------------------------------------------------------ //
const sleep = ms => new Promise(r => setTimeout(r, ms));
var global_comid;
var loader = `<div class="loading-container" style="height: 350px; padding-top: 12px;"> 
                <div class="loading"> 
                  <h2>LOADING DATA</h2>
                  <span></span><span></span><span></span><span></span><span></span><span></span><span></span> 
                </div>
              </div>`; 


async function get_data_station(code, comid, name, river, basin, latitude, longitude, altitude, locality1, locality2, locality3){
    // Add data to the panel
    $("#panel-title-custom").html(`${code.toUpperCase()} - ${name.toUpperCase()}`)
    $("#station-comid-custom").html(`<b>COMID:</b> &nbsp ${comid}`)
    $("#station-river-custom").html(`<b>RIO:</b> &nbsp ${river.toUpperCase()}`)
    $("#station-basin-custom").html(`<b>CUENCA:</b> &nbsp ${basin.toUpperCase()}`)
    $("#station-latitude-custom").html(`<b>LATITUD:</b> &nbsp ${latitude.toUpperCase()}`)
    $("#station-longitude-custom").html(`<b>LONGITUD:</b> &nbsp ${longitude.toUpperCase()}`)
    $("#station-altitude-custom").html(`<b>ALTITUD:</b> &nbsp ${altitude.toUpperCase()} msnm`)
    $("#station-locality1-custom").html(`<b>PROVINCIA:</b> &nbsp ${locality1.toUpperCase()}`)
    $("#station-locality2-custom").html(`<b>CANTON:</b> &nbsp ${locality2.toUpperCase()}`)
    $("#station-locality3-custom").html(`<b>PARROQUIA:</b> &nbsp ${locality3.toUpperCase()}`)
            
    loader = `<div class="loading-container" style="height: 350px; padding-top: 12px;"> 
                        <div class="loading"> 
                        <h2>LOADING DATA</h2>
                            <span></span><span></span><span></span><span></span><span></span><span></span><span></span> 
                        </div>
                    </div>`;
            
    // Add the dynamic loader
    $("#hydrograph").html(loader)
    $("#visual-analisis").html(loader)
    $("#metrics").html(loader)
    $("#forecast").html(loader)
    $("#corrected-forecast").html(loader)
            
    // We need stop 300ms to obtain the width of the panel-tab-content
    await sleep(300);
            
    // Retrieve the data
    $.ajax({
        type: 'GET', 
        url: "get-data",
        data: {
            codigo: code.toLowerCase(),
            comid: comid,
            nombre: name.toUpperCase(),
            width: `${$("#panel-tab-content").width()}`
        }
    }).done(function(response){
        // Render the panel data
        $("#modal-body-panel-custom").html(response);
            
        // Set active variables for panel data
        active_code = code.toLowerCase();
        active_comid = comid;
        global_comid = comid;
        active_name = name.toUpperCase();
    })
}

