import axios from "axios";
import Swal from 'sweetalert2';

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e =>{
       if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea= icono.parentElement.parentElement.dataset.tarea;
            

            //request hacia tarea/:id
            const url = `${location.origin}/tareas/${idTarea}`;
            
            axios.patch(url,{idTarea})
                .then(function (respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
       }
       if (e.target.classList.contains('fa-trash')) {
           
           const tareaHTML= e.target.parentElement.parentElement,
                idTarea= tareaHTML.dataset.tarea;
            
                Swal.fire({
                    title: 'Desea borrar esta Tarea?',
                    text: "Un Tarea eliminado no se puede recuperar!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, borrar!',
                    cancelButtonText: 'No, Cancelar'
                  }).then((result) => {
                    if (result.value) {
                        //enviar el delete por medio de axios
                        const url = `${location.origin}/tareas/${idTarea}`;
                        axios.delete(url,{params: {idTarea}})
                            .then(function (respuesta) {
                                if (respuesta.status === 200) {
                                    //eliminar el nodo
                                    tareaHTML.parentElement.removeChild(tareaHTML);

                                    //opcional alerta
                                    Swal.fire(
                                        'Tarea Eliminada Correctamente',
                                        respuesta.data,
                                        'success'
                                    );
                                    actualizarAvance();
                                    /* setTimeout(()=>{
                                        window.location.href=`${location.origin}`;
                                      },2500) */
                                }
                            })
                    }
                })
       }
    })
}


export default tareas;