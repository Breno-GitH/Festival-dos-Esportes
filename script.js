const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialogBox = document.getElementById("dialog-box");
const dialogText = document.getElementById("dialog-text");
const hintText = document.getElementById("hint-text");

let currentScene = "HUB"; 

// Registro de Insígnias dos Esportes
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
// CONFIGURAÇÃO DE SPRITES
// -------------------------------------------------------------
const SPRITES_CONFIG = {
    pedras: [
        { x: 0.668, y: 0.825, w: 0.030, h: 0.052 }, // Pedra Vermelha
        { x: 0.715, y: 0.825, w: 0.030, h: 0.052 }, // Pedra Laranja
        { x: 0.765, y: 0.825, w: 0.030, h: 0.052 }, // Pedra Amarela
        { x: 0.715, y: 0.893, w: 0.030, h: 0.052 }  // Pedra Azul
    ],
    zorp: {
        idle: { x: 0.90, y: 0.52, w: 0.08, h: 0.22 },
        subindo: [
            { x: 0.17, y: 0.52, w: 0.08, h: 0.22 },
            { x: 0.25, y: 0.52, w: 0.08, h: 0.22 }
        ]
    }
}   

// -------------------------------------------------------------
// 1. CARREGAMENTO DAS IMAGENS
// -------------------------------------------------------------
const zorpImg = new Image(); zorpImg.src = "zorp.png";
const bgPingPong = new Image(); bgPingPong.src = "bg_pingpong.png?v=2";
const imgArcoSprites = new Image(); imgArcoSprites.src = "Sprites_MG_AF.png"; 
const imgArenaArco = new Image(); imgArenaArco.src = "Arena_Arco.png"; 

// Sprites Basquete
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

// Sprites Escalada
const imgEscaladaSprites = new Image(); 
imgEscaladaSprites.src = "Sprites_Escalada.png";

const imgMestreEscalada = new Image(); imgMestreEscalada.src = "npc_mestre_escalada.png";
const imgGuiaTrilha = new Image(); imgGuiaTrilha.src = "npc_guia_trilha.png";
const imgFotografo = new Image(); imgFotografo.src = "npc_fotografo.png";
const imgAtleta = new Image(); imgAtleta.src = "npc_atleta.png";
const imgIniciante = new Image(); imgIniciante.src = "npc_iniciante.png";
const imgGeologa = new Image(); imgGeologa.src = "npc_geologa.png";
const imgChef = new Image(); imgChef.src = "npc_chef.png";
const imgGuarda = new Image(); imgGuarda.src = "npc_guarda.png";

// -------------------------------------------------------------
// 2. OBJETOS, OBSTÁCULOS E ESTADOS DO JOGO
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
    power: 0, maxPower: 100, isPowerActive: false,
    gameState: 'TUTORIAL',
    win: false
};

// -------------------------------------------------------------
// TELAS DE INTERFACE (UI OVERLAYS)
// -------------------------------------------------------------
function drawOverlayScreen(title, lines, titleColor = "#f1c40f") {
    // Fundo escuro translúcido
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.textAlign = "center";
    
    // Título
    ctx.fillStyle = titleColor;
    ctx.font = "bold 26px monospace";
    ctx.fillText(title, canvas.width / 2, 80);
    
    // Linhas de explicação
    ctx.fillStyle = "#ffffff";
    ctx.font = "14px monospace";
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, 130 + (index * 25));
    });
    
    // Instrução para continuar piscando
    ctx.fillStyle = (Date.now() % 1000 < 500) ? "#ffffff" : "#f1c40f"; 
    ctx.font = "bold 14px monospace";
    ctx.fillText("[Pressione ESPAÇO para continuar]", canvas.width / 2, canvas.height - 40);
    
    ctx.textAlign = "left"; // Reset
}


// -------------------------------------------------------------
// MINIGAME ESCALADA (INSPIRADO EM DOODLE CHAMPION ISLAND GAMES)
// -------------------------------------------------------------
const escaladaGame = {
    vida: 3,
    maxVida: 3,
    invulTimer: 0,
    shakeTimer: 0,
    
    playerX: 225,
    playerY: 220,
    pedraAtual: null,
    targetPedra: null,
    
    emPulo: false,
    puloProgresso: 0,
    puloVelocidade: 0.09,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    
    pedrasGeradas: [],
    objetosCaindo: [],
    particulas: [],
    
    alturaAtual: 0,
    alturaTotal: 1200, 
    checkpointAltura: 0,
    
    ventoForca: 0,
    ventoTimer: 0,
    ventoDuracao: 0,
    ventoDirecao: 1, // 1 para direita, -1 para esquerda
    ventoParticulas: [],
    
    morteMotivo: "",
    isGameOver: false,
    
    minimapaX: 20,
    minimapaY: 50,
    minimapaLargura: 12,
    minimapaAltura: 190,
    
    mensagemAtual: "",
    mensagemTimer: 0,
    mensagensMostradas: {},
    
    gameState: 'TUTORIAL',
    win: false
};

function resetEscalada() {
    escaladaGame.vida = 3;
    escaladaGame.invulTimer = 0;
    escaladaGame.shakeTimer = 0;
    escaladaGame.playerX = 225;
    escaladaGame.playerY = 220;
    escaladaGame.alturaAtual = 0;
    escaladaGame.checkpointAltura = 0;
    escaladaGame.emPulo = false;
    escaladaGame.puloProgresso = 0;
    escaladaGame.isGameOver = false;
    escaladaGame.morteMotivo = "";
    escaladaGame.objetosCaindo = [];
    escaladaGame.particulas = [];
    escaladaGame.ventoForca = 0;
    escaladaGame.ventoTimer = 180;
    escaladaGame.ventoDuracao = 0;
    escaladaGame.ventoParticulas = [];
    escaladaGame.mensagemAtual = "";
    escaladaGame.mensagemTimer = 0;
    escaladaGame.mensagensMostradas = {200: false, 500: false, 800: false, 1100: false};
    
    escaladaGame.pedrasGeradas = [
        { x: 225, y: 220, r: 16, tipo: 'normal', id: 1 },
        { x: 160, y: 160, r: 16, tipo: 'normal', id: 2 },
        { x: 290, y: 160, r: 16, tipo: 'normal', id: 3 },
        { x: 225, y: 100, r: 16, tipo: 'moving', baseX: 225, amplitude: 50, speed: 1.2, offset: 0, id: 4 }
    ];
    escaladaGame.pedraAtual = escaladaGame.pedrasGeradas[0];
    escaladaGame.targetPedra = null;
    escaladaGame.gameState = 'TUTORIAL';
}

function encontrarMelhorPedra(dirX) {
    if (escaladaGame.pedrasGeradas.length === 0) return null;
    
    let melhor = null;
    let menorScore = Infinity;

    for (let p of escaladaGame.pedrasGeradas) {
        if (p === escaladaGame.pedraAtual || p.quebrada) continue;

        let dx = p.x - escaladaGame.playerX;
        let dy = p.y - escaladaGame.playerY;

        // A pedra precisa estar acima (dy negativo) ou próxima no mesmo nível
        if (dy < 10 && dy > -180) {
            let valido = false;
            if (dirX < 0 && dx < -15) valido = true;
            else if (dirX > 0 && dx > 15) valido = true;
            else if (dirX === 0 && Math.abs(dx) <= 90) valido = true;

            if (valido) {
                let dist = Math.hypot(dx, dy);
                if (dist < menorScore && dist <= 210) {
                    menorScore = dist;
                    melhor = p;
                }
            }
        }
    }
    return melhor;
}

