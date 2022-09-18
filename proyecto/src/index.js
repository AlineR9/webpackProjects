import  _ from 'lodash';
import './estilo.scss';
import Datos from './datos.csv';
import yaml  from './datos.yaml';
import json5 from './datos.json5';
import  imagen  from './imagenPrincipal.png';

if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
        navigator.serviceWorker.register('./service-worker.js').then(registration =>{
            console.log("SW activo",registration);
        }).catch(err=>{
            console.log("sw no activo",err);
        });
    });
}



function componente(){
    const elemento = document.createElement('div');
    elemento.innerHTML = _.join([yaml.title,yaml.subtitulo],' ');

    elemento.classList.add('texto');
    
    return elemento;
}

function componenteDos(){
    

    const elementImg = document.createElement('div');
    elementImg.classList.add('alineacion');
    
    const imagenPrincipal = new Image();
    imagenPrincipal.src =imagen;
    elementImg.appendChild(imagenPrincipal);
    
    return imagenPrincipal;
}




//llamar a la funcion
document.body.appendChild(componente());
document.body.appendChild(componenteDos());
document.body.classList.add('fondo');
