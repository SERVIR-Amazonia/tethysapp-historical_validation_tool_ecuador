// -------------------------------------------------------------------------------------- //
//                                   PALETAS DE COLORES                                   //
// -------------------------------------------------------------------------------------- //

// Función para obtener el color en función deL valor asociado a la paleta de colore
function getColor(valor, tablaColores) {

    // Encontrar el valor mínimo y máximo en la tabla
    const valores = tablaColores.map((color) => color.valor);
    const minimo = Math.min(...valores);
    const maximo = Math.max(...valores);

    // Verificar si el valor está dentro del rango
    if (valor < minimo || valor > maximo) {
        return 'rgb(255, 255, 255)'; // Color transparente
    }

    // Ordenar la tabla por valores
    tablaColores.sort((a, b) => a.valor - b.valor);

    // Encontrar los dos puntos más cercanos en la tabla
    let lowerColor, upperColor;
    for (let i = 0; i < tablaColores.length - 1; i++) {
        if (valor >= tablaColores[i].valor && valor <= tablaColores[i + 1].valor) {
            lowerColor = tablaColores[i];
            upperColor = tablaColores[i + 1];
            break;
        }
    }

    // Calcular la interpolación lineal
    const t = (valor - lowerColor.valor) / (upperColor.valor - lowerColor.valor);

    // Interpolar los componentes RGB
    const r = Math.round(lowerColor.r + t * (upperColor.r - lowerColor.r));
    const g = Math.round(lowerColor.g + t * (upperColor.g - lowerColor.g));
    const b = Math.round(lowerColor.b + t * (upperColor.b - lowerColor.b));

    return `rgb(${r}, ${g}, ${b})`;
}



// Estilo para ASM
//const colASM = [
//    { valor: 0.00, hex: "#F9F788", r: 249, g: 247, b: 136 },
//    { valor: 0.15, hex: "#D6D309", r: 214, g: 211, b: 9 },
//    { valor: 0.30, hex: "#B08C00", r: 176, g: 140, b: 0 },
//    { valor: 0.30, hex: "#B6F8A9", r: 182, g: 248, b: 169 },
//    { valor: 0.45, hex: "#1DD41C", r: 29, g: 212, b: 28 },
//    { valor: 0.60, hex: "#005200", r: 0, g: 82, b: 0 },
//    { valor: 0.60, hex: "#30F7F8", r: 48, g: 247, b: 248 },
//    { valor: 0.80, hex: "#300EFF", r: 48, g: 14, b: 255 },
//    { valor: 1.00, hex: "#100053", r: 16, g: 0, b: 83 },
//];
const colASM = [
        { valor: 0.00, hex: "#F9F788", r: 249, g: 247, b: 136 },
        { valor: 0.10, hex: "#D6D309", r: 214, g: 211, b: 9 },
        { valor: 0.20, hex: "#B08C00", r: 176, g: 140, b: 0 },
        { valor: 0.30, hex: "#B6F8A9", r: 182, g: 248, b: 169 },
        { valor: 0.40, hex: "#1DD41C", r: 29, g: 212, b: 28 },
        { valor: 0.50, hex: "#005200", r: 0, g: 82, b: 0 },
        { valor: 0.60, hex: "#359AFF", r: 53, g: 154, b: 255 },
        { valor: 0.70, hex: "#0069D2", r: 0, g: 105, b: 210 },
        { valor: 0.80, hex: "#00367F", r: 0, g: 54, b: 127 },
        { valor: 0.90, hex: "#100053", r: 16, g: 0, b: 83 },
        { valor: 1.00, hex: "#000000", r: 0, g: 0, b: 0 },
    ];
    
function style_ASM(feature){
    return {
        fillColor: getColor(feature.properties.asm, colASM),
        color: "black",
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1,
    }
}

function style_FFR12(feature){
    return {
        fillColor: getColor(feature.properties.ffr12, colASM),
        color: "black",
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1,
    }
}

function style_FFR24(feature){
    return {
        fillColor: getColor(feature.properties.ffr24, colASM),
        color: "black",
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1,
    }
}

