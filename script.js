const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialogBox = document.getElementById("dialog-box");
const dialogText = document.getElementById("dialog-text");
const gameTitle = document.getElementById("game-title");
const hintText = document.getElementById("hint-text");

let currentScene = "HUB"; 
const insignias = { esqui: false, pingpong: false };

// -------------------------------------------------------------
// CARREGAMENTO E CONFIGURAÇÃO DO SPRITE DO ZORP
// -------------------------------------------------------------
const zorpImg = new Image();
zorpImg.src = "zorp.png";

const player = { x: 225, y: 150, width: 24, height: 28, speed: 2.5 };
const keys = { w: false, a: false, s: false, d: false, e: false, space: false };

// Animação com a grade correta (8 Colunas x 5 Linhas)
const zorpSprite = {
    frameX: 0,
    frameY: 1, // Linha 1 = Animação de Caminhada
    isMoving: false,
    timer: 0,
    directionFrames: [0, 0]
};

window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === " ") keys.space = true;
    if (keys.hasOwnProperty(k)) keys[k] = true;
});
window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (k === " ") keys.space = false;
    if (keys.hasOwnProperty(k)) keys[k] = false;
});

const npcs = [
    { scene: "HUB", x: 180, y: 180, color: "#9c27b0", msg: "> TURISTA: Olhe as ondas na agua! Essa ilha e incrivel." },
    { scene: "HUB", x: 270, y: 130, color: "#ff9800", msg: "> GUIA: As pontes levam aos minigames!" },
    { scene: "ILHA_ESQUI", x: 120, y: 150, color: "#00bcd4", msg: "> ALPINISTA: Brrr! Essa neve esta muito fria." },
    { scene: "ILHA_ESQUI", x: 225, y: 60, color: "#ffeb3b", msg: "> MESTRE DO GELO: Pronto para descer a montanha?", isMaster: "JOGO_ESQUI" },
    { scene: "ILHA_PINGPONG", x: 150, y: 220, color: "#8bc34a", msg: "> APRENDIZ: Que chao de madeira lindo, nao acha?" },
    { scene: "ILHA_PINGPONG", x: 225, y: 80, color: "#ff9800", msg: "> MESTRE DO PING-PONG: Mostre seus reflexos!", isMaster: "JOGO_PINGPONG" }
];

function isColliding(a, b) {
    return (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y);
}

// -------------------------------------------------------------
// MOTOR GRÁFICO (CENÁRIOS)
// -------------------------------------------------------------
function drawShadow(x, y, w, h) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.beginPath();
    ctx.ellipse(x + w/2, y + h, w/1.5, h/3, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawWater() {
    ctx.fillStyle = "#2b78e4"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4a90e2";
    for(let i=0; i<30; i++) {
        let wx = (Date.now() / 20 + i * 40) % canvas.width;
        let wy = (i * 15) % canvas.height;
        ctx.fillRect(wx, wy, 12, 2);
    }
}

function drawOrganicIsland(centerX, centerY) {
    ctx.fillStyle = "#e8c37d";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 90, 0, Math.PI*2); 
    ctx.arc(centerX - 30, centerY - 60, 60, 0, Math.PI*2); 
    ctx.arc(centerX + 60, centerY - 20, 70, 0, Math.PI*2); 
    ctx.arc(centerX - 40, centerY + 50, 65, 0, Math.PI*2); 
    ctx.arc(centerX + 30, centerY + 60, 70, 0, Math.PI*2); 
    ctx.fill();

    ctx.fillStyle = "#7dbd42";
    ctx.beginPath();
    ctx.arc(centerX, centerY, 82, 0, Math.PI*2);
    ctx.arc(centerX - 30, centerY - 60, 52, 0, Math.PI*2);
    ctx.arc(centerX + 60, centerY - 20, 62, 0, Math.PI*2);
    ctx.arc(centerX - 40, centerY + 50, 57, 0, Math.PI*2);
    ctx.arc(centerX + 30, centerY + 60, 62, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "#c59f6d"; 
    ctx.fillRect(centerX - 15, centerY - 100, 30, 100); 
    ctx.fillRect(centerX, centerY - 15, 120, 30); 
    ctx.fillRect(centerX - 15, centerY, 30, 100); 
    ctx.fillRect(centerX - 120, centerY - 15, 120, 30); 
}

function drawPath(x, y, w, h) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(x + 5, y + 10, w, h);
    ctx.fillStyle = "#6d4c41"; 
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#8d6e63"; 
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
}