function tentarPular() {
    if (escaladaGame.emPulo || escaladaGame.isGameOver) return;

    let dirX = 0;
    if (keys.a) dirX = -1;
    if (keys.d) dirX = 1;

    let alvo = encontrarMelhorPedra(dirX);
    // Se não encontrou na direção exata, tenta a pedra mais próxima acima
    if (!alvo) alvo = encontrarMelhorPedra(0);

    if (alvo) {
        escaladaGame.emPulo = true;
        escaladaGame.puloProgresso = 0;
        escaladaGame.startX = escaladaGame.playerX;
        escaladaGame.startY = escaladaGame.playerY;
        escaladaGame.targetX = alvo.x;
        escaladaGame.targetY = alvo.y;
        escaladaGame.targetPedra = alvo;

        // Efeito de poeira de pulo
        criarPoeira(escaladaGame.playerX, escaladaGame.playerY, '#8d6e63', 5);
    }
}

function criarPoeira(x, y, cor, qtd = 6) {
    for (let i = 0; i < qtd; i++) {
        escaladaGame.particulas.push({
            x: x + (Math.random() * 16 - 8),
            y: y + (Math.random() * 10 - 5),
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2 - 1,
            life: 20 + Math.random() * 15,
            maxLife: 35,
            cor: cor,
            r: 2 + Math.random() * 2.5
        });
    }
}

function atualizarAnimacaoPulo() {
    if (!escaladaGame.emPulo) return;

    escaladaGame.puloProgresso += escaladaGame.puloVelocidade;

    // Atualiza destino se a pedra de destino for móvel
    if (escaladaGame.targetPedra && escaladaGame.targetPedra.tipo === 'moving') {
        escaladaGame.targetX = escaladaGame.targetPedra.x;
    }

    if (escaladaGame.puloProgresso >= 1) {
        escaladaGame.puloProgresso = 1;
        escaladaGame.emPulo = false;
        escaladaGame.playerX = escaladaGame.targetX;
        escaladaGame.playerY = escaladaGame.targetY;
        escaladaGame.pedraAtual = escaladaGame.targetPedra;
        escaladaGame.targetPedra = null;

        // Chegada na pedra
        if (escaladaGame.pedraAtual) {
            criarPoeira(escaladaGame.playerX, escaladaGame.playerY, '#d7ccc8', 6);
            
            // Pedra quebradiça começa a rachar
            if (escaladaGame.pedraAtual.tipo === 'brittle') {
                escaladaGame.pedraAtual.quebrando = true;
            }
            
            // Checkpoint / Lanterna recupera vida
            if (escaladaGame.pedraAtual.tipo === 'checkpoint' && !escaladaGame.pedraAtual.coletado) {
                escaladaGame.pedraAtual.coletado = true;
                if (escaladaGame.vida < escaladaGame.maxVida) {
                    escaladaGame.vida++;
                }
                escaladaGame.checkpointAltura = escaladaGame.alturaAtual;
                criarPoeira(escaladaGame.playerX, escaladaGame.playerY, '#f1c40f', 15);
            }
        }
    } else {
        const t = escaladaGame.puloProgresso;
        // Interpolação com influência de vento
        let ventoDesvio = 0;
        if (escaladaGame.ventoDuracao > 0) {
            ventoDesvio = Math.sin(t * Math.PI) * (escaladaGame.ventoForca * 12);
        }
        
        escaladaGame.playerX = escaladaGame.startX + (escaladaGame.targetX - escaladaGame.startX) * t + ventoDesvio;

        const alturaArco = 32; 
        const interpolacaoY = escaladaGame.startY + (escaladaGame.targetY - escaladaGame.startY) * t;
        escaladaGame.playerY = interpolacaoY - Math.sin(t * Math.PI) * alturaArco;
    }
}

function atualizarCameraEMundo() {
    const limiteTelaY = 175;

    if (escaladaGame.playerY < limiteTelaY) {
        const diferenca = limiteTelaY - escaladaGame.playerY;
        escaladaGame.playerY = limiteTelaY;
        escaladaGame.alturaAtual += diferenca;

        for (let i = 0; i < escaladaGame.pedrasGeradas.length; i++) {
            escaladaGame.pedrasGeradas[i].y += diferenca;
        }

        if (escaladaGame.emPulo) {
            escaladaGame.startY += diferenca;
            escaladaGame.targetY += diferenca;
        }
    }
}

let pedraIdCounter = 10;
function gerarNovaCamadaDePedras() {
    let menorY = escaladaGame.pedrasGeradas.length > 0 
        ? Math.min(...escaladaGame.pedrasGeradas.map(p => p.y)) 
        : 180;
        
    // Progresso relativo
    const progresso = escaladaGame.alturaAtual / escaladaGame.alturaTotal;
    
    // Chance de tipos especiais baseado na altitude
    const tipos = ['normal', 'normal'];
    if (progresso > 0.15) tipos.push('moving');
    if (progresso > 0.3) tipos.push('brittle');
    if (progresso > 0.5) tipos.push('moving', 'brittle');

    // A cada ~300m gera um checkpoint lanterna
    const proxCheckpoint = Math.floor((escaladaGame.alturaAtual + 100) / 300) * 300;
    const isCheckpoint = (proxCheckpoint > 0 && Math.abs(escaladaGame.alturaAtual - proxCheckpoint) < 60);

    const qtd = isCheckpoint ? 1 : 2;
    for (let i = 0; i < qtd; i++) {
        let posX = isCheckpoint ? 225 : (70 + (i * 150) + (Math.random() * 60 - 30));
        let posY = menorY - 50 - Math.random() * 20;
        let tipo = isCheckpoint ? 'checkpoint' : tipos[Math.floor(Math.random() * tipos.length)];

        let novaPedra = {
            id: ++pedraIdCounter,
            x: posX,
            y: posY,
            r: isCheckpoint ? 18 : 15,
            tipo: tipo
        };

        if (tipo === 'moving') {
            novaPedra.baseX = posX;
            novaPedra.amplitude = 40 + Math.random() * 35;
            novaPedra.speed = 1.0 + Math.random() * 1.2;
            novaPedra.offset = Math.random() * Math.PI * 2;
        } else if (tipo === 'brittle') {
            novaPedra.tempoRestante = 45; // ~0.75 segundos antes de quebrar
            novaPedra.quebrando = false;
            novaPedra.quebrada = false;
        } else if (tipo === 'checkpoint') {
            novaPedra.coletado = false;
        }

        escaladaGame.pedrasGeradas.push(novaPedra);
    }
}

