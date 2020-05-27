export class Sweetalert {

    // Username popup
    enterUsername() {
        Swal.fire({
            title: 'Unesite svoj username',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            imageUrl: 'images/hi.gif',
            showCancelButton: false,
            confirmButtonText: 'Potvrdi',
            confirmButtonColor: '#3b9c8c',
            showLoaderOnConfirm: true,
            backdrop: `rgb(38, 51, 83)`
        }).then((result) => {
            if (result.value) {
                localStorage.setItem('username', result.value);
                location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Ups...',
                    text: 'Morate uneti username!',
                    confirmButtonColor: '#3b9c8c',
                    backdrop: 'rgb(38, 51, 83)'
                }).then(() => {
                    this.enterUsername();
                })
            }
        });
    }

    // Sweetalert for showing winner or loser (game.html)
    winnerOrLoser(url, mainText, text) {
        Swal.fire({
            title: mainText,
            text: text,
            imageWidth: 'auto',
            imageHeight: 'auto',
            imageUrl: url,
            imageAlt: 'Winner',
        })
    }

}