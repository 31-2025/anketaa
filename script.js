// SUPABASE POVEZIVANJE
// Ovde unesi svoj Publishable key iz Supabase > Settings > API Keys.
const SUPABASE_URL = "https://zozubzjxwwdvixkfkfvr.supabase.co";
const SUPABASE_KEY = "sb_publishable_uSIlc8IB5SM9XMez-UhWjg_Rg5vGFmj";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const noButton=document.getElementById('noButton');
const noArea=document.getElementById('noArea');
const yesButton=document.getElementById('yesButton');
const successMessage=document.getElementById('successMessage');
const continueDate=document.getElementById('continueDate');
const dateScreen=document.getElementById('dateScreen');
const dateForm=document.getElementById('dateForm');
const dateInput=document.getElementById('dateInput');
const foodScreen=document.getElementById('foodScreen');
const foodGrid=document.getElementById('foodGrid');
const foodSubmit=document.getElementById('foodSubmit');
const foodHint=document.getElementById('foodHint');
const finalScreen=document.getElementById('finalScreen');
let chosenFood='';

function moveNoButton(){
  const area=noArea.getBoundingClientRect();
  const button=noButton.getBoundingClientRect();
  const maxX=Math.max(0,area.width-button.width);
  const maxY=Math.max(0,area.height-button.height);
  const oldX=noButton.offsetLeft,oldY=noButton.offsetTop;
  let x=oldX,y=oldY;
  for(let i=0;i<25;i++){
    x=Math.random()*maxX;y=Math.random()*maxY;
    if(Math.hypot(x-oldX,y-oldY)>65)break;
  }
  noButton.style.left=`${x}px`;noButton.style.top=`${y}px`;
}
noButton.addEventListener('pointerenter',moveNoButton);
noButton.addEventListener('pointerdown',e=>{
  if(e.pointerType==='touch'||e.pointerType==='pen'){e.preventDefault();moveNoButton();}
});
noButton.addEventListener('click',e=>{e.preventDefault();moveNoButton();});
yesButton.addEventListener('click',()=>successMessage.classList.remove('hidden'));
continueDate.addEventListener('click',()=>{
  successMessage.classList.add('hidden');
  dateScreen.classList.remove('hidden');
});
const now=new Date();
dateInput.min=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);

dateForm.addEventListener('submit',e=>{
  e.preventDefault();
  if(!dateForm.reportValidity())return;
  dateScreen.classList.add('hidden');
  foodScreen.classList.remove('hidden');
});

foodGrid.addEventListener('click',e=>{
  const option=e.target.closest('.food-option');
  if(!option)return;
  foodGrid.querySelectorAll('.food-option').forEach(button=>button.classList.remove('selected'));
  option.classList.add('selected');
  chosenFood=option.dataset.food;
  foodSubmit.disabled=false;
  foodHint.textContent=`Dakle ${chosenFood} 💛`;
});
foodSubmit.addEventListener('click', async ()=>{
  if(!chosenFood)return;

  const selectedDate = dateInput.value;
  const selectedTime = document.getElementById('timeInput').value;

  if(!selectedDate || !selectedTime){
    alert('Molim te izaberi datum i vreme.');
    return;
  }

  foodSubmit.disabled = true;
  foodSubmit.textContent = 'ČUVAMO IZBOR...';

  const { error } = await supabaseClient
    .from('date_responses')
    .insert({
      date: selectedDate,
      time: selectedTime,
      food: chosenFood
    });

  if(error){
    console.error('Supabase greška:', error);
    alert('Izbor nije sačuvan. Proveri internet konekciju i pokušaj ponovo.');
    foodSubmit.disabled = false;
    foodSubmit.textContent = 'DALJE... ♥';
    return;
  }

  const [year,month,day] = selectedDate.split('-');
  document.getElementById('finalDate').textContent = `📅 ${day}.${month}.${year}. u ${selectedTime} h`;
  document.getElementById('finalFood').textContent = `🍽️ Imamo ${chosenFood}!`;
  foodScreen.classList.add('hidden');
  finalScreen.classList.remove('hidden');
});
window.addEventListener('resize',()=>{
  noButton.style.left=`${Math.max(0,Math.min(noButton.offsetLeft,noArea.clientWidth-noButton.offsetWidth))}px`;
  noButton.style.top=`${Math.max(0,Math.min(noButton.offsetTop,noArea.clientHeight-noButton.offsetHeight))}px`;
});

document.getElementById('finishButton').addEventListener('click', () => {

    window.close();
    setTimeout(() => {
        if (!window.closed) {
            document.body.innerHTML = `
                <div style="
                    min-height:100vh;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    text-align:center;
                    background:#e4efcf;
                    color:#344c3b;
                    font-family:Georgia,serif;
                ">
                    <div>
                        <h1>Hvala! 💗</h1>
                        <p>Dogovoreno! 🥰</p>
                        <p>Sada mozes da zatvoris ovu karticu.</p>
                    </div>
                </div>
            `;
        }
    }, 300);

});
