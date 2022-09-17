const path = require('path');
const yaml = require('yamljs');
const json5 = require('json5');

module.exports ={
    entry:'./src/index.js',
    devtool:'inline-source-map',
    
    module:{
        rules:[
            
            {
                test:/\.s[ac]ss$/i,//archivos que necesitan procesamiento
                use:['style-loader','css-loader','sass-loader'], // con lo que se van a tratar
            },
            {
                test:/\.css$/i,//archivos que necesitan procesamiento
                use:['style-loader','css-loader'], // con lo que se van a tratar
            },
           {
                test:/\.(png|jpg)$/i,//se especifica queel tipo de archivo es imagen
                type:'asset/resource',
            },
            {
                test:/\.csv$/i,//archivos que necesitan procesamiento
                use:['csv-loader'], // con lo que se van a tratar
            },
            {
                test:/\.yaml$/i,
                type:'json' ,
                parser:{
                    parse: yaml.parse
                }
                
            },
            {
                test:/\.json5$/i,//archivos que necesitan procesamiento
                type:'json', // con lo que se van a tratar
                parser:{
                    parse: json5.parse
                }
            },
            
        ],
    },
    output:{
        filename: 'bundle.js',//nombre del archhivo
        path: path.resolve(__dirname,'dist'),//donde esta ubicado
        
    },
};