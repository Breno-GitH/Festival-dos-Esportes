const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialogBox = document.getElementById("dialog-box");
const dialogText = document.getElementById("dialog-text");
const hintText = document.getElementById("hint-text");

let currentScene = "HUB"; 

// Registro de Insígnias dos 8 Esportes
const insignias = { 
    esqui: false, 
    pingpong: false,
    skate: false,
    basquete: false,
    arco: false,
    corrida: false,
    escalada: false,
    surf: false
};

// -------------------------------------------------------------
// 1. CARREGAMENTO DAS IMAGENS
// -------------------------------------------------------------
const zorpImg = new Image(); zorpImg.src = "zorp.png";
const bgPingPong = new Image(); bgPingPong.src = "bg_pingpong.png?v=2";
const imgArcoSprites = new Image(); imgArcoSprites.src = "Sprites_MG_AF.png"; 
const imgArenaArco = new Image(); imgArenaArco.src = "Arena_Arco.png"; 

// Sprites Basquete (Carregando os arquivos separados presentes na pasta)
const imgZorpBasquete = new Image(); imgZorpBasquete.src = "zorp_basq.png";
const imgMestreBasquete = new Image(); imgMestreBasquete.src = "Mestre_basq.png";
const imgArenaBasquete = new Image(); imgArenaBasquete.src = "Arena_Basquete.png";
// NPCs Globais
const imgTurista = new Image(); imgTurista.src = "npc_turista.png";
const imgGuia = new Image(); imgGuia.src = "npc_guia.png";
const imgAlpinista = new Image(); imgAlpinista.src = "npc_alpinista.png";
const imgMestreGelo = new Image(); imgMestreGelo.src = "npc_mestre_gelo.png";
const imgAprendiz = new Image(); imgAprendiz.src = "npc_aprendiz.png";
const imgMestrePingPong = new Image(); imgMestrePingPong.src = "npc_mestre_ping_pong.png";

// Sprites Ping-Pong
const imgZorpIdle = new Image(); imgZorpIdle.src = "zorp_idle.png";
const imgZorpMU = new Image(); imgZorpMU.src = "zorp_mu.png";
const imgZorpMD = new Image(); imgZorpMD.src = "zorp_md.png";
const imgZorpHit = new Image(); imgZorpHit.src = "zorp_hit.png";

const imgMestreIdle = new Image(); imgMestreIdle.src = "mestre_idle.png";
const imgMestreMU = new Image(); imgMestreMU.src = "mestre_mu.png";
const imgMestreMD = new Image(); imgMestreMD.src = "mestre_md.png";
const imgMestreHit = new Image(); imgMestreHit.src = "mestre_hit.png";

// -------------------------------------------------------------
// 2. OBJETOS, OBSTÁCULOS E ESTADOS DO JOGO (GERAL E PING PONG)
// -------------------------------------------------------------
const player = { 
    x: 225, 
    y: 150, 
    speed: 2.2,
    renderWidth: 40,   
    renderHeight: 48   
};

const keys = { w: false, a: false, s: false, d: false, e: false, space: false };

const zorpSprite = {
    cols: 3, rows: 4, row: 0, 
    animSequence: [1, 0, 1, 2], animIndex: 0,
    isMoving: false, timer: 0, speed: 8 
};

const pingPong = {
    playerX: 50, playerY: 140, 
    opponentX: 370, opponentY: 140, 
    speed: 3,
    ballX: 225, ballY: 150, ballSpeedX: 3, ballSpeedY: 2, ballRadius: 4,
    playerScore: 0, opponentScore: 0, maxScore: 3,
    playerAction: "IDLE", opponentAction: "IDLE",  
    playerHitTimer: 0, opponentHitTimer: 0,
    power: 0, maxPower: 100, isPowerActive: false
};

// -------------------------------------------------------------
// MINIGAME ARCO E FLECHA (MOVIMENTO E TIRO FRONTAL)
// -------------------------------------------------------------
const arcoGame = {
    playerScore: 0,
    mestreScore: 0,
    targetScore: 200,
    
    playerX: 120,
    playerY: 420,
    playerSpeed: 4.5,
    playerState: 'IDLE',
    playerFrame: 0,
    playerFrameTimer: 0,
    playerShootCooldown: 0,

    mestreX: 330,
    mestreY: 420,
    mestreSpeed: 3.5,
    mestreState: 'IDLE',
    mestreFrame: 0,
    mestreFrameTimer: 0,
    mestreShootCooldown: 0,

    arrows: [],
    targets: [],
    spawnTimer: 0
};

// -------------------------------------------------------------
// MINIGAME BASQUETE (TIMING COM SPRITES)
// -------------------------------------------------------------
const basqueteGame = {
    phase: 'READY',       // READY, POWER, ANGLE, SHOOTING, RESULT
    round: 0,
    maxRounds: 5,
    playerScore: 0,
    
    // Status dos Sprites dos Personagens
    playerX: 140,
    playerY: 230,
    playerState: 'IDLE',  // IDLE, PREP, SHOOT, WIN, LOSE
    playerFrame: 0,
    playerFrameTimer: 0,

    mestreX: 310,
    mestreY: 230,
    mestreState: 'IDLE',  // IDLE, DEFEND, WIN, LOSE
    mestreFrame: 0,
    mestreFrameTimer: 0,
    
    // Power bar (vertical)
    powerValue: 0,        
    powerDir: 1,          
    powerSpeed: 2.2,      
    powerLocked: -1,      
    powerSweetMin: 40,    
    powerSweetMax: 60,
    
    // Angle bar (horizontal)
    angleValue: 0,
    angleDir: 1,
    angleSpeed: 2.8,
    angleLocked: -1,
    angleSweetMin: 40,
    angleSweetMax: 60,
    
    // Ball animation
    ballX: 140,
    ballY: 190,
    ballTargetX: 225,
    ballTargetY: 60,
    ballAnimTimer: 0,
    ballAnimDuration: 40,
    ballStartX: 140,
    ballStartY: 190,
    
    // Result display
    resultTimer: 0,
    resultText: '',
    shotResult: '',  // 'SWISH', 'GOOD', 'MISS'
    
    // Countdown
    countdownTimer: 0,
    
    // Difficulty ramp
    speedIncrease: 0.15
};

function resetBasquete() {
    basqueteGame.phase = 'READY';
    basqueteGame.round = 0;
    basqueteGame.playerScore = 0;
    basqueteGame.powerSpeed = 2.2;
    basqueteGame.angleSpeed = 2.8;
    basqueteGame.countdownTimer = 60;
    _resetBasqueteRound();
}

function _resetBasqueteRound() {
    basqueteGame.powerValue = 0;
    basqueteGame.powerDir = 1;
    basqueteGame.powerLocked = -1;
    basqueteGame.angleValue = 0;
    basqueteGame.angleDir = 1;
    basqueteGame.angleLocked = -1;
    basqueteGame.ballAnimTimer = 0;
    basqueteGame.resultTimer = 0;
    basqueteGame.resultText = '';
    basqueteGame.shotResult = '';
    basqueteGame.playerState = 'IDLE';
    basqueteGame.mestreState = 'IDLE';
    basqueteGame.ballX = 140;
    basqueteGame.ballY = 190;
}

function updateBasquete() {
    hintText.innerText = "[ESPAÇO] TRAVAR FORÇA / ÂNGULO";
    
    // Animação contínua de frames dos sprites
    basqueteGame.playerFrameTimer++;
    if (basqueteGame.playerFrameTimer > 10) {
        basqueteGame.playerFrameTimer = 0;
        basqueteGame.playerFrame = (basqueteGame.playerFrame + 1) % 2;
        basqueteGame.mestreFrame = (basqueteGame.mestreFrame + 1) % 2;
    }

    if (basqueteGame.countdownTimer > 0) {
        basqueteGame.countdownTimer--;
        return;
    }
    
    if (basqueteGame.phase === 'READY') {
        basqueteGame.phase = 'POWER';
        basqueteGame.playerState = 'PREP';
        basqueteGame.mestreState = 'DEFEND';
    }
    
    // Phase: POWER
    if (basqueteGame.phase === 'POWER') {
        basqueteGame.powerValue += basqueteGame.powerSpeed * basqueteGame.powerDir;
        if (basqueteGame.powerValue >= 100) { basqueteGame.powerValue = 100; basqueteGame.powerDir = -1; }
        if (basqueteGame.powerValue <= 0) { basqueteGame.powerValue = 0; basqueteGame.powerDir = 1; }
        
        if (keys.space) {
            basqueteGame.powerLocked = basqueteGame.powerValue;
            basqueteGame.phase = 'ANGLE';
            keys.space = false;
        }
    }
    
    // Phase: ANGLE
    else if (basqueteGame.phase === 'ANGLE') {
        basqueteGame.angleValue += basqueteGame.angleSpeed * basqueteGame.angleDir;
        if (basqueteGame.angleValue >= 100) { basqueteGame.angleValue = 100; basqueteGame.angleDir = -1; }
        if (basqueteGame.angleValue <= 0) { basqueteGame.angleValue = 0; basqueteGame.angleDir = 1; }
        
        if (keys.space) {
            basqueteGame.angleLocked = basqueteGame.angleValue;
            basqueteGame.phase = 'SHOOTING';
            basqueteGame.playerState = 'SHOOT';
            basqueteGame.ballAnimTimer = 0;
            
            let powerErr = Math.abs(basqueteGame.powerLocked - 50);
            let angleErr = Math.abs(basqueteGame.angleLocked - 50);
            
            basqueteGame.ballStartX = basqueteGame.playerX;
            basqueteGame.ballStartY = basqueteGame.playerY - 40;
            basqueteGame.ballTargetX = 225 + (basqueteGame.angleLocked - 50) * 1.5;
            basqueteGame.ballTargetY = 55 + powerErr * 0.5;
            
            if (powerErr <= 10 && angleErr <= 10) {
                basqueteGame.shotResult = 'SWISH';
            } else if (powerErr <= 20 && angleErr <= 20) {
                basqueteGame.shotResult = 'GOOD';
            } else {
                basqueteGame.shotResult = 'MISS';
            }
            
            keys.space = false;
        }
    }
    
    // Phase: SHOOTING
    else if (basqueteGame.phase === 'SHOOTING') {
        basqueteGame.ballAnimTimer++;
        let t = basqueteGame.ballAnimTimer / basqueteGame.ballAnimDuration;
        
        if (t >= 1) {
            t = 1;
            basqueteGame.phase = 'RESULT';
            basqueteGame.round++;
            
            if (basqueteGame.shotResult === 'SWISH') {
                basqueteGame.playerScore += 3;
                basqueteGame.resultText = 'SWISH! +3';
                basqueteGame.playerState = 'WIN';
                basqueteGame.mestreState = 'LOSE';
            } else if (basqueteGame.shotResult === 'GOOD') {
                basqueteGame.playerScore += 2;
                basqueteGame.resultText = 'CESTA! +2';
                basqueteGame.playerState = 'WIN';
                basqueteGame.mestreState = 'LOSE';
            } else {
                basqueteGame.resultText = 'ERROU!';
                basqueteGame.playerState = 'LOSE';
                basqueteGame.mestreState = 'WIN';
            }
            basqueteGame.resultTimer = 90;
        }
        
        let linearX = basqueteGame.ballStartX + (basqueteGame.ballTargetX - basqueteGame.ballStartX) * t;
        let linearY = basqueteGame.ballStartY + (basqueteGame.ballTargetY - basqueteGame.ballStartY) * t;
        let arcHeight = -120 * Math.sin(t * Math.PI);
        
        basqueteGame.ballX = linearX;
        basqueteGame.ballY = linearY + arcHeight;
    }
    
    // Phase: RESULT
    else if (basqueteGame.phase === 'RESULT') {
        basqueteGame.resultTimer--;
        
        if (basqueteGame.resultTimer <= 0) {
            if (basqueteGame.round >= basqueteGame.maxRounds) {
                if (basqueteGame.playerScore >= 8) {
                    insignias.basquete = true;
                    currentScene = "ILHA_BASQUETE";
                    dialogText.innerHTML = `> MESTRE DO BASQUETE: Incrível! ${basqueteGame.playerScore} pontos! Você é um craque!`;
                    dialogBox.classList.add("show");
                } else {
                    currentScene = "ILHA_BASQUETE";
                    dialogText.innerHTML = `> MESTRE DO BASQUETE: ${basqueteGame.playerScore} pontos... Tente acertar o momento perfeito!`;
                    dialogBox.classList.add("show");
                }
            } else {
                _resetBasqueteRound();
                basqueteGame.phase = 'READY';
                basqueteGame.countdownTimer = 30;
                basqueteGame.powerSpeed += basqueteGame.speedIncrease;
                basqueteGame.angleSpeed += basqueteGame.speedIncrease;
            }
        }
    }
}