function gerenciarPedras() {
    const alturaTela = canvas.height || 300;
    
    // Atualiza pedras móveis e quebradiças
    const now = Date.now();
    for (let p of escaladaGame.pedrasGeradas) {
        if (p.tipo === 'moving') {
            p.x = p.baseX + Math.sin(now * 0.0025 * p.speed + p.offset) * p.amplitude;
            // Se o jogador estiver nesta pedra móvel e não estiver pulando, move junto
            if (escaladaGame.pedraAtual === p && !escaladaGame.emPulo) {
                escaladaGame.playerX = p.x;
            }
        } else if (p.tipo === 'brittle' && p.quebrando && !p.quebrada) {
            p.tempoRestante--;
            if (Math.random() < 0.3) {
                criarPoeira(p.x, p.y, '#e74c3c', 2);
            }
            if (p.tempoRestante <= 0) {
                p.quebrada = true;
                criarPoeira(p.x, p.y, '#c0392b', 12);
                escaladaGame.shakeTimer = 8;
                
                // Se o jogador ainda estiver nela, cai e perde vida
                if (escaladaGame.pedraAtual === p && !escaladaGame.emPulo) {
                    aplicarDanoJogador("A pedra desmoronou sob seus pés!");
                    // Tenta recolocar em uma pedra abaixo
                    let pedrasAbaixo = escaladaGame.pedrasGeradas.filter(item => item !== p && !item.quebrada && item.y > p.y);
                    if (pedrasAbaixo.length > 0) {
                        pedrasAbaixo.sort((a, b) => a.y - b.y);
                        escaladaGame.pedraAtual = pedrasAbaixo[0];
                        escaladaGame.playerX = escaladaGame.pedraAtual.x;
                        escaladaGame.playerY = escaladaGame.pedraAtual.y;
                    }
                }
            }
        }
    }

    // Remove pedras que saíram da tela por baixo
    escaladaGame.pedrasGeradas = escaladaGame.pedrasGeradas.filter(pedra => pedra.y < alturaTela + 60);

    if (escaladaGame.pedrasGeradas.length === 0) {
        gerarNovaCamadaDePedras();
        return;
    }

    let menorY = Math.min(...escaladaGame.pedrasGeradas.map(p => p.y));
    if (menorY > 40) {
        gerarNovaCamadaDePedras();
    }
}

function aplicarDanoJogador(motivo) {
    if (escaladaGame.invulTimer > 0 || escaladaGame.isGameOver) return;

    escaladaGame.vida--;
    escaladaGame.invulTimer = 60; // 1 segundo invulnerável
    escaladaGame.shakeTimer = 12; // Tremor de tela

    if (escaladaGame.vida <= 0) {
        finalizarMinigame("DERROTA");
    }
}

function gerenciarVento() {
    if (escaladaGame.ventoDuracao > 0) {
        escaladaGame.ventoDuracao--;
        
        // Gera partículas visuais de vento
        if (Math.random() < 0.7) {
            escaladaGame.ventoParticulas.push({
                x: escaladaGame.ventoDirecao > 0 ? -20 : canvas.width + 20,
                y: Math.random() * canvas.height,
                vx: escaladaGame.ventoDirecao * (6 + Math.random() * 4),
                vy: (Math.random() - 0.5) * 1.5,
                len: 20 + Math.random() * 25,
                alpha: 0.8
            });
        }
    } else {
        escaladaGame.ventoForca = 0;
        escaladaGame.ventoTimer--;
        if (escaladaGame.ventoTimer <= 0) {
            // Inicia nova rajada de vento
            escaladaGame.ventoDuracao = 180 + Math.floor(Math.random() * 120); // 3 a 5 seg
            escaladaGame.ventoTimer = 350 + Math.floor(Math.random() * 250);
            escaladaGame.ventoDirecao = Math.random() < 0.5 ? 1 : -1;
            escaladaGame.ventoForca = 1.0 + Math.random() * 0.8;
        }
    }

    // Atualiza partículas de vento
    for (let i = escaladaGame.ventoParticulas.length - 1; i >= 0; i--) {
        let vp = escaladaGame.ventoParticulas[i];
        vp.x += vp.vx;
        vp.y += vp.vy;
        vp.alpha -= 0.015;
        if (vp.alpha <= 0 || vp.x < -50 || vp.x > canvas.width + 50) {
            escaladaGame.ventoParticulas.splice(i, 1);
        }
    }
}

function gerenciarObjetosCaindo() {
    const progresso = escaladaGame.alturaAtual / escaladaGame.alturaTotal;
    
    // Chance de objetos caindo cresce com a altitude
    const chance = 0.018 + progresso * 0.035;
    if (Math.random() < chance) {
        const isSnowball = Math.random() < 0.5;
        escaladaGame.objetosCaindo.push({
            x: 40 + Math.random() * (canvas.width - 80),
            y: escaladaGame.playerY - canvas.height - 20,
            speed: 2.5 + Math.random() * 2.5 + progresso * 1.5,
            r: isSnowball ? 10 : 8,
            type: isSnowball ? 'snowball' : 'boulder',
            rotacao: 0
        });
    }

    const cameraY = escaladaGame.playerY - canvas.height * 0.6;
    
    for (let i = escaladaGame.objetosCaindo.length - 1; i >= 0; i--) {
        let obj = escaladaGame.objetosCaindo[i];
        obj.y += obj.speed;
        obj.rotacao += 0.1;

        // Colisão com Zorp
        let dx = obj.x - escaladaGame.playerX;
        let dy = obj.y - escaladaGame.playerY;
        let dist = Math.hypot(dx, dy);

        if (dist < obj.r + 14) {
            criarPoeira(obj.x, obj.y, obj.type === 'snowball' ? '#ffffff' : '#795548', 10);
            aplicarDanoJogador("Atingido por pedras da montanha!");
            escaladaGame.objetosCaindo.splice(i, 1);
        } else if (obj.y > cameraY + canvas.height + 60) {
            escaladaGame.objetosCaindo.splice(i, 1);
        }
    }
}

function gerenciarParticulas() {
    for (let i = escaladaGame.particulas.length - 1; i >= 0; i--) {
        let p = escaladaGame.particulas[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0) {
            escaladaGame.particulas.splice(i, 1);
        }
    }
}

function checarVitoriaEscalada() {
    if (escaladaGame.alturaAtual >= escaladaGame.alturaTotal) {
        escaladaGame.alturaAtual = escaladaGame.alturaTotal;
        finalizarMinigame("VITORIA"); 
    }
}

function finalizarMinigame(resultado) {
    escaladaGame.gameState = 'GAMEOVER';
    escaladaGame.win = (resultado === "VITORIA");
    if (resultado === "VITORIA") {
        insignias.escalada = true;
        dialogText.innerHTML = "> MESTRE DA ESCALADA: Espetacular! Você dominou o Monte Zorp e conquistou a Insígnia da Escalada!";
    } else {
        dialogText.innerHTML = "> MESTRE DA ESCALADA: A montanha exige reflexos rápidos! Desvie das pedras e cuidado com as rochas frágeis.";
    }
}

