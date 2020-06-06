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
            confirmButtonColor: 'rgb(38, 51, 83)',
        })
    }

    // Game rules (navbar)
    gameRules() {
        let button = document.querySelector('.rules');
        button.addEventListener('click', () => {
            Swal.fire({
                title: 'Pravila',
                text: 'Izaberite igru protiv kompjutera ili protiv drugog igrača. Sačekajte generisanje početnog slova. Imate ukupno 90 sekundi da pojmove upišete unutar naznačenih polja. Ukoliko primetite da ste tačno odgovorili, a poene niste dobili, unesite taj pojma u odeljku "Dodaj nov pojma" na početnoj strani. NAPOMENA: Upotrebljavajte slova Č, Ć, Đ, Ž i Š kako bi unos bio ispravan.',
                icon: 'question',
                confirmButtonColor: 'rgb(38, 51, 83)',
            })
        });
    }

}