function drawBasqueteGame() {
    // 1. Cenário
    if (imgArenaBasquete.complete && imgArenaBasquete.naturalWidth > 0) {
        ctx.drawImage(imgArenaBasquete, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#c68642'; ctx.fillRect(0, 180, canvas.width, 120);
        ctx.strokeStyle = '#e8a95b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(canvas.width, 180); ctx.stroke();
        
        // Tabela e Aro em vetor (fallback)
        ctx.fillStyle = '#ecf0f1'; ctx.fillRect(205, 30, 40, 5);
        ctx.strokeStyle = '#e74c3c'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(225, 55, 15, 5, 0, 0, Math.PI * 2); ctx.stroke();
    }
    
  // 2. Personagens e Bola com Sprites Separados
    if (imgZorpBasquete.complete && imgZorpBasquete.naturalWidth > 0 &&
        imgMestreBasquete.complete && imgMestreBasquete.naturalWidth > 0) {
        
        ctx.imageSmoothingEnabled = false;

        let renderH = 90;

        // --- ZORP BASQUETE ---
        let zorpFrameW = imgZorpBasquete.width / 6;
        let zorpFrameH = imgZorpBasquete.height / 2;
        let zorpRenderW = renderH * (zorpFrameW / zorpFrameH);

        let pCol = 0;
        if (basqueteGame.playerState === 'PREP') pCol = 1;
        else if (basqueteGame.playerState === 'SHOOT') pCol = 2;
        else if (basqueteGame.playerState === 'WIN') pCol = 3 + basqueteGame.playerFrame;
        else if (basqueteGame.playerState === 'LOSE') pCol = 5;

        ctx.drawImage(
            imgZorpBasquete,
            Math.floor(pCol * zorpFrameW), 0, Math.floor(zorpFrameW), Math.floor(zorpFrameH),
            Math.floor(basqueteGame.playerX - zorpRenderW / 2), Math.floor(basqueteGame.playerY - renderH),
            Math.floor(zorpRenderW), Math.floor(renderH)
        );

        // --- MESTRE DO BASQUETE ---
        let mestreFrameW = imgMestreBasquete.width / 6;
        let mestreFrameH = imgMestreBasquete.height / 2;
        let mestreRenderW = renderH * (mestreFrameW / mestreFrameH);

        let mCol = 0;
        if (basqueteGame.mestreState === 'DEFEND') mCol = 1;
        else if (basqueteGame.mestreState === 'WIN') mCol = 2 + basqueteGame.mestreFrame;
        else if (basqueteGame.mestreState === 'LOSE') mCol = 4;

        ctx.drawImage(
            imgMestreBasquete,
            Math.floor(mCol * mestreFrameW), 0, Math.floor(mestreFrameW), Math.floor(mestreFrameH),
            Math.floor(basqueteGame.mestreX - mestreRenderW / 2), Math.floor(basqueteGame.mestreY - renderH),
            Math.floor(mestreRenderW), Math.floor(renderH)
        );

    } else {
        // Fallback Vetorial caso as imagens falhem em carregar
        ctx.fillStyle = '#2ecc71'; ctx.fillRect(basqueteGame.playerX - 15, basqueteGame.playerY - 50, 30, 50);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(basqueteGame.mestreX - 15, basqueteGame.mestreY - 50, 30, 50);
    }   

    // 3. Desenho da Bola de Basquete
    ctx.fillStyle = '#e67e22';
    ctx.beginPath();
    ctx.arc(Math.floor(basqueteGame.ballX), Math.floor(basqueteGame.ballY), 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Interface: BARRA DE FORÇA (Esquerda, Vertical)
    let barX = 30, barY = 40, barW = 22, barH = 190;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
    
    let gradient = ctx.createLinearGradient(0, barY + barH, 0, barY);
    gradient.addColorStop(0, '#e74c3c');
    gradient.addColorStop(0.3, '#f39c12');
    gradient.addColorStop(0.5, '#2ecc71');
    gradient.addColorStop(0.7, '#f39c12');
    gradient.addColorStop(1, '#e74c3c');
    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY, barW, barH);
    
    let sweetY1 = barY + barH - (basqueteGame.powerSweetMax / 100) * barH;
    let sweetY2 = barY + barH - (basqueteGame.powerSweetMin / 100) * barH;
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(barX, sweetY1, barW, sweetY2 - sweetY1);
    ctx.setLineDash([]);
    
    let powerY = (basqueteGame.powerLocked >= 0)
        ? barY + barH - (basqueteGame.powerLocked / 100) * barH
        : barY + barH - (basqueteGame.powerValue / 100) * barH;
        
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX - 4, powerY - 2, barW + 8, 4);
    ctx.font = 'bold 10px monospace';
    ctx.fillText('FORÇA', barX - 2, barY - 8);

    // 5. Interface: BARRA DE ÂNGULO (Inferior, Horizontal)
    let aBarX = 80, aBarY = 260, aBarW = 280, aBarH = 18;
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(aBarX - 2, aBarY - 2, aBarW + 4, aBarH + 4);
    
    let aGradient = ctx.createLinearGradient(aBarX, 0, aBarX + aBarW, 0);
    aGradient.addColorStop(0, '#e74c3c');
    aGradient.addColorStop(0.3, '#f39c12');
    aGradient.addColorStop(0.5, '#2ecc71');
    aGradient.addColorStop(0.7, '#f39c12');
    aGradient.addColorStop(1, '#e74c3c');
    ctx.fillStyle = aGradient;
    ctx.fillRect(aBarX, aBarY, aBarW, aBarH);
    
    let sweetX1 = aBarX + (basqueteGame.angleSweetMin / 100) * aBarW;
    let sweetX2 = aBarX + (basqueteGame.angleSweetMax / 100) * aBarW;
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(sweetX1, aBarY, sweetX2 - sweetX1, aBarH);
    ctx.setLineDash([]);
    
    let angleX = (basqueteGame.angleLocked >= 0)
        ? aBarX + (basqueteGame.angleLocked / 100) * aBarW
        : aBarX + (basqueteGame.angleValue / 100) * aBarW;
        
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(angleX - 2, aBarY - 4, 4, aBarH + 8);
    ctx.fillText('ÂNGULO', aBarX + aBarW / 2 - 20, aBarY + aBarH + 12);

    // 6. HUD do Placar
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, 28);
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#f1c40f'; ctx.fillText(`PONTOS: ${basqueteGame.playerScore}`, 15, 19);
    ctx.fillStyle = '#3498db'; ctx.fillText(`ARREMESSO: ${basqueteGame.round}/${basqueteGame.maxRounds}`, 160, 19);
    
    ctx.fillStyle = '#ffffff';
    let phaseLabel = '';
    if (basqueteGame.phase === 'POWER') phaseLabel = '► TRAVE A FORÇA!';
    else if (basqueteGame.phase === 'ANGLE') phaseLabel = '► TRAVE O ÂNGULO!';
    ctx.fillText(phaseLabel, 300, 19);

    // Countdown e Resultado Animado
    if (basqueteGame.countdownTimer > 0) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px monospace';
        let countNum = Math.ceil(basqueteGame.countdownTimer / 30);
        let countText = countNum > 0 ? `${countNum}` : 'GO!';
        let tw = ctx.measureText(countText).width;
        ctx.fillText(countText, (canvas.width - tw) / 2, 150);
    }

    if (basqueteGame.phase === 'RESULT' && basqueteGame.resultText) {
        ctx.font = 'bold 26px monospace';
        let color = basqueteGame.shotResult === 'MISS' ? '#e74c3c' : '#2ecc71';
        if (basqueteGame.shotResult === 'SWISH') color = '#f1c40f';
        ctx.fillStyle = color;
        let tw = ctx.measureText(basqueteGame.resultText).width;
        ctx.fillText(basqueteGame.resultText, (canvas.width - tw) / 2, 130);
    }
}

