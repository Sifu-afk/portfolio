console.log('weikia');


const funnybutton1 = document.querySelector('.clickME')
const funnybutton2 = document.querySelector('.funnybutton')
const bush = document.querySelector('.bush')


funnybutton1.addEventListener('click', ()=>{
    const bioField = document.querySelector('.bioField')

    alert('WOW interactive')
})

    funnybutton2.addEventListener('click', () => {
        visibility();

        myMove();


    });

    function visibility() {
        const bush = document.getElementById('bush');
        if (bush) {
            bush.classList.toggle('vis');
            bush.classList.toggle('invis');
        }
    }

function myMove() {
  let id = null;
  const elem = document.getElementById("bush");
  let pos = 0;
  clearInterval(id);
  id = setInterval(frame, 5);
  function frame() {
    if (pos == 650) {
      clearInterval(id);
    } else {
      pos++;
    //   elem.style.top = pos + 'px';
      elem.style.left = pos + 'px';
    }
  }
}