var tiemporestante;
var cc_segundoslleva = 0;
var cc_minutostiene = 0;
var sincontatras = 0;

function toggleActs() {
  $("#moduloactividad").css("display", "none");
  $("#modulosocial").css("display", "none");
  $("#moduloactividades").css("display", "block");
}

function toggleSoc() {
  $("#moduloactividad").css("display", "none");
  $("#modulosocial").css("display", "block");
  $("#moduloactividades").css("display", "none");
}

function toggleAct() {
  $("#moduloactividad").css("display", "block");
  $("#modulosocial").css("display", "none");
  $("#moduloactividades").css("display", "none");
}

function verEjercicioAlumno(id) {
  jQuery.ajax({
    type: "POST",
    async: true,
    url: rutajs + "modulos/aca/lib/ajax-modulo.php",
    data: "&fn=verEjercicioAlumno&enc_idejercicio=" + id,
    success: function (data) {
      $("#viewejercicio .container-pregunta-actividad").html(data);
      $("#viewejercicio").modal();
    }
  });
}

function actualizaSuscripcion(hilo) {
  jQuery.ajax({
    type: "POST",
    async: false,
    url: rutajs + "modulos/debates/lib/ajax-debates.php",
    data: "fn=actualizaSuscripcion&enc_hilo=" + hilo,
    success: function (dato) {
      muestraMsgMain("success", trans("Opción guardada correctamente"));
    }
  });
}

function lanzarCuentaAtras(segundoslleva, minutostiene) {
  cc_segundoslleva = segundoslleva;
  cc_minutostiene = minutostiene;
  var horas;
  var minutos;
  var segundos;
  if (segundoslleva == 0) {
    if (minutostiene < 61) {
      horas = "00";
      minutos = minutostiene;
    } else {
      horas = parseInt(minutostiene / 60);
      minutos = minutostiene - horas * 60;
    }
    if (horas < 10) {
      horas = "0" + horas;
    }
    if (minutos < 10) {
      minutos = "0" + minutos;
    }
    segundos = "00";
  } else {
    segundostiene = minutostiene * 60;
    segudnoslequedan = segundostiene - segundoslleva;

    horas = Math.floor(segudnoslequedan / 3600);
    minutos = Math.floor((segudnoslequedan / 60) % 60);
    segundos = segudnoslequedan % 60;

    if (
      parseInt(horas) <= 0 &&
      parseInt(minutos) <= 0 &&
      parseInt(segundos) <= 0
    ) {
      clearInterval(rel);
      $("#auto").val("1");
      $("#frmtest-asg").submit();
    }
    if (horas < 10) {
      horas = "0" + horas;
    }
    if (minutos < 10) {
      minutos = "0" + minutos;
    }
    if (segundos < 10) {
      segundos = "0" + segundos;
    }

    if (segudnoslequedan < (segundostiene * 20) / 100) {
      $("#cuentaatras").addClass("cuentraatras20");
    }
  }
  if(!sincontatras){
    $("#cuentaatras .contador").html(horas + ':' + minutos + ':' + segundos);
  }else{
    $("#cuentaatras").html(
      '<div class="tiempo-preguntas">' +
        '<div class="tiempo-restante">' +
          '<span class="contador-sincontra">' +
            horas +
            ':' +
            minutos +
            ':' +
            segundos +
          '</span>' +
        '</div>' +
      '</div>'
    );
  }
}

function actReloj() {

  cc_segundoslleva = cc_segundoslleva + 1;
  lanzarCuentaAtras(cc_segundoslleva, cc_minutostiene);
}