function updateEscaladaGame() {
    if (escaladaGame.gameState === 'TUTORIAL') {
        if (keys.space) { 
            escaladaGame.gameState = 'PLAYING'; 
            keys.space = false; 
        }
        return;
    }
    
    if (escaladaGame.gameState === 'GAMEOVER') {
        if (keys.space) { 
            currentScene = "ILHA_ESCALADA"; 
            keys.space = false; 
            dialogBox.classList.add("show");
        }
        return;
    }

    if (escaladaGame.isGameOver) return;

    // Atualiza timers de invulnerabilidade e tremor
    if (escaladaGame.invulTimer > 0) escaladaGame.invulTimer--;
    if (escaladaGame.shakeTimer > 0) escaladaGame.shakeTimer--;

    hintText.innerText = "[A / D] MIRAR NA PEDRA  |  [ESPAÇO] OU [W] PULAR  |  CUIDADO COM AS PEDRAS MÓVEIS!";

    // Identifica mira na pedra mais próxima
    let dirX = 0;
    if (keys.a) dirX = -1;
    if (keys.d) dirX = 1;
    escaladaGame.targetPedra = encontrarMelhorPedra(dirX);
    if (!escaladaGame.targetPedra) escaladaGame.targetPedra = encontrarMelhorPedra(0);

    if ((keys.space || keys.w) && !escaladaGame.emPulo) {
        tentarPular();
        keys.space = false;
        keys.w = false;
    }

    atualizarAnimacaoPulo();
    atualizarCameraEMundo();
    gerenciarPedras();
    gerenciarVento();
    gerenciarObjetosCaindo();
    gerenciarParticulas();
    
    // Mensagens do Mestre ao longo da subida (estilo Champion Island)
    const marcos = [200, 500, 800, 1100];
    const textos = [
        "MESTRE: Bom começo! Desvie das pedras que estou rolando!",
        "MESTRE: Vento forte à frente! Cuidado ao calcular seus pulos!",
        "MESTRE: Rochas frágeis! Não fique parado muito tempo nelas!",
        "MESTRE: Você está quase no cume! Mostre do que é capaz!"
    ];
    for (let i = 0; i < marcos.length; i++) {
        if (escaladaGame.alturaAtual >= marcos[i] && !escaladaGame.mensagensMostradas[marcos[i]]) {
            escaladaGame.mensagemAtual = textos[i];
            escaladaGame.mensagemTimer = 190;
            escaladaGame.mensagensMostradas[marcos[i]] = true;
        }
    }
    
    if (escaladaGame.mensagemTimer > 0) {
        escaladaGame.mensagemTimer--;
    }

    checarVitoriaEscalada();
}

