function mapPixelValueToColor(pixelValue) {
    switch (true) {
        case pixelValue === 0:
            return 'rgba(0, 0, 0, 0)'; 
        case pixelValue >= 0.01 && pixelValue <= 0.5:
            return 'rgba(180, 215, 255, 1)';
        case pixelValue > 0.5 && pixelValue <= 1:
            return 'rgba(117, 186, 255, 1)';
        case pixelValue > 1 && pixelValue <= 2:
            return 'rgba(53, 154, 255, 1)';
        case pixelValue > 2 && pixelValue <= 3:
            return 'rgba(4, 130, 255, 1)';
        case pixelValue > 3 && pixelValue <= 5:
            return 'rgba(0, 105, 255, 1)';
        case pixelValue > 5 && pixelValue <= 7:
            return 'rgba(0, 154, 127, 1)';
        case pixelValue > 7 && pixelValue <= 10:
            return 'rgba(20, 143, 27, 1)';
        case pixelValue > 10 && pixelValue <= 15:
            return 'rgba(26, 207, 5, 1)';
        case pixelValue > 15 && pixelValue <= 20:
            return 'rgba(99, 237, 7, 1)';
        case pixelValue > 20 && pixelValue <= 25:
            return 'rgba(255, 244, 43, 1)';
        case pixelValue > 25 && pixelValue <= 30:
            return 'rgba(232, 220, 0, 1)';
        case pixelValue > 30 && pixelValue <= 35:
            return 'rgba(240, 96, 0, 1)';
        case pixelValue > 35 && pixelValue <= 40:
            return 'rgba(255, 127, 39, 1)';
        case pixelValue > 40 && pixelValue <= 45:
            return 'rgba(255, 166, 106, 1)';
        case pixelValue > 45 && pixelValue <= 50:
            return 'rgba(248, 78, 120, 1)';
        case pixelValue > 50 && pixelValue <= 60:
            return 'rgba(247, 30, 84, 1)';
        case pixelValue > 60 && pixelValue <= 70:
            return 'rgba(191, 0, 0, 1)';
        case pixelValue > 70 && pixelValue <= 80:
            return 'rgba(136, 0, 0, 1)';
        case pixelValue > 80 && pixelValue <= 90:
            return 'rgba(100, 0, 0, 1)';
        case pixelValue > 90 && pixelValue <= 100:
            return 'rgba(45, 0, 0, 1)';
        case pixelValue > 100:
            return 'rgba(0, 0, 0, 1)';
        default:
            return 'rgba(0, 0, 0, 0)'; 
    }    
}

function getRasterLayer(filePath) {
    return new Promise(function(resolve, reject) {
      fetch(filePath)
        .then(response => response.blob())
        .then(blob => {
          var reader = new FileReader();
          reader.onload = function(event) {
            var arrayBuffer = event.target.result;
            console.log("ArrayBuffer:", arrayBuffer);
            parseGeoraster(arrayBuffer).then(georaster => {
              var pacumTIFF = new GeoRasterLayer({
                georaster: georaster,
                opacity: 0.5,
                pixelValuesToColorFn: mapPixelValueToColor
              });
              resolve(pacumTIFF);
            });
          };
          reader.readAsArrayBuffer(blob);
        });
    });
  }
  

function get_format_date_00UTC(fechaActual){
    var fechaActual = new Date(fechaActual - 18000000)
    const year = fechaActual.getUTCFullYear();
    const month = String(fechaActual.getUTCMonth() + 1).padStart(2, '0');
    const day = String(fechaActual.getUTCDate()).padStart(2, '0');
    const hour = String(fechaActual.getUTCHours()).padStart(2, '0');
    return(`${year}-${month}-${day} ${hour}:00 UTC`);
}

// Obtener la fecha actual
const today = get_format_date_00UTC(new Date());
//const yesterday = get_format_date_00UTC(new Date(new Date() - 86400000));








getRasterLayer('https://www.hydroshare.org/resource/925ad37f78674d578eab2494e13db240/data/contents/pacum_24_res.tif')
  .then(function(pacumTIFF) {
   pacum24 = pacumTIFF 
})
getRasterLayer('https://www.hydroshare.org/resource/925ad37f78674d578eab2494e13db240/data/contents/pacum_48_res.tif')
  .then(function(pacumTIFF) {
   pacum48 = pacumTIFF 
})
getRasterLayer('https://www.hydroshare.org/resource/925ad37f78674d578eab2494e13db240/data/contents/pacum_72_res.tif')
  .then(function(pacumTIFF) {
   pacum72 = pacumTIFF 
})



var legend24 = L.control({ position: 'bottomleft' });
legend24.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Precipitación acumulada en 24h (mm) - Actualización: ${today} </div>
                            <img width='700px' src='${server}/static/${app_name}/images/legend_pacum.png'>
                        </div>
                    </div>`;
    return div;
}; 
var legend48 = L.control({ position: 'bottomleft' });
legend48.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Precipitación acumulada en 48h (mm) - Actualización: ${today} </div>
                            <img width='700px' src='${server}/static/${app_name}/images/legend_pacum.png'>
                        </div>
                    </div>`;
    return div;
}; 
var legend72 = L.control({ position: 'bottomleft' });
legend72.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Precipitación acumulada en 72h (mm) - Actualización: ${today} </div>
                            <img width='700px' src='${server}/static/${app_name}/images/legend_pacum.png'>
                        </div>
                    </div>`;
    return div;
};




$('#check-pacum24').on('change', function () {
    if($('#check-pacum24').is(':checked')){
        pacum24.addTo(map);
        legend24.addTo(map);
        if($('#check-pacum48').is(':checked')){
            $('#check-pacum48')[0].checked = false
            map.removeLayer(pacum48)
            map.removeControl(legend48)
        }
        if($('#check-pacum72').is(':checked')){
            $('#check-pacum72')[0].checked = false
            map.removeLayer(pacum72)
            map.removeControl(legend72)
        }
    }else{
        map.removeLayer(pacum24)
        map.removeControl(legend24)
    }
});

$('#check-pacum48').on('change', function () {
    if($('#check-pacum48').is(':checked')){
        pacum48.addTo(map);
        legend48.addTo(map);
        if($('#check-pacum24').is(':checked')){
            $('#check-pacum24')[0].checked = false
            map.removeLayer(pacum24)
            map.removeControl(legend24)
        }
        if($('#check-pacum72').is(':checked')){
            $('#check-pacum72')[0].checked = false
            map.removeLayer(pacum72)
            map.removeControl(legend72)
        }
    }else{
        map.removeLayer(pacum48)
        map.removeControl(legend48)
    }
});


$('#check-pacum72').on('change', function () {
    if($('#check-pacum72').is(':checked')){
        pacum72.addTo(map);
        legend72.addTo(map);
        if($('#check-pacum24').is(':checked')){
            $('#check-pacum24')[0].checked = false
            map.removeLayer(pacum24)
            map.removeControl(legend24)
        }
        if($('#check-pacum48').is(':checked')){
            $('#check-pacum48')[0].checked = false
            map.removeLayer(pacum48)
            map.removeControl(legend48)
        }
    }else{
        map.removeLayer(pacum72)
        map.removeControl(legend72)
    }
});