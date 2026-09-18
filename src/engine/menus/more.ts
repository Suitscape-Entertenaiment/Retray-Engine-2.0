import Swal from "sweetalert2";

let more_form: string = document.getElementById("more_form")?.innerHTML ?? "";

function more_window(): void {
    Swal.fire({
        title: "More...",
        html: more_form,
        focusConfirm: false,
        showCancelButton: false,
        confirmButtonText: "ok",
        preConfirm: () => {}
        }).then((result) => {
        if (result.isConfirmed) {}
    });
}

export { more_window };