function drawMonument(x, y) {
    drawShadow(x - 20, y - 5, 40, 20);
    ctx.fillStyle = "#757575"; ctx.fillRect(x - 20, y - 20, 40, 30);
    ctx.fillStyle = "#9e9e9e"; ctx.fillRect(x - 20, y - 30, 40, 10);
    ctx.fillStyle = "#212121";
    ctx.fillRect(x - 10, y - 15, 8, 8); 
    ctx.fillRect(x + 2, y - 15, 8, 8);  

    if (insignias.esqui) { ctx.fillStyle = "#00e5ff"; ctx.fillRect(x - 8, y - 13, 4, 4); }
    if (insignias.pingpong) { ctx.fillStyle = "#76ff03"; ctx.fillRect(x + 4, y - 13, 4, 4); }
}

function drawTree(x, y, type="green") {
    drawShadow(x, y, 20, 30);
    ctx.fillStyle = "#5d4037"; ctx.fillRect(x + 8, y + 15, 6, 15);
    if(type === "snow") {
        ctx.fillStyle = "#e0f7fa"; ctx.beginPath(); ctx.arc(x+10, y+10, 14, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#b2ebf2"; ctx.beginPath(); ctx.arc(x+10, y+16, 16, 0, Math.PI*2); ctx.fill();
    } else {
        ctx.fillStyle = "#2e7d32"; ctx.beginPath(); ctx.arc(x+10, y+10, 14, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#4caf50"; ctx.beginPath(); ctx.arc(x+10, y+16, 16, 0, Math.PI*2); ctx.fill();
    }
}

function drawChibi(x, y, color) {
    drawShadow(x, y, 16, 20);
    ctx.fillStyle = color; ctx.fillRect(x + 3, y + 10, 10, 10);
    ctx.fillStyle = "#ffcc99"; ctx.fillRect(x, y, 16, 12);
    ctx.fillStyle = "#000"; ctx.fillRect(x + 3, y + 4, 2, 4); ctx.fillRect(x + 11, y + 4, 2, 4);
}

function drawHUB() {
    drawWater();
    drawPath(205, -10, 40, 80); 
    drawPath(310, 130, 120, 40); 
    drawOrganicIsland(225, 150);
    drawMonument(225, 150);
}

function drawIlhaEsqui() {
    drawWater();
    ctx.fillStyle = "#e0f7fa"; ctx.fillRect(10, 10, 430, 280); 
    ctx.fillStyle = "#ffffff"; ctx.fillRect(15, 15, 420, 270); 
    drawPath(205, 275, 40, 25); 
    drawTree(40, 40, "snow"); drawTree(350, 60, "snow"); 
    drawTree(60, 200, "snow"); drawTree(370, 220, "snow");
}

function drawIlhaPingPong() {
    drawWater();
    ctx.fillStyle = "#558b2f"; ctx.fillRect(10, 10, 430, 280); 
    ctx.fillStyle = "#8bc34a"; ctx.fillRect(15, 15, 420, 270); 
    drawPath(0, 130, 20, 40); 
    ctx.fillStyle = "#795548"; ctx.fillRect(145, 55, 160, 90);
    ctx.fillStyle = "#d7ccc8"; ctx.fillRect(150, 60, 150, 80);
    drawTree(40, 40); drawTree(350, 60); drawTree(60, 200); drawTree(380, 230);
}

// -------------------------------------------------------------
// LÓGICA E ATUALIZAÇÃO
// -------------------------------------------------------------
function update() {
    if (["HUB", "ILHA_ESQUI", "ILHA_PINGPONG"].includes(currentScene)) {
        hintText.innerText = "USE [W A S D] PARA MOVER | [E] PARA FALAR";
        player.dx = 0; player.dy = 0;
        zorpSprite.isMoving = false;
        
        // Mapeamento preciso das colunas para cada direção
        if (keys.s) { 
            player.dy = player.speed; 
            zorpSprite.frameY = 1; 
            zorpSprite.directionFrames = [0, 0]; // Andar para frente
            zorpSprite.isMoving = true; 
        } else if (keys.w) { 
            player.dy = -player.speed; 
            zorpSprite.frameY = 1; 
            zorpSprite.directionFrames = [5, 6]; // Andar para trás
            zorpSprite.isMoving = true; 
        } else if (keys.a) { 
            player.dx = -player.speed; 
            zorpSprite.frameY = 1; 
            zorpSprite.directionFrames = [1, 2]; // Andar para esquerda
            zorpSprite.isMoving = true; 
        } else if (keys.d) { 
            player.dx = player.speed; 
            zorpSprite.frameY = 1; 
            zorpSprite.directionFrames = [3, 4]; // Andar para direita
            zorpSprite.isMoving = true; 
        }
        
        player.x += player.dx; player.y += player.dy;

        if (zorpSprite.isMoving) {
            zorpSprite.timer++;
            if (zorpSprite.timer % 10 === 0) {
                zorpSprite.frameX = (zorpSprite.frameX === zorpSprite.directionFrames[0]) ? zorpSprite.directionFrames[1] : zorpSprite.directionFrames[0];
            }
        } else {
            zorpSprite.frameX = 0; 
            zorpSprite.frameY = 0; // Posição parada de frente
        }

        if (currentScene === "HUB") {
            if (player.y < 5 && player.x > 200 && player.x < 240) { currentScene = "ILHA_ESQUI"; player.y = 260; }
            if (player.x > 420 && player.y > 120 && player.y < 170) { currentScene = "ILHA_PINGPONG"; player.x = 25; }
        } 
        else if (currentScene === "ILHA_ESQUI" && player.y > 270 && player.x > 200 && player.x < 240) {
            currentScene = "HUB"; player.y = 15;
        }
        else if (currentScene === "ILHA_PINGPONG" && player.x < 15 && player.y > 120 && player.y < 170) {
            currentScene = "HUB"; player.x = 410;
        }

        let npcProximo = null;
        for (let npc of npcs) {
            if (npc.scene === currentScene && isColliding(player, {x: npc.x-15, y: npc.y-15, width: 46, height: 50})) {
                npcProximo = npc; break;
            }
        }
        
        if (npcProximo) {
            dialogBox.classList.add("show");
            let extra = npcProximo.isMaster ? "<br><br>[ESPACO] PARA INICIAR O DESAFIO" : "";
            if (keys.e || keys.space) {
                dialogText.innerHTML = npcProximo.msg + extra;
            } else { 
                dialogText.innerHTML = "> (Pressione [E] para conversar)"; 
            }
        } else { 
            dialogBox.classList.remove("show"); 
        }
    }
}

// -------------------------------------------------------------
// RENDERIZAÇÃO PRINCIPAL
// -------------------------------------------------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentScene === "HUB") drawHUB();
    else if (currentScene === "ILHA_ESQUI") drawIlhaEsqui();
    else if (currentScene === "ILHA_PINGPONG") drawIlhaPingPong();
    
    if (["HUB", "ILHA_ESQUI", "ILHA_PINGPONG"].includes(currentScene)) {
        for (let npc of npcs) {
            if (npc.scene === currentScene) drawChibi(npc.x, npc.y, npc.color);
        }
        
        drawShadow(player.x - 2, player.y + 18, 20, 10);

        // CORREÇÃO CRÍTICA: A imagem possui 8 colunas reais na maior linha
        if (zorpImg.complete && zorpImg.naturalWidth !== 0) {
            const columns = 8;
            const rows = 5;
            const frameWidth = zorpImg.width / columns;
            const frameHeight = zorpImg.height / rows;

            ctx.drawImage(
                zorpImg,
                zorpSprite.frameX * frameWidth,
                zorpSprite.frameY * frameHeight,
                frameWidth,
                frameHeight,
                player.x - 10, 
                player.y - 14,
                40,  // Tamanho ideal na tela
                40   
            );
        }
    }
}

function gameLoop() { 
    update(); 
    draw(); 
    requestAnimationFrame(gameLoop); 
}

gameLoop();