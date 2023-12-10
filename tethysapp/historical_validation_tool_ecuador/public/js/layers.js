 // ------------------------------------------------------------------------------------------------------------ //
//                                             HTML FOR FLOOD ALERT                                             //
// ------------------------------------------------------------------------------------------------------------ //
const layersHTML = `<div class="control control-group">

                        <label class="label-control" for="select-warnings">ADVERTENCIAS</label>
                        <div class="alert-panel-checkbox">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="check-warning">
                                <label class="form-check-label" for="check-warning"> Alertas por lluvias y tormentas </label>
                            </div>
                        </div>

                        <label class="label-control" for="select-precipitation" style="padding-top:12px">GPM IMERG Early Run</label>
                        <div class="alert-panel-checkbox">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="check-pacum24">
                                <label class="form-check-label" for="check-pacum24"> Precipitación acumulada en 24h </label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="check-pacum48">
                                <label class="form-check-label" for="check-pacum48"> Precipitación acumulada en 48h </label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="check-pacum72">
                                <label class="form-check-label" for="check-pacum72"> Precipitación acumulada en 72h </label>
                            </div>
                        </div>

                        <label class="label-control" for="select-loc" style="padding-top:12px">NWSAFFGS</label>
                        <div class="alert-panel-checkbox">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="nwsaffg-asm">
                                <label class="form-check-label" for="nwsaffg-asm">Humedad media del suelo</label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="nwsaffg-ffg">
                                <label class="form-check-label" for="nwsaffg-ffg">Precipitación requerida para crecida</label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="nwsaffg-fmap06">
                                <label class="form-check-label" for="nwsaffg-fmap06">Pronóstico de precipitación (prox. 6h)</label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="nwsaffg-fmap24">
                                <label class="form-check-label" for="nwsaffg-fmap12">Pronóstico de precipitación (prox. 24h)</label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="nwsaffg-ffr12">
                                <label class="form-check-label" for="nwsaffg-ffr12">Riesgo de crecida (prox. 12h)</label>
                            </div>
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="nwsaffg-ffr24">
                                <label class="form-check-label" for="nwsaffg-ffr24">Riesgo de crecida (prox. 24h)</label>
                            </div>
                        </div> 
                    </div>
                    <br>`;

// Add HTML into the control panel
$("#layers")[0].innerHTML = layersHTML;











