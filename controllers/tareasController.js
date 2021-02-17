const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea= async (req, res, next)=>{

    const proyecto = await Proyectos.findOne({
        //Primero obtenemos el Proyecto Actual 
        where:{
            url: req.params.url
        }
    });
    //leer valor del input
    const {tarea} = req.body;

    const estado = 0;
    const proyectoId = proyecto.id;

    //insertar bd y redireccionar
    const resultado = await Tareas.create({tarea,estado,proyectoId});
    if (!resultado) return next();

    res.redirect(`/proyectos/${req.params.url}`)
}

exports.cambiarEstadoTarea = async (req, res, next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where:{
            id
        } 
    });
    //cambiar el estado
    let estado = 0;
    if (tarea.estado === estado) {
        estado= 1;
    } 
    tarea.estado = estado;
    
    const resultado = await tarea.save();
    if (!resultado) return next();

    res.status(200).send('Actualizado')
}

exports.eliminarTarea = async (req, res, next)=>{
    const {id}=req.params;
    //eliminar tarear
    const resultado = await Tareas.destroy({where:{id}});

    if (!resultado) return next();
    res.status(200).send('Tarea Eliminada')
}