// Estilo para ASM
const colFFG = [
    { valor: 0, r: 255, g: 255, b: 255 },
    { valor: 0.5, r: 180, g: 215, b: 255 },
    { valor: 1, r: 117, g: 186, b: 255 },
    { valor: 2, r: 53, g: 154, b: 255 },
    { valor: 3, r: 4, g: 130, b: 255 },
    { valor: 4, r: 0, g: 105, b: 255 },
    { valor: 5, r: 0, g: 54, b: 127 },
    { valor: 7, r: 20, g: 143, b: 27 },
    { valor: 10, r: 26, g: 207, b: 5 },
    { valor: 15, r: 99, g: 237, b: 7 },
    { valor: 20, r: 255, g: 244, b: 43 },
    { valor: 25, r: 232, g: 220, b: 0 },
    { valor: 30, r: 240, g: 96, b: 0 },
    { valor: 35, r: 255, g: 127, b: 39 },
    { valor: 40, r: 255, g: 166, b: 106 },
    { valor: 45, r: 248, g: 78, b: 120 },
    { valor: 50, r: 247, g: 30, b: 84 },
    { valor: 60, r: 191, g: 0, b: 0 },
    { valor: 70, r: 136, g: 0, b: 0 },
    { valor: 80, r: 100, g: 0, b: 127 },
    { valor: 90, r: 194, g: 0, b: 251 },
    { valor: 100, r: 221, g: 102, b: 255 },
    { valor: 125, r: 235, g: 166, b: 255 },
    { valor: 150, r: 249, g: 230, b: 255 },
    { valor: 300, r: 212, g: 212, b: 212 },
    { valor: 400, r: 0, g: 0, b: 0 },
];


function style_FFG(feature){
    return {
        fillColor: getColor(feature.properties.ffg, colFFG),
        color: "black",
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1,
    }
}

function style_FMAP06(feature){
    return {
        fillColor: getColor(feature.properties.fmap06, colFFG),
        color: "black",
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1,
    }
}

function style_FMAP24(feature){
    return {
        fillColor: getColor(feature.properties.fmap24, colFFG),
        color: "black",
        weight: 0.1,
        opacity: 1,
        fillOpacity: 1,
    }
}



var legend_asm = L.control({ position: 'bottomleft' });
legend_asm.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Humedad media del suelo (%) - Actualización: ${today} </div>
                            <img width='500px' src='${server}/static/${app_name}/images/legend_moisture.png'>
                        </div>
                    </div>`;
    return div;
}; 

var legend_ffg = L.control({ position: 'bottomleft' });
legend_ffg.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Precipitación requerida para crecida (mm) - Actualización: ${today} </div>
                            <img width='700px' src='${server}/static/${app_name}/images/legend_pacum.png'>
                        </div>
                    </div>`;
    return div;
}; 

var legend_fmap06 = L.control({ position: 'bottomleft' });
legend_fmap06.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Pronóstico de precipitación prox. 6h (mm) - Actualización: ${today} </div>
                            <img width='700px' src='${server}/static/${app_name}/images/legend_pacum.png'>
                        </div>
                    </div>`;
    return div;
}; 


var legend_fmap24 = L.control({ position: 'bottomleft' });
legend_fmap24.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Pronóstico de precipitación prox. 24h (mm) - Actualización: ${today} </div>
                            <img width='700px' src='${server}/static/${app_name}/images/legend_pacum.png'>
                        </div>
                    </div>`;
    return div;
}; 