function drawEscaladaGame() {
    const cameraY = escaladaGame.playerY - canvas.height * 0.6;
    
    // Efeito de Tremor de Tela
    let shakeX = 0, shakeY = 0;
    if (escaladaGame.shakeTimer > 0) {
        shakeX = (Math.random() - 0.5) * 6;
        shakeY = (Math.random() - 0.5) * 6;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // 1. Fundo da Parede Montanhosa com gradiente de altitude
    const progresso = Math.min(1, escaladaGame.alturaAtual / escaladaGame.alturaTotal);
    let gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (progresso < 0.4) {
        gradiente.addColorStop(0, "#4e342e");
        gradiente.addColorStop(1, "#3e2723");
    } else if (progresso < 0.8) {
        gradiente.addColorStop(0, "#37474f");
        gradiente.addColorStop(1, "#4e342e");
    } else {
        gradiente.addColorStop(0, "#263238");
        gradiente.addColorStop(1, "#37474f");
    }
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Textura rochosa e fendas nas montanhas
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
        let fendaY = ((i * 70 - (escaladaGame.alturaAtual * 0.5)) % (canvas.height + 70));
        ctx.beginPath();
        ctx.moveTo(30 + (i * 65), fendaY);
        ctx.lineTo(50 + (i * 65), fendaY + 30);
        ctx.lineTo(40 + (i * 65), fendaY + 60);
        ctx.stroke();
    }

    // 2. Partículas de Poeira / Fragmentos
    escaladaGame.particulas.forEach(p => {
        const renderY = p.y - cameraY;
        ctx.fillStyle = p.cor;
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, renderY, p.r, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // 3. Desenhar Pedras / Agarras de Escalada
    escaladaGame.pedrasGeradas.forEach((p) => {
        if (p.quebrada) return;
        const renderY = p.y - cameraY;

        if (renderY + p.r > -40 && renderY - p.r < canvas.height + 40) {
            let shakePedraX = 0;
            if (p.tipo === 'brittle' && p.quebrando) {
                shakePedraX = (Math.random() - 0.5) * 4;
            }

            // Indicador de Mira / Próximo Alvo
            if (escaladaGame.targetPedra === p && !escaladaGame.emPulo) {
                ctx.strokeStyle = "#f1c40f";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(p.x + shakePedraX, renderY, p.r + 5 + Math.sin(Date.now() * 0.01) * 2, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Renderiza de acordo com o tipo de pedra
            if (p.tipo === 'moving') {
                // Pedra Móvel (Azul Cristalina com brilho)
                ctx.fillStyle = "#0288d1";
                ctx.shadowColor = "#29b6f6";
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(p.x + shakePedraX, renderY, p.r + 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#81d4fa";
                ctx.beginPath();
                ctx.arc(p.x + shakePedraX - 3, renderY - 3, p.r * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else if (p.tipo === 'brittle') {
                // Pedra Quebradiça (Avermelhada/Rachada)
                ctx.fillStyle = p.quebrando ? "#e74c3c" : "#d35400";
                ctx.beginPath();
                ctx.arc(p.x + shakePedraX, renderY, p.r, 0, Math.PI * 2);
                ctx.fill();
                // Rachaduras
                ctx.strokeStyle = "#2c3e50";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(p.x - 6 + shakePedraX, renderY - 6);
                ctx.lineTo(p.x + 2 + shakePedraX, renderY);
                ctx.lineTo(p.x + 6 + shakePedraX, renderY + 6);
                ctx.stroke();
            } else if (p.tipo === 'checkpoint') {
                // Lanterna / Ponto de Descanso Dourado
                ctx.fillStyle = "#f39c12";
                ctx.shadowColor = "#f1c40f";
                ctx.shadowBlur = 14;
                ctx.beginPath();
                ctx.arc(p.x, renderY, p.r + 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#fff9c4";
                ctx.beginPath();
                ctx.arc(p.x, renderY, p.r * 0.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            } else {
                // Pedra Normal de Montanha (Textura Rústica)
                ctx.fillStyle = (escaladaGame.pedraAtual === p) ? "#f1c40f" : "#8d6e63";
                ctx.beginPath();
                ctx.arc(p.x, renderY, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                ctx.beginPath();
                ctx.arc(p.x - 3, renderY - 3, p.r * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });

    // 4. Desenhar Jogador (Zorp)
    const playerRenderY = escaladaGame.playerY - cameraY;
    const isBlinking = (escaladaGame.invulTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0);

    if (!isBlinking) {
        if (zorpImg.complete && zorpImg.naturalWidth > 0) {
            // Desenha o sprite do Zorp
            const zW = 40, zH = 48;
            ctx.drawImage(zorpImg, 0, 0, 32, 32, escaladaGame.playerX - zW / 2, playerRenderY - zH + 10, zW, zH);
        } else {
            ctx.fillStyle = "#2ecc71";
            ctx.beginPath();
            ctx.arc(escaladaGame.playerX, playerRenderY, 14, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 5. Desenhar Objetos Caindo (Pedras e Bolas de Neve do Mestre)
    escaladaGame.objetosCaindo.forEach(obj => {
        const renderY = obj.y - cameraY;
        if (obj.type === 'snowball') {
            // Bola de Neve
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(obj.x, renderY, obj.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#b0bec5";
            ctx.beginPath();
            ctx.arc(obj.x - 2, renderY - 2, obj.r * 0.4, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Pedregulho
            ctx.fillStyle = "#5d4037";
            ctx.beginPath();
            ctx.arc(obj.x, renderY, obj.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#8d6e63";
            ctx.beginPath();
            ctx.arc(obj.x - 2, renderY - 2, obj.r * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // 6. Desenhar Vento (Linhas e Rajadas)
    if (escaladaGame.ventoParticulas.length > 0) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        escaladaGame.ventoParticulas.forEach(vp => {
            ctx.globalAlpha = vp.alpha;
            ctx.beginPath();
            ctx.moveTo(vp.x, vp.y);
            ctx.lineTo(vp.x + vp.vx * 3, vp.y + vp.vy * 3);
            ctx.stroke();
        });
        ctx.globalAlpha = 1.0;
    }

    // 7. Mestre no Topo da Montanha com a Bandeira
    const topoDist = (escaladaGame.alturaTotal - escaladaGame.alturaAtual);
    const topoRenderY = escaladaGame.playerY - topoDist - cameraY;
    if (topoRenderY > -150 && topoRenderY < canvas.height) {
        // Platô do Cume
        ctx.fillStyle = "#eceff1";
        ctx.fillRect(80, topoRenderY + 30, canvas.width - 160, 20);
        
        // Bandeira da Vitória
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(220, topoRenderY - 10, 4, 40);
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.moveTo(224, topoRenderY - 10);
        ctx.lineTo(250, topoRenderY);
        ctx.lineTo(224, topoRenderY + 10);
        ctx.closePath();
        ctx.fill();

        // Mestre esperando no topo
        if (imgMestreEscalada.complete) {
            ctx.drawImage(imgMestreEscalada, 260, topoRenderY - 20, 36, 54);
        }
    }

    ctx.restore(); // Restaura contexto pós-tremor de tela

    // 8. HUD (Interface Superior e Minimapa)
    // Minimapa
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(escaladaGame.minimapaX, escaladaGame.minimapaY, escaladaGame.minimapaLargura, escaladaGame.minimapaAltura);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(escaladaGame.minimapaX, escaladaGame.minimapaY, escaladaGame.minimapaLargura, escaladaGame.minimapaAltura);

    const progressoMini = Math.min(1, escaladaGame.alturaAtual / escaladaGame.alturaTotal);
    const posZorpY = escaladaGame.minimapaY + escaladaGame.minimapaAltura - (progressoMini * escaladaGame.minimapaAltura);

    // Marcador do Topo
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(escaladaGame.minimapaX - 3, escaladaGame.minimapaY, 18, 4);

    // Marcador do Zorp
    ctx.fillStyle = "#2ecc71";
    ctx.fillRect(escaladaGame.minimapaX - 4, posZorpY - 2, 20, 5);

    // Barra de Status Superior
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, 32);

    // Vidas (Corações)
    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 15px monospace";
    let coracoes = "";
    for (let v = 0; v < escaladaGame.maxVida; v++) {
        coracoes += (v < escaladaGame.vida) ? "♥ " : "♡ ";
    }
    ctx.fillText(`VIDAS: ${coracoes}`, 80, 21);

    // Altura Atual
    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`ALTITUDE: ${Math.floor(escaladaGame.alturaAtual)}m / ${escaladaGame.alturaTotal}m`, 250, 21);

    // Indicador de Vento no HUD
    if (escaladaGame.ventoDuracao > 0) {
        ctx.fillStyle = (Date.now() % 400 < 200) ? "#00e5ff" : "#ffffff";
        ctx.font = "bold 11px monospace";
        let setaVento = escaladaGame.ventoDirecao > 0 ? ">>>" : "<<<";
        ctx.fillText(`VENTO ${setaVento}`, canvas.width - 90, 21);
    }

    // 9. Caixa de Diálogo do Mestre (Estilo Doodle Champion Island)
    if (escaladaGame.mensagemTimer > 0) {
        ctx.fillStyle = "rgba(20, 20, 30, 0.9)";
        ctx.fillRect(40, 42, canvas.width - 80, 44);
        ctx.strokeStyle = "#f1c40f";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 42, canvas.width - 80, 44);
        
        if (imgMestreEscalada.complete) {
            ctx.drawImage(imgMestreEscalada, 45, 45, 26, 38);
        }
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px monospace";
        ctx.fillText(escaladaGame.mensagemAtual, 80, 68);
    }
    
    // 10. Telas de Tutorial e Fim de Jogo
    if (escaladaGame.gameState === 'TUTORIAL') {
        drawOverlayScreen("ESCALADA NO MONTE ZORP", [
            "Chegue ao cume do monte (1200m)!",
            "Use [A / D] para mirar na pedra desejada.",
            "Aperte [ESPAÇO] ou [W] para saltar de pedra em pedra.",
            "CUIDADO: Pedras azuis se movem, pedras vermelhas quebram!",
            "Desvie dos pedregulhos e bolas de neve que rolam do topo!"
        ], "#f1c40f");
    } else if (escaladaGame.gameState === 'GAMEOVER') {
        if (escaladaGame.win) {
            drawOverlayScreen("VITÓRIA NO CUME!", [
                "Você superou os ventos e pedregulhos!",
                "Alcançou o topo e conquistou a Insígnia da Escalada!"
            ], "#2ecc71");
        } else {
            drawOverlayScreen("QUEDA NA MONTANHA...", [
                "A montanha é implacável!",
                "Mantenha o ritmo, desvie das pedras e tente novamente!"
            ], "#e74c3c");
        }
    }
}
// -------------------------------------------------------------
// MINIGAME ARCO E FLECHA
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
    spawnTimer: 0,
    
    gameState: 'TUTORIAL',
    win: false
};

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
    arcoGame.gameState = 'TUTORIAL';
    arcoGame.win = false;
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
    if (arcoGame.gameState === 'TUTORIAL') {
        if (keys.space) { arcoGame.gameState = 'PLAYING'; keys.space = false; }
        return;
    }
    
    if (arcoGame.gameState === 'GAMEOVER') {
        if (keys.space) { 
            currentScene = "ILHA_ARCO"; 
            keys.space = false; 
            dialogText.innerHTML = arcoGame.win 
                ? `> MESTRE ARQUEIRO: Fantástico! Você venceu a disputa com ${arcoGame.playerScore} pontos!` 
                : `> MESTRE ARQUEIRO: Ganhei desta vez! Mova-se rápido para alinhar seus tiros.`;
            dialogBox.classList.add("show");
        }
        return;
    }

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
        arcoGame.gameState = 'GAMEOVER';
        arcoGame.win = true;
    } else if (arcoGame.mestreScore >= arcoGame.targetScore) {
        arcoGame.gameState = 'GAMEOVER';
        arcoGame.win = false;
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

    // OVERLAYS (Telas)
    if (arcoGame.gameState === 'TUTORIAL') {
        drawOverlayScreen("ARCO E FLECHA", [
            "Seja o primeiro a fazer " + arcoGame.targetScore + " pontos.",
            "Use A e D para mirar a direção.",
            "Aperte ESPAÇO para atirar.",
            "Acerte os alvos antes do Mestre!"
        ], "#e67e22");
    } else if (arcoGame.gameState === 'GAMEOVER') {
        if (arcoGame.win) {
            drawOverlayScreen("VITÓRIA!", ["Sua mira é impecável!", "Insígnia do Arco conquistada!"], "#2ecc71");
        } else {
            drawOverlayScreen("DERROTA...", ["O Mestre Arqueiro foi mais rápido.", "Tente não perder os alvos velozes."], "#e74c3c");
        }
    }
}

// -------------------------------------------------------------
// MINIGAME BASQUETE
// -------------------------------------------------------------
const basqueteGame = {
    phase: 'TUTORIAL',
    round: 0,
    maxRounds: 5,
    playerScore: 0,
    
    playerX: 140,
    playerY: 175,
    playerState: 'IDLE',
    playerFrame: 0,
    playerFrameTimer: 0,

    mestreX: 310,
    mestreY: 175,
    mestreState: 'IDLE',
    mestreFrame: 0,
    mestreFrameTimer: 0,
    
    powerValue: 0,        
    powerDir: 1,          
    powerSpeed: 2.2,      
    powerLocked: -1,      
    powerSweetMin: 40,    
    powerSweetMax: 60,
    
    angleValue: 0,
    angleDir: 1,
    angleSpeed: 2.8,
    angleLocked: -1,
    angleSweetMin: 40,
    angleSweetMax: 60,
    
    ballX: 140,
    ballY: 145,
    ballTargetX: 225,
    ballTargetY: 60,
    ballAnimTimer: 0,
    ballAnimDuration: 40,
    ballStartX: 140,
    ballStartY: 190,
    
    resultTimer: 0,
    resultText: '',
    shotResult: '',
    
    countdownTimer: 0,
    speedIncrease: 0.15,
    
    win: false
};

function resetBasquete() {
    basqueteGame.phase = 'TUTORIAL';
    basqueteGame.round = 0;
    basqueteGame.playerScore = 0;
    basqueteGame.powerSpeed = 2.2;
    basqueteGame.angleSpeed = 2.8;
    basqueteGame.countdownTimer = 60;
    basqueteGame.win = false;
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
    basqueteGame.ballY = 145;
}

function updateBasquete() {
    if (basqueteGame.phase === 'TUTORIAL') {
        if (keys.space) { basqueteGame.phase = 'READY'; keys.space = false; }
        return;
    }
    
    if (basqueteGame.phase === 'GAMEOVER') {
        if (keys.space) { 
            currentScene = "ILHA_BASQUETE"; 
            keys.space = false; 
            dialogBox.classList.add("show");
        }
        return;
    }

    hintText.innerText = "[ESPAÇO] TRAVAR FORÇA / ÂNGULO";
    
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
    else if (basqueteGame.phase === 'RESULT') {
        basqueteGame.resultTimer--;
        
        if (basqueteGame.resultTimer <= 0) {
            if (basqueteGame.round >= basqueteGame.maxRounds) {
                basqueteGame.phase = 'GAMEOVER';
                basqueteGame.win = basqueteGame.playerScore >= 8;
                
                if (basqueteGame.win) {
                    insignias.basquete = true;
                    dialogText.innerHTML = `> MESTRE DO BASQUETE: Incrível! ${basqueteGame.playerScore} pontos! Você é um craque!`;
                } else {
                    dialogText.innerHTML = `> MESTRE DO BASQUETE: ${basqueteGame.playerScore} pontos... Tente acertar o momento perfeito!`;
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

const MESTRE_COLS = 10;
const MESTRE_ROWS = 5;

function drawBasqueteGame() {
    if (imgArenaBasquete.complete && imgArenaBasquete.naturalWidth > 0) {
        ctx.drawImage(imgArenaBasquete, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#c68642'; ctx.fillRect(0, 180, canvas.width, 120);
        ctx.strokeStyle = '#e8a95b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(canvas.width, 180); ctx.stroke();
    }

    ctx.imageSmoothingEnabled = false;

    if (imgMestreBasquete.complete && imgMestreBasquete.naturalWidth > 0) {
        const frameW = imgMestreBasquete.width / MESTRE_COLS;
        const frameH = imgMestreBasquete.height / MESTRE_ROWS;

        const cestaSx = Math.floor(3.65 * frameW);
        const cestaSy = Math.floor(4 * frameH);
        const cestaSw = Math.floor(frameW * 0.85);
        const cestaSh = Math.floor(frameH * 0.85);

        const cestaWidth = 32;
        const cestaHeight = 32;
        
        ctx.drawImage(
            imgMestreBasquete,
            cestaSx, cestaSy, cestaSw, cestaSh,
            225 - cestaWidth / 2, 45, cestaWidth, cestaHeight
        );
    }

    if (imgZorpBasquete.complete && imgZorpBasquete.naturalWidth > 0 &&
        imgMestreBasquete.complete && imgMestreBasquete.naturalWidth > 0) {

        const renderH = 75;

        const zorpFrameW = imgZorpBasquete.width / 10;
        const zorpFrameH = imgZorpBasquete.height / 5;
        const zorpRenderW = renderH * (zorpFrameW / zorpFrameH);

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

        const mestreFrameW = imgMestreBasquete.width / MESTRE_COLS;
        const mestreFrameH = imgMestreBasquete.height / MESTRE_ROWS;
        const mestreRenderW = renderH * (mestreFrameW / mestreFrameH);

        let mCol = 0, mRow = 0;
        if (basqueteGame.mestreState === 'DEFEND') { mCol = 1; mRow = 0; }
        else if (basqueteGame.mestreState === 'WIN') { mCol = 6 + basqueteGame.mestreFrame; mRow = 3; }
        else if (basqueteGame.mestreState === 'LOSE') { mCol = 0; mRow = 0; }

        ctx.drawImage(
            imgMestreBasquete,
            Math.floor(mCol * mestreFrameW), Math.floor(mRow * mestreFrameH),
            Math.floor(mestreFrameW), Math.floor(mestreFrameH),
            Math.floor(basqueteGame.mestreX - mestreRenderW / 2), Math.floor(basqueteGame.mestreY - renderH),
            Math.floor(mestreRenderW), Math.floor(renderH)
        );
    }

    ctx.fillStyle = "#e67e22";
    ctx.beginPath();
    ctx.arc(basqueteGame.ballX, basqueteGame.ballY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d35400";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.strokeStyle = "#a04000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(basqueteGame.ballX - 8, basqueteGame.ballY);
    ctx.lineTo(basqueteGame.ballX + 8, basqueteGame.ballY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(basqueteGame.ballX, basqueteGame.ballY - 8);
    ctx.lineTo(basqueteGame.ballX, basqueteGame.ballY + 8);
    ctx.stroke();

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

    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, 28);
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#f1c40f'; ctx.fillText(`PONTOS: ${basqueteGame.playerScore}`, 15, 19);
    ctx.fillStyle = '#3498db'; ctx.fillText(`ARREMESSO: ${basqueteGame.round}/${basqueteGame.maxRounds}`, 160, 19);
    
    ctx.fillStyle = '#ffffff';
    let phaseLabel = '';
    if (basqueteGame.phase === 'POWER') phaseLabel = '► TRAVE A FORÇA!';
    else if (basqueteGame.phase === 'ANGLE') phaseLabel = '► TRAVE O ÂNGULO!';
    ctx.fillText(phaseLabel, 300, 19);

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

    // OVERLAYS (Telas)
    if (basqueteGame.phase === 'TUTORIAL') {
        drawOverlayScreen("BASQUETE", [
            "Faça pelo menos 8 pontos em " + basqueteGame.maxRounds + " arremessos.",
            "Aperte ESPAÇO para travar a FORÇA.",
            "Aperte ESPAÇO para travar o ÂNGULO.",
            "Tente acertar o centro verde!"
        ], "#e67e22");
    } else if (basqueteGame.phase === 'GAMEOVER') {
        if (basqueteGame.win) {
            drawOverlayScreen("VITÓRIA!", ["Você fez " + basqueteGame.playerScore + " pontos!", "Insígnia do Basquete conquistada!"], "#2ecc71");
        } else {
            drawOverlayScreen("DERROTA...", ["Você fez " + basqueteGame.playerScore + " pontos.", "Faltou pouco, tente novamente!"], "#e74c3c");
        }
    }
}

// -------------------------------------------------------------
// OBSTÁCULOS E NPCs (HUB E ILHAS)
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
        { x: 45, y: 190, w: 40, h: 35, type: 'tent', solid: true },
        { x: 130, y: 220, w: 25, h: 25, type: 'campfire', solid: true },
        { x: 110, y: 140, w: 20, h: 25, type: 'trail_sign', solid: true },
        { x: 330, y: 140, w: 25, h: 20, type: 'climbing_gear', solid: true },
        { x: 35, y: 65, w: 25, h: 35, type: 'pine_tree', solid: true },
        { x: 385, y: 65, w: 25, h: 35, type: 'pine_tree', solid: true },
        { x: 390, y: 200, w: 25, h: 35, type: 'pine_tree', solid: true },
        { x: 80, y: 70, w: 30, h: 30, type: 'boulder', solid: true },
        { x: 340, y: 70, w: 30, h: 30, type: 'boulder', solid: true }
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
    { scene: "HUB", x: 180, y: 180, img: imgTurista, tamanho: 48, msg: "> TURISTA: O arquipélago tem diversas modalidades esportivas!" },
    { scene: "HUB", x: 270, y: 130, img: imgGuia, tamanho: 48, msg: "> GUIA: Explore os caminhos ao Norte, Sul, Leste e Oeste." },

    { scene: "ILHA_ESQUI", x: 120, y: 150, img: imgAlpinista, tamanho: 48, msg: "> ALPINISTA: A vista daqui de cima é espetacular!" },

    { scene: "ILHA_PINGPONG", x: 150, y: 220, img: imgAprendiz, tamanho: 48, msg: "> APRENDIZ: Treine seu tempo de reação para rebatidas." },
    { scene: "ILHA_PINGPONG", x: 225, y: 80, img: imgMestrePingPong, tamanho: 48, msg: "> MESTRE DO PING-PONG: Mostre seus reflexos!", isMaster: "JOGO_PINGPONG" },

    { scene: "ILHA_SKATE", x: 225, y: 80, img: imgTurista, tamanho: 48, msg: "> MESTRE DO SKATE: Acerte as manobras no half-pipe!", isMaster: "JOGO_SKATE" },
    { scene: "ILHA_BASQUETE", x: 225, y: 80, img: imgGuia, tamanho: 48, msg: "> MESTRE DO BASQUETE: Marque pontos antes do tempo acabar!", isMaster: "JOGO_BASQUETE" },
    { scene: "ILHA_ARCO", x: 225, y: 80, img: imgAprendiz, tamanho: 48, msg: "> MESTRE ARQUEIRO: Acerte os alvos mais rápidos que eu!", isMaster: "JOGO_ARCO" },
    { scene: "ILHA_CORRIDA", x: 225, y: 80, img: imgAlpinista, tamanho: 48, msg: "> MESTRE DA CORRIDA: Mantenha o ritmo para não cansar!", isMaster: "JOGO_CORRIDA" },
    
    // NPCs da Ilha da Escalada (Reduzidos para 4 icônicos e bem posicionados)
    { scene: "ILHA_ESCALADA", x: 225, y: 70, img: imgMestreEscalada, tamanho: 48, msg: "> MESTRE DA ESCALADA: O Monte Zorp não perdoa os fracos! Desvie das pedras e alcance o cume!", isMaster: "JOGO_ESCALADA" },
    { scene: "ILHA_ESCALADA", x: 80, y: 140, img: imgGuiaTrilha, tamanho: 48, msg: "> GUIA DE TRILHA: Cuidado lá em cima! O vento sopra forte e algumas pedras rachadas quebram ao pisar!" },
    { scene: "ILHA_ESCALADA", x: 370, y: 140, img: imgGeologa, tamanho: 48, msg: "> GEÓLOGA: As pedras azuis deslizam pela montanha, e as vermelhas estão prestes a desmoronar!" },
    { scene: "ILHA_ESCALADA", x: 95, y: 220, img: imgChef, tamanho: 48, msg: "> CHEF DE ACAMPAMENTO: Uma sopa bem quente para dar energia antes de enfrentar a montanha!" },
    
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
                } else if (jogo === "JOGO_ESCALADA") {
                    currentScene = "JOGO_ESCALADA";
                    resetEscalada();
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
    } 
    else if (currentScene === "JOGO_PINGPONG") {
        updatePingPong();
    } else if (currentScene === "JOGO_ARCO") {
        updateArco();
    } else if (currentScene === "JOGO_BASQUETE") {
        updateBasquete();
    } else if (currentScene === "JOGO_ESCALADA") {
        updateEscaladaGame();
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
        pingPong.gameState = 'TUTORIAL';
        pingPong.win = false;
    }
}

function updatePingPong() {
    if (pingPong.gameState === 'TUTORIAL') {
        if (keys.space) { pingPong.gameState = 'PLAYING'; keys.space = false; }
        return;
    }
    
    if (pingPong.gameState === 'GAMEOVER') {
        if (keys.space) { 
            currentScene = "ILHA_PINGPONG"; 
            keys.space = false; 
            dialogText.innerHTML = pingPong.win ? "> MESTRE: Incrível reflexo! Você conquistou a Insígnia do Ping-Pong!" : "> MESTRE: Treine mais um pouco e tente novamente!";
            dialogBox.classList.add("show");
        }
        return;
    }

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
        pingPong.gameState = 'GAMEOVER';
        pingPong.win = true;
    } else if (pingPong.opponentScore >= pingPong.maxScore) {
        pingPong.gameState = 'GAMEOVER';
        pingPong.win = false;
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
        let larguraCalculada, alturaCalculada, drawX, drawY;

        if (npc.sw && npc.sh) {
            const proporcao = npc.sw / npc.sh;
            larguraCalculada = npc.tamanho * proporcao;
            alturaCalculada = npc.tamanho;
            drawX = Math.floor(npc.x - larguraCalculada / 2);
            drawY = Math.floor(npc.y - alturaCalculada);

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(npc.img, npc.sx, npc.sy, npc.sw, npc.sh, drawX, drawY, larguraCalculada, alturaCalculada);
        } else {
            const proporcao = npc.img.width / npc.img.height;
            larguraCalculada = npc.tamanho * proporcao;
            alturaCalculada = npc.tamanho;
            drawX = Math.floor(npc.x - larguraCalculada / 2);
            drawY = Math.floor(npc.y - alturaCalculada);

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(npc.img, drawX, drawY, larguraCalculada, alturaCalculada);
        }
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
            case 'campfire':
                // Fogueira animada do acampamento base
                ctx.fillStyle = '#424242';
                ctx.beginPath(); ctx.arc(obs.x + 12, obs.y + 16, 11, 0, Math.PI * 2); ctx.fill();
                // Troncos de madeira cruzados
                ctx.fillStyle = '#3e2723';
                ctx.fillRect(obs.x + 3, obs.y + 14, 18, 4);
                ctx.fillRect(obs.x + 10, obs.y + 7, 4, 18);
                // Chamas animadas
                let flameHeight = 10 + Math.sin(Date.now() * 0.015) * 3;
                ctx.fillStyle = '#e67e22';
                ctx.beginPath();
                ctx.moveTo(obs.x + 5, obs.y + 16);
                ctx.lineTo(obs.x + 12, obs.y + 16 - flameHeight);
                ctx.lineTo(obs.x + 19, obs.y + 16);
                ctx.closePath(); ctx.fill();
                // Núcleo amarelo
                ctx.fillStyle = '#f1c40f';
                ctx.beginPath();
                ctx.moveTo(obs.x + 8, obs.y + 16);
                ctx.lineTo(obs.x + 12, obs.y + 18 - flameHeight);
                ctx.lineTo(obs.x + 16, obs.y + 16);
                ctx.closePath(); ctx.fill();
                break;
            case 'trail_sign':
                // Placa de trilha da montanha
                ctx.fillStyle = '#5d4037';
                ctx.fillRect(obs.x + 8, obs.y + 8, 4, obs.h - 8);
                ctx.fillStyle = '#8d6e63';
                ctx.fillRect(obs.x, obs.y, obs.w, 12);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 7px monospace';
                ctx.fillText('▲ CUME', obs.x + 2, obs.y + 9);
                break;
            case 'climbing_gear':
                // Mochila e cordas de escalada
                ctx.fillStyle = '#1565c0';
                ctx.fillRect(obs.x + 2, obs.y + 4, 12, 14); // Mochila
                ctx.fillStyle = '#0d47a1';
                ctx.fillRect(obs.x + 4, obs.y + 7, 8, 5);
                // Corda enrolada
                ctx.strokeStyle = '#f39c12';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(obs.x + 18, obs.y + 11, 6, 0, Math.PI * 2);
                ctx.stroke();
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
    
    // 1. Base da Ilha de Montanha com bordas rochosas
    ctx.fillStyle = "#3e2723";
    ctx.fillRect(15, 15, 420, 270);
    
    // 2. Terreno alpino e platô rochoso
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(25, 25, 400, 250);
    
    // Manchas de grama alpina
    ctx.fillStyle = "#558b2f";
    ctx.fillRect(40, 120, 100, 130);
    ctx.fillRect(310, 120, 100, 130);
    ctx.fillRect(150, 170, 150, 80);

    // 3. Cordilheira de Montanhas Majestosa ao Fundo (Norte)
    // Pico distante da esquerda
    ctx.fillStyle = "#455a64";
    ctx.beginPath();
    ctx.moveTo(30, 90);
    ctx.lineTo(130, 18);
    ctx.lineTo(230, 90);
    ctx.closePath();
    ctx.fill();

    // Pico distante da direita
    ctx.beginPath();
    ctx.moveTo(220, 90);
    ctx.lineTo(320, 18);
    ctx.lineTo(420, 90);
    ctx.closePath();
    ctx.fill();

    // Pico Central Mais Alto (Monte Zorp)
    ctx.fillStyle = "#37474f";
    ctx.beginPath();
    ctx.moveTo(120, 100);
    ctx.lineTo(225, 10);
    ctx.lineTo(330, 100);
    ctx.closePath();
    ctx.fill();

    // Cumes Nevados das Montanhas
    ctx.fillStyle = "#eceff1";
    // Neve do Pico Central
    ctx.beginPath();
    ctx.moveTo(225, 10);
    ctx.lineTo(200, 38);
    ctx.lineTo(215, 32);
    ctx.lineTo(225, 40);
    ctx.lineTo(235, 30);
    ctx.lineTo(250, 38);
    ctx.closePath();
    ctx.fill();

    // Neve do Pico Esquerdo
    ctx.beginPath();
    ctx.moveTo(130, 18);
    ctx.lineTo(110, 36);
    ctx.lineTo(130, 32);
    ctx.lineTo(150, 36);
    ctx.closePath();
    ctx.fill();

    // Neve do Pico Direito
    ctx.beginPath();
    ctx.moveTo(320, 18);
    ctx.lineTo(300, 36);
    ctx.lineTo(320, 32);
    ctx.lineTo(340, 36);
    ctx.closePath();
    ctx.fill();

    // Fendas e rochas da montanha
    ctx.strokeStyle = "#263238";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(225, 40);
    ctx.lineTo(210, 80);
    ctx.moveTo(225, 40);
    ctx.lineTo(240, 85);
    ctx.stroke();

    // 4. Trilha de Terra Batida até a base da montanha
    ctx.fillStyle = "#8d6e63";
    ctx.beginPath();
    ctx.moveTo(200, 270);
    ctx.lineTo(205, 75);
    ctx.lineTo(245, 75);
    ctx.lineTo(250, 270);
    ctx.closePath();
    ctx.fill();

    // Pedregulhos de trilha
    ctx.fillStyle = "#d7ccc8";
    for (let i = 0; i < 6; i++) {
        ctx.fillRect(215 + (i % 2) * 12, 100 + i * 25, 4, 3);
    }

    // Portal/Entrada de Escalada no Norte
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(195, 55, 6, 25);
    ctx.fillRect(249, 55, 6, 25);
    ctx.fillRect(195, 55, 60, 6);
    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 8px monospace";
    ctx.fillText("▲ ENTRADA DO MONTE", 175, 50);

    // Entrada Sul (caminho para o Arquipélago/HUB)
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

    // OVERLAYS (Telas)
    if (pingPong.gameState === 'TUTORIAL') {
        drawOverlayScreen("PING PONG", [
            "Chegue a " + pingPong.maxScore + " pontos para vencer.",
            "Use W A S D para se mover.",
            "Rebata a bola para carregar sua barra.",
            "Aperte ESPAÇO para um Smash Especial!"
        ], "#3498db");
    } else if (pingPong.gameState === 'GAMEOVER') {
        if (pingPong.win) {
            drawOverlayScreen("VITÓRIA!", ["Você derrotou o Mestre e", "ganhou a Insígnia do Ping-Pong!"], "#2ecc71");
        } else {
            drawOverlayScreen("DERROTA...", ["O Mestre foi mais rápido.", "Tente novamente!"], "#e74c3c");
        }
    }
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
    else if (currentScene === "JOGO_ARCO") drawArcoGame();
    else if (currentScene === "JOGO_BASQUETE") drawBasqueteGame();
    else if (currentScene === "JOGO_ESCALADA") drawEscaladaGame();
    
    if (!currentScene.startsWith("JOGO_")) {
        drawSceneObstacles();
        for (let npc of npcs) {
            if (npc.scene === currentScene) drawNPC(npc);
        }
        drawPlayer();
    }
    
    if (currentScene !== "JOGO_ARCO" && currentScene !== "JOGO_BASQUETE" && currentScene !== "JOGO_ESCALADA") {
        drawHUD();
    }
}

function gameLoop() { 
    update(); 
    draw(); 
    requestAnimationFrame(gameLoop); 
}

gameLoop();