const path = require('path');


module.exports ={
    entry:'./src/index.ts',
    devtool:'inline-source-map',
    
    module:{
        rules:[
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node-modules/

            },  
        ],
    },
    resolve:{
        extensions:['.tsx','.ts','.js'],
    },
    output:{
        filename: 'bundle.js',//nombre del archhivo
        path: path.resolve(__dirname,'dist'),//donde esta ubicado
        
    },
};