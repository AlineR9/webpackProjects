var evolChat = (function () {

    // las funciones publicas abajo del todo

    // private
    var _optionsDefault = {urlServer : 'https://chatserver.evolcampus.com', urlAjax : '/'}

    // eventos privados
    var _onConnect = function () {
        //console.log('_onConnect....');
    }

    var _onReconnect = function () {
        //console.log('_onReconnect..')
        //_reInit(evolChat.options)
        __destruir();
    }

    var _onComplete = function () {
        if (!evolChat.socket.connected) {
            __destruir();
        }
    }

    var _onDisconnect = function () {
        //console.log('_onDisconnect....');
        __desconectado();
    }

    var _onConectado = function (data) {
        //$('#aaa').show();
        evolChat.socket.usuario = data.usuario;
    }

    var _onReceive = function (data) {
        if (data.sala.idSala != __getIdSalaActual()) {
            __pintaNumeroPendientesSala(data);
            beep();
        } else {
            __pintaMsj(data.msj);
            $('#chat-msjs').scrollTop($('#chat-msjs')[0].scrollHeight)
        }
    }

    var _onCargaMensajes = function(data) {
        $('#chat-chat .chat-cargando').fadeOut();
        $('#chat-cajamsjnueva').fadeOut();
        $('#chat-cajamsj').fadeIn();

        __borraNumeroPendientesSala(data.sala);
        __cabeceraSala(data.sala)
        for (var i=0; i < data.msjs.length; i++) {
            __pintaMsj(data.msjs[i]);
        }
        setTimeout(function() {
            __calcHeight();
            var container = $('#chat-chat .chat-secciones-cuerpo');
            container.slimScroll({scrollTo : container[0].scrollHeight })
        }, 500);
    }

    var _onCargaSalas = function (data) {

        //eliminar temporal
        $('#chat-salas .chat-cargando').remove();
        $('#chat-usuarios .chat-cargando').remove();

        if(data.salas.length > 0) {
            //$('#chat-salas').append('<ul/>');
            for(var i=0; i < data.salas.length; i++) {

                __pintaLineaSala(data.salas[i]);

                __pintaUsuariosSala(data.salas[i], data.salas[i].usuarios);
                __pintaUsuariosConectadosSala(data.salas[i], data.salas[i].conectados)
                //__actualizaConectadosGrupo(data.salas[i]);
                evolChat.socket.emit('entraSala', {idSala : data.salas[i].idSala});
            }

            __actualizaNumPendientesTotales();

        } else {
            __destruir();
        }
    }

    var _onDesconectadoSala = function(data) {
        __usuarioSala(data.sala, data.usuario, 0);
        __actualizaConectadosGrupo(data.sala);
    }

    var _onConectadosSala = function(data) {
        for (var i=0; i < data.usuarios.length; i++) {
            __usuarioSala(data.sala, data.usuarios[i], 1);
        }
        __actualizaConectadosGrupo(data.sala);
    }

    var _onCargaSalaNueva = function(data) {
        __pintaUsuariosSala(data.sala, data.sala.usuarios);
        evolChat.socket.emit('entraSala', {idSala : data.sala.idSala});
        if (data.sala.creador == evolChat.socket.usuario.id) {
            __cargaSala(data.sala.idSala);
        }
        __actualizaConectadosGrupo(data.sala);
    }
    // fin eventos privados

    // funciones privadas
    var __safeDecode = function(txt) {
        try {
            txt = decodeURIComponent(escape(txt));
        } catch (e) {
        }
        return txt;
    }


    var __setIdSalaActual = function(idSala) {
        evolChat.socket.idSalaActual = idSala;
    }

    var __getIdSalaActual = function() {
        return evolChat.socket.idSalaActual;
    }

    var __msj = function() {
        var txt = $('#chat-frmmsj');
        var txtval = $.trim(txt.val());
        if(txtval.length > 0) {
            var msj = {
                usuario : evolChat.socket.usuario,
                numMsj : 1,
                texto : txtval
            }
            __pintaMsj(msj);
            evolChat.socket.emit('msj', {texto : escape(msj.texto)});
        }
        txt.val('');
        var container = $('#chat-chat .chat-secciones-cuerpo');
        container.slimScroll({scrollTo : container[0].scrollHeight })

    }
    var __cargaSala = function(idSala) {
        var chatmsjs = $('#chat-msjs');
        chatmsjs.empty().append('<ul />');
        __cambiaSeccion('chat-chat')
        __setIdSalaActual(idSala);

        $('#chat-chat .chat-cargando').fadeIn();

        evolChat.socket.emit('cargaSala', {idSala : idSala});
    }
    var __usuarioSala = function(sala, usuario, entra) {

        var grupousuarios = $('.chat-ligrupousuarios[data-chat-grupo-id="'+sala.idGrupo+'"]');
        //var grupousuarios = $('#chat-grupousuarios-'+sala.idGrupo);
        var liusuario = grupousuarios.find('ul li[data-chat-usuario-id="'+usuario.id+'"]');

        if (!liusuario.length) {
		//console.log("no existe, sale");
            return;
            __pintaUsuarioSala(sala, usuario);
            liusuario = grupousuarios.find('ul li[data-chat-usuario-id="'+usuario.id+'"]');
        }

        if (entra) {
            if (liusuario.hasClass('noconectado')) {
                //console.log(sala, usuario, liusuario.data());
                liusuario.removeClass('noconectado');
            }
        } else {
            if (!liusuario.hasClass('noconectado')) {
                liusuario.addClass('noconectado');
            }
        }

        if (usuario.id == evolChat.socket.usuario.id) {
            liusuario.removeClass('noconectado').addClass('noconectado');
        }

        if (sala.idSala == evolChat.socket.idSalaActual
            && sala.idModulo == null) {
            if (entra) {
                $('#chat-cajamsj .conectadosGrupo').html('<i class="fa fa-check-circle"></i> '+trans('conectado'));
            } else {
                $('#chat-cajamsj .conectadosGrupo').html('<i class="fa fa-circle"></i> '+trans('no conectado'));
            }

        }

        // ordenar
        var sortli = function(a,b) {
            return (!$(b).hasClass('noconectado') && $(a).hasClass('noconectado')) ? 1 : -1;
        }
        var ulpadre = liusuario.parents('ul');
//console.log('apend', ulpadre)
        //ulpadre.find('li').sort(sortli).appendTo(ulpadre);
    }

    var __pintaLineaSala = function(sala) {
        if (sala.idModulo == null)
            return;

        sala.estudio = __safeDecode(sala.estudio);
        sala.grupo = __safeDecode(sala.grupo);
        sala.nombre = __safeDecode(sala.nombre);

        var ligrupo = $('#chat-salas .chat-secciones-cuerpo').find('div[data-chat-grupo-id="'+sala.idGrupo+'"]');
        if (ligrupo.length == 0) {
            ligrupo = $('<div class="chat-ligruposala" data-chat-grupo-id="'+sala.idGrupo+'">'+
                '<a href="javascript:;" class="desplegar"><i class="fa fa-angle-double-down"></i></a>'+
                '<div class="chat-grupo-cab">'+
                    '<span class="chat-grupo-nombre"></span>'+
                    '<span class="conectadosGrupo">'+trans('ningún usuario conectado')+'</span>'+
                '</div></div>');
            ligrupo.find('a.desplegar').on('click', function(e) {
                e.preventDefault();
                $(this).find('i').toggleClass('fa-angle-double-down').toggleClass('fa-angle-double-up');
                $(this).parents('div.chat-ligruposala').find('ul').toggle('fast')
            });
            ligrupo.find('.chat-grupo-cab').on('click', function(e) {
                e.preventDefault();
                $(this).parent().find('i').toggleClass('fa-angle-double-down').toggleClass('fa-angle-double-up');
                $(this).parents('div.chat-ligruposala').find('ul').toggle('fast')
            });

            ligrupo.find('.chat-grupo-nombre').text(sala.estudio+' ('+sala.grupo+')');
            $('#chat-salas .chat-secciones-cuerpo').append(ligrupo);
            ligrupo = $('#chat-salas .chat-secciones-cuerpo').find('div[data-chat-grupo-id="'+sala.idGrupo+'"]');

            // lo mismo para compañeros
            ligrupousuario = $('<div class="chat-ligrupousuarios" data-chat-grupo-id="'+sala.idGrupo+'">'+
                '<span class="badge badge-warning chat-msjsSala"></span>'+
                    '<a href="javascript:;" class="desplegar"><i class="fa fa-angle-double-up"></i></a>'+
                    '<div class="chat-grupo-cab"><span class="chat-grupo-nombre"></span>'+
                    '<span class="conectadosGrupo">'+trans('ningún usuario conectado')+'</span>'+
                    '</div><div class="chat-lineas" style="display:none"></div></div>');
            ligrupousuario.find('a.desplegar').on('click', function(e) {
                e.preventDefault();
                $(this).find('i').toggleClass('fa-angle-double-up').toggleClass('fa-angle-double-down');
                $(this).parents('div.chat-ligrupousuarios').find('.chat-lineas').toggle('fast')
            });
            ligrupousuario.find('.chat-grupo-cab').on('click', function(e) {
                e.preventDefault();
                $(this).parent().find('i').toggleClass('fa-angle-double-up').toggleClass('fa-angle-double-down');
                $(this).parents('div.chat-ligrupousuarios').find('.chat-lineas').toggle('fast')
            });

            ligrupousuario.find('.chat-grupo-nombre').text(sala.estudio+' ('+sala.grupo+')');
            var profes = $('<div class="chat-grupousuarios-profes" style="display:none"><span>Profesores</span><ul class="list-unstyled"></ul></div>')
            var alumnos = $('<div class="chat-grupousuarios-alumnos" style="display:none"><span>Alumnos</span><ul class="list-unstyled"></ul></div>')
            ligrupousuario.find('.chat-lineas').append(profes);
            ligrupousuario.find('.chat-lineas').append(alumnos);
            $('#chat-usuarios .chat-secciones-cuerpo').append(ligrupousuario);
        }

        if (sala.idModulo != null) {

            var ulgrupo = ligrupo.find('ul');
            if (!ulgrupo.length) {
                ulgrupo = $('<ul class="list-unstyled" />');
                ligrupo.append(ulgrupo);
            }

            var li = $(
                '<li> '+
                '   <a href="javascript:;"> '+
                '       <i class="fa fa-users"></i> '+
                //'       <img class="pull-left img-polaroid img-circle img-responsive chat-img" src="/web/images/avatar.gif"> '+
                '       <b></b><span class="badge badge-warning chat-msjsSala"></span>' +
                '   </a> '+
                '</li>');
        } else {

            var ulgrupo = ligrupo.find('ul');
            if (!ulgrupo.length) {
                ulgrupo = $('<ul class="list-unstyled" />');
                ligrupo.append(ulgrupo);
            }

            var li = $(
                '<li> '+
                '    <i class="fa fa-2x fa-users"></i> ' +
                '    <a href="javascript:;"><b></b><span class="badge badge-warning chat-msjsSala"></span></a> '+
                //'    <p class="conectadosSala"></p> '+
                '</li>');
        }

        li.attr('data-chat-sala-id', sala.idSala);
        li.find('a').on('click', function() {
            evolChat.cargaSala(sala.idSala);
        });
        li.find('b').text(sala.nombre);

        if ("numMsj" in sala) {

            li.find('.chat-msjsSala').text(sala.numMsj);
            li.find('.chat-msjsSala').addClass('badge-warning');
        }

        ulgrupo.append(li);
    }

    var __pintaUsuariosSala = function(sala, usuarios) {
        for (var i=0; i < usuarios.length; i++) {
            __pintaUsuarioSala(sala, usuarios[i]);
        }
        __actualizaConectadosGrupo(sala);
    }

    var __pintaUsuariosConectadosSala = function(sala, conectados) {
        for (var i=0; i < conectados.length; i++) {
            __usuarioSala(sala, conectados[i], 1);
        }
        __actualizaConectadosGrupo(sala);
    }

    var __pintaUsuarioSala = function(sala, usuario) {
        usuario.nombre = __safeDecode(usuario.nombre);

        if (usuario.bTipo == '1') {
            var grupousuarios = $('.chat-ligrupousuarios[data-chat-grupo-id="'+sala.idGrupo+'"] .chat-grupousuarios-profes');
        } else {
            var grupousuarios = $('.chat-ligrupousuarios[data-chat-grupo-id="'+sala.idGrupo+'"] .chat-grupousuarios-alumnos');
        }

        var liusuario = grupousuarios.find('ul li[data-chat-usuario-id="'+usuario.id+'"]');
        if (!liusuario.length) {
            var liusuario = $(
                '<li class="noconectado" data-chat-usuario-id="'+usuario.id+'"> '+
                '    <a href="javascript:;">' +
                '      <img class="pull-left img-polaroid img-circle img-responsive chat-img" src="//s3-eu-west-1.amazonaws.com/mdext-st.pre/avatares/avatar.png"> '+
                '      <b></b> '+
                '      <span class="badge badge-warning chat-msjsSala"></span> '+
                '    </a> '+
                '</li>');
            /*if ("conectado" in usuario && usuario.conectado) {
                liusuario.removeClass('noconectado');
            }*/

            liusuario.attr('data-chat-grupo-id', sala.idGrupo);
            if (typeof usuario.idSala != "undefined") {
                liusuario.data('chat-sala-id', sala.idSala);
            }
            liusuario.find('img').attr('src', usuario.urlImagen);
            liusuario.find('b').text(usuario.nombre);
            if (usuario.id != evolChat.socket.usuario.id) {
                liusuario.find('a').on('click' , function(e) {
                    e.preventDefault();
                    var liusuario = $(this).parent('li');
                    var idGrupo = liusuario.attr('data-chat-grupo-id');
                    var idSala = liusuario.attr('data-chat-sala-id');
                    evolChat.cargaSala(idSala);
                    if (idSala == null) {
                        //chat-cajamsjnueva
                        $('#chat-cajamsj').hide('fast');
                        var btn = $('#chat-cajamsjnueva button');
                        btn.off('click');
                        btn.on('click' , function(e) {
                            e.preventDefault();
                            evolChat.nuevaSala(idGrupo, [liusuario.attr('data-chat-usuario-id')])
                        })
                        $('#chat-cajamsjnueva').show('fast');
                    }
                });
            }

            if (usuario.id == evolChat.socket.usuario.id) {
                liusuario.addClass('hidden');
            } else {
                grupousuarios.show();
            }

            grupousuarios.find('ul').append(liusuario);
        } else {

            // ya existe
            if (sala.idModulo == null) {

                // si no existe ya
                if (sala.usuarios.length == 2
                    && (sala.usuarios[0].id == evolChat.socket.usuario.id
                        || sala.usuarios[1].id == evolChat.socket.usuario.id)
                    && liusuario.attr('data-chat-usuario-id') != evolChat.socket.usuario.id) {

                    liusuario.attr('data-chat-sala-id', sala.idSala);
                }
            }
        }

        if (sala.idModulo == null) {
            if ("numMsj" in sala && usuario.id != evolChat.socket.usuario.id) {
                liusuario.find('.chat-msjsSala').text(sala.numMsj);
                liusuario.find('.chat-msjsSala').addClass('badge-warning');

                __actualizaNumPendientesSalaUsuario(sala);

            }
        }
    }

    var __actualizaNumPendientesSalaUsuario = function(sala) {

        var liusuario = $('.chat-ligrupousuarios li[data-chat-sala-id="'+sala.idSala+'"]');

        var numMsjTotal = 0;
        var grupousuario = liusuario.parents('.chat-ligrupousuarios');
        grupousuario.find('li span.chat-msjsSala').each(function(index, el) {
            var numMsj = parseInt($(el).text(), 10);
            if (isNaN(numMsj))
                numMsj = 0;

            numMsjTotal += numMsj;
        });

        if (numMsjTotal == 0) {
            numMsjTotal = '';
        }
        grupousuario.find(' > span.chat-msjsSala').text(numMsjTotal);
    }

    var __actualizaConectadosGrupo = function(sala) {

        var ligrupo = $('.chat-ligrupousuarios[data-chat-grupo-id="'+sala.idGrupo+'"]');
        var ligruposala = $('.chat-ligruposala[data-chat-grupo-id="'+sala.idGrupo+'"]');

        if (ligrupo.length) {
            var nConectados = ligrupo.find('ul li:not(.noconectado)').length;
            if (nConectados == 1) {
                ligrupo.find('.conectadosGrupo').text(nConectados + trans('usuario conectado'))
                ligruposala.find('.chat-grupo-cab .conectadosGrupo').text(nConectados + trans('usuario conectado'))
            } else if (nConectados > 1) {
                ligrupo.find('.conectadosGrupo').text(nConectados + trans('usuarios conectados'))
                ligruposala.find('.chat-grupo-cab .conectadosGrupo').text(nConectados + ' usuarios conectados')
            } else {
                ligrupo.find('.conectadosGrupo').text('ningún usuario conectado')
                ligruposala.find('.chat-grupo-cab .conectadosGrupo').text(trans('ningún usuario conectado'))
            }

            if (sala.idModulo != null) {
                if (sala.idSala == evolChat.socket.idSalaActual) {
                    if (nConectados == 1) {
                        $('#chat-cajamsj .conectadosGrupo').text(nConectados +' '+ trans('usuario conectado'))
                    } else if (nConectados > 1) {
                        $('#chat-cajamsj .conectadosGrupo').text(nConectados +' '+ trans('usuarios conectados'))
                    } else {
                        $('#chat-cajamsj .conectadosGrupo').text(trans('ningún usuario conectado'))
                    }
                }

            }

        }
    }

    var __borraNumeroPendientesSala = function (sala) {
        var badge = $('li[data-chat-sala-id="'+sala.idSala+'"] a span.chat-msjsSala');
        badge.removeClass('badge-warning');
        badge.text('');

        if (sala.idModulo == null) {
            __actualizaNumPendientesSalaUsuario(sala)
        }

        __actualizaNumPendientesTotales();
    }

    var __cabeceraSala = function (sala) {
        sala.nombre = __safeDecode(sala.nombre);
        var cab = $('#chat-cajamsj .chat-secciones-cab');
        cab.empty();
        var htmlcab = $('<div class="chat-grupo-cab"><a href="javascript:;" class="volverasala"><i class="fa fa-arrow-left"></i></a><span class="chat-grupo-nombre"></span><span class="conectadosGrupo">'+trans('ningún usuario conectado')+'</span></div>');

        var back = htmlcab.find('a.volverasala');
        var titulo = htmlcab.find('.chat-grupo-nombre');
        var conectados = htmlcab.find('.conectadosGrupo');
        if (sala.idModulo == null) {

            cab.addClass('chat-secciones-cabpriv')
            cab.attr('data-chat-sala-id', sala.idSala)
            var compa;
            if (sala.usuarios[0].id != evolChat.socket.usuario.id) {
                compa = sala.usuarios[0];
            } else {
                compa = sala.usuarios[1];
            }
            titulo.text(__safeDecode(compa.nombre));

        } else {
            titulo.text(sala.nombre);
        }

        var usuariosConectados = sala.conectados.length -1;

        if (usuariosConectados > 1) {
            conectados.text(usuariosConectados+' '+trans('usuarios conectados'));
        } else if (usuariosConectados == 1) {
            conectados.text(usuariosConectados+' '+trans('usuario conectado'));
        } else {
            conectados.text(trans('ningún usuario conectado'));
        }


        if (sala.idModulo != null) {
            back.on('click', function(e) {
                e.preventDefault();
                $('#navli-chat-salas').find('a').trigger('click');
            });
        } else {
            back.on('click', function(e) {
                e.preventDefault();
                $('#navli-chat-usuarios').find('a').trigger('click');
            });

            if (usuariosConectados == 1) {
                conectados.html('<i class="fa fa-check-circle"></i> '+trans('conectado'))
            } else {
                conectados.html('<i class="fa fa-circle"></i> '+trans('no conectado'))
            }
        }

        cab.append(htmlcab);
    }

    var __actualizaNumPendientesSala = function() {
        var numMsjTotal = 0;

        var ligrupossala = $('#chat-salas .chat-ligruposala');
        ligrupossala.each(function(index, el) {
            var numMsjGrupoSala = 0;
            $(el).attr('data-num-pendientes', 0);
            var lichatssala = $(el).find('ul li');
            lichatssala.each(function(index2, el2) {

                var numMsj = parseInt($(el2).find('span.chat-msjsSala').text(), 10);
                if (isNaN(numMsj))
                    numMsj = 0;

                numMsjTotal += numMsj;
                numMsjGrupoSala += numMsj;

                $(el2).attr('data-num-pendientes', numMsj);
            });
            $(el).attr('data-num-pendientes', numMsjGrupoSala);

            // ordenar
            var lichatssalaOrdered = lichatssala.sort(function(a,b) {
                return $(a).attr('data-num-pendientes') < $(b).attr('data-num-pendientes');
            });

            var ulchatssala =  $(el).find('ul');
            //ulchatssala.find('li').remove();
            ulchatssala.prepend(lichatssalaOrdered);
        });

        // ordenar
        var ligrupossalaOrdered = ligrupossala.sort(function(a,b) {
            return $(a).attr('data-num-pendientes') < $(b).attr('data-num-pendientes');
        });

        var salascuerpo =  $('#chat-salas .chat-secciones-cuerpo');
        //salascuerpo.find('.chat-ligruposala').remove();
        salascuerpo.prepend(ligrupossalaOrdered);

        if (numMsjTotal == 0) {
            numMsjTotal = '';
        }

        $('#chat-conteoSalas').text(numMsjTotal);
        return numMsjTotal;
    }

    var __actualizaNumPendientesUsuarios = function() {
        var numMsjTotal = 0;

        var liusuariossala = $('#chat-usuarios .chat-ligrupousuarios');
        liusuariossala.each(function(index, el) {
            var numMsjGrupoSala = 0;
            $(el).attr('data-num-pendientes', 0);
            var lichatssala = $(el).find('.chat-grupousuarios-profes ul li');
            lichatssala.each(function(index2, el2) {

                var numMsj = parseInt($(el2).find('span.chat-msjsSala').text(), 10);
                if (isNaN(numMsj))
                    numMsj = 0;

                numMsjTotal += numMsj;
                numMsjGrupoSala += numMsj;

                $(el2).attr('data-num-pendientes', numMsj);
            });


            // ordenar
            /**/
            var lichatssalaOrdered = lichatssala.sort(function(a,b) {
                return $(a).attr('data-num-pendientes') < $(b).attr('data-num-pendientes');
            });

            var ulchatssala =  $(el).find('.chat-grupousuarios-profes ul');

            //ulchatssala.find('li').remove();
            ulchatssala.prepend(lichatssalaOrdered);

            /////
            lichatssala = $(el).find('.chat-grupousuarios-alumnos ul li');
            lichatssala.each(function(index2, el2) {

                var numMsj = parseInt($(el2).find('span.chat-msjsSala').text(), 10);
                if (isNaN(numMsj))
                    numMsj = 0;

                numMsjTotal += numMsj;
                numMsjGrupoSala += numMsj;

                $(el2).attr('data-num-pendientes', numMsj);
            });


            // ordenar
            /**/
            lichatssalaOrdered = lichatssala.sort(function(a,b) {
                return $(a).attr('data-num-pendientes') < $(b).attr('data-num-pendientes');
            });

            ulchatssala =  $(el).find('.chat-grupousuarios-alumnos ul');
            //ulchatssala.find('li').remove();
            ulchatssala.prepend(lichatssalaOrdered);



            $(el).attr('data-num-pendientes', numMsjGrupoSala);
        });

        // ordenar
        /**/
        var liusuariossalaOrdered = liusuariossala.sort(function(a,b) {
            return $(a).attr('data-num-pendientes') < $(b).attr('data-num-pendientes');
        });

        var usuarioscuerpo =  $('#chat-usuarios .chat-secciones-cuerpo');
        //usuarioscuerpo.find('.chat-ligrupousuarios').remove();
        usuarioscuerpo.prepend(liusuariossalaOrdered);


        $('#chat-conteoSalasUsuarios').text(numMsjTotal);
        return numMsjTotal;

    }

    var __actualizaNumPendientesTotales = function () {

        var nMsjsSala = __actualizaNumPendientesSala();
        var nMsjsUsuarios =__actualizaNumPendientesUsuarios();
        var total = (parseInt(nMsjsSala) || 0 ) + (parseInt(nMsjsUsuarios) || 0 );

        if (total == 0) {
            total = '';
            $('#chat-icono').removeClass('animated bounce conmensajes');
        } else {
            $('#chat-icono').addClass('animated bounce conmensajes');
        }

        $('#chat-icono .chat-msjsSala').text(total);
    }

    var __pintaMsj = function(msj) {


        // escapar las cadenas necesarias
        msj.texto = __safeDecode(msj.texto);
        msj.usuario.nombre = __safeDecode(msj.usuario.nombre)

        var chatmsjs = $('#chat-msjs ul');

        var li = $(
            '<li class="chat-msj">'+
                '<small></small>' +
                '<b></b>' +
                '<span class="fhora"></span>' +
                '<div class="cajaTxtMsj"><span class="txtEsc"></span></div>' +
            '</li>');

        li.attr('data-chat-msj-usuario', msj.usuario.id);
        // use the 'text' method to escape malicious user input
        var txtEsc = msj.texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        txtEsc = txtEsc.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
        //li.find('span').text(msj.texto);
        li.find('span.txtEsc').html(txtEsc);

        var fechahora = moment(msj.fecha);
        var ultFecha = $('#chat-msjs ul  small').last();
        if (ultFecha.length == 0 || ultFecha.text() != fechahora.format('DD/MM/YYYY') ) {
            li.find('small').text(fechahora.format('DD/MM/YYYY'))
        } else {
            li.find('small').remove();
        }

        li.find('span.fhora').html(fechahora.format('HH:mm'));
        if (msj.usuario.id == evolChat.socket.usuario.id) {
            li.addClass('chat-msjmio');
            li.find('b').remove();
        } else {
            li.addClass('chat-msjcompanero');

            // mirar si el anteior tb era suyo
            var ultli = $('#chat-msjs ul li').last();
            if (ultli.length > 0) {
                if (ultli.data('chat-msj-usuario') != msj.usuario.id) {
                    li.find('b').text(msj.usuario.nombre);
                }
            } else {
                li.find('b').text(msj.usuario.nombre);
            }
            //li.find('b').text(msj.usuario.nombre);
        }

        chatmsjs.append(li);
    }

    var __pintaNumeroPendientesSala = function (data) {

        var badge = $('li[data-chat-sala-id="'+data.sala.idSala+'"] a span.chat-msjsSala');
        var msjs = parseInt(badge.text(), 10);
        if (isNaN(msjs)) {
            msjs = 0;
        }

        if ("msj" in data || badge.data('inicializado') != '1') {
            if ("msj" in data) {
                badge.data('inicializado', '1');
            } else {
                msjs = 0;
            }

            if (!badge.hasClass('badge-warning')) {
                badge.addClass('badge-warning');
            }

            badge.text(msjs + data.numMsj);
        }

        if (data.sala.idModulo == null) {
            // sumar al contenedor tb
            var numMsjTotal = 0;
            var grupousuario = $('#chat-usuarios div[data-chat-grupo-id="'+data.sala.idGrupo+'"]');
            grupousuario.find('li span.chat-msjsSala').each(function(index, el) {
                var numMsj = parseInt($(el).text(), 10);
                if (isNaN(numMsj))
                    numMsj = 0;

                numMsjTotal += numMsj;
            });

            if (numMsjTotal == 0) {
                numMsjTotal = '';
            }
            grupousuario.find(' > span.chat-msjsSala').text(numMsjTotal);
        }

        __actualizaNumPendientesTotales();

    }

    var __nuevaSala = function(grupo, usuarios) {
        $.ajax({
            url: evolChat.options.urlAjax,
            type: 'POST',
            dataType: 'json',
            data: {fn: 'nuevaSala', grupo : grupo, usuarios : usuarios},
            success: function(data, textStatus, xhr) {
                evolChat.socket.emit('nuevaSala', {idSala : data.idSala});
            },
            //complete: function(xhr, textStatus) {},
            error: function(xhr, textStatus, errorThrown) {
                //console.log(errorThrown)
            }
        })

    }

    var __cambiaSeccion = function(seccion) {
        __setIdSalaActual(null)
        $('.chat-secciones').hide();
        $('#'+seccion).show('fast', function() {
            __calcHeight();
        })
    }

    var __connect = function(token) {

        evolChat.socket = io(evolChat.options.urlServer, {
            query: 'token='+token,
            forceNew: false,
            reconnectionAttempts: 10,
            reconnectionDelay: 1500,
            transports: ['websocket']
        });
        //console.log('conect io');

        evolChat.socket.on('connect', function() {})
        evolChat.socket.on('reconnect', function() { _onReconnect() })
        evolChat.socket.on('complete', function() { _onComplete() })
        evolChat.socket.on('disconnect', function() { _onDisconnect() })
        evolChat.socket.on('conectado', function(data) { _onConectado(data)})
        evolChat.socket.on('receive', function(data) { _onReceive(data)})
        evolChat.socket.on('cargaMensajes', function(data) { _onCargaMensajes(data)})
        evolChat.socket.on('cargaSalas', function(data) { _onCargaSalas(data)})
        evolChat.socket.on('conectadosSala', function(data) { _onConectadosSala(data)})
        evolChat.socket.on('conectadoSala', function(data) { _onConectadoSala(data)})
        evolChat.socket.on('desconectadoSala', function(data) { _onDesconectadoSala(data)})
        evolChat.socket.on('cargaSalaNueva', function(data) { _onCargaSalaNueva(data)})

        evolChat.socket.idSalaActual = 0

    }

    var __desconectado = function () {

        $('#evolchat').hide();
        $('#chat-contenedor').hide();
        $('#chat-icono').off('click');
        $('#chat-icono').tooltip({
            placement : 'left',
            title : trans('reconectando con el chat')+'...',
            trigger : 'hover'
        });
        $('#chat-icono').addClass('disabled')
        $('#chat-icono').show();
        $('#chat-icono i').removeClass('fa-weixin').addClass('fa-refresh fa-spin fa-fw');
    }

    var __destruir = function() {
        //console.log('destruir...');
        $('#evolchat').remove();
    }

    var __preparaHTML = function(abierto) {
        $('#evolchat').show();
        $('#chat-icono').on('click', function(e) {
            e.preventDefault();
            $('#evolchat #chat-icono').hide()
            $('#evolchat #chat-contenedor').show('fast', function() {
                __calcHeight();
            })
        })

        $('#chat-minimizar').on('click', function(e) {
            e.preventDefault();
            $('#evolchat #chat-contenedor').hide()
            $('#evolchat #chat-icono').show('fast')
        })

        $('#navli-chat-salas > a').on('click', function(e) {
            e.preventDefault();
            __cambiaSeccion('chat-salas')
            $('#navli-chat-usuarios').removeClass('activa');
            $('#navli-chat-salas').addClass('activa');
            //$('.chat-secciones').hide();
            //$('#chat-salas').show('fast')
        });

        $('#navli-chat-usuarios > a').on('click', function(e) {
            e.preventDefault();
            __cambiaSeccion('chat-usuarios')
            $('#navli-chat-salas').removeClass('activa');
            $('#navli-chat-usuarios').addClass('activa');
            //$('.chat-secciones').hide();
            //$('#chat-usuarios').show('fast')
        });

        /*$('#chat-frmmsj button').on('click', function(e) {
            e.preventDefault();
            evolChat.enviaMsj();
        });*/

        $('#chat-frmmsj').keypress(function(event){
            var chatfrmmsj = $('#chat-frmmsj');
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                event.preventDefault();
                if (event.shiftKey) {
                    chatfrmmsj.val(chatfrmmsj.val() + "\n");
                    chatfrmmsj.scrollTop(chatfrmmsj[0].scrollHeight);
                } else {
                    evolChat.enviaMsj();
                    return false;
                }
            }

        });

        if (abierto) {
            $('#chat-icono').click();
        }

        $('#txtsalas').text(trans('Salas'));
        $('#txtcompaneros').text(trans('Compañeros'));
        $('#txtseleccionachat').text(trans('Selecciona una sala para entrar en una conversación'));
        $('#chat-frmmsj').attr('placeholder', trans('Escriba su mensaje'));
        $('#txtnochat').text(trans('No tienes ningún chat abierto con este compañero. Haz click en iniciar chat para comenzar'));
        $('#txtavisorecibira').text(trans('Aunque no esté en línea recibirá los mensajes cuando conecte'));
        $('#txtbtniniciarchat').text(trans('Iniciar chat'));

    }

    var _init = function(options) { //}, abierto) {
        options = options || {};
        //abierto = abierto || false;

        $.extend(evolChat.options, options);

        $.ajax({
            url: evolChat.options.urlAjax,
            type: 'POST',
            dataType: 'json',
            data: {fn : 'token'},
            success: function(data, textStatus, xhr) {
                __preparaHTML(false);
                //if (!abierto) {
                    __connect(data.token);
                /*}
                /*
                $.ajax({
                    url: evolChat.options.urlAjax,
                    type: 'POST',
                    dataType: 'html',
                    data: {fn: 'dameHTMLChat'},
                    success: function(datahtml, textStatus, xhr) {
                        $('#evolchat').show();
                        __preparaHTML(datahtml, abierto);
                        if (!abierto) {
                            __connect(data.token)
                        }
                    }
                })
                */
            }
        });


        $(window).on('resize', function() {
            evolChat.calcHeight();

        })
    }

    var _reInit = function() {
        __destruir();
        //_init(evolChat.options, false);
    }

    var __calcHeight = function() {
        $('#chat-msjs').css('max-height', 'auto')
        var conth = $('#chat-contenedor').height();
        var navh =  $('#chat-contenedor .nav').height()
        var cabh = 0, pieh = 0, seccion;
        $('.chat-secciones').each(function(index, el) {

            if ($(el).css('display') != 'none') {
                seccion = $(el)
                var cab = $(el).find('.chat-secciones-cab');
                var pie = $(el).find('.chat-secciones-pie');

                if (cab.length) {
                    cabh = cab.height()
                }
                if (pie.length) {
                    pieh = pie.height()
                }
            }
        });

        var h = conth - navh - cabh - pieh;
        //
        var cuerpo = seccion.find('.chat-secciones-cuerpo')
        cuerpo.css('height',h+'px')
        cuerpo.slimScroll({destroy:true, height:h+'px'});
        cuerpo.slimScroll({height:h+'px'});
    }
    // fin funciones privadas

    // public
    return {
        socket : null,
        options : _optionsDefault,
        init : _init,
        destruir : __destruir,
        cargaSala : __cargaSala,
        nuevaSala : __nuevaSala,
        calcHeight : __calcHeight,
        enviaMsj : function() {
            __msj();
        }
    }

})();

function beep() {
  var snd = new Audio(
    "data:audio/mpeg;base64,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qkxBTUUzLjk3qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7kmT2j/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo="
  );
  snd.play();
}
