import  _ from 'lodash';
import './estilo.css';
import './estilo.scss';
import  imagen  from './imagen.png';
import Datos from './datos.csv';
import yaml  from './datos.yaml';
import json5 from './datos.json5';

if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
        navigator.serviceWorker.register('./service-worker.js').then(registration =>{
            console.log("SW registrado",registration);
        }).catch(err=>{
            console.log("sw no registrado",err);
        });
    });
}


//genera un nuevo bloque 
//genra funcion
function componente(){
    const elemento = document.createElement('div');//se genera constante del componente(se genera el componente)
//motrar mensaje
//lodash 
    elemento.innerHTML = _.join(['Hola','webpack'],' ');
    elemento.classList.add('hola');
    elemento.classList.add('fondo');
    //se agrega la imagen
    const miImagen = new Image();//se crea un objeto img
    miImagen.src =imagen;
    elemento.appendChild(miImagen);
    
    console.log(Datos);
    return elemento;
}

console.log(yaml.title);
console.log(json5.owner.name);
//llamar a la funcion
document.body.appendChild(componente());
document.body.classList.add('fondo');