var legend_ffr12 = L.control({ position: 'bottomleft' });
legend_ffr12.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Riesgo de crecida prox. 12h (%) - Actualización: ${today} </div>
                            <img width='500px' src='${server}/static/${app_name}/images/legend_moisture.png'>
                        </div>
                    </div>`;
    return div;
}; 


var legend_ffr24 = L.control({ position: 'bottomleft' });
legend_ffr24.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `<div style='background-color:rgba(255,255,255,0.8);'>
                        <div style='margin: 12px !important; padding-bottom:4px !important; padding-top: 5px !important;'>
                            <div style='font-size:14px; font-weight:bold; padding-bottom:6px;'>Riesgo de crecida prox. 24h (%) - Actualización: ${today} </div>
                            <img width='500px' src='${server}/static/${app_name}/images/legend_moisture.png'>
                        </div>
                    </div>`;
    return div;
}; 






// ------------------------------------------------------------------------------------- //
//                                    PRESENTAR DATOS                                    //
// ------------------------------------------------------------------------------------- //

// Add nwsaffgs data
fetch('https://geoserver.hydroshare.org/geoserver/HS-352379cf82444fd099eca8bfc662789b/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=nwsaffds&maxFeatures=20000&outputFormat=application/json', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
})
.then(response => response.json())
.then(data => {
    // Transformar los datos a L.geoJSON
    layerCustom = L.geoJSON(data);
    console.log("Listo")

    // PRODUCTO ASM - HUMEDAD DEL SUELO
    $('#nwsaffg-asm').on('change', function () {
        if($('#nwsaffg-asm').is(':checked')){
            layerCustom.addTo(map);
            layerCustom.setStyle(style_ASM);
            layerCustom.bringToBack();
            legend_asm.addTo(map);
            if($('#nwsaffg-ffg').is(':checked')){ 
                $('#nwsaffg-ffg')[0].checked = false;
                map.removeControl(legend_ffg);
            }
            if($('#nwsaffg-fmap06').is(':checked')){ 
                $('#nwsaffg-fmap06')[0].checked = false;
                map.removeControl(legend_fmap06);
            }
            if($('#nwsaffg-fmap24').is(':checked')){ 
                $('#nwsaffg-fmap24')[0].checked = false;
                map.removeControl(legend_fmap24);
            }
            if($('#nwsaffg-ffr12').is(':checked')){ 
                $('#nwsaffg-ffr12')[0].checked = false;
                map.removeControl(legend_ffr12);
            }
            if($('#nwsaffg-ffr24').is(':checked')){ 
                $('#nwsaffg-ffr24')[0].checked = false;
                map.removeControl(legend_ffr24);
            }
        } else {
            map.removeControl(legend_asm);
        }
        var cond1 = !$('#nwsaffg-asm').is(':checked');
        var cond2 = !$('#nwsaffg-ffg').is(':checked');
        var cond3 = !$('#nwsaffg-fmap06').is(':checked');
        var cond4 = !$('#nwsaffg-fmap24').is(':checked');
        var cond5 = !$('#nwsaffg-ffr12').is(':checked');
        var cond6 = !$('#nwsaffg-ffr24').is(':checked');
        if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6){
            map.removeLayer(layerCustom);
        }
    });

    // PRODUCTO FFG - PRECIPITACION REQUERIDA PARA INUNDACION
    $('#nwsaffg-ffg').on('change', function () {
        if($('#nwsaffg-ffg').is(':checked')){
            layerCustom.addTo(map);
            layerCustom.setStyle(style_FFG);
            layerCustom.bringToBack();
            legend_ffg.addTo(map);
            if($('#nwsaffg-asm').is(':checked')){ 
                $('#nwsaffg-asm')[0].checked = false;
                map.removeControl(legend_asm);
            }
            if($('#nwsaffg-fmap06').is(':checked')){ 
                $('#nwsaffg-fmap06')[0].checked = false;
                map.removeControl(legend_fmap06);
            }
            if($('#nwsaffg-fmap24').is(':checked')){ 
                $('#nwsaffg-fmap24')[0].checked = false;
                map.removeControl(legend_fmap24);
            }
            if($('#nwsaffg-ffr12').is(':checked')){
                $('#nwsaffg-ffr12')[0].checked = false;
                map.removeControl(legend_ffr12);
            }
            if($('#nwsaffg-ffr24').is(':checked')){ 
                $('#nwsaffg-ffr24')[0].checked = false;
                map.removeControl(legend_ffr24);
            }
        } else {
            map.removeControl(legend_ffg);
        }
        var cond1 = !$('#nwsaffg-asm').is(':checked');
        var cond2 = !$('#nwsaffg-ffg').is(':checked');
        var cond3 = !$('#nwsaffg-fmap06').is(':checked');
        var cond4 = !$('#nwsaffg-fmap24').is(':checked');
        var cond5 = !$('#nwsaffg-ffr12').is(':checked');
        var cond6 = !$('#nwsaffg-ffr24').is(':checked');
        if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6){
            map.removeLayer(layerCustom);
        }
    });

    

    // PRODUCTO FMAP24 - PRONOSTICO DE PRECIPITACION A 24 HORAS
    $('#nwsaffg-fmap24').on('change', function () {
        if($('#nwsaffg-fmap24').is(':checked')){
            layerCustom.addTo(map);
            layerCustom.setStyle(style_FMAP24);
            layerCustom.bringToBack();
            legend_fmap24.addTo(map);
            if($('#nwsaffg-asm').is(':checked')){ 
                $('#nwsaffg-asm')[0].checked = false;
                map.removeControl(legend_asm);
            }
            if($('#nwsaffg-ffg').is(':checked')){ 
                $('#nwsaffg-ffg')[0].checked = false;
                map.removeControl(legend_ffg);
            }
            if($('#nwsaffg-fmap06').is(':checked')){ 
                $('#nwsaffg-fmap06')[0].checked = false;
                map.removeControl(legend_fmap06);
            }
            if($('#nwsaffg-ffr12').is(':checked')){ 
                $('#nwsaffg-ffr12')[0].checked = false;
                map.removeControl(legend_ffr12);
            }
            if($('#nwsaffg-ffr24').is(':checked')){ 
                $('#nwsaffg-ffr24')[0].checked = false;
                map.removeControl(legend_ffr24);
            }
        } else {
            map.removeControl(legend_fmap24);
        }
        var cond1 = !$('#nwsaffg-asm').is(':checked');
        var cond2 = !$('#nwsaffg-ffg').is(':checked');
        var cond3 = !$('#nwsaffg-fmap06').is(':checked');
        var cond4 = !$('#nwsaffg-fmap24').is(':checked');
        var cond5 = !$('#nwsaffg-ffr12').is(':checked');
        var cond6 = !$('#nwsaffg-ffr24').is(':checked');
        if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6){
            map.removeLayer(layerCustom);
        }
    });

    // PRODUCTO FMAP06 - PRONOSTICO DE PRECIPITACION A 06 HORAS
    $('#nwsaffg-fmap06').on('change', function () {
        if($('#nwsaffg-fmap06').is(':checked')){
            layerCustom.addTo(map);
            layerCustom.setStyle(style_FMAP06);
            layerCustom.bringToBack();
            legend_fmap06.addTo(map);
            if($('#nwsaffg-asm').is(':checked')){ 
                $('#nwsaffg-asm')[0].checked = false;
                map.removeControl(legend_asm);
            }
            if($('#nwsaffg-ffg').is(':checked')){ 
                $('#nwsaffg-ffg')[0].checked = false;
                map.removeControl(legend_ffg);
            }
            if($('#nwsaffg-fmap24').is(':checked')){ 
                $('#nwsaffg-fmap24')[0].checked = false;
                map.removeControl(legend_fmap24);
            }
            if($('#nwsaffg-ffr12').is(':checked')){ 
                $('#nwsaffg-ffr12')[0].checked = false;
                map.removeControl(legend_ffr12);
            }
            if($('#nwsaffg-ffr24').is(':checked')){ 
                $('#nwsaffg-ffr24')[0].checked = false;
                map.removeControl(legend_ffr24);
            }
        } else {
            map.removeControl(legend_fmap06);
        }
        var cond1 = !$('#nwsaffg-asm').is(':checked');
        var cond2 = !$('#nwsaffg-ffg').is(':checked');
        var cond3 = !$('#nwsaffg-fmap06').is(':checked');
        var cond4 = !$('#nwsaffg-fmap24').is(':checked');
        var cond5 = !$('#nwsaffg-ffr12').is(':checked');
        var cond6 = !$('#nwsaffg-ffr24').is(':checked');
        if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6){
            map.removeLayer(layerCustom);
        }
    });

    // RIESGO DE INUNDACION a 12 horas
    $('#nwsaffg-ffr12').on('change', function () {
        if($('#nwsaffg-ffr12').is(':checked')){
            layerCustom.addTo(map);
            layerCustom.setStyle(style_FFR12);
            layerCustom.bringToBack();
            legend_ffr12.addTo(map);
            if($('#nwsaffg-asm').is(':checked')){ 
                $('#nwsaffg-asm')[0].checked = false;
                map.removeControl(legend_asm);
            }
            if($('#nwsaffg-ffg').is(':checked')){ 
                $('#nwsaffg-ffg')[0].checked = false;
                map.removeControl(legend_ffg);
            }
            if($('#nwsaffg-fmap24').is(':checked')){ 
                $('#nwsaffg-fmap24')[0].checked = false;
                map.removeControl(legend_fmap24);
            }
            if($('#nwsaffg-fmap06').is(':checked')){ 
                $('#nwsaffg-fmap06')[0].checked = false;
                map.removeControl(legend_fmap06);
            }
            if($('#nwsaffg-ffr24').is(':checked')){ 
                $('#nwsaffg-ffr24')[0].checked = false;
                map.removeControl(legend_ffr24);
            }
        } else {
            map.removeControl(legend_ffr12);
        }
        var cond1 = !$('#nwsaffg-asm').is(':checked');
        var cond2 = !$('#nwsaffg-ffg').is(':checked');
        var cond3 = !$('#nwsaffg-fmap06').is(':checked');
        var cond4 = !$('#nwsaffg-fmap24').is(':checked');
        var cond5 = !$('#nwsaffg-ffr12').is(':checked');
        var cond6 = !$('#nwsaffg-ffr24').is(':checked');
        if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6){
            map.removeLayer(layerCustom);
        }
    });

    // RIESGO DE INUNDACION a 12 horas
    $('#nwsaffg-ffr24').on('change', function () {
        if($('#nwsaffg-ffr24').is(':checked')){
            layerCustom.addTo(map);
            layerCustom.setStyle(style_FFR12);
            layerCustom.bringToBack();
            legend_ffr24.addTo(map);
            if($('#nwsaffg-asm').is(':checked')){ 
                $('#nwsaffg-asm')[0].checked = false;
                map.removeControl(legend_asm);
            }
            if($('#nwsaffg-ffg').is(':checked')){ 
                $('#nwsaffg-ffg')[0].checked = false;
                map.removeControl(legend_ffg);
            }
            if($('#nwsaffg-fmap24').is(':checked')){ 
                $('#nwsaffg-fmap24')[0].checked = false;
                map.removeControl(legend_fmap24);
            }
            if($('#nwsaffg-fmap06').is(':checked')){ 
                $('#nwsaffg-fmap06')[0].checked = false;
                map.removeControl(legend_fmap06);
            }
            if($('#nwsaffg-ffr12').is(':checked')){ 
                $('#nwsaffg-ffr12')[0].checked = false;
                map.removeControl(legend_ffr12);
            }
        } else {
            map.removeControl(legend_ffr24);
        }
        var cond1 = !$('#nwsaffg-asm').is(':checked');
        var cond2 = !$('#nwsaffg-ffg').is(':checked');
        var cond3 = !$('#nwsaffg-fmap06').is(':checked');
        var cond4 = !$('#nwsaffg-fmap24').is(':checked');
        var cond5 = !$('#nwsaffg-ffr12').is(':checked');
        var cond6 = !$('#nwsaffg-ffr24').is(':checked');
        if(cond1 && cond2 && cond3 && cond4 && cond5 && cond6){
            map.removeLayer(layerCustom);
        }
    });
    
});