function lanzarCuentaAtras_mint(segundoslleva, minutostiene) {
  cc_segundoslleva = segundoslleva;
  cc_minutostiene = minutostiene;
  var horas;
  var minutos;
  var segundos;

  hay = 1;

  if (segundoslleva == 0) {
    if (minutostiene < 61) {
      horas = "00";
      minutos = minutostiene;
    } else {
      horas = parseInt(minutostiene / 60);
      minutos = minutostiene - horas * 60;
    }
    if (horas < 10) {
      horas = "0" + horas;
    }
    if (minutos < 10) {
      minutos = "0" + minutos;
    }
    segundos = "00";
  } else {
    segundostiene = minutostiene * 60;
    segudnoslequedan = segundostiene - segundoslleva;

    horas = Math.floor(segudnoslequedan / 3600);
    minutos = Math.floor((segudnoslequedan / 60) % 60);
    segundos = segudnoslequedan % 60;

    if (
      parseInt(horas) <= 0 &&
      parseInt(minutos) <= 0 &&
      parseInt(segundos) <= 0
    ) {
      clearInterval(relmint);

      if($('#btnHeTerminado').length){
        $('#btnHeTerminado').removeAttr('disabled');
        $('#btnHeTerminado').removeClass('btn-default');
        $('#btnHeTerminado').addClass('btn-success');
        $('#btnHeTerminado').click(function (event) {
          $('#frmMarcaAct').submit();
        });
      }else{
        if($('#btnSubirsolucion').length){
          $('#btnSubirsolucion').removeAttr('disabled');
          $('#btnSubirsolucion').removeClass('btn-default');
          $('#btnSubirsolucion').addClass('btn-primary');
          $('#btnSubirsolucion').unbind("click");
        }else{
          if($('#comprobarRespuestas').length){
            $('#comprobarRespuestas').removeAttr('disabled');
            $('#comprobarRespuestas').removeClass('btn-default');
            $('#comprobarRespuestas').addClass('btn-success');
            $('#comprobarRespuestas').unbind("click");
          }else{
            if($('#btncrearpost').length){
              $('#btncrearpost').removeAttr('disabled');
              $('#btncrearpost').removeClass('btn-default');
              $('#btncrearpost').addClass('btn-success');
              $('#btncrearpost').unbind("click");
            }
          }
        }
      }
      $('#capa_tiempominimo').remove();



      //anotar el tiempo
      //anotaTiempoManual();
    }else{
      if ($('#btnHeTerminado').length) {
        $('#btnHeTerminado').click(function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
      } else {
        if ($('#btnSubirsolucion').length) {
          $('#btnSubirsolucion').click(function (event) {
            event.preventDefault();
            event.stopPropagation();
          });
        } else {
          if ($('#comprobarRespuestas').length) {
            $('#comprobarRespuestas').click(function (event) {
              event.preventDefault();
              event.stopPropagation();
            });
          } else {
            if ($('#btncrearpost').length) {
              $('#btncrearpost').click(function (event) {
                event.preventDefault();
                event.stopPropagation();
              });
            }
          }
        }
      }

    }

    if(horas<=0 && minutos<=0 && segundos<=0){ hay = 0; }

    if (horas < 10) {
      horas = "0" + horas;
    }
    if (minutos < 10) {
      minutos = "0" + minutos;
    }
    if (segundos < 10) {
      segundos = "0" + segundos;
    }
  }

  if(hay){
    $("#cuentaatras").html(
      horas +
      ":" +
      minutos +
      ":" +
      segundos
    );
  }else{
    $("#cuentaatras").html("00:00:00");
  }

}

function actReloj_mint() {
  cc_segundoslleva = cc_segundoslleva + 1;
  lanzarCuentaAtras_mint(cc_segundoslleva, cc_minutostiene);
}




function revisarRespuesta(num, intento, preg, tipo) {
  //miramos si ha marcado alguna sino es asi msg y no continuamos
  $("#slide" + num + " .btnrevisar").html("Corrigiendo...");

  marcada = 0;
  if (tipo == "radio") {
    $("#slide" + num + " input:radio").each(function (index) {
      if ($(this).is(":checked")) {
        marcada = 1;
      }
    });
  } else {
    $("#slide" + num + " input:checked").each(function (index) {
      if ($(this).is(":checked")) {
        marcada = 1;
      }
    });
  }

  if (!marcada) {
    /*$("#slide" + num + " .btnrevisar").html(
      '<svg class=""><use xlink:href="#i-check"></use></svg> ' + trans("Comprobar respuesta")
    );*/
    muestraMsgMain("info", trans("Debe seleccionar al menos una respuesta"));
  } else {
    $.when(autoguardarTest(false)).done(function () {
      jQuery.ajax({
        type: "POST",
        async: false,
        url: rutajs + "modulos/aca/lib/ajax-modulo.php",
        data: "&fn=revisaPregunta&enc_intento=" + intento + "&enc_preg=" + preg,
        success: function (data) {
          //console.log(data)
          res = data.split("##@##");
          //console.log(res);
          if (res[0] != "1") {
            if (res[1] == "1") {
              //acierto
              $("#li_enl_prg_" + num).removeClass("pill-00");
              $("#li_enl_prg_" + num).addClass("pill-01");
              $("#slide" + num + " .titulo-pregunta-test").css("fill", "#118a6e").css("color", "#118a6e");
              ahora = $("#slide" + num + " .titulo-pregunta-test .orden-pregunta").html();
              $("#slide" + num + "  .titulo-pregunta-test .orden-pregunta").html(
                '<svg class=""><use xlink:href="#i-check"></use></svg> ' + ahora
              );
            } else {
              //fallo
              $("#li_enl_prg_" + num).removeClass("pill-00");
              $("#li_enl_prg_" + num).addClass("pill-02");
              $("#slide" + num + " .titulo-pregunta-test").css("fill", "#bb1414").css("color", "#bb1414");
              ahora = $("#slide" + num + "  .titulo-pregunta-test .orden-pregunta").html();
              $("#slide" + num + "  .titulo-pregunta-test .orden-pregunta").html(
                '<svg class=""><use xlink:href="#i-cerrar"></use></svg> ' + ahora
              );
              //ademas si es fallo recorremos las respuestas para saber cual selecciono y la clase resptestincorrecta
              $("#slide" + num + " .input-test").each(function () {
                if (
                  $(this)
                    .find("input")
                    .is(":checked")
                ) {
                  $(this).addClass("resptestincorrecta");
                }
              });
            }
            //dividimos resp correctas
            rreesspp = res[2].split(",");
            for (var i = 0; i < rreesspp.length; i++) {
              $("#liresp" + rreesspp[i]).addClass("resptestcorrecta");
            }
            if (res[3] != "") $("#explic" + num).html(res[3]);
          }

          $("#slide" + num + " .btnrevisar").remove();

          $("#slide" + num + " input:radio").attr("disabled", "disabled");
          $("#slide" + num + " input:checkbox").attr("disabled", "disabled");
        }
      });
    });
  }
}

function eventosMarcarRespuesta(intento, pregunta, respuesta, respsiempre, contador, ocultaNota, idPregunta, input) {

  var yaEstaSeleccionada = document.getElementById('yaSeleccionada'+pregunta);
  var spanTotalRespuestasSeleccionadas = '';
  var totalRespuestasSeleccionadas = '';
  var totalRespuestas = '';
  var totalRespuestasCheckSeleccionadas = 0;
  var divCuentaAtras = document.getElementById('cuentaatras');

  if(divCuentaAtras != null) {
    var spanTotalRespuestasSeleccionadas = document.getElementById('numerorespuestas');
    var totalRespuestasSeleccionadas = parseInt(spanTotalRespuestasSeleccionadas.textContent);
    var totalRespuestas = parseInt(document.getElementById('totalrespuestas').textContent);
  }

  var inp=$(input);

  if (input.classList.contains('theone')) {
    inp.prop('checked',false).removeClass('theone');

    $('.respchk'+idPregunta).each(function() {
      if (this.checked) {
        totalRespuestasCheckSeleccionadas++;
      }
    });
    if (totalRespuestasCheckSeleccionadas == 0) {
      totalRespuestasSeleccionadas--;
      yaEstaSeleccionada.value = 0;
    }

    spanTotalRespuestasSeleccionadas.innerHTML = totalRespuestasSeleccionadas;

    if (ocultaNota == '1') {
      $('#li_enl_prg_' + contador).removeClass('pill-03');
      $('#li_enl_prg_' + contador).addClass('pill-00');
    }
  } else {
      if(totalRespuestasSeleccionadas < totalRespuestas && yaEstaSeleccionada.value == 0){
        totalRespuestasSeleccionadas++;
        yaEstaSeleccionada.value = 1;
      }
      spanTotalRespuestasSeleccionadas.innerHTML = totalRespuestasSeleccionadas;
      $('input:radio[name=\''+inp.prop('name')+'\'].theone').removeClass('theone'); //quita la clase de los otros inputs
      inp.addClass('theone');
      respuesta = respsiempre;

      if (ocultaNota == '1') {
        $('#li_enl_prg_' + contador).removeClass('pill-00');
        $('#li_enl_prg_' + contador).addClass('pill-03');
      }
  }


  if($('.rsp'+idPregunta+':checked').length){
    $('#slide'+ contador +' .btnrevisar').removeAttr('disabled');
  }else{
    $('#slide'+ contador +' .btnrevisar').attr('disabled','true');
  }

  marcaRespuesta(intento, pregunta, respuesta, respsiempre);
}

function marcaRespuesta(intento, pregunta, respuesta, respsiempre) {

  $(".btnrevisar").css('visibility', 'hidden');
  jQuery.ajax({
    type: "POST",
    async: true,
    url: rutajs + "modulos/aca/lib/ajax-modulo.php",
    data:
      "&fn=guardarRespTemporal&enc_intento=" +
      intento +
      "&enc_pregunta=" +
      pregunta +
      "&enc_respuesta=" +
      respuesta +
      "&enc_respsiempre=" +
      respsiempre +
      "&segundos=" +
      cc_segundoslleva,
    success: function (data) {
      $(".btnrevisar").css("visibility", "");
     },
    error: function(jqXHR, exception) {
      muestraMsgMain("error", trans("Error al guardar la respuesta"));
    }
  });
}

function autoguardarTest(asy) {
  /*var frmdata = $("#frmtest-asg input").serialize();
  if (asy !== false) asy = true;
  jQuery.ajax({
    type: "POST",
    async: asy,
    url: rutajs + "modulos/aca/lib/ajax-modulo.php",
    data: frmdata + "&fn=guardarTemporal&segundos=" + cc_segundoslleva,
    success: function (data) {
      if (data == "false") {
        $(window).location.href = $(window).location.href;
      }
    }
  });
  timer = setTimeout("autoguardarTest()",30000);*/
}

function validarTest(total) {
  autoguardarTest();
  var cant = 0;
  $(".respuesta-radio").each(function () {
    //todos los que sean de la clase row1
    if ($(this).is(":checked")) {
      cant++;
    }
  });

  if (cant == 0) {
    alertJS(trans("Debes marcar al menos una respuesta"));
    return false;
  }

  if (cant < total) {
    confirmJS(
      trans("De las %1 preguntas has dejado vacias %2 ¿Seguro que desea enviar el test?", { "%1": total, "%2": total - cant }),
      function () {
        NLD();
        return false;
      },
      function () {
        LD();
        $("#auto").val(1);
        $("#frmtest-asg").submit();
      },
      [trans('cancelar', null, null, null, 'ucfirst'), trans('continuar', null, null, null, 'ucfirst')]
    );
  } else {
    LD();
    $("#auto").val(1);
    $("#frmtest-asg").submit();
  }
  return false;
}

function cargarPreguntaControl(idactividad) {
  jQuery.ajax({
    type: "POST",
    async: false,
    url: rutajs + "modulos/aca/lib/ajax-modulo.php",
    data: "fn=preguntacontrol&enc_idactividad=" + idactividad,
    success: function (data) {
      if (data != "") {
        $("#heterminado").toggle();
        $("#preguntadecontrol").css("display", "block");
        $("#preguntadecontrol").html(data);

        $(".tipografialibro").toggle(500);
      }
    }
  });
}

function validarSolucion() {

  let questionsContainers = document.querySelectorAll('.clpreguntas');
  let totalQuestions = questionsContainers.length;
  let counterByQuestionWithAnswer = 0;
  let arrCkeditorInstances = Object.values(CKEDITOR.instances);
  let i = 0;

  questionsContainers.forEach(container => {
    let inputHasValue = false;
    let inputsInContainer = document.querySelectorAll("#"+container.id+" input[name*='adjresppreg']");
    let inputTextIsRequired = document.querySelector('#'+container.id+" textarea").classList.contains('actividad-obligatoria') ? true : false;

    if (inputTextIsRequired && arrCkeditorInstances[i].getData() != "") {
      inputHasValue = true;
    }

    if (!inputTextIsRequired) {
      inputsInContainer.forEach(input => {
        if (input.value != "") {
          inputHasValue = true;
        }
      });
    }

    if (inputHasValue) {
      counterByQuestionWithAnswer++;
    }

    i++;
  });

  if (totalQuestions == counterByQuestionWithAnswer) {
    return true;
  }

  muestraMsgMain(
    "error",
    trans("Debe completar los campos obligatorios")
  );
  return false;

  /* var ok;


  ok = "si";

  tot = 0;
  tot_resp = 0;
  i1 = 0;
  i2 = 0;
  i_inpaudio = 0;
  i_adjunto = 0;


  $("input[name*='idpreguntaej']").each(function (index, element) {
    val = $(this).val();
    resp = 0;
    tot = tot + 1;
    i1 = index;

    tipo = 0;
    //miramos si es de adjutno o texto
    $("input[name*='bexterno']").each(function (index_tipo, element_tipo) {
      i2 = index_tipo;

      if (i1 == i2) {
        tipo = $(this).val();
      }
    });

    switch(tipo){
      case '1':
        //obliga adjunto
        $("input[name*='adjresppreg']").each(function (index3, element3) {
          if (i_adjunto == index3) {
            if ($(this).val() != "") {
              resp = 1;
            }
          }
        });
        break;
      case '2':
        encontrado = 0;
        $(".hiddenaudio[name*='adjresppreg']").each(function (index3, element3) {
          if (i_inpaudio == index3) {
            if ($(this).val() != "") {
              resp = 1;
              encontrado = 1;
            }
          }
        });
        if(encontrado == 0){
          //no ha grabado audio miramos si ha adjuntado
          $(".cajasubiraudio input[name*='adjresppreg']").each(function (index3, element3) {
            if (i_inpaudio == index3) {
              if ($(this).val() != "") {
                resp = 1;
              }
            }
          });
        }
        break;
      default:
        $("textarea[name*='txtresppreg']").each(function (index2, element2) {
          i2 = index2;

          if (i1 == i2) {
            val2 = $(this);
            encontrado = 0;
            for (var i in CKEDITOR.instances) {
                if(i==$(val2).attr('id') && CKEDITOR.instances[i].getData()){
                  resp = 1;
                }
            }
          }
        });
    }

    if(resp && tipo!=2){ i_adjunto = i_adjunto + 1; }
    if(resp && tipo==2){ i_inpaudio=i_inpaudio+1; }



    tot_resp = tot_resp + resp;
  });


  //return false;
  if(tot != tot_resp){
        ok = 'no';
  }

  if (ok == "si") {
    return false;
  } else {
    muestraMsgMain(
      "error",
      trans("Debe completar los campos obligatorios")
    );
    return false;
  } */
}

function cambiaTamTexto(valor) {
  jQuery.ajax({
    type: "POST",
    async: true,
    url: rutajs + "modulos/aca/lib/ajax-modulo.php",
    data: "fn=cambiaTamTexto&valor=" + valor,
    success: function (data) {
      $("#p-contenido").css("font-size", data + "%");
    }
  });
}

function cargaObjetivos(ruta, matricula) {
  jQuery.ajax({
    type: "POST",
    async: false,
    url: rutajs + "modulos/aca/lib/ajax-modulo.php",
    data:
      "fn=cargaobjetivosfefe&enc_ruta=" + ruta + "&enc_matricula=" + matricula,
    success: function (data) {
      $("#p-contenido").html(data);
    }
  });
}

function marcaresptest(idpreg) {
  jQuery.each($("#ulpreg" + idpreg + " li"), function () {
    if ($("#" + $(this).attr("id") + " input")[0].checked) {
      $(this).addClass("respmarcada");
    } else $(this).removeClass("respmarcada");
  });
}

function crearHilo() {
  var ok = "si";

  if ($("#n_titulodebate").val() == "") {
    ok = "no";
  }

  if (ok == "si") {
    return true;
  } else {
    mostrarAlerta(
      "error",
      trans("Rellene el titulo del debate y el desarrollo del mismo")
    );
    return false;
  }
}

function lanzaTemaPDF(id) {
  jQuery.ajax({
    type: "POST",
    async: false,
    url: rutajs + "modulos/aca/pdfunidad.php?id=" + id,
    success: function (data) {
      $("#descargandopdf").toggle();
    }
  });
}

function resetNewPost() {
  $('#capaNuevoDebate').hide();
  $('#container-boton-nuevo-debate').show();
  document.querySelectorAll('#btnnuevomensaje').forEach(function (e) { e.classList.remove('boton-activo'); });
}

function resetReplyPosts() {
  document.querySelectorAll('div[id^=reply-row-preg-]').forEach(function (e) { e.remove(); });
  document.querySelectorAll('a[id^=boton-citar-]').forEach(function (e) { e.classList.remove('boton-activo'); });
}

function resetEditPosts() {
  document.querySelectorAll('div[id^=edit-row-preg-]').forEach(function (e) { e.remove(); });
  document.querySelectorAll('a[id^=boton-editar-]').forEach(function (e) { e.classList.remove('boton-activo'); });
}

function citarPost(idPost, idPostRespuesta, usuario) {
  const containerPost = 'row-preg-' + idPost;
  const containerReply = 'reply-' + containerPost;
  const buttonReply     = 'boton-citar-' + idPost;

  if (document.getElementById(containerReply) !== null) return;

  resetNewPost()
  resetReplyPosts()
  resetEditPosts()

  document.getElementById(buttonReply).classList.add('boton-activo');

  jQuery.ajax({
    type: 'POST',
    async: false,
    url: rutajs + 'modulos/aca/lib/ajax-modulo.php',
    data : 'fn=capaResponderCitando&containerReply=' + containerReply + '&idPostRespuesta=' + idPostRespuesta
        + '&idPost=' + idPost,
    success: function(data) {
      document.getElementById(containerPost).insertAdjacentHTML('afterend', data);
      document.getElementById(containerReply).style.display = 'block';

      if (typeof usuario != "undefined") {
        $('#' + containerReply + " #citado").html(
            trans("citando a", null, null, null, "ucfirst") + ": <b>" + usuario + "</b>"
        );
        $('#' + containerReply + " #citado").show();
      } else $('#' + containerReply + " #citado").hide();

      goTo(containerReply);

      CKEDITOR.replace("n_detalledebate-" + idPost, {
        customConfig:
            getRutaCKEditor() + "config_basic.js?vs=" + Math.random() * 100,
        language: keys_ckeditor[idevolLang]
      });
    }
  });
}

function editarPost(idPost, idUsuario) {
  const containerPost = 'row-preg-' + idPost;
  const containerEdit = 'edit-' + containerPost;
  const buttonEdit     = 'boton-editar-' + idPost;

  if (document.getElementById(containerEdit) !== null) return;

  resetNewPost()
  resetReplyPosts()
  resetEditPosts()

  document.getElementById(buttonEdit).classList.add('boton-activo');

  jQuery.ajax({
    type: 'POST',
    async: false,
    url: rutajs + 'modulos/aca/lib/ajax-modulo.php',
    data : 'fn=capaEditarPost&containerEdit=' + containerEdit + '&idPost=' + idPost,
    success: function(data) {
      document.getElementById(containerPost).insertAdjacentHTML('afterend', data);
      document.getElementById(containerEdit).style.display = 'block';

      $('#' + containerEdit + " #post_editar").val(idPost);
      $('#' + containerEdit + " #iduserpost").val(idUsuario);

      $('#' + containerEdit + ' #m_detalledebate').val($('#' + containerPost + ' #tped' + idPost).val());
      goTo(containerEdit);

      CKEDITOR.replace("m_detalledebate", {
        customConfig:
            getRutaCKEditor() + "config_basic.js?vs=" + Math.random() * 100,
        language: keys_ckeditor[idevolLang]
      });
    }
  });
}

function modificarPost(idpost,idsp) {
  $("#capaNuevoDebate").hide();
  $("#capa-nuevo-debate").hide();

  $("#post_editar").val(idpost);
  $("#iduserpost").val(idsp);
  $("#citado").hide();

  $('#m_detalledebate').val($('#tped'+idpost).val());

  CKEDITOR.replace("m_detalledebate", {
    customConfig:
      getRutaCKEditor() + "config_basic.js?vs=" + Math.random() * 100,
    language: keys_ckeditor[idevolLang]
  });
  $('#capa-mod-debate').show();
  $([document.documentElement, document.body]).animate({
    scrollTop: $('#capa-mod-debate').offset().top
  }, 1000);
  $(this).remove();
}

function cancelEdicionDeb() {
  $("#capaNuevoDebate").show();
  $("#capa-nuevo-debate").show();
  $('#capa-mod-debate').hide();
  $([document.documentElement, document.body]).animate({
    scrollTop: 0
  }, 200);
}


function nuevoPost() {
  const containerNew = 'capaNuevoDebate';
  const buttonNew  = 'btnnuevomensaje';

  resetReplyPosts();
  resetEditPosts();

  document.getElementById(buttonNew).classList.add('boton-activo');

  jQuery.ajax({
    type: 'POST',
    async: false,
    url: rutajs + 'modulos/aca/lib/ajax-modulo.php',
    data : 'fn=capaNuevoPost',
    success: function(data) {
      document.getElementById(containerNew).innerHTML = data
      document.getElementById(containerNew).style.display = 'block';

      $('#' + containerNew + " #citado").hide();

      alturaCabecera = $('#navbarcampus').height() + ($('#navbaraula').length ? $('#navbaraula').height() / 2 : 0);
      goTo(containerNew);
      $("#" + containerNew).slideDown();

      CKEDITOR.replace("n_detalledebate", {
        customConfig:
            getRutaCKEditor() + "config_basic.js?vs=" + Math.random() * 100,
        language: keys_ckeditor[idevolLang]
      });
    }
  });
}

function cargaRespuestasMuro(idPost, idMatricula, bDebateCerrado) {
  resetNewPost()
  resetReplyPosts()
  resetEditPosts()

  if ($("#condicionDivRespuestas"+idPost).val() == 0) {
      jQuery.ajax({
          type: 'POST',
          async: false,
          url: rutajs + 'modulos/aca/lib/ajax-modulo.php',
          data : 'fn=cargarespuestasmuro&enc_idPost='+idPost+'&enc_idMatricula='+idMatricula+'&bDebateCerrado='+bDebateCerrado,
          success: function(data) {
              $("#respuestasMuro" + idPost).html(data);
              $("#respuestasMuro" + idPost).show();
              $("#verRespuestas" + idPost).hide();
              $("#ocultarRespuestas" + idPost).show();
              $("#condicionDivRespuestas").val(1);
          }
      });
  } else {
      $("#respuestasMuro" + idPost).show();
      $("#verRespuestas" + idPost).hide();
      $("#ocultarRespuestas" + idPost).show();
  }
}

function ocultarRespuestasMuro(idPost) {
  resetNewPost()
  resetReplyPosts()
  resetEditPosts()
  $("#respuestasMuro" + idPost).hide();
  $("#verRespuestas" + idPost).show();
  $("#ocultarRespuestas" + idPost).hide();
}

function close() {
  return false;
}

function actTiemposParticipante(actividad,modulo,grupo,matricula) {
  jQuery.ajax({
    type: "POST",
    async: false,
    url: rutajs + "modulos/aca/lib/ajax-modulo.php",
    data: "&fn=actTiemposParticipante&enc_actividad=" + actividad + "&enc_modulo=" + modulo + "&enc_grupo=" + grupo + "&enc_matricula=" + matricula,
    success: function (data) {
      const datos = data.split("##ev##");
      if(!empty(data)){
        const datos = data.split("##ev##");
        cc_minutostiene = parseInt(datos[0]);
        cc_segundoslleva = parseInt(datos[1]);
        if (cc_minutostiene<=180) {
          $('#cuentaatras').show();
      }
      }
    }
  });
}

function descuentaTiempoTest(enc_idintento, enc_seg, enc_tgastados, enc_tref, actividad, modulo, grupo, matricula) {
  jQuery.ajax({
    type: "POST",
    async: false,
    url: rutajs + "modulos/aca/lib/ajax-modulo.php",
    data:
      "fn=descuentaTiempoTest&enc_seg=" +
      enc_seg +
      "&enc_idintento=" +
      enc_idintento +
      "&enc_tgastados=" +
      enc_tgastados +
      "&enc_tref=" +
      enc_tref +
      "&enc_actividad=" + actividad + "&enc_modulo=" + modulo + "&enc_grupo=" + grupo + "&enc_matricula=" + matricula,
    success: function (data) {
      if(parseInt(data)>0){
        cc_segundoslleva = parseInt(data);
      }
    },
  });
}

function descargarTest(idIntento, idActividad, fecha, tituloActividad) {
  jQuery.ajax({
    type: "POST",
    async: true,
    url: "/../../gestion/modulos/docencia/descargaintento.php",
    xhrFields: {
      responseType: 'blob'
    },
    data:
      "&enc_idintento=" +
      idIntento +
      "&enc_b_actividad=" +
      idActividad,
    success: function (data) {
      var blob = new Blob([data], { type: 'application/pdf' });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = trans("IntentoTest") + " " + tituloActividad + " " + fecha + ".pdf";
      link.click();
      window.URL.revokeObjectURL(link);
    }
  });
}

function agregarMarcaAgua(emailUsuario) {
  let sheet = document.createElement('style')
  let styleContent = `
    .container-actividad-marca{
        position: relative;
    }

    .container-actividad-marca:after{
      background-size: 550px;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      //background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='230' height='106' viewBox='0 0 230 106'><g id='marca-agua' transform='matrix(0.966, -0.259, 0.259, 0.966, -611.493, -92.528)'><rect width='224' height='50' transform='translate(551.704 303.641)' fill='rgba(255,255,255,0)'/><text transform='translate(663.794 333.313)' fill='rgba(0,0,0,0.17)' font-size='12' font-family='ArialMT, Arial'><tspan x='-98.795' y='0'>${emailUsuario}</tspan></text></g></svg>");
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='374.475' height='159.514' viewBox='0 0 374.475 159.514'><g transform='matrix(0.966, -0.259, 0.259, 0.966, -538.91, -65.907)'><rect width='370' height='66' transform='translate(478.704 295.641)' fill='rgba(255,255,255,0)'/><text transform='translate(663.794 333.313)' fill='rgba(0,0,0,0.12)' font-size='12' font-family='ArialMT, Arial'><tspan x='-98.795' y='0'>${emailUsuario}</tspan></text></g></svg>");
      pointer-events: none;
    }`;

  sheet.innerHTML = styleContent;
  document.head.appendChild(sheet);

  let elemToObserve = document.querySelector('.container-actividad-marca');
  let observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.attributeName == "class" && !mutation.target.classList.contains('container-actividad-marca')){
        location.reload();
      }
    });
  });
  observer.observe(elemToObserve, {attributes: true})

  document.addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
      let style = document.createElement('style');
      style.id = 'styleInsideIframe';
      style.innerText = styleContent;
      document.fullscreenElement.contentWindow.document.head.appendChild(style);
      document.fullscreenElement.contentWindow.document.getElementById("viewer").classList.add("container-actividad-marca");

    } else {
      let styleToRemove = document.getElementById('viewer').contentWindow.document.getElementById("styleInsideIframe");
      document.getElementById('viewer').contentWindow.document.head.removeChild(styleToRemove);
    }
  });

}

window.addEventListener('message', event => {
  if (event.origin === 'https://pdfplayer.evolcampus.com' || event.origin === rutaweb) {
    const idActividad = document.getElementById('idActividad').value
    const idMatricula = document.getElementById('idMatricula').value

    if (idActividad != "" && idMatricula != "") {
      savePdfCurrentPage(idActividad, idMatricula, event.data.currentPage)
    }
  }
});

function savePdfCurrentPage(idActividad, idMatricula, currentPage) {
  const dataBody =  {
    "fn": "savePdfCurrentPage",
    "enc_idActividad": idActividad,
    "enc_idMatricula": idMatricula,
    "currentPage": currentPage
  }

  $.ajax({
    type: "POST",
    url: "/campus/modulos/aca/lib/ajax-modulo.php",
    data: dataBody,
    success: function(data) {
      //console.log(data)
    }
  });
}
