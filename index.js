const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
//const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser= require('cookie-parser');
const passport = require('./config/passport');

// importar variable de entorno
require('dotenv').config({path: 'variables.env'});

// helpers con algunas funciones
const helpers = require('./helpers')

//crear conexion a la base de datos
const db = require('./config/db');

//importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
db.sync()
    .then(()=> console.log('Conectado al servidor'))
    .catch(error => console.log(error))

//crear una app de express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//habilitar bodyparce para leer los datos del formulario
app.use(bodyParser.urlencoded({extended: true}))



//app.set('view engine', 'ejs');
//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//pasar vardum a la aplicacion
app.use((req, res, next)=>{
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes=req.flash();
    res.locals.usuario = {...req.user} || null
    next();
});

// Agregamos express validator a toda la aplicación
//app.use(expressValidator());


app.use('/',routes())


//servidor y puerto
const host= '0.0.0.0';
const port = process.env.PORT || 5000;

app.listen(port, host, ()=>{
    console.log('El servidor esta funcionando');
})