function drawArcoGame() {
    if (imgArenaArco.complete && imgArenaArco.naturalWidth > 0) {
        ctx.drawImage(imgArenaArco, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#66bb6a"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    arcoGame.targets.forEach(t => {
        ctx.fillStyle = "#5d4037"; ctx.fillRect(Math.floor(t.x - 2), Math.floor(t.y), 4, 20);
        ctx.fillStyle = "#e74c3c"; ctx.beginPath(); ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(t.x, t.y, t.radius * 0.6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f1c40f"; ctx.beginPath(); ctx.arc(t.x, t.y, t.radius * 0.3, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px monospace";
        ctx.fillText(`${t.points}p`, Math.floor(t.x - 10), Math.floor(t.y - t.radius - 6));
    });

    if (imgArcoSprites.complete && imgArcoSprites.naturalWidth > 0) {
        ctx.imageSmoothingEnabled = false;

        let frameW = imgArcoSprites.width / 8;
        let frameH = imgArcoSprites.height / 2;
        let renderHeight = 110; 
        let renderWidth = renderHeight * (frameW / frameH);

        let arrowSrcX = Math.floor(7 * frameW + (frameW * 0.3));
        let arrowSrcY = Math.floor(frameH * 0.2);                
        let arrowSrcW = Math.floor(frameW * 0.5);                
        let arrowSrcH = Math.floor(frameH * 0.8);                

        let arrowRenderWidth = 22;  
        let arrowRenderHeight = 36; 

        arcoGame.arrows.forEach(arr => {
            ctx.drawImage(
                imgArcoSprites, 
                arrowSrcX, arrowSrcY, arrowSrcW, arrowSrcH, 
                Math.floor(arr.x - arrowRenderWidth / 2), Math.floor(arr.y - arrowRenderHeight / 2), 
                arrowRenderWidth, arrowRenderHeight
            );
        });

        // ZORP
        let pRow = 0; 
        let pCol = arcoGame.playerState === 'SHOOT' ? 2 : Math.floor(arcoGame.playerFrame);
        
        let pSx = Math.floor(pCol * frameW);
        let pSy = Math.floor(pRow * frameH);
        let pSw = Math.floor(frameW);
        let pSh = Math.floor(frameH);

        let pDx = Math.floor(arcoGame.playerX - (renderWidth / 2));
        let pDy = Math.floor(arcoGame.playerY - renderHeight + 15);
        let pDw = Math.floor(renderWidth);
        let pDh = Math.floor(renderHeight);

        ctx.drawImage(imgArcoSprites, pSx, pSy, pSw, pSh, pDx, pDy, pDw, pDh);

        // MESTRE
        let mRow = 0; 
        let mCol = arcoGame.mestreState === 'SHOOT' ? 6 : 4 + Math.floor(arcoGame.mestreFrame); 
        
        let mSx = Math.floor(mCol * frameW);
        let mSy = Math.floor(mRow * frameH);
        let mSw = Math.floor(frameW);
        let mSh = Math.floor(frameH);

        let mDx = Math.floor(arcoGame.mestreX - (renderWidth / 2));
        let mDy = Math.floor(arcoGame.mestreY - renderHeight + 15);
        let mDw = Math.floor(renderWidth);
        let mDh = Math.floor(renderHeight);

        ctx.drawImage(imgArcoSprites, mSx, mSy, mSw, mSh, mDx, mDy, mDw, mDh);
        
    } else {
        arcoGame.arrows.forEach(arr => {
            ctx.fillStyle = "#ecf0f1"; ctx.fillRect(Math.floor(arr.x - 1), Math.floor(arr.y), 2, 14);
        });
        ctx.fillStyle = "#2ecc71"; ctx.fillRect(Math.floor(arcoGame.playerX - 15), Math.floor(arcoGame.playerY - 40), 30, 40);
        ctx.fillStyle = "#e74c3c"; ctx.fillRect(Math.floor(arcoGame.mestreX - 15), Math.floor(arcoGame.mestreY - 40), 30, 40);
    }

    ctx.fillStyle = "rgba(0,0,0,0.8)"; ctx.fillRect(0, 0, canvas.width, 30);
    ctx.fillStyle = "#f1c40f"; ctx.font = "bold 14px monospace";
    ctx.fillText(`ZORP: ${arcoGame.playerScore}/${arcoGame.targetScore}`, 20, 20);
    
    ctx.fillStyle = "#e74c3c";
    let mestreText = `MESTRE: ${arcoGame.mestreScore}/${arcoGame.targetScore}`;
    ctx.fillText(mestreText, canvas.width - ctx.measureText(mestreText).width - 20, 20);
}

function resetArco() {
    arcoGame.playerScore = 0;
    arcoGame.mestreScore = 0;
    arcoGame.playerX = 150;
    arcoGame.mestreX = canvas.width - 150;
    arcoGame.playerY = canvas.height - 40; 
    arcoGame.mestreY = canvas.height - 40;
    arcoGame.playerState = 'IDLE';
    arcoGame.mestreState = 'IDLE';
    arcoGame.playerShootCooldown = 0;
    arcoGame.mestreShootCooldown = 0;
    arcoGame.arrows = [];
    arcoGame.targets = [];
    arcoGame.spawnTimer = 0;
}

function spawnArcoTarget() {
    const speeds = [1.5, 2.5, 3.5];
    const selectedSpeed = speeds[Math.floor(Math.random() * speeds.length)];
    const side = Math.random() > 0.5 ? 1 : -1;
    const startX = side === 1 ? -20 : canvas.width + 20;
    
    arcoGame.targets.push({
        x: startX,
        y: 60 + Math.random() * 80,
        radius: 18 - selectedSpeed * 2, 
        speedX: selectedSpeed * side,
        points: Math.round(selectedSpeed * 10)
    });
}

function updateArco() {
    hintText.innerText = "[A D] MOVER | [ESPAÇO] ATIRAR FLECHA";

    arcoGame.spawnTimer++;
    if (arcoGame.spawnTimer > 45 && arcoGame.targets.length < 6) {
        spawnArcoTarget();
        arcoGame.spawnTimer = 0;
    }

    let isMoving = false;
    if (arcoGame.playerState !== 'SHOOT') {
        if (keys.a) {
            arcoGame.playerX = Math.max(30, arcoGame.playerX - arcoGame.playerSpeed);
            isMoving = true;
        }
        if (keys.d) {
            arcoGame.playerX = Math.min(canvas.width / 2 - 20, arcoGame.playerX + arcoGame.playerSpeed);
            isMoving = true;
        }
        arcoGame.playerState = isMoving ? 'MOVE' : 'IDLE';
    }

    if (arcoGame.playerShootCooldown > 0) arcoGame.playerShootCooldown--;
    if (keys.space && arcoGame.playerShootCooldown === 0) {
        arcoGame.playerState = 'SHOOT';
        arcoGame.playerShootTimer = 15;
        
        arcoGame.arrows.push({
            x: arcoGame.playerX, 
            y: arcoGame.playerY - 40,
            speedY: -8,
            owner: 'PLAYER'
        });
        arcoGame.playerShootCooldown = 25;
    }

    if (arcoGame.playerState === 'SHOOT') {
        arcoGame.playerShootTimer--;
        if (arcoGame.playerShootTimer <= 0) arcoGame.playerState = 'IDLE';
    } else {
        arcoGame.playerFrameTimer++;
        if (arcoGame.playerFrameTimer > 6) {
            arcoGame.playerFrameTimer = 0;
            arcoGame.playerFrame = isMoving ? (arcoGame.playerFrame + 1) % 3 : 0;
        }
    }

    if (arcoGame.mestreShootCooldown > 0) arcoGame.mestreShootCooldown--;
    let target = arcoGame.targets.find(t => t.x > canvas.width / 2);
    if (!target && arcoGame.targets.length > 0) target = arcoGame.targets[0];

    let mestreMoving = false;
    if (target && arcoGame.mestreState !== 'SHOOT') {
        let diffX = (target.x + target.speedX * 5) - arcoGame.mestreX; 
        
        if (Math.abs(diffX) > 10) {
            arcoGame.mestreX += Math.sign(diffX) * arcoGame.mestreSpeed;
            mestreMoving = true;
        } else if (arcoGame.mestreShootCooldown === 0) {
            arcoGame.mestreState = 'SHOOT';
            arcoGame.mestreShootTimer = 15;
            
            arcoGame.arrows.push({
                x: arcoGame.mestreX,
                y: arcoGame.mestreY - 40,
                speedY: -8,
                owner: 'MESTRE'
            });
            arcoGame.mestreShootCooldown = 30;
        }
    }
    
    arcoGame.mestreX = Math.max(canvas.width / 2 + 20, Math.min(canvas.width - 30, arcoGame.mestreX));
    if (arcoGame.mestreState !== 'SHOOT') arcoGame.mestreState = mestreMoving ? 'MOVE' : 'IDLE';

    if (arcoGame.mestreState === 'SHOOT') {
        arcoGame.mestreShootTimer--;
        if (arcoGame.mestreShootTimer <= 0) arcoGame.mestreState = 'IDLE';
    } else {
        arcoGame.mestreFrameTimer++;
        if (arcoGame.mestreFrameTimer > 6) {
            arcoGame.mestreFrameTimer = 0;
            arcoGame.mestreFrame = mestreMoving ? (arcoGame.mestreFrame + 1) % 3 : 0;
        }
    }

    for (let i = arcoGame.targets.length - 1; i >= 0; i--) {
        let t = arcoGame.targets[i];
        t.x += t.speedX;
        if (t.x < -30 || t.x > canvas.width + 30) arcoGame.targets.splice(i, 1);
    }

    for (let i = arcoGame.arrows.length - 1; i >= 0; i--) {
        let arr = arcoGame.arrows[i];
        arr.y += arr.speedY; 

        let hit = false;
        for (let j = arcoGame.targets.length - 1; j >= 0; j--) {
            let t = arcoGame.targets[j];
            let dist = Math.hypot(arr.x - t.x, arr.y - t.y);
            
            if (dist <= t.radius + 8) {
                if (arr.owner === 'PLAYER') arcoGame.playerScore += t.points;
                else arcoGame.mestreScore += t.points;

                arcoGame.targets.splice(j, 1);
                hit = true;
                break;
            }
        }
        
        if (hit || arr.y < -10) arcoGame.arrows.splice(i, 1);
    }

    if (arcoGame.playerScore >= arcoGame.targetScore) {
        insignias.arco = true;
        currentScene = "ILHA_ARCO";
        dialogText.innerHTML = `> MESTRE ARQUEIRO: Fantástico! Você venceu a disputa com ${arcoGame.playerScore} pontos!`;
        dialogBox.classList.add("show");
    } else if (arcoGame.mestreScore >= arcoGame.targetScore) {
        currentScene = "ILHA_ARCO";
        dialogText.innerHTML = `> MESTRE ARQUEIRO: Ganhei desta vez! Mova-se rápido para alinhar seus tiros.`;
        dialogBox.classList.add("show");
    }
}

// -------------------------------------------------------------
// ASSETS E MAPEAMENTO EXPLICITO: ESQUI
// -------------------------------------------------------------
const esquiAssets = {
    zorp: new Image(),
    mestre: new Image(),
    elementos: new Image()
};
esquiAssets.zorp.src = "zorp_esqui.png";
esquiAssets.mestre.src = "mestre_esqui.png";
esquiAssets.elementos.src = "elementos_esqui.png";

const ZORP_ESQUI_FRAMES = {
    idle:  { x: 0, y: 0, w: 50, h: 60 },
    left:  { x: 50, y: 0, w: 50, h: 60 },
    right: { x: 100, y: 0, w: 50, h: 60 },
    jump:  { x: 150, y: 0, w: 50, h: 60 },
    hit:   { x: 200, y: 0, w: 50, h: 60 }
};

const MESTRE_ESQUI_FRAMES = {
    idle:   { x: 0, y: 0, w: 60, h: 70 },
    attack: { x: 60, y: 0, w: 60, h: 70 }
};

const ELEMENTOS_ESQUI_FRAMES = {
    arvore:           { x: 0, y: 0, w: 64, h: 80, cw: 20, ch: 10 },
    rocha:            { x: 64, y: 0, w: 48, h: 48, cw: 30, ch: 15 },
    rampa:            { x: 112, y: 0, w: 80, h: 40, cw: 60, ch: 20 },
    bolaDeNeve:       { x: 192, y: 0, w: 48, h: 48, cw: 24, ch: 24 },
    estalactite:      { x: 240, y: 0, w: 32, h: 64, cw: 16, ch: 16 },
    bandeiraAzul:     { x: 272, y: 0, w: 32, h: 64, cw: 5, ch: 5 },
    bandeiraVermelha: { x: 304, y: 0, w: 32, h: 64, cw: 5, ch: 5 },
    bonecoNeve:       { x: 336, y: 0, w: 48, h: 64, cw: 20, ch: 10 }
};

const esquiGame = {
    playerX: 225, 
    playerY: 240, 
    speedX: 5, 
    trackSpeed: 6,
    distance: 0, 
    maxDistance: 4000, 
    score: 0,
    trackOffset: 0,
    obstacles: [],
    isJumping: false,
    jumpTimer: 0,
    maxJumpTimer: 45,
    jumpHeight: 0,
    isHit: false,
    hitTimer: 0,
    bossActive: false,
    bossX: 225,
    bossY: -100,
    bossTimer: 0
};

const TRACK_LEFT = 100;
const TRACK_RIGHT = 350;

function resetEsqui() {
    esquiGame.playerX = canvas.width / 2;
    esquiGame.distance = 0;
    esquiGame.score = 0;
    esquiGame.trackSpeed = 5;
    esquiGame.obstacles = [];
    esquiGame.isHit = false;
    esquiGame.hitTimer = 0;
    esquiGame.isJumping = false;
    esquiGame.jumpHeight = 0;
    esquiGame.bossActive = false;
    esquiGame.bossY = -100;
}

function spawnObstacle() {
    let isDeco = Math.random() > 0.6;
    let type, obsX;

    if (isDeco) {
        const decos = ["arvore", "arvore", "rocha"];
        type = decos[Math.floor(Math.random() * decos.length)];
        obsX = Math.random() > 0.5 ? Math.random() * (TRACK_LEFT - 20) : TRACK_RIGHT + 20 + (Math.random() * (canvas.width - TRACK_RIGHT - 20));
    } else {
        const obs = ["rocha", "rampa", "bandeiraAzul", "bandeiraVermelha", "bonecoNeve"];
        type = obs[Math.floor(Math.random() * obs.length)];
        obsX = TRACK_LEFT + 20 + Math.random() * (TRACK_RIGHT - TRACK_LEFT - 40);
    }

    esquiGame.obstacles.push({
        x: obsX,
        y: -50,
        type: type,
        passed: false
    });
}

function updateEsqui() {
    hintText.innerText = "[A D] MOVER | [ESPAÇO] PULAR RAMPAS";

    if (esquiGame.distance > 0 && esquiGame.distance % 500 === 0) {
        esquiGame.trackSpeed = Math.min(12, esquiGame.trackSpeed + 0.5);
    }

    if (esquiGame.isJumping) {
        esquiGame.jumpTimer--;
        esquiGame.jumpHeight = Math.sin((1 - (esquiGame.jumpTimer / esquiGame.maxJumpTimer)) * Math.PI) * 45;
        
        if (esquiGame.jumpTimer <= 0) {
            esquiGame.isJumping = false;
            esquiGame.jumpHeight = 0;
        }
    }

    if (esquiGame.hitTimer > 0) {
        esquiGame.hitTimer--;
        if (esquiGame.hitTimer === 0) {
            esquiGame.isHit = false;
        }
    } else if (!esquiGame.isJumping) {
        if (keys.a) esquiGame.playerX -= esquiGame.speedX;
        if (keys.d) esquiGame.playerX += esquiGame.speedX;
        
        esquiGame.playerX = Math.max(TRACK_LEFT + 15, Math.min(TRACK_RIGHT - 15, esquiGame.playerX));
    }

    let currentSpeed = esquiGame.isHit ? esquiGame.trackSpeed * 0.4 : esquiGame.trackSpeed;
    esquiGame.distance += currentSpeed * 0.1;
    esquiGame.trackOffset = (esquiGame.trackOffset + currentSpeed) % 40;

    if (Math.random() < 0.08 && !esquiGame.isHit) spawnObstacle();

    if (!esquiGame.bossActive && esquiGame.distance > 500 && Math.random() < 0.002) {
        esquiGame.bossActive = true;
        esquiGame.bossY = -100;
        esquiGame.bossX = esquiGame.playerX;
    }

    if (esquiGame.bossActive) {
        if (esquiGame.bossY < 80) esquiGame.bossY += 2;
        
        esquiGame.bossTimer++;
        if (esquiGame.bossTimer > 100) {
            esquiGame.obstacles.push({
                x: esquiGame.bossX,
                y: esquiGame.bossY + 20,
                type: "bolaDeNeve",
                passed: false
            });
            esquiGame.bossTimer = 0;
            if (Math.random() > 0.5) esquiGame.bossActive = false;
        }
    } else if (esquiGame.bossY > -100) {
        esquiGame.bossY -= 2;
    }

    const pBox = { 
        x: esquiGame.playerX - 10, 
        y: esquiGame.playerY - 5, 
        w: 20, 
        h: 10 
    };

    for (let i = esquiGame.obstacles.length - 1; i >= 0; i--) {
        let obs = esquiGame.obstacles[i];
        let frame = ELEMENTOS_ESQUI_FRAMES[obs.type] || { cw: 20, ch: 20 };
        
        obs.y += currentSpeed;

        if (obs.y > canvas.height + 100) {
            esquiGame.obstacles.splice(i, 1);
            continue;
        }

        if (!obs.passed && obs.y > esquiGame.playerY) {
            obs.passed = true;
            if (!esquiGame.isHit && obs.type !== "arvore") {
                esquiGame.score += 15; 
            }
        }

        let oBox = {
            x: obs.x - (frame.cw / 2),
            y: obs.y - (frame.ch / 2),
            w: frame.cw,
            h: frame.ch
        };

        if (pBox.x < oBox.x + oBox.w && pBox.x + pBox.w > oBox.x &&
            pBox.y < oBox.y + oBox.h && pBox.y + pBox.h > oBox.y) {
            
            if (obs.type === "rampa") {
                if (keys.space && !esquiGame.isJumping) {
                    esquiGame.isJumping = true;
                    esquiGame.jumpTimer = esquiGame.maxJumpTimer;
                    esquiGame.score += 100;
                }
            } else if (!esquiGame.isJumping || esquiGame.jumpHeight < 20) {
                esquiGame.isHit = true;
                esquiGame.hitTimer = 45;
                esquiGame.score = Math.max(0, esquiGame.score - 50);
                esquiGame.obstacles.splice(i, 1);
            }
        }
    }

    if (esquiGame.distance >= esquiGame.maxDistance) {
        esquiGame.score += 1000;
        insignias.esqui = true;
        currentScene = "ILHA_ESQUI";
        dialogText.innerHTML = `> MESTRE DO GELO: Você dominou a descida! Pontuação: ${esquiGame.score}`;
        dialogBox.classList.add("show");
    }
}

function drawEsquiGame() {
    ctx.fillStyle = "#a8d5e5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(TRACK_LEFT, 0, TRACK_RIGHT - TRACK_LEFT, canvas.height);

    ctx.strokeStyle = "#9bc6d6";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(TRACK_LEFT, 0); ctx.lineTo(TRACK_LEFT, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(TRACK_RIGHT, 0); ctx.lineTo(TRACK_RIGHT, canvas.height); ctx.stroke();

    ctx.strokeStyle = "#f0f8ff";
    ctx.lineWidth = 2;
    for (let y = esquiGame.trackOffset - 40; y < canvas.height; y += 40) {
        ctx.beginPath(); ctx.moveTo(TRACK_LEFT + 40, y); ctx.lineTo(TRACK_LEFT + 40, y + 20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(TRACK_RIGHT - 40, y); ctx.lineTo(TRACK_RIGHT - 40, y + 20); ctx.stroke();
    }

    const drawSpriteAncorado = (img, frame, posX, posY, yOffset = 0, isShadow = false) => {
        if (!img.complete || img.naturalWidth === 0) return;
        
        if (isShadow) {
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.beginPath(); ctx.ellipse(posX, posY, frame.w * 0.3, frame.w * 0.1, 0, 0, Math.PI*2); ctx.fill();
            return;
        }

        let drawX = posX - (frame.w / 2);
        let drawY = posY - frame.h - yOffset;
        
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, frame.x, frame.y, frame.w, frame.h, drawX, drawY, frame.w, frame.h);
    };

    let renderList = [...esquiGame.obstacles];
    if (esquiGame.bossActive || esquiGame.bossY > -50) {
        renderList.push({ isBoss: true, x: esquiGame.bossX, y: esquiGame.bossY });
    }
    renderList.push({ isPlayer: true, x: esquiGame.playerX, y: esquiGame.playerY });
    
    renderList.sort((a, b) => a.y - b.y);

    renderList.forEach(obj => {
        if (obj.isBoss) {
            let frame = esquiGame.bossTimer > 80 ? MESTRE_ESQUI_FRAMES.attack : MESTRE_ESQUI_FRAMES.idle;
            drawSpriteAncorado(esquiAssets.mestre, frame, obj.x, obj.y, 0, true);
            drawSpriteAncorado(esquiAssets.mestre, frame, obj.x, obj.y);
            
        } else if (obj.isPlayer) {
            let playerFrame = ZORP_ESQUI_FRAMES.idle;
            if (esquiGame.isHit) playerFrame = ZORP_ESQUI_FRAMES.hit;
            else if (esquiGame.isJumping) playerFrame = ZORP_ESQUI_FRAMES.jump;
            else if (keys.a) playerFrame = ZORP_ESQUI_FRAMES.left;
            else if (keys.d) playerFrame = ZORP_ESQUI_FRAMES.right;

            if (esquiGame.isHit && esquiGame.hitTimer % 8 < 4) ctx.globalAlpha = 0.5;
            
            drawSpriteAncorado(esquiAssets.zorp, playerFrame, obj.x, obj.y, 0, true);
            drawSpriteAncorado(esquiAssets.zorp, playerFrame, obj.x, obj.y, esquiGame.jumpHeight);
            
            ctx.globalAlpha = 1.0;
            
        } else {
            let frame = ELEMENTOS_ESQUI_FRAMES[obj.type];
            if (frame) {
                if (obj.type !== "bandeiraAzul" && obj.type !== "bandeiraVermelha") {
                    drawSpriteAncorado(esquiAssets.elementos, frame, obj.x, obj.y, 0, true);
                }
                drawSpriteAncorado(esquiAssets.elementos, frame, obj.x, obj.y);
            } else {
                ctx.fillStyle = obj.type === 'arvore' ? '#27ae60' : '#7f8c8d';
                ctx.fillRect(obj.x - 15, obj.y - 30, 30, 30);
            }
        }
    });

    ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fillRect(0, 0, canvas.width, 35);
    ctx.fillStyle = "#fff"; ctx.font = "bold 14px monospace";
    
    ctx.fillStyle = "#f1c40f"; ctx.fillText(`PONTOS: ${esquiGame.score}`, 10, 22);
    ctx.fillStyle = "#3498db"; ctx.fillText(`DIST: ${Math.floor(esquiGame.distance)}m`, 150, 22);
    ctx.fillStyle = "#e74c3c";
    let displaySpeed = Math.floor(esquiGame.trackSpeed * 7.5);
    ctx.fillText(`VELOCIDADE: ${displaySpeed} km/h`, 270, 22);
}

// -------------------------------------------------------------
// OBSTÁCULOS E NPCs (HUB)
// -------------------------------------------------------------
const sceneObstacles = {
    HUB: [
        { x: 130, y: 190, w: 40, h: 20, type: 'bench', solid: true },
        { x: 280, y: 190, w: 40, h: 20, type: 'bench', solid: true },
        { x: 130, y: 100, w: 30, h: 30, type: 'flower_bed', solid: false },
        { x: 290, y: 100, w: 30, h: 30, type: 'flower_bed', solid: false }
    ],
    ILHA_CORRIDA: [
        { x: 120, y: 130, w: 35, h: 10, type: 'hurdle', solid: true },
        { x: 220, y: 130, w: 35, h: 10, type: 'hurdle', solid: true },
        { x: 320, y: 130, w: 35, h: 10, type: 'hurdle', solid: true },
        { x: 80, y: 40, w: 40, h: 20, type: 'water_station', solid: true }
    ],
    ILHA_SURF: [
        { x: 35, y: 35, w: 30, h: 30, type: 'palm_tree', solid: true },
        { x: 385, y: 35, w: 30, h: 30, type: 'palm_tree', solid: true },
        { x: 310, y: 180, w: 45, h: 20, type: 'surf_rack', solid: true },
        { x: 90, y: 190, w: 40, h: 40, type: 'umbrella', solid: true },
        { x: 220, y: 220, w: 20, h: 20, type: 'sandcastle', solid: false }
    ],
    ILHA_SKATE: [
        { x: 80, y: 150, w: 50, h: 30, type: 'ramp', solid: false },
        { x: 280, y: 160, w: 70, h: 15, type: 'rail', solid: true },
        { x: 120, y: 210, w: 15, h: 15, type: 'cone', solid: true },
        { x: 150, y: 230, w: 15, h: 15, type: 'cone', solid: true }
    ],
    ILHA_ARCO: [
        { x: 100, y: 45, w: 25, h: 25, type: 'target', solid: true },
        { x: 225, y: 45, w: 25, h: 25, type: 'target', solid: true },
        { x: 350, y: 45, w: 25, h: 25, type: 'target', solid: true },
        { x: 50, y: 100, w: 10, h: 30, type: 'wind_flag', solid: false },
        { x: 380, y: 100, w: 10, h: 30, type: 'wind_flag', solid: false }
    ],
    ILHA_BASQUETE: [
        { x: 210, y: 40, w: 30, h: 20, type: 'hoop', solid: true },
        { x: 330, y: 180, w: 60, h: 30, type: 'bleachers', solid: true }
    ],
    ILHA_ESCALADA: [
        { x: 70, y: 60, w: 30, h: 30, type: 'boulder', solid: true },
        { x: 350, y: 60, w: 30, h: 30, type: 'boulder', solid: true },
        { x: 90, y: 200, w: 40, h: 40, type: 'tent', solid: true }
    ],
    ILHA_ESQUI: [
        { x: 60, y: 70, w: 25, h: 35, type: 'pine_tree', solid: true },
        { x: 360, y: 70, w: 25, h: 35, type: 'pine_tree', solid: true },
        { x: 120, y: 200, w: 20, h: 30, type: 'snowman', solid: true },
        { x: 280, y: 170, w: 25, h: 35, type: 'pine_tree', solid: true }
    ],
    ILHA_PINGPONG: [
        { x: 320, y: 50, w: 60, h: 40, type: 'scoreboard', solid: true }
    ]
};

const npcs = [
    { scene: "HUB", x: 180, y: 180, img: imgTurista, tamanho: 48, msg: "> TURISTA: O arquipelago tem 8 modalidades esportivas!" },
    { scene: "HUB", x: 270, y: 130, img: imgGuia, tamanho: 48, msg: "> GUIA: Explore os caminhos ao Norte, Sul, Leste e Oeste." },

    { scene: "ILHA_ESQUI", x: 120, y: 150, img: imgAlpinista, tamanho: 48, msg: "> ALPINISTA: Brrr! Essa neve esta muito fria." },
    { scene: "ILHA_ESQUI", x: 225, y: 60, img: imgMestreGelo, tamanho: 48, msg: "> MESTRE DO GELO: Desafie a montanha congelada!", isMaster: "JOGO_ESQUI" },

    { scene: "ILHA_PINGPONG", x: 150, y: 220, img: imgAprendiz, tamanho: 48, msg: "> APRENDIZ: Treine seu tempo de reacao para rebatidas." },
    { scene: "ILHA_PINGPONG", x: 225, y: 80, img: imgMestrePingPong, tamanho: 48, msg: "> MESTRE DO PING-PONG: Mostre seus reflexos!", isMaster: "JOGO_PINGPONG" },

    { scene: "ILHA_SKATE", x: 225, y: 80, img: imgTurista, tamanho: 48, msg: "> MESTRE DO SKATE: Acerte as manobras no half-pipe!", isMaster: "JOGO_SKATE" },
    { scene: "ILHA_BASQUETE", x: 225, y: 80, img: imgGuia, tamanho: 48, msg: "> MESTRE DO BASQUETE: Marque pontos antes do tempo acabar!", isMaster: "JOGO_BASQUETE" },
    { scene: "ILHA_ARCO", x: 225, y: 80, img: imgAprendiz, tamanho: 48, msg: "> MESTRE ARQUEIRO: Acerte os alvos mais rapidos que eu!", isMaster: "JOGO_ARCO" },
    { scene: "ILHA_CORRIDA", x: 225, y: 80, img: imgAlpinista, tamanho: 48, msg: "> MESTRE DA CORRIDA: Mantenha o ritmo para nao cansar!", isMaster: "JOGO_CORRIDA" },
    { scene: "ILHA_ESCALADA", x: 225, y: 80, img: imgMestreGelo, tamanho: 48, msg: "> MESTRE DA ESCALADA: Mantenha firme as maos nas pedras!", isMaster: "JOGO_ESCALADA" },
    { scene: "ILHA_SURF", x: 225, y: 80, img: imgTurista, tamanho: 48, msg: "> MESTRE DO SURF: Pegue as maiores ondas sem cair!", isMaster: "JOGO_SURF" }
];

// -------------------------------------------------------------
// 3. CONTROLES DO TECLADO
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// 4. COLISÕES E LÓGICA DE MOVIMENTO (HUB)
// -------------------------------------------------------------
function isColliding(player, box) {
    const playerBox = { x: player.x - 12, y: player.y - 16, width: 24, height: 18 };
    return (
        playerBox.x < box.x + box.width &&
        playerBox.x + playerBox.width > box.x &&
        playerBox.y < box.y + box.height &&
        playerBox.y + playerBox.height > box.y
    );
}

function checkObstacleCollision(nextX, nextY) {
    const feetBox = { x: nextX - 10, y: nextY - 8, w: 20, h: 10 };
    const obstacles = sceneObstacles[currentScene] || [];

    for (let obs of obstacles) {
        if (!obs.solid) continue;
        if (
            feetBox.x < obs.x + obs.w &&
            feetBox.x + feetBox.w > obs.x &&
            feetBox.y < obs.y + obs.h &&
            feetBox.y + feetBox.h > obs.y
        ) {
            return true; 
        }
    }
    return false;
}

function update() {
    const isOverworldScene = !currentScene.startsWith("JOGO_");

    if (isOverworldScene) {
        hintText.innerText = "USE [W A S D] PARA MOVER | [E] PARA FALAR";
        
        let moveX = 0, moveY = 0;
        if (keys.w) moveY -= 1;
        if (keys.s) moveY += 1;
        if (keys.a) moveX -= 1;
        if (keys.d) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
            moveX *= Math.SQRT1_2;
            moveY *= Math.SQRT1_2;
        }

        if (moveX !== 0 || moveY !== 0) {
            zorpSprite.isMoving = true;

            if (moveY > 0) zorpSprite.row = 0;       
            else if (moveY < 0) zorpSprite.row = 1;  
            else if (moveX < 0) zorpSprite.row = 2;  
            else if (moveX > 0) zorpSprite.row = 3;  

            let nextX = player.x + moveX * player.speed;
            let nextY = player.y + moveY * player.speed;

            if (!checkObstacleCollision(nextX, player.y)) player.x = nextX;
            if (!checkObstacleCollision(player.x, nextY)) player.y = nextY;

        } else {
            zorpSprite.isMoving = false;
        }

        if (zorpSprite.isMoving) {
            zorpSprite.timer++;
            if (zorpSprite.timer % zorpSprite.speed === 0) {
                zorpSprite.animIndex = (zorpSprite.animIndex + 1) % zorpSprite.animSequence.length;
            }
        } else {
            zorpSprite.animIndex = 0;
            zorpSprite.timer = 0;
        }

        // Transições de Mapa
        if (currentScene === "HUB") {
            if (player.y < 5 && player.x > 200 && player.x < 240) { currentScene = "ILHA_ESQUI"; player.y = 265; }
            else if (player.x > 430 && player.y > 120 && player.y < 170) { currentScene = "ILHA_PINGPONG"; player.x = 20; }
            else if (player.y > 280 && player.x > 200 && player.x < 240) { currentScene = "ILHA_SKATE"; player.y = 20; }
            else if (player.x < 10 && player.y > 120 && player.y < 170) { currentScene = "ILHA_ARCO"; player.x = 420; }
        } 
        else if (currentScene === "ILHA_ESQUI") {
            if (player.y > 280) { currentScene = "HUB"; player.y = 15; }
        }
        else if (currentScene === "ILHA_PINGPONG") {
            if (player.x < 10) { currentScene = "HUB"; player.x = 420; }
            else if (player.y < 5) { currentScene = "ILHA_SURF"; player.y = 265; }
        }
        else if (currentScene === "ILHA_SKATE") {
            if (player.y < 5) { currentScene = "HUB"; player.y = 270; }
            else if (player.x > 430) { currentScene = "ILHA_BASQUETE"; player.x = 20; }
            else if (player.x < 10) { currentScene = "ILHA_CORRIDA"; player.x = 420; }
        }
        else if (currentScene === "ILHA_BASQUETE") {
            if (player.x < 10) { currentScene = "ILHA_SKATE"; player.x = 420; }
        }
        else if (currentScene === "ILHA_CORRIDA") {
            if (player.x > 430) { currentScene = "ILHA_SKATE"; player.x = 20; }
        }
        else if (currentScene === "ILHA_ARCO") {
            if (player.x > 430) { currentScene = "HUB"; player.x = 20; }
            else if (player.y < 5) { currentScene = "ILHA_ESCALADA"; player.y = 265; }
        }
        else if (currentScene === "ILHA_ESCALADA") {
            if (player.y > 280) { currentScene = "ILHA_ARCO"; player.y = 15; }
        }
        else if (currentScene === "ILHA_SURF") {
            if (player.y > 280) { currentScene = "ILHA_PINGPONG"; player.y = 15; }
        }

      // Interação NPC
        let npcProximo = null;
        for (let npc of npcs) {
            if (npc.scene === currentScene && isColliding(player, {x: npc.x-15, y: npc.y-15, width: 46, height: 50})) {
                npcProximo = npc; 
                break;
            }
        }
        
        if (npcProximo) {
            dialogBox.classList.add("show");
            
            // Adiciona a instrução de atalho apenas se for um Mestre de minigame
            let extra = npcProximo.isMaster ? "<br><br>[ESPAÇO] INICIAR MINIGAME" : "";
            
            // Pressionar 'E' ou 'ESPAÇO' mostra o diálogo
            if (keys.e || keys.space) { 
                dialogText.innerHTML = npcProximo.msg + extra; 

                // Transição de cena ocorre APENAS se apertar ESPAÇO e o NPC for um Mestre
              if (keys.e || keys.space) {
    dialogText.innerHTML = npcProximo.msg + extra;
}

/*
 * INICIAR MINIGAME
 * E OU ESPAÇO FUNCIONAM COMO CONFIRMAÇÃO
 */
if (npcProximo) {
    dialogBox.classList.add("show");

    const extra = npcProximo.isMaster
        ? "<br><br>[E] OU [ESPAÇO] PARA INICIAR"
        : "";

    if (npcProximo.isMaster && (keys.e || keys.space)) {

        const jogo = npcProximo.isMaster;

        if (jogo === "JOGO_PINGPONG") {
            currentScene = "JOGO_PINGPONG";
            resetPingPong(true);

        } else if (jogo === "JOGO_ARCO") {
            currentScene = "JOGO_ARCO";
            resetArco();

        } else if (jogo === "JOGO_BASQUETE") {
            currentScene = "JOGO_BASQUETE";
            resetBasquete();
        }

        dialogBox.classList.remove("show");

        keys.e = false;
        keys.space = false;

    } else if (keys.e || keys.space) {

        dialogText.innerHTML = npcProximo.msg + extra;

    } else {

        dialogText.innerHTML = npcProximo.isMaster
            ? "> (Pressione [E] ou [ESPAÇO] para iniciar)"
            : "> (Pressione [E] para conversar)";
    }

} else {
    dialogBox.classList.remove("show");
}
            } else { 
                dialogText.innerHTML = "> (Pressione [E] para conversar)"; 
            }
        } else { 
            dialogBox.classList.remove("show"); 
        }
    } 
    else if (currentScene === "JOGO_PINGPONG") {
        updatePingPong();
    } else if (currentScene === "JOGO_ESQUI") { 
        updateEsqui();
    } else if (currentScene === "JOGO_ARCO") {
        updateArco();
    } else if (currentScene === "JOGO_BASQUETE") {
        updateBasquete();
    }
}

// -------------------------------------------------------------
// 5. MINIGAME PING PONG
// -------------------------------------------------------------
function resetPingPong(fullReset = false) {
    pingPong.ballX = 225;
    pingPong.ballY = 150;
    pingPong.ballSpeedX = Math.random() > 0.5 ? 3 : -3;
    pingPong.ballSpeedY = (Math.random() - 0.5) * 4;
    pingPong.playerHitTimer = 0;
    pingPong.opponentHitTimer = 0;
    pingPong.isPowerActive = false;
    
    if(fullReset) {
        pingPong.playerScore = 0;
        pingPong.opponentScore = 0;
        pingPong.power = 0;
        pingPong.playerX = 50;
        pingPong.playerY = 140;
    }
}

function updatePingPong() {
    hintText.innerText = "[W A S D] MOVER | [ESPACO] SMASH ESPECIAL!";

    let pMoveX = 0, pMoveY = 0;
    if (keys.w) pMoveY -= pingPong.speed;
    if (keys.s) pMoveY += pingPong.speed;
    if (keys.a) pMoveX -= pingPong.speed;
    if (keys.d) pMoveX += pingPong.speed;

    pingPong.playerX = Math.max(30, Math.min(180, pingPong.playerX + pMoveX));
    pingPong.playerY = Math.max(70, Math.min(230, pingPong.playerY + pMoveY));

    if (pMoveY < 0) pingPong.playerAction = "MOVE_UP";
    else if (pMoveY > 0) pingPong.playerAction = "MOVE_DOWN";
    else pingPong.playerAction = "IDLE";

    if (pingPong.playerHitTimer > 0) {
        pingPong.playerAction = "HIT";
        pingPong.playerHitTimer--;
    }

    if (keys.space && pingPong.power >= pingPong.maxPower) {
        pingPong.isPowerActive = true;
    }

    const targetY = pingPong.ballY;
    if (pingPong.opponentY < targetY - 10) {
        pingPong.opponentY += 2.2;
        pingPong.opponentAction = "MOVE_DOWN";
    } else if (pingPong.opponentY > targetY + 10) {
        pingPong.opponentY -= 2.2;
        pingPong.opponentAction = "MOVE_UP";
    } else {
        pingPong.opponentAction = "IDLE";
    }
    pingPong.opponentY = Math.max(70, Math.min(230, pingPong.opponentY));

    if (pingPong.opponentHitTimer > 0) {
        pingPong.opponentAction = "HIT";
        pingPong.opponentHitTimer--;
    }

    pingPong.ballX += pingPong.ballSpeedX;
    pingPong.ballY += pingPong.ballSpeedY;

    if (pingPong.ballY <= 80 || pingPong.ballY >= 230) pingPong.ballSpeedY *= -1;

    let pBox = { x: pingPong.playerX - 10, y: pingPong.playerY - 10, w: 40, h: 50 };
    if (pingPong.ballX > pBox.x && pingPong.ballX < pBox.x + pBox.w && 
        pingPong.ballY > pBox.y && pingPong.ballY < pBox.y + pBox.h) {
        if (pingPong.ballSpeedX < 0) {
            pingPong.playerHitTimer = 12; 
            if (pingPong.isPowerActive) {
                pingPong.ballSpeedX = 7.5;
                pingPong.power = 0;
                pingPong.isPowerActive = false;
            } else {
                pingPong.ballSpeedX = Math.abs(pingPong.ballSpeedX) + 0.3;
                pingPong.power = Math.min(pingPong.maxPower, pingPong.power + 25);
            }
            pingPong.ballSpeedY = (pingPong.ballY - pingPong.playerY) * 0.15;
        }
    }

    let mBox = { x: pingPong.opponentX - 15, y: pingPong.opponentY - 15, w: 50, h: 60 };
    if (pingPong.ballX > mBox.x && pingPong.ballX < mBox.x + mBox.w && 
        pingPong.ballY > mBox.y && pingPong.ballY < mBox.y + mBox.h) {
        if (pingPong.ballSpeedX > 0) {
            pingPong.opponentHitTimer = 12;
            let returnSpeed = Math.min(4.5, pingPong.ballSpeedX + 0.2); 
            pingPong.ballSpeedX = -Math.abs(returnSpeed);
            pingPong.ballSpeedY = (pingPong.ballY - pingPong.opponentY) * 0.15;
        }
    }

    if (pingPong.ballX < -10) {
        pingPong.opponentScore++;
        resetPingPong(false);
    } else if (pingPong.ballX > canvas.width + 10) {
        pingPong.playerScore++;
        resetPingPong(false);
    }

    if (pingPong.playerScore >= pingPong.maxScore) {
        insignias.pingpong = true;
        currentScene = "ILHA_PINGPONG";
        dialogText.innerHTML = "> MESTRE: Incrivel reflexo! Voce conquistou a Insignia do Ping-Pong!";
        dialogBox.classList.add("show");
    } else if (pingPong.opponentScore >= pingPong.maxScore) {
        currentScene = "ILHA_PINGPONG";
        dialogText.innerHTML = "> MESTRE: Treine mais um pouco e tente novamente!";
        dialogBox.classList.add("show");
    }
}

// -------------------------------------------------------------
// 6. DESENHO DAS ILHAS E OBSTÁCULOS
// -------------------------------------------------------------
function drawWater() {
    ctx.fillStyle = "#2b78e4"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#4a90e2";
    for(let i = 0; i < 30; i++) {
        let wx = (Date.now() / 20 + i * 40) % canvas.width;
        let wy = (i * 15) % canvas.height;
        ctx.fillRect(wx, wy, 12, 2);
    }
}

function drawPath(x, y, w, h) {
    ctx.fillStyle = "#95a5a6"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#7f8c8d"; ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
}

function drawShadow(footX, footY) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(footX, footY - 1, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayer() {
    drawShadow(player.x, player.y);

    if (zorpImg.complete && zorpImg.naturalWidth !== 0) {
        ctx.imageSmoothingEnabled = false;

        const frameWidth = zorpImg.width / zorpSprite.cols;
        const frameHeight = zorpImg.height / zorpSprite.rows;

        const sequences = [
            [1, 0, 1, 2], 
            [1, 0, 1, 2], 
            [1, 2, 1, 0], 
            [1, 2, 1, 0]  
        ];
        
        const currentSeq = sequences[zorpSprite.row];
        const sx = currentSeq[zorpSprite.animIndex] * frameWidth;
        const sy = zorpSprite.row * frameHeight;

        const offsetsY = [0, 0, 15, 15]; 
        const currentOffsetY = offsetsY[zorpSprite.row] || 0;

        const targetHeight = 48;
        const targetWidth = Math.floor(targetHeight * (frameWidth / frameHeight));

        const drawX = Math.floor(player.x - targetWidth / 2);
        const drawY = Math.floor(player.y - targetHeight + currentOffsetY);

        ctx.drawImage(
            zorpImg, 
            Math.floor(sx), Math.floor(sy), Math.floor(frameWidth), Math.floor(frameHeight), 
            drawX, drawY, targetWidth, targetHeight
        );
    }
}

function drawNPC(npc) {
    drawShadow(npc.x, npc.y);
    if (npc.img.complete && npc.img.naturalWidth !== 0) {
        const proporcao = npc.img.width / npc.img.height;
        const larguraCalculada = npc.tamanho * proporcao;
        const alturaCalculada = npc.tamanho;
        const drawX = Math.floor(npc.x - larguraCalculada / 2);
        const drawY = Math.floor(npc.y - alturaCalculada);

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(npc.img, drawX, drawY, larguraCalculada, alturaCalculada);
    }
}

function drawSceneObstacles() {
    const obstacles = sceneObstacles[currentScene] || [];
    obstacles.forEach(obs => {
        switch (obs.type) {
            case 'hurdle':
                ctx.fillStyle = '#ffffff'; ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
                ctx.fillStyle = '#e74c3c'; ctx.fillRect(obs.x + 4, obs.y, 6, obs.h); ctx.fillRect(obs.x + 20, obs.y, 6, obs.h);
                break;
            case 'palm_tree':
                ctx.fillStyle = '#795548'; ctx.fillRect(obs.x + 10, obs.y + 10, 10, 20);
                ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.arc(obs.x + 15, obs.y + 8, 16, 0, Math.PI * 2); ctx.fill();
                break;
            case 'surf_rack':
                ctx.fillStyle = '#8d6e63'; ctx.fillRect(obs.x, obs.y + 10, obs.w, 8);
                ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.ellipse(obs.x + obs.w / 2, obs.y + 6, obs.w / 2, 5, 0, 0, Math.PI * 2); ctx.fill();
                break;
            case 'ramp':
                ctx.fillStyle = '#bdc3c7';
                ctx.beginPath(); ctx.moveTo(obs.x, obs.y + obs.h); ctx.lineTo(obs.x + obs.w, obs.y + obs.h); ctx.lineTo(obs.x + obs.w, obs.y); ctx.closePath(); ctx.fill();
                break;
            case 'rail':
                ctx.fillStyle = '#ecf0f1'; ctx.fillRect(obs.x, obs.y + 2, obs.w, 4);
                ctx.fillRect(obs.x + 8, obs.y + 6, 4, obs.h - 6); ctx.fillRect(obs.x + obs.w - 12, obs.y + 6, 4, obs.h - 6);
                break;
            case 'target':
                ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(obs.x + 12, obs.y + 12, 12, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(obs.x + 12, obs.y + 12, 8, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(obs.x + 12, obs.y + 12, 4, 0, Math.PI * 2); ctx.fill();
                break;
            case 'hoop':
                ctx.fillStyle = '#ffffff'; ctx.fillRect(obs.x, obs.y, obs.w, 8);
                ctx.strokeStyle = '#e67e22'; ctx.lineWidth = 3; ctx.strokeRect(obs.x + 8, obs.y + 8, 14, 10);
                break;
            case 'boulder':
                ctx.fillStyle = '#4e342e'; ctx.beginPath(); ctx.arc(obs.x + 15, obs.y + 15, 15, 0, Math.PI * 2); ctx.fill();
                break;
            case 'pine_tree':
                ctx.fillStyle = '#3e2723'; ctx.fillRect(obs.x + 10, obs.y + 25, 5, 10); 
                ctx.fillStyle = '#1b5e20';
                ctx.beginPath(); ctx.moveTo(obs.x + 12, obs.y); ctx.lineTo(obs.x, obs.y + 25); ctx.lineTo(obs.x + obs.w, obs.y + 25); ctx.closePath(); ctx.fill();
                break;
            case 'bench':
                ctx.fillStyle = '#8d6e63'; ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
                ctx.fillStyle = '#5d4037'; ctx.fillRect(obs.x, obs.y + 5, obs.w, 2); ctx.fillRect(obs.x, obs.y + 12, obs.w, 2);
                break;
            case 'flower_bed': 
                ctx.fillStyle = '#27ae60'; ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
                ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(obs.x + 8, obs.y + 8, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(obs.x + 22, obs.y + 15, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#9b59b6'; ctx.beginPath(); ctx.arc(obs.x + 10, obs.y + 22, 4, 0, Math.PI * 2); ctx.fill();
                break;
            case 'water_station':
                ctx.fillStyle = '#bdc3c7'; ctx.fillRect(obs.x, obs.y + 10, obs.w, 10);
                ctx.fillStyle = '#3498db'; ctx.fillRect(obs.x + 5, obs.y + 5, 6, 5); ctx.fillRect(obs.x + 20, obs.y + 5, 6, 5);
                break;
            case 'umbrella': 
                ctx.fillStyle = '#d35400'; ctx.fillRect(obs.x + 18, obs.y + 15, 4, 25);
                ctx.fillStyle = '#e74c3c'; ctx.beginPath(); ctx.arc(obs.x + 20, obs.y + 15, 20, Math.PI, 0); ctx.fill();
                ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(obs.x + 20, obs.y + 15, 10, Math.PI, 0); ctx.fill();
                break;
            case 'sandcastle': 
                ctx.fillStyle = '#f39c12'; ctx.fillRect(obs.x, obs.y + 5, obs.w, 15);
                ctx.fillRect(obs.x, obs.y, 5, 5); ctx.fillRect(obs.x + 7, obs.y, 6, 5); ctx.fillRect(obs.x + 15, obs.y, 5, 5);
                break;
            case 'cone': 
                ctx.fillStyle = '#e67e22'; ctx.beginPath(); ctx.moveTo(obs.x + 7, obs.y); ctx.lineTo(obs.x, obs.y + 15); ctx.lineTo(obs.x + 15, obs.y + 15); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#ffffff'; ctx.fillRect(obs.x + 3, obs.y + 5, 9, 3);
                break;
            case 'wind_flag':
                ctx.fillStyle = '#7f8c8d'; ctx.fillRect(obs.x, obs.y, 3, obs.h);
                ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.moveTo(obs.x + 3, obs.y + 2); ctx.lineTo(obs.x + 20, obs.y + 8); ctx.lineTo(obs.x + 3, obs.y + 14); ctx.closePath(); ctx.fill();
                break;
            case 'bleachers': 
                ctx.fillStyle = '#95a5a6'; ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
                ctx.fillStyle = '#7f8c8d'; ctx.fillRect(obs.x, obs.y + 10, obs.w, 2); ctx.fillRect(obs.x, obs.y + 20, obs.w, 2);
                break;
            case 'tent': 
                ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.moveTo(obs.x + 20, obs.y); ctx.lineTo(obs.x, obs.y + 30); ctx.lineTo(obs.x + 40, obs.y + 30); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#27ae60'; ctx.beginPath(); ctx.moveTo(obs.x + 20, obs.y); ctx.lineTo(obs.x + 20, obs.y + 30); ctx.lineTo(obs.x + 40, obs.y + 30); ctx.closePath(); ctx.fill();
                ctx.fillStyle = '#333333'; ctx.beginPath(); ctx.moveTo(obs.x + 20, obs.y + 15); ctx.lineTo(obs.x + 10, obs.y + 30); ctx.lineTo(obs.x + 30, obs.y + 30); ctx.closePath(); ctx.fill();
                break;
            case 'snowman': 
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(obs.x + 10, obs.y + 22, 8, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(obs.x + 10, obs.y + 10, 6, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#d35400'; ctx.beginPath(); ctx.moveTo(obs.x + 10, obs.y + 10); ctx.lineTo(obs.x + 18, obs.y + 12); ctx.lineTo(obs.x + 10, obs.y + 14); ctx.closePath(); ctx.fill(); 
                ctx.fillStyle = '#333333'; ctx.fillRect(obs.x + 5, obs.y, 10, 5); ctx.fillRect(obs.x + 2, obs.y + 5, 16, 2); 
                break;
            case 'scoreboard': 
                ctx.fillStyle = '#2c3e50'; ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
                ctx.strokeStyle = '#ecf0f1'; ctx.lineWidth = 2; ctx.strokeRect(obs.x + 2, obs.y + 2, obs.w - 4, obs.h - 4);
                ctx.fillStyle = '#e74c3c'; ctx.font = 'bold 12px monospace'; ctx.fillText('00', obs.x + 10, obs.y + 25);
                ctx.fillStyle = '#3498db'; ctx.fillText('00', obs.x + 35, obs.y + 25);
                ctx.fillStyle = '#ffffff'; ctx.fillRect(obs.x + obs.w / 2 - 1, obs.y + 5, 2, obs.h - 10);
                break;
        }
    });
}

function drawHUB() {
    drawWater();
    drawPath(205, 0, 40, 80);    
    drawPath(205, 220, 40, 80);  
    drawPath(310, 130, 140, 40); 
    drawPath(0, 130, 140, 40);   

    ctx.fillStyle = "#7dbd42";
    ctx.beginPath(); ctx.arc(225, 150, 95, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = "#bdc3c7"; ctx.fillRect(190, 115, 70, 70);
    ctx.strokeStyle = "#7f8c8d"; ctx.strokeRect(190, 115, 70, 70);
}

function drawIlhaEsqui() {
    drawWater();
    ctx.fillStyle = "#ffffff"; ctx.fillRect(15, 15, 420, 270); 
    drawPath(205, 270, 40, 30);
}

function drawIlhaPingPong() {
    drawWater();
    ctx.fillStyle = "#8bc34a"; ctx.fillRect(15, 15, 420, 270); 
    drawPath(0, 130, 30, 40); 
    drawPath(205, 0, 40, 30);
}

function drawIlhaSkate() {
    drawWater();
    ctx.fillStyle = "#9e9e9e"; ctx.fillRect(15, 15, 420, 270); 
    ctx.fillStyle = "#e0e0e0"; ctx.fillRect(60, 60, 330, 180); 
    drawPath(205, 0, 40, 30);
    drawPath(420, 130, 30, 40);
    drawPath(0, 130, 30, 40);
}

function drawIlhaBasquete() {
    drawWater();
    ctx.fillStyle = "#ff9800"; ctx.fillRect(15, 15, 420, 270); 
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2; ctx.strokeRect(40, 40, 370, 220);
    drawPath(0, 130, 30, 40);
}

function drawIlhaArco() {
    drawWater();
    ctx.fillStyle = "#4caf50"; ctx.fillRect(15, 15, 420, 270); 
    drawPath(420, 130, 30, 40);
    drawPath(205, 0, 40, 30);
}

function drawIlhaCorrida() {
    drawWater();
    ctx.fillStyle = "#d84315"; ctx.fillRect(15, 15, 420, 270); 
    ctx.fillStyle = "#4caf50"; ctx.fillRect(70, 60, 310, 180); 
    drawPath(420, 130, 30, 40);
}

function drawIlhaEscalada() {
    drawWater();
    ctx.fillStyle = "#795548"; ctx.fillRect(15, 15, 420, 270); 
    ctx.fillStyle = "#5d4037"; ctx.fillRect(40, 30, 370, 220); 
    drawPath(205, 270, 40, 30);
}

function drawIlhaSurf() {
    drawWater();
    ctx.fillStyle = "#fff59d"; ctx.fillRect(15, 15, 420, 270); 
    drawPath(205, 270, 40, 30);
}

// -------------------------------------------------------------
// 7. RENDERIZADOR DO PING PONG E HUD GERAL
// -------------------------------------------------------------
function drawPingPongGame() {
    ctx.imageSmoothingEnabled = false;

    if (bgPingPong.complete) ctx.drawImage(bgPingPong, 0, 0, canvas.width, canvas.height);

    let zorpSpriteImg = imgZorpIdle;
    if (pingPong.playerAction === "MOVE_UP") zorpSpriteImg = imgZorpMU;
    else if (pingPong.playerAction === "MOVE_DOWN") zorpSpriteImg = imgZorpMD;
    else if (pingPong.playerAction === "HIT") zorpSpriteImg = imgZorpHit;

    let mestreSpriteImg = imgMestreIdle;
    if (pingPong.opponentAction === "MOVE_UP") mestreSpriteImg = imgMestreMU;
    else if (pingPong.opponentAction === "MOVE_DOWN") mestreSpriteImg = imgMestreMD;
    else if (pingPong.opponentAction === "HIT") mestreSpriteImg = imgMestreHit;

    drawShadow(pingPong.playerX + 18, pingPong.playerY + 45);
    drawShadow(pingPong.opponentX + 18, pingPong.opponentY + 45);

    if (zorpSpriteImg.complete) ctx.drawImage(zorpSpriteImg, pingPong.playerX, pingPong.playerY, 36, 48);
    if (mestreSpriteImg.complete) ctx.drawImage(mestreSpriteImg, pingPong.opponentX, pingPong.opponentY, 36, 48);

    if (Math.abs(pingPong.ballSpeedX) > 6) {
        ctx.fillStyle = "#ff5722"; ctx.shadowBlur = 10; ctx.shadowColor = "#ffeb3b";
    } else {
        ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 0;
    }

    ctx.beginPath(); ctx.arc(pingPong.ballX, pingPong.ballY, pingPong.ballRadius, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ffffff"; ctx.font = "bold 16px monospace";
    ctx.fillText(`ZORP: ${pingPong.playerScore}`, 100, 30);
    ctx.fillText(`MESTRE: ${pingPong.opponentScore}`, 270, 30);

    ctx.fillStyle = "#333"; ctx.fillRect(80, 40, 100, 10);
    if (pingPong.isPowerActive || pingPong.power >= pingPong.maxPower) {
        ctx.fillStyle = (Date.now() % 400 < 200) ? "#ff9800" : "#ff5722"; 
        ctx.fillText("ESPAÇO: SMASH!", 80, 65);
    } else {
        ctx.fillStyle = "#ffeb3b";
    }
    
    let barraPreenchida = (pingPong.power / pingPong.maxPower) * 100;
    ctx.fillRect(80, 40, barraPreenchida, 10);
    ctx.strokeStyle = "#fff"; ctx.strokeRect(80, 40, 100, 10);
}

function drawHUD() {
    const size = 15;
    const spacing = 22;
    const startX = 20;
    const startY = canvas.height - 30; 
    let i = 0;

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(5, canvas.height - 40, 200, 35);

    for (let esporte in insignias) {
        ctx.fillStyle = insignias[esporte] ? "#f1c40f" : "#7f8c8d";
        ctx.beginPath();
        ctx.arc(startX + (i * spacing), startY, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();
        i++;
    }
}

// -------------------------------------------------------------
// 8. LOOP PRINCIPAL
// -------------------------------------------------------------
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentScene === "HUB") drawHUB();
    else if (currentScene === "ILHA_ESQUI") drawIlhaEsqui();
    else if (currentScene === "ILHA_PINGPONG") drawIlhaPingPong();
    else if (currentScene === "ILHA_SKATE") drawIlhaSkate();
    else if (currentScene === "ILHA_BASQUETE") drawIlhaBasquete();
    else if (currentScene === "ILHA_ARCO") drawIlhaArco();
    else if (currentScene === "ILHA_CORRIDA") drawIlhaCorrida();
    else if (currentScene === "ILHA_ESCALADA") drawIlhaEscalada();
    else if (currentScene === "ILHA_SURF") drawIlhaSurf();
    else if (currentScene === "JOGO_PINGPONG") drawPingPongGame();
    else if (currentScene === "JOGO_ESQUI") drawEsquiGame();
    else if (currentScene === "JOGO_ARCO") drawArcoGame();
    else if (currentScene === "JOGO_BASQUETE") drawBasqueteGame();
    
    if (!currentScene.startsWith("JOGO_")) {
        drawSceneObstacles();
        for (let npc of npcs) {
            if (npc.scene === currentScene) drawNPC(npc);
        }
        drawPlayer();
    }
    
    if (currentScene !== "JOGO_ESQUI" && currentScene !== "JOGO_ARCO" && currentScene !== "JOGO_BASQUETE") {
        drawHUD();
    }
}

function gameLoop() { 
    update(); 
    draw(); 
    requestAnimationFrame(gameLoop); 
}

gameLoop();