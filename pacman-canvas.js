/**
 * JOGO PACMAN DEVORA LETRAS - VERSÃO COM TRAVA DE FASE E VIDAS
 */

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const fases = ["COBRA", "ZEBRA", "CASA", "LIVRO", "PORTA", "AMIGO", "NUVEM", "FESTA", "PRAIA", "CAMPO"];
let nivel = 0;
let palavraAlvo = fases[nivel];
let letraIndex = 0;
let score = 0;
let vidas = 3;

const tileSize = 26; 

const mapa = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,2,1,2,1,1,1,0,1,1,1,1],
    [1,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,1],
    [1,1,1,1,0,1,2,1,1,2,1,1,2,1,0,1,1,1,1],
    [1,2,2,2,0,2,2,1,2,2,2,1,2,2,0,2,2,2,1],
    [1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
    [1,2,2,1,0,1,2,2,2,2,2,2,2,1,0,1,2,2,1],
    [1,1,1,1,0,1,2,1,1,1,1,1,2,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

let pacman = { px: 9 * tileSize, py: 13 * tileSize, dir: -1, nextDir: -1, speed: 2 };

let ghosts = [
    { px: 8*tileSize, py: 9*tileSize, color: 'red', letra: '', dir: 0, speed: 1 },
    { px: 9*tileSize, py: 9*tileSize, color: 'pink', letra: '', dir: 0, speed: 1 },
    { px: 10*tileSize, py: 9*tileSize, color: 'cyan', letra: '', dir: 0, speed: 1 },
    { px: 9*tileSize, py: 7*tileSize, color: 'orange', letra: '', dir: 0, speed: 1 }
];

function atribuirLetras() {
    let letraCorreta = palavraAlvo[letraIndex];
    ghosts[0].letra = letraCorreta;
    for(let i = 1; i < ghosts.length; i++) {
        let letrasExtras = palavraAlvo.split('').filter(l => l !== letraCorreta);
        if(letrasExtras.length === 0) letrasExtras = ["A", "B", "C"]; 
        ghosts[i].letra = letrasExtras[Math.floor(Math.random() * letrasExtras.length)];
    }
}

function resetPosicoes() {
    pacman.px = 9 * tileSize;
    pacman.py = 13 * tileSize;
    pacman.dir = -1;
    pacman.nextDir = -1;
    ghosts.forEach(g => {
        g.px = 9 * tileSize;
        g.py = 9 * tileSize;
    });
}

window.addEventListener('keydown', e => {
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.key) > -1) e.preventDefault(); 
    if(e.key === "ArrowRight" || e.key === "d") pacman.nextDir = 0;
    if(e.key === "ArrowDown" || e.key === "s")  pacman.nextDir = 1;
    if(e.key === "ArrowLeft" || e.key === "a")  pacman.nextDir = 2;
    if(e.key === "ArrowUp" || e.key === "w")    pacman.nextDir = 3;
}, false);

function canMove(obj, direction) {
    let x = obj.px / tileSize;
    let y = obj.py / tileSize;
    if(direction === 0) x++;
    if(direction === 1) y++;
    if(direction === 2) x--;
    if(direction === 3) y--;
    return mapa[Math.round(y)] && mapa[Math.round(y)][Math.round(x)] !== 1;
}

