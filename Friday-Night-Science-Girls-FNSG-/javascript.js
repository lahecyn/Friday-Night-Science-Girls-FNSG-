const ost = new Audio("ostdanganronpa.mp3");
let arrowleft = document.getElementById('arrowS-left');
let arrowdown = document.getElementById('arrowS-down');
let arrowup = document.getElementById('arrowS-up');
let arrowright = document.getElementById('arrowS-right');   

let makoto = document.getElementById('makoto_p');

const idle_monokuma = document.getElementById('idle_monokuma');
 
function gerarNota(direca) {
    const novaNota = document.createElement("div");

    novaNota.classList.add("seta-descendo");
    novaNota.classList.add("arrow" + direcao); 

    if (direcao === "left") {
        novaNota.classList.add("pos_leftS");
        novaNota.style.backgroundImage = "url('Arrows_fnf/ArrowLeft.png')";
    }   else if (direcao === "down") {
        novaNota.classList.add("pos_downS");
        novaNota.style.backgroundImage = "url('Arrows_fnf/ArrowDown.png')";
    }   else if (direcao === "up") {
        novaNota.classList.add("pos_upS");
        novaNota.style.backgroundImage = "url('Arrows_fnf/ArrowUp.png')";
    }   else if (direcao === "right") {
        novaNota.classList.add("pos_rightS");
        novaNota.style.backgroundImage = "url('Arrows_fnf/ArrowRight.png')";
    }
    document.getElementById("area-notas").appendChild(novaNota);
}

function checarAcerto (direcaopressionada) {
    
    const arrowS = document.querySelector("arrowS-" + direcaopressionada);

    const pos_staticY = arrowS.getBoundingClientRect().top;

    const notasnaTela = document.querySelectorAll(".seta-descendo");

    notasnaTela.forEach((nota) => {
        
        if (nota.classList.contains("arrowS-" + direcaopressionada)) {

            const posicaoNotaY = nota.getBoundingClientRect().top;

            const diferenca = Math.abs( posicaoNotaY - pos_staticY);

            if (diferenca < 60) {
            console.log("Sick");
            nota.remove();
        }
        }
  
    })
}
let indiceNotaAtual = 0;
let jogoRodando = false;

function atualizarJogo(){
    if(!jogoRodando) return;

    const tempoAtual = musica.currentTime;

}
const mapaNotas = [
    {tempo: 1.0, direcao:"left"},
    {tempo: 1.5, direcao:"down"},
    {tempo: 1.7, direcao:"up"},
    {tempo: 2.0, direcao:"right"},
    {tempo: 3.0, direcao:"up"},
    {tempo: 3.5, direcao:"down"},

]

function TeclaD() {

    const makoto = document.getElementById("makoto_p");
    makoto.src = "characters/Left_makoto.png";
    if (arrowleft) arrowleft.style.filter = "brightness(1.6) drop-shadow(0 0 3px #4242429d)";

    gerarNota("left");
    checarAcerto("left");
}

function TeclaF() {

    const makoto = document.getElementById("makoto_p");
    makoto.src = "characters/Down_makoto.png";

    if (arrowdown) arrowdown.style.filter = "brightness(1.6) drop-shadow(0 0 3px #4242429d)";
    gerarNota("down");
    checarAcerto("down");
}

function TeclaJ() {

    const makoto = document.getElementById("makoto_p");
    makoto.src = "characters/Up_makoto.png";
    
    if (arrowup) arrowup.style.filter = "brightness(1.6) drop-shadow(0 0 3px #4242429d)";
    gerarNota("up");
    checarAcerto("up");
}

function TeclaK() {
    makoto = document.getElementById("makoto_p");
    makoto.src = "characters/Right_makoto.png";

    if (arrowright) arrowright.style.filter = "brightness(1.6) drop-shadow(0 0 3px #4242429d)";
    gerarNota("right");
    checarAcerto("right");
}

window.addEventListener("keydown", (event) => {

    const teclada = event.key.toLowerCase();
    console.log("Você apertou a tecla: " + teclada);
        if (teclada === "d") {
            TeclaD();
            checarAcerto("left");
        }
   
        if (teclada === "f") {
            TeclaF();
            checarAcerto("down");
        }
        
        if (teclada === "j") {
            TeclaJ();
            checarAcerto("up");
        }
    
        if (teclada === "k") {
            TeclaK();
            checarAcerto("right");
        }
    }
);
window.addEventListener("keyup", (event) => {
    const teclaSolta = event.key.toLowerCase();

    if(teclaSolta === "d" || teclaSolta === "f" || teclaSolta === "j" || teclaSolta === "k") {
        if (arrowleft)  arrowleft.style.filter = "none";
        if (arrowdown)  arrowdown.style.filter = "none";
        if (arrowup)    arrowup.style.filter = "none";
        if (arrowright) arrowright.style.filter = "none";
        
        const makoto = document.getElementById("makoto_p");
        makoto.src = "characters/Idle_makoto.png";
    }
    
})