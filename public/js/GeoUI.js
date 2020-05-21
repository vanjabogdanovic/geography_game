export class GeoUI {

    // Username popup
    enterUsername(){
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
                }).then( () => {
                    this.enterUsername();
                })
            }
        });
    }

    // Hello div in navbar
    hello(div) {
        div.textContent = `Zdravo, ${localStorage.username}!`;
    }

    //Hall of Fame template
    leaderboard(tr1, tr2, array) {
        for(let i = 0; i < 5; i++) {
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let img = document.createElement('img');
            let h;
            if(i == 0) {
                h = document.createElement('h1');
                h.style.color = '#FFDB23';
                img.src = 'images/' + i + '.png';
                img.style.width = '70%';
            } else if(i == 1) {
                h = document.createElement('h2');
                h.style.color = 'darkred';
                img.src = 'images/' + i + '.png';
                img.style.width = '65%';
            } else if(i == 2) {
                h = document.createElement('h3');
                h.style.color = 'silver';
                img.src = 'images/' + i + '.png';
                img.style.width = '60%';
            } else {
                h = document.createElement('h4');
                img.src = 'images/medal.png';
                img.style.width = '50%';
            }
            h.textContent = array[i][0] + ": " + array[i][1];
            tr1.append(td1);
            tr2.append(td2);
            td1.append(img);
            td2.append(h);
        }
    }
}