function loop() {
    if(pacman.px % tileSize === 0 && pacman.py % tileSize === 0) {
        let x = pacman.px / tileSize;
        let y = pacman.py / tileSize;
        if(mapa[y][x] === 0) { mapa[y][x] = 2; score += 10; }
        if(canMove(pacman, pacman.nextDir)) pacman.dir = pacman.nextDir;
        if(!canMove(pacman, pacman.dir)) pacman.dir = -1;
    }
    if(pacman.dir === 0) pacman.px += pacman.speed;
    if(pacman.dir === 1) pacman.py += pacman.speed;
    if(pacman.dir === 2) pacman.px -= pacman.speed;
    if(pacman.dir === 3) pacman.py -= pacman.speed;

    ghosts.forEach(g => {
        if(g.px % tileSize === 0 && g.py % tileSize === 0) {
            let possible = [];
            for(let d=0; d<4; d++) {
                if(d !== (g.dir + 2) % 4 && canMove(g, d)) possible.push(d);
            }
            g.dir = possible[Math.floor(Math.random() * possible.length)];
        }
        if(g.dir === 0) g.px += g.speed;
        if(g.dir === 1) g.py += g.speed;
        if(g.dir === 2) g.px -= g.speed;
        if(g.dir === 3) g.py -= g.speed;

        let dist = Math.sqrt(Math.pow(pacman.px - g.px, 2) + Math.pow(pacman.py - g.py, 2));
        if(dist < tileSize * 0.7) {
            if(g.letra === palavraAlvo[letraIndex]) {
                letraIndex++;
                score += 50;
                
                // TRAVA DE SEGURANÇA: Move fantasmas para longe imediatamente
                g.px = 9 * tileSize; g.py = 9 * tileSize;

                if(letraIndex >= palavraAlvo.length) {
                    vidas++;
                    nivel = (nivel + 1) % fases.length;
                    palavraAlvo = fases[nivel]; 
                    letraIndex = 0;
                    resetPosicoes(); // Reseta tudo antes do alerta
                    alert("MUITO BEM! Você ganhou +1 VIDA! Próxima palavra: " + palavraAlvo);
                }
                atribuirLetras();
            } else {
                vidas--;
                resetPosicoes();
                if(vidas > 0) {
                    alert("Cuidado! Você perdeu 1 vida. Busque a letra: " + palavraAlvo[letraIndex]);
                } else {
                    alert("GAME OVER! Reiniciando...");
                    nivel = 0; palavraAlvo = fases[nivel]; letraIndex = 0; score = 0; vidas = 3;
                }
                atribuirLetras();
            }
        }
    });

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(let y=0; y<mapa.length; y++) {
        for(let x=0; x<mapa[y].length; x++) {
            if(mapa[y][x] === 1) {
                ctx.fillStyle = "#1e1eff";
                ctx.fillRect(x*tileSize+1, y*tileSize+1, tileSize-2, tileSize-2);
            } else if(mapa[y][x] === 0) {
                ctx.fillStyle = "#ffb8ae";
                ctx.beginPath(); ctx.arc(x*tileSize+tileSize/2, y*tileSize+tileSize/2, 2, 0, 7); ctx.fill();
            }
        }
    }

    ctx.fillStyle = "yellow";
    ctx.beginPath(); ctx.arc(pacman.px+tileSize/2, pacman.py+tileSize/2, tileSize/2.2, 0.2*Math.PI, 1.8*Math.PI); 
    ctx.lineTo(pacman.px+tileSize/2, pacman.py+tileSize/2); ctx.fill();

    ghosts.forEach(g => {
        ctx.fillStyle = g.color;
        ctx.beginPath(); ctx.arc(g.px+tileSize/2, g.py+tileSize/3, tileSize/2.2, Math.PI, 0);
        ctx.lineTo(g.px+tileSize-2, g.py+tileSize-2); ctx.lineTo(g.px+2, g.py+tileSize-2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = `bold ${tileSize/1.5}px Arial`; ctx.textAlign = "center";
        ctx.fillText(g.letra, g.px+tileSize/2, g.py+tileSize/1.2);
    });

    ctx.fillStyle = "white"; ctx.font = "bold 18px Arial"; ctx.textAlign = "left";
    ctx.fillText("PALAVRA: " + palavraAlvo, 10, 25);
    ctx.fillStyle = "yellow";
    ctx.fillText("BUSQUE: " + palavraAlvo[letraIndex], 10, 50);
    ctx.fillStyle = "#00ff00";
    ctx.fillText("VIDAS: " + vidas, 380, 25);
    ctx.fillStyle = "white";
    ctx.fillText("PONTOS: " + score, 380, 50);

    requestAnimationFrame(loop);
}

atribuirLetras();
loop();