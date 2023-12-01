class Modal
{
    // Maneja las acciones del Modal
    static HandleModal(id){
        const modal = document.getElementById(id);

        // Oculta el ABM y Muestra la tabla al cerrar el modal
        modal.addEventListener('hide.bs.modal', event => {
            document.getElementById("abm_container").style.display = "none";
            document.getElementById("form_container").style.display = "flex";;

            const requireFields = document.getElementById('form_abm').querySelectorAll('[required]');

            // Oculta los mensajes de error
            for (const campo of requireFields) {
                campo.nextElementSibling.classList.add("hidden");
            }
        });
    }
}
export default Modal;