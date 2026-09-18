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

// Sprites Escalada (NPCs e Personagens)
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

// Sprites Dedicados de Animação do Zorp na Escalada (Sem pedras nos pés - Linhas 1 a 3)
const imgZorpClimbIdle0 = new Image(); imgZorpClimbIdle0.src = "zorp_climb_idle_0.png?v=3";
const imgZorpClimbIdle1 = new Image(); imgZorpClimbIdle1.src = "zorp_climb_idle_1.png?v=3";
const imgZorpClimbUp0 = new Image(); imgZorpClimbUp0.src = "zorp_climb_up_0.png?v=3";
const imgZorpClimbUp1 = new Image(); imgZorpClimbUp1.src = "zorp_climb_up_1.png?v=3";
const imgZorpClimbUp2 = new Image(); imgZorpClimbUp2.src = "zorp_climb_up_2.png?v=3";
const imgZorpClimbUp3 = new Image(); imgZorpClimbUp3.src = "zorp_climb_up_3.png?v=3";
const imgZorpClimbReachL = new Image(); imgZorpClimbReachL.src = "zorp_climb_reach_left.png?v=3";
const imgZorpClimbReachR = new Image(); imgZorpClimbReachR.src = "zorp_climb_reach_right.png?v=3";
const imgZorpClimbJumpUp = new Image(); imgZorpClimbJumpUp.src = "zorp_climb_jump_up.png?v=3";
const imgZorpClimbJumpL = new Image(); imgZorpClimbJumpL.src = "zorp_climb_jump_left.png?v=3";
const imgZorpClimbJumpR = new Image(); imgZorpClimbJumpR.src = "zorp_climb_jump_right.png?v=3";
const imgZorpClimbHit = new Image(); imgZorpClimbHit.src = "zorp_climb_hit.png?v=3";
const imgZorpClimbFall = new Image(); imgZorpClimbFall.src = "zorp_climb_fall.png?v=3";

// Sprites de Agarras Coloridas de Escalada (Estilo Google Doodle Champion Island)
const imgGripGreen = new Image(); imgGripGreen.src = "grip_green.png?v=3";
const imgGripPurple = new Image(); imgGripPurple.src = "grip_purple.png?v=3";
const imgGripBlue = new Image(); imgGripBlue.src = "grip_blue.png?v=3";
const imgGripRed = new Image(); imgGripRed.src = "grip_red.png?v=3";
const imgShrineCheckpoint = new Image(); imgShrineCheckpoint.src = "shrine_checkpoint.png?v=3";
const imgPlatformLedge = new Image(); imgPlatformLedge.src = "platform_ledge.png?v=3";

// Efeitos e Projéteis do Mestre
const imgHazardStone = new Image(); imgHazardStone.src = "hazard_stone.png?v=3";
const imgHitSparkYellow = new Image(); imgHitSparkYellow.src = "hit_spark_yellow.png?v=3";

// Arte e Sprites de Vitória no Cume (VictoryEscalada.png)
const imgVictoryEscalada = new Image(); imgVictoryEscalada.src = "VictoryEscalada.png?v=3";
const imgVictoryZorpBadge = new Image(); imgVictoryZorpBadge.src = "victory_zorp_badge.png?v=3";
const imgVictoryMestreThumbs = new Image(); imgVictoryMestreThumbs.src = "victory_mestre_thumbs.png?v=3";

// -------------------------------------------------------------
// SPRITES E RECURSOS DO MINIGAME DE BOXE (NOVA ARENA, ZORP COSTAS, MESTRE FRENTE, EMOJIS, FX E FINISHER)
// -------------------------------------------------------------
const imgBoxeArenaBg = new Image(); imgBoxeArenaBg.src = "Arena_Boxe.png?v=4";
const imgBoxeTelaVs = new Image(); imgBoxeTelaVs.src = "boxe_tela_vs.png?v=4";
const imgBoxeTelaVitoria = new Image(); imgBoxeTelaVitoria.src = "boxe_tela_vitoria.png?v=4";

// Zorp (Costas / Punch-Out Perspective)
const imgZorpBoxeBackIdle0 = new Image(); imgZorpBoxeBackIdle0.src = "zorp_boxe_back_idle_0.png?v=5";
const imgZorpBoxeBackIdle1 = new Image(); imgZorpBoxeBackIdle1.src = "zorp_boxe_back_idle_1.png?v=5";
const imgZorpBoxeBackIdle2 = new Image(); imgZorpBoxeBackIdle2.src = "zorp_boxe_back_idle_2.png?v=5";
const imgZorpBoxeBackGuard = new Image(); imgZorpBoxeBackGuard.src = "zorp_boxe_back_guard.png?v=5";
const imgZorpBoxeBackDuck = new Image(); imgZorpBoxeBackDuck.src = "zorp_boxe_back_duck.png?v=5";
const imgZorpBoxeBackDodgeL = new Image(); imgZorpBoxeBackDodgeL.src = "zorp_boxe_back_dodge_l.png?v=5";
const imgZorpBoxeBackDodgeR = new Image(); imgZorpBoxeBackDodgeR.src = "zorp_boxe_back_dodge_r.png?v=5";
const imgZorpBoxeBackJab = new Image(); imgZorpBoxeBackJab.src = "zorp_boxe_back_jab.png?v=5";
const imgZorpBoxeBackDireto = new Image(); imgZorpBoxeBackDireto.src = "zorp_boxe_back_direto.png?v=5";
const imgZorpBoxeBackHook = new Image(); imgZorpBoxeBackHook.src = "zorp_boxe_back_hook.png?v=5";
const imgZorpBoxeBackUppercut = new Image(); imgZorpBoxeBackUppercut.src = "zorp_boxe_back_uppercut.png?v=5";
const imgZorpBoxeBackHit = new Image(); imgZorpBoxeBackHit.src = "zorp_boxe_back_hit.png?v=5";
const imgZorpBoxeBackFall = new Image(); imgZorpBoxeBackFall.src = "zorp_boxe_back_fall.png?v=5";
const imgZorpBoxeBackDizzyKnees = new Image(); imgZorpBoxeBackDizzyKnees.src = "zorp_boxe_back_dizzy_knees.png?v=5";
const imgZorpBoxeBackKnockdown = new Image(); imgZorpBoxeBackKnockdown.src = "zorp_boxe_back_knockdown.png?v=5";
const imgZorpBoxeBackSitup = new Image(); imgZorpBoxeBackSitup.src = "zorp_boxe_back_situp.png?v=5";
const imgZorpBoxeBackPant = new Image(); imgZorpBoxeBackPant.src = "zorp_boxe_back_pant.png?v=5";
const imgZorpBoxeBackWin = new Image(); imgZorpBoxeBackWin.src = "zorp_boxe_back_win.png?v=5";

// Mestre (Frente / Punch-Out Opponent)
const imgMestreBoxeFrontIdle0 = new Image(); imgMestreBoxeFrontIdle0.src = "mestre_boxe_front_idle_0.png?v=5";
const imgMestreBoxeFrontIdle1 = new Image(); imgMestreBoxeFrontIdle1.src = "mestre_boxe_front_idle_1.png?v=5";
const imgMestreBoxeFrontIdle2 = new Image(); imgMestreBoxeFrontIdle2.src = "mestre_boxe_front_idle_2.png?v=5";
const imgMestreBoxeFrontGuard = new Image(); imgMestreBoxeFrontGuard.src = "mestre_boxe_front_guard.png?v=5";
const imgMestreBoxeFrontJab = new Image(); imgMestreBoxeFrontJab.src = "mestre_boxe_front_jab.png?v=5";
const imgMestreBoxeFrontHeavy = new Image(); imgMestreBoxeFrontHeavy.src = "mestre_boxe_front_heavy.png?v=5";
const imgMestreBoxeFrontHit = new Image(); imgMestreBoxeFrontHit.src = "mestre_boxe_front_hit.png?v=5";
const imgMestreBoxeFrontKnockdown = new Image(); imgMestreBoxeFrontKnockdown.src = "mestre_boxe_front_knockdown.png?v=5";
const imgMestreBoxeFrontDodgeL = new Image(); imgMestreBoxeFrontDodgeL.src = "mestre_boxe_front_dodge_l.png?v=6";
const imgMestreBoxeFrontDodgeR = new Image(); imgMestreBoxeFrontDodgeR.src = "mestre_boxe_front_dodge_r.png?v=6";
const imgMestreBoxeFrontGetup = new Image(); imgMestreBoxeFrontGetup.src = "mestre_boxe_front_getup.png?v=5";
const imgMestreBoxeFrontRise = new Image(); imgMestreBoxeFrontRise.src = "mestre_boxe_front_rise.png?v=5";
const imgMestreBoxeFrontWin = new Image(); imgMestreBoxeFrontWin.src = "mestre_boxe_front_win.png?v=8";

// Mestre Golpe Especial Punch-Out & Speedlines
const imgMestreBoxeSpecialWindup = new Image(); imgMestreBoxeSpecialWindup.src = "mestre_boxe_special_windup.png?v=5";
const imgMestreBoxeSpecialCharge = new Image(); imgMestreBoxeSpecialCharge.src = "mestre_boxe_special_charge.png?v=5";
const imgMestreBoxeSpecialPunch = new Image(); imgMestreBoxeSpecialPunch.src = "mestre_boxe_special_punch.png?v=5";
const imgBoxeFxSpeedline = new Image(); imgBoxeFxSpeedline.src = "boxe_fx_speedline.png?v=5";

// Emojis de Reação
const imgEmojiZorpAlert = new Image(); imgEmojiZorpAlert.src = "emoji_zorp_alert.png?v=4";
const imgEmojiZorpAngry = new Image(); imgEmojiZorpAngry.src = "emoji_zorp_angry.png?v=4";
const imgEmojiZorpStars = new Image(); imgEmojiZorpStars.src = "emoji_zorp_stars.png?v=4";
const imgEmojiZorpGuard = new Image(); imgEmojiZorpGuard.src = "emoji_zorp_guard.png?v=4";
const imgEmojiZorpDizzy = new Image(); imgEmojiZorpDizzy.src = "emoji_zorp_dizzy.png?v=4";
const imgEmojiZorpSwirl = new Image(); imgEmojiZorpSwirl.src = "emoji_zorp_swirl.png?v=4";

const imgEmojiMestreSmirk = new Image(); imgEmojiMestreSmirk.src = "emoji_mestre_smirk.png?v=4";
const imgEmojiMestreCocky = new Image(); imgEmojiMestreCocky.src = "emoji_mestre_cocky.png?v=4";
const imgEmojiMestreDizzy = new Image(); imgEmojiMestreDizzy.src = "emoji_mestre_dizzy.png?v=4";
const imgEmojiMestreWink = new Image(); imgEmojiMestreWink.src = "emoji_mestre_wink.png?v=4";
const imgEmojiMestreShock = new Image(); imgEmojiMestreShock.src = "emoji_mestre_shock.png?v=4";

// Efeitos Visuais de Impacto
const imgBoxeFxHitspark = new Image(); imgBoxeFxHitspark.src = "boxe_fx_hitspark.png?v=4";
const imgBoxeFxExplosion = new Image(); imgBoxeFxExplosion.src = "boxe_fx_explosion.png?v=4";
const imgBoxeFxStars = new Image(); imgBoxeFxStars.src = "boxe_fx_stars.png?v=4";
const imgBoxeFxExclamation = new Image(); imgBoxeFxExclamation.src = "boxe_fx_exclamation.png?v=4";

// Golpe Final Especial Cinematográfico (Super Gancho & Mestre Voando - EXCLUSIVOS)
const imgZorpFinisherPrep = new Image(); imgZorpFinisherPrep.src = "zorp_finisher_prep.png?v=4";
const imgZorpFinisherLaunch = new Image(); imgZorpFinisherLaunch.src = "zorp_finisher_launch.png?v=4";
const imgZorpFinisherLaunchArc = new Image(); imgZorpFinisherLaunchArc.src = "zorp_finisher_launch_arc.png?v=4";
const imgZorpFinisherImpact = new Image(); imgZorpFinisherImpact.src = "zorp_finisher_impact.png?v=4";
const imgZorpFinisherPose = new Image(); imgZorpFinisherPose.src = "zorp_finisher_pose.png?v=4";

const imgMestreFinisherFly0 = new Image(); imgMestreFinisherFly0.src = "mestre_finisher_fly_0.png?v=4";
const imgMestreFinisherFly1 = new Image(); imgMestreFinisherFly1.src = "mestre_finisher_fly_1.png?v=4";
const imgMestreFinisherFlyDescend = new Image(); imgMestreFinisherFlyDescend.src = "mestre_finisher_fly_descend.png?v=4";
const imgMestreFinisherCrash = new Image(); imgMestreFinisherCrash.src = "mestre_finisher_crash.png?v=4";

// Novos NPCs da Ilha de Boxe (Overworld)
const imgNpcMestreBoxe = new Image(); imgNpcMestreBoxe.src = "npc_mestre_novo.png?v=4";
const imgNpcTreinadorBoxe = new Image(); imgNpcTreinadorBoxe.src = "npc_treinador_novo.png?v=4";
const imgNpcArbitroBoxe = new Image(); imgNpcArbitroBoxe.src = "npc_arbitro_novo.png?v=4";
const imgNpcBoxeador = new Image(); imgNpcBoxeador.src = "npc_pugilista_novo.png?v=4";
const imgBoxeSacoPancada = new Image(); imgBoxeSacoPancada.src = "boxe_saco_pancada.png?v=4";

// -------------------------------------------------------------
// SPRITES E RECURSOS DO MINIGAME DE SKATE (PRAÇA OLÍMPICA)
// -------------------------------------------------------------
const imgZorpSkateIdle = new Image(); imgZorpSkateIdle.src = "zorp_skate_idle.png?v=1";
const imgZorpSkateCruise = new Image(); imgZorpSkateCruise.src = "zorp_skate_cruise.png?v=1";
const imgZorpSkatePush = new Image(); imgZorpSkatePush.src = "zorp_skate_push.png?v=1";
const imgZorpSkateBrake = new Image(); imgZorpSkateBrake.src = "zorp_skate_brake.png?v=1";
const imgZorpSkateOllie = new Image(); imgZorpSkateOllie.src = "zorp_skate_ollie.png?v=1";
const imgZorpSkateKickflip = new Image(); imgZorpSkateKickflip.src = "zorp_skate_kickflip.png?v=1";
const imgZorpSkateHeelflip = new Image(); imgZorpSkateHeelflip.src = "zorp_skate_heelflip.png?v=1";
const imgZorpSkateGrind = new Image(); imgZorpSkateGrind.src = "zorp_skate_grind.png?v=1";
const imgZorpSkateSlide = new Image(); imgZorpSkateSlide.src = "zorp_skate_slide.png?v=1";
const imgZorpSkateSpecial = new Image(); imgZorpSkateSpecial.src = "zorp_skate_special.png?v=1";
const imgZorpSkateFall = new Image(); imgZorpSkateFall.src = "zorp_skate_fall.png?v=1";
const imgZorpSkateStumble = new Image(); imgZorpSkateStumble.src = "zorp_skate_stumble.png?v=1";
const imgZorpSkateWin = new Image(); imgZorpSkateWin.src = "zorp_skate_win.png?v=1";

const imgMestreSkateIdle = new Image(); imgMestreSkateIdle.src = "mestre_skate_idle.png?v=1";
const imgMestreSkateCruise = new Image(); imgMestreSkateCruise.src = "mestre_skate_cruise.png?v=1";
const imgMestreSkatePush = new Image(); imgMestreSkatePush.src = "mestre_skate_push.png?v=1";
const imgMestreSkateBrake = new Image(); imgMestreSkateBrake.src = "mestre_skate_brake.png?v=1";
const imgMestreSkateOllie = new Image(); imgMestreSkateOllie.src = "mestre_skate_ollie.png?v=1";
const imgMestreSkateKickflip = new Image(); imgMestreSkateKickflip.src = "mestre_skate_kickflip.png?v=1";
const imgMestreSkateHeelflip = new Image(); imgMestreSkateHeelflip.src = "mestre_skate_heelflip.png?v=1";
const imgMestreSkateGrind = new Image(); imgMestreSkateGrind.src = "mestre_skate_grind.png?v=1";
const imgMestreSkateFall = new Image(); imgMestreSkateFall.src = "mestre_skate_fall.png?v=1";
const imgMestreSkateDazed = new Image(); imgMestreSkateDazed.src = "mestre_skate_dazed.png?v=1";
const imgMestreSkateCheer = new Image(); imgMestreSkateCheer.src = "mestre_skate_cheer.png?v=1";

const imgNpcMestreSkate = new Image(); imgNpcMestreSkate.src = "npc_mestre_skate.png?v=1";

const imgSkateFxSmoke = new Image(); imgSkateFxSmoke.src = "skate_fx_smoke.png?v=1";
const imgSkateFxSpark = new Image(); imgSkateFxSpark.src = "skate_fx_spark.png?v=1";
const imgSkateFxStar = new Image(); imgSkateFxStar.src = "skate_fx_star.png?v=1";
const imgZorpSkateFinalSpin = new Image(); imgZorpSkateFinalSpin.src = "zorp_skate_final_spin.png?v=1";
const imgMestreSkateFinalSpin = new Image(); imgMestreSkateFinalSpin.src = "mestre_skate_final_spin.png?v=1";

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

const keys = { 
    w: false, a: false, s: false, d: false, e: false, space: false,
    j: false, k: false, u: false, i: false,
    z: false, x: false, c: false, v: false
};

const zorpSprite = {
    cols: 3, rows: 4, row: 0, 
    animSequence: [1, 0, 1, 2], animIndex: 0,
    isMoving: false, timer: 0, speed: 8 
};

const pingPong = {
    playerX: 50, playerY: 140, 
    opponentX: 370, opponentY: 140, 
    speed: 3.5,
    ballX: 100, ballY: 145, ballZ: 20,
    ballSpeedX: 4, ballSpeedY: 0, ballSpeedZ: 2,
    ballRadius: 4, gravity: 0.22,
    playerScore: 0, opponentScore: 0, maxScore: 3,
    playerAction: "IDLE", opponentAction: "IDLE",  
    playerHitTimer: 0, opponentHitTimer: 0,
    power: 0, maxPower: 100, isPowerActive: false,
    mestrePower: 0, isMestreSpecial: false, mestreBannerTimer: 0,
    rallyHits: 0,
    gameState: 'TUTORIAL',
    win: false,
    lastHitter: null,
    playerBounces: 0,
    opponentBounces: 0,
    bounceEffects: [],
    server: 'PLAYER'
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
// MINIGAME ESCALADA (INSPIRADO 100% EM DOODLE CHAMPION ISLAND GAMES)
// -------------------------------------------------------------
const escaladaGame = {
    vida: 3,
    maxVida: 3,
    invulTimer: 0,
    shakeTimer: 0,
    
    // Mundo Amplo da Montanha (1500px de largura com Exploração Lateral Completa)
    mountainWidth: 1500,
    cameraX: 525,
    
    playerX: 750,
    playerY: 220,
    pedraAtual: null,
    targetPedra: null,
    
    emPulo: false,
    puloProgresso: 0,
    puloVelocidade: 0.095,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    jumpDir: 0, // -1 esquerda, 0 cima, 1 direita
    
    climbFrameTimer: 0,
    climbFrameIndex: 0,
    
    pedrasGeradas: [],
    objetosCaindo: [],
    particulas: [],
    sparksImpacto: [],
    
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
    
    minimapaX: 14,
    minimapaY: 46,
    minimapaLargura: 44,
    minimapaAltura: 195,
    
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
    escaladaGame.mountainWidth = 1500;
    escaladaGame.cameraX = 525;
    escaladaGame.playerX = 750;
    escaladaGame.playerY = 220;
    escaladaGame.alturaAtual = 0;
    escaladaGame.checkpointAltura = 0;
    escaladaGame.emPulo = false;
    escaladaGame.puloProgresso = 0;
    escaladaGame.jumpDir = 0;
    escaladaGame.climbFrameTimer = 0;
    escaladaGame.climbFrameIndex = 0;
    escaladaGame.isGameOver = false;
    escaladaGame.morteMotivo = "";
    escaladaGame.objetosCaindo = [];
    escaladaGame.particulas = [];
    escaladaGame.sparksImpacto = [];
    escaladaGame.ventoForca = 0;
    escaladaGame.ventoTimer = 180;
    escaladaGame.ventoDuracao = 0;
    escaladaGame.ventoParticulas = [];
    escaladaGame.mensagemAtual = "";
    escaladaGame.mensagemTimer = 0;
    escaladaGame.mensagensMostradas = {200: false, 500: false, 800: false, 1100: false};
    
    // Base inicial ampla com agarras coloridas distribuídas por toda a montanha de 1500px
    escaladaGame.pedrasGeradas = [
        { x: 120, y: 220, r: 16, tipo: 'green', id: 1 },
        { x: 320, y: 220, r: 16, tipo: 'purple', id: 2 },
        { x: 530, y: 220, r: 16, tipo: 'green', id: 3 },
        { x: 750, y: 220, r: 16, tipo: 'green', id: 4 }, // Ponto de partida inicial central
        { x: 970, y: 220, r: 16, tipo: 'purple', id: 5 },
        { x: 1180, y: 220, r: 16, tipo: 'green', id: 6 },
        { x: 1380, y: 220, r: 16, tipo: 'purple', id: 7 },
        
        { x: 200, y: 155, r: 16, tipo: 'purple', id: 8 },
        { x: 420, y: 150, r: 16, tipo: 'green', id: 9 },
        { x: 620, y: 150, r: 16, tipo: 'moving', baseX: 620, amplitude: 55, speed: 1.2, offset: 0, id: 10 },
        { x: 750, y: 150, r: 16, tipo: 'green', id: 11 },
        { x: 880, y: 150, r: 16, tipo: 'moving', baseX: 880, amplitude: 55, speed: 1.2, offset: Math.PI, id: 12 },
        { x: 1080, y: 155, r: 16, tipo: 'purple', id: 13 },
        { x: 1300, y: 150, r: 16, tipo: 'green', id: 14 },
        
        { x: 140, y: 85, r: 16, tipo: 'green', id: 15 },
        { x: 350, y: 90, r: 16, tipo: 'purple', id: 16 },
        { x: 560, y: 85, r: 16, tipo: 'green', id: 17 },
        { x: 750, y: 85, r: 16, tipo: 'green', id: 18 },
        { x: 940, y: 85, r: 16, tipo: 'purple', id: 19 },
        { x: 1150, y: 90, r: 16, tipo: 'green', id: 20 },
        { x: 1360, y: 85, r: 16, tipo: 'green', id: 21 }
    ];
    escaladaGame.pedraAtual = escaladaGame.pedrasGeradas[3]; // Zorp no centro
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

        // Permite saltos para cima ou transversais laterais na montanha de 1500px
        if (dy < 15 && dy > -190) {
            let valido = false;
            if (dirX < 0 && dx < -10) valido = true;
            else if (dirX > 0 && dx > 10) valido = true;
            else if (dirX === 0 && Math.abs(dx) <= 150 && dy < -20) valido = true;

            if (valido) {
                let dist = Math.hypot(dx, dy);
                if (dist < menorScore && dist <= 270) {
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
    if (!alvo && dirX !== 0) alvo = encontrarMelhorPedra(0);
    if (!alvo) {
        let pedrasAcima = escaladaGame.pedrasGeradas.filter(p => p !== escaladaGame.pedraAtual && !p.quebrada && p.y < escaladaGame.playerY - 10);
        if (pedrasAcima.length > 0) {
            pedrasAcima.sort((a, b) => Math.hypot(a.x - escaladaGame.playerX, a.y - escaladaGame.playerY) - Math.hypot(b.x - escaladaGame.playerX, b.y - escaladaGame.playerY));
            alvo = pedrasAcima[0];
        }
    }

    if (alvo) {
        escaladaGame.emPulo = true;
        escaladaGame.puloProgresso = 0;
        escaladaGame.startX = escaladaGame.playerX;
        escaladaGame.startY = escaladaGame.playerY;
        escaladaGame.targetX = alvo.x;
        escaladaGame.targetY = alvo.y;
        escaladaGame.targetPedra = alvo;

        let diffX = alvo.x - escaladaGame.startX;
        if (diffX < -15) escaladaGame.jumpDir = -1;
        else if (diffX > 15) escaladaGame.jumpDir = 1;
        else escaladaGame.jumpDir = 0;

        criarPoeira(escaladaGame.playerX, escaladaGame.playerY, '#8d6e63', 6);
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

function criarHitSpark(x, y) {
    escaladaGame.sparksImpacto.push({
        x: x,
        y: y,
        life: 14,
        maxLife: 14,
        scale: 1.0
    });
}

function atualizarAnimacaoPulo() {
    if (!escaladaGame.emPulo) return;

    escaladaGame.puloProgresso += escaladaGame.puloVelocidade;

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
        escaladaGame.jumpDir = 0;

        if (escaladaGame.pedraAtual) {
            criarPoeira(escaladaGame.playerX, escaladaGame.playerY, '#d7ccc8', 6);
            
            if (escaladaGame.pedraAtual.tipo === 'brittle') {
                escaladaGame.pedraAtual.quebrando = true;
            }
            
            // Checkpoint / Santuário recupera vida
            if (escaladaGame.pedraAtual.tipo === 'checkpoint' && !escaladaGame.pedraAtual.coletado) {
                escaladaGame.pedraAtual.coletado = true;
                escaladaGame.vida = escaladaGame.maxVida;
                escaladaGame.checkpointAltura = escaladaGame.alturaAtual;
                criarPoeira(escaladaGame.playerX, escaladaGame.playerY, '#f1c40f', 24);
            }
        }
    } else {
        const t = escaladaGame.puloProgresso;
        let ventoDesvio = 0;
        if (escaladaGame.ventoDuracao > 0) {
            ventoDesvio = Math.sin(t * Math.PI) * (escaladaGame.ventoForca * 16);
        }
        
        escaladaGame.playerX = escaladaGame.startX + (escaladaGame.targetX - escaladaGame.startX) * t + ventoDesvio;

        const alturaArco = 30; 
        const interpolacaoY = escaladaGame.startY + (escaladaGame.targetY - escaladaGame.startY) * t;
        escaladaGame.playerY = interpolacaoY - Math.sin(t * Math.PI) * alturaArco;
    }
}

function atualizarCameraEMundo() {
    const limiteTelaY = 175;

    // Acompanhamento vertical
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

    // Acompanhamento horizontal suave pela montanha ampla de 1500px
    const maxCamX = escaladaGame.mountainWidth - canvas.width;
    const targetCamX = Math.max(0, Math.min(maxCamX, escaladaGame.playerX - canvas.width / 2));
    escaladaGame.cameraX += (targetCamX - escaladaGame.cameraX) * 0.14;
}

let pedraIdCounter = 40;
function gerarNovaCamadaDePedras() {
    let menorY = escaladaGame.pedrasGeradas.length > 0 
        ? Math.min(...escaladaGame.pedrasGeradas.map(p => p.y)) 
        : 180;
        
    const progresso = escaladaGame.alturaAtual / escaladaGame.alturaTotal;
    
    // Tipos de agarras coloridas com maior desafio
    const tipos = ['green', 'purple', 'green'];
    if (progresso > 0.10) tipos.push('moving');
    if (progresso > 0.20) tipos.push('brittle');
    if (progresso > 0.40) tipos.push('moving', 'brittle', 'brittle');

    // A cada ~300m gera santuários de descanso
    const proxCheckpoint = Math.floor((escaladaGame.alturaAtual + 120) / 300) * 300;
    const isCheckpoint = (proxCheckpoint > 0 && Math.abs(escaladaGame.alturaAtual - proxCheckpoint) < 60);

    // 8 Setores/Colunas ao longo da montanha de 1500px
    const setores = [
        { min: 70, max: 200 },
        { min: 230, max: 370 },
        { min: 400, max: 540 },
        { min: 580, max: 720 },
        { min: 760, max: 900 },
        { min: 940, max: 1080 },
        { min: 1120, max: 1260 },
        { min: 1300, max: 1430 }
    ];

    if (isCheckpoint) {
        // Gera plataformas de descanso
        escaladaGame.pedrasGeradas.push({
            id: ++pedraIdCounter,
            x: 750,
            y: menorY - 55,
            r: 22,
            tipo: 'checkpoint',
            coletado: false
        });
        escaladaGame.pedrasGeradas.push({ id: ++pedraIdCounter, x: 280, y: menorY - 50, r: 16, tipo: 'green' });
        escaladaGame.pedrasGeradas.push({ id: ++pedraIdCounter, x: 1220, y: menorY - 50, r: 16, tipo: 'purple' });
        return;
    }

    // Gera 5 a 7 agarras por camada para ampla liberdade lateral
    let qtdPedras = Math.random() < 0.5 ? 6 : 7;
    let setoresEscolhidos = setores.slice().sort(() => Math.random() - 0.5).slice(0, qtdPedras);

    for (let s of setoresEscolhidos) {
        let posX = s.min + Math.random() * (s.max - s.min);
        let posY = menorY - 48 - Math.random() * 24;
        let tipo = tipos[Math.floor(Math.random() * tipos.length)];

        let novaPedra = {
            id: ++pedraIdCounter,
            x: posX,
            y: posY,
            r: 16,
            tipo: tipo
        };

        if (tipo === 'moving') {
            novaPedra.baseX = posX;
            novaPedra.amplitude = 40 + Math.random() * 40;
            novaPedra.speed = 1.1 + Math.random() * 1.3;
            novaPedra.offset = Math.random() * Math.PI * 2;
        } else if (tipo === 'brittle') {
            novaPedra.tempoRestante = 40; // ~0.65s (mais desafiador!)
            novaPedra.quebrando = false;
            novaPedra.quebrada = false;
        }

        escaladaGame.pedrasGeradas.push(novaPedra);
    }
}

function gerenciarPedras() {
    const alturaTela = canvas.height || 300;
    const now = Date.now();

    for (let p of escaladaGame.pedrasGeradas) {
        if (p.tipo === 'moving') {
            p.x = p.baseX + Math.sin(now * 0.0025 * p.speed + p.offset) * p.amplitude;
            if (escaladaGame.pedraAtual === p && !escaladaGame.emPulo) {
                escaladaGame.playerX = p.x;
            }
        } else if (p.tipo === 'brittle' && p.quebrando && !p.quebrada) {
            p.tempoRestante--;
            if (Math.random() < 0.4) {
                criarPoeira(p.x, p.y, '#e74c3c', 2);
            }
            if (p.tempoRestante <= 0) {
                p.quebrada = true;
                criarPoeira(p.x, p.y, '#c0392b', 14);
                escaladaGame.shakeTimer = 8;
                
                if (escaladaGame.pedraAtual === p && !escaladaGame.emPulo) {
                    aplicarDanoJogador("A rocha desmoronou sob seus pés!");
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

    // Remove agarras que saíram da tela por baixo
    escaladaGame.pedrasGeradas = escaladaGame.pedrasGeradas.filter(pedra => pedra.y < alturaTela + 70);

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
    escaladaGame.invulTimer = 65; // ~1.1 segundo invulnerável
    escaladaGame.shakeTimer = 14; // Tremor de tela

    if (escaladaGame.vida <= 0) {
        finalizarMinigame("DERROTA");
    }
}

function gerenciarVento() {
    if (escaladaGame.ventoDuracao > 0) {
        escaladaGame.ventoDuracao--;
        
        if (Math.random() < 0.8) {
            escaladaGame.ventoParticulas.push({
                x: escaladaGame.ventoDirecao > 0 ? -20 : escaladaGame.mountainWidth + 20,
                y: Math.random() * canvas.height,
                vx: escaladaGame.ventoDirecao * (8 + Math.random() * 5),
                vy: (Math.random() - 0.5) * 1.5,
                len: 24 + Math.random() * 30,
                alpha: 0.85
            });
        }
    } else {
        escaladaGame.ventoForca = 0;
        escaladaGame.ventoTimer--;
        if (escaladaGame.ventoTimer <= 0) {
            escaladaGame.ventoDuracao = 180 + Math.floor(Math.random() * 120);
            escaladaGame.ventoTimer = 280 + Math.floor(Math.random() * 200);
            escaladaGame.ventoDirecao = Math.random() < 0.5 ? 1 : -1;
            escaladaGame.ventoForca = 1.1 + Math.random() * 0.9;
        }
    }

    for (let i = escaladaGame.ventoParticulas.length - 1; i >= 0; i--) {
        let vp = escaladaGame.ventoParticulas[i];
        vp.x += vp.vx;
        vp.y += vp.vy;
        vp.alpha -= 0.016;
        if (vp.alpha <= 0 || vp.x < -60 || vp.x > escaladaGame.mountainWidth + 60) {
            escaladaGame.ventoParticulas.splice(i, 1);
        }
    }
}

function gerenciarObjetosCaindo() {
    const progresso = escaladaGame.alturaAtual / escaladaGame.alturaTotal;
    
    // Projéteis jogados pelo mestre com maior frequência e perigo (pedras arremessadas, pedregulhos pesados e bolas de neve)
    const chance = 0.024 + progresso * 0.045;
    if (Math.random() < chance) {
        const rnd = Math.random();
        let tipo = 'thrown_stone';
        if (rnd < 0.35) tipo = 'snowball';
        else if (rnd < 0.65) tipo = 'boulder';

        escaladaGame.objetosCaindo.push({
            x: 50 + Math.random() * (escaladaGame.mountainWidth - 100),
            y: escaladaGame.playerY - canvas.height - 30,
            speed: 2.6 + Math.random() * 2.8 + progresso * 1.6,
            r: (tipo === 'snowball') ? 14 : (tipo === 'boulder' ? 12 : 10),
            type: tipo,
            rotacao: 0
        });
    }

    const cameraY = escaladaGame.playerY - canvas.height * 0.6;
    
    for (let i = escaladaGame.objetosCaindo.length - 1; i >= 0; i--) {
        let obj = escaladaGame.objetosCaindo[i];
        obj.y += obj.speed;
        obj.rotacao += 0.12;

        let dx = obj.x - escaladaGame.playerX;
        let dy = obj.y - (escaladaGame.playerY - 14);
        let dist = Math.hypot(dx, dy);

        if (dist < obj.r + 15) {
            criarPoeira(obj.x, obj.y, obj.type === 'snowball' ? '#ffffff' : '#795548', 12);
            criarHitSpark(escaladaGame.playerX, escaladaGame.playerY - 15);
            aplicarDanoJogador("Atingido pelas pedras arremessadas do topo!");
            escaladaGame.objetosCaindo.splice(i, 1);
        } else if (obj.y > cameraY + canvas.height + 80) {
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

    for (let i = escaladaGame.sparksImpacto.length - 1; i >= 0; i--) {
        let sp = escaladaGame.sparksImpacto[i];
        sp.life--;
        if (sp.life <= 0) {
            escaladaGame.sparksImpacto.splice(i, 1);
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
        dialogText.innerHTML = "> MESTRE DA ESCALADA: A montanha exige atenção! Use as rotas laterais e desvie das pedras que arremesso!";
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

    if (escaladaGame.invulTimer > 0) escaladaGame.invulTimer--;
    if (escaladaGame.shakeTimer > 0) escaladaGame.shakeTimer--;

    escaladaGame.climbFrameTimer++;
    if (escaladaGame.climbFrameTimer > 10) {
        escaladaGame.climbFrameTimer = 0;
        escaladaGame.climbFrameIndex = (escaladaGame.climbFrameIndex + 1) % 4;
    }

    hintText.innerText = "[A / D] MIRAR NA ROTA  |  [ESPAÇO] OU [W] PULAR  |  EXPLORE TODA A LARGURA DA MONTANHA!";

    let dirX = 0;
    if (keys.a) dirX = -1;
    if (keys.d) dirX = 1;
    escaladaGame.targetPedra = encontrarMelhorPedra(dirX);
    if (!escaladaGame.targetPedra && dirX === 0) escaladaGame.targetPedra = encontrarMelhorPedra(0);

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
    
    const marcos = [200, 500, 800, 1100];
    const textos = [
        "MESTRE: Você pode usar as rotas laterais da esquerda e direita para desviar!",
        "MESTRE: Rajadas de vento montanhoso! Mantenha a firmeza nos saltos!",
        "MESTRE: Cuidado com as rochas vermelhas que racham ao pisar!",
        "MESTRE: O cume está logo ali! Pule com precisão até a bandeira!"
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
    const cameraX = escaladaGame.cameraX;
    const cameraY = escaladaGame.playerY - canvas.height * 0.6;
    
    // Efeito de Tremor de Tela
    let shakeX = 0, shakeY = 0;
    if (escaladaGame.shakeTimer > 0) {
        shakeX = (Math.random() - 0.5) * 6;
        shakeY = (Math.random() - 0.5) * 6;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // 1. Fundo da Parede Montanhosa Ampla (1500px) com Câmera Móvel
    const progresso = Math.min(1, escaladaGame.alturaAtual / escaladaGame.alturaTotal);
    let gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (progresso < 0.35) {
        gradiente.addColorStop(0, "#4e342e");
        gradiente.addColorStop(1, "#3e2723");
    } else if (progresso < 0.75) {
        gradiente.addColorStop(0, "#37474f");
        gradiente.addColorStop(1, "#4e342e");
    } else {
        gradiente.addColorStop(0, "#1c2833");
        gradiente.addColorStop(1, "#37474f");
    }
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Fendas rochosas e estratos montanhosos na coordenada de mundo (1500px)
    ctx.strokeStyle = "rgba(0, 0, 0, 0.22)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 26; i++) {
        let fendaMundoX = 30 + (i * 58);
        let renderFendaX = fendaMundoX - cameraX;
        let fendaY = ((i * 55 - (escaladaGame.alturaAtual * 0.4)) % (canvas.height + 80));
        
        if (renderFendaX > -40 && renderFendaX < canvas.width + 40) {
            ctx.beginPath();
            ctx.moveTo(renderFendaX, fendaY);
            ctx.lineTo(renderFendaX + 18, fendaY + 35);
            ctx.lineTo(renderFendaX + 8, fendaY + 70);
            ctx.stroke();
        }
    }

    // Paredões de penhasco nas extremidades do mundo da montanha
    const leftCliffRenderX = 0 - cameraX;
    if (leftCliffRenderX + 40 > 0) {
        ctx.fillStyle = "#271c19";
        ctx.fillRect(0, 0, Math.max(0, leftCliffRenderX + 40), canvas.height);
    }
    const rightCliffRenderX = (escaladaGame.mountainWidth - 40) - cameraX;
    if (rightCliffRenderX < canvas.width) {
        ctx.fillStyle = "#271c19";
        ctx.fillRect(Math.max(0, rightCliffRenderX), 0, canvas.width - rightCliffRenderX, canvas.height);
    }

    // 2. Partículas de Poeira
    escaladaGame.particulas.forEach(p => {
        const renderX = p.x - cameraX;
        const renderY = p.y - cameraY;
        ctx.fillStyle = p.cor;
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.r, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // 3. Desenhar Agarras Coloridas de Escalada (Estilo Google Doodle Champion Island)
    escaladaGame.pedrasGeradas.forEach((p) => {
        if (p.quebrada) return;
        const renderX = p.x - cameraX;
        const renderY = p.y - cameraY;

        if (renderX > -60 && renderX < canvas.width + 60 && renderY > -60 && renderY < canvas.height + 60) {
            let shakePedraX = 0;
            if (p.tipo === 'brittle' && p.quebrando) {
                shakePedraX = (Math.random() - 0.5) * 4;
            }

            // Indicador de Mira no Próximo Alvo
            if (escaladaGame.targetPedra === p && !escaladaGame.emPulo) {
                ctx.strokeStyle = "#f1c40f";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(renderX + shakePedraX, renderY, p.r + 6 + Math.sin(Date.now() * 0.01) * 2, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Renderiza de acordo com o tipo de agarra
            if (p.tipo === 'checkpoint') {
                // Plataforma de grama com Santuário/Lanterna
                if (imgPlatformLedge.complete && imgPlatformLedge.naturalWidth > 0) {
                    ctx.drawImage(imgPlatformLedge, renderX - 36, renderY - 10, 72, 40);
                }
                if (imgShrineCheckpoint.complete && imgShrineCheckpoint.naturalWidth > 0) {
                    ctx.shadowColor = "#f1c40f";
                    ctx.shadowBlur = 14;
                    ctx.drawImage(imgShrineCheckpoint, renderX - 20, renderY - 44, 40, 48);
                    ctx.shadowBlur = 0;
                }
            } else if (p.tipo === 'moving') {
                // Agarram Móvel Azul (Cristal Deslizante)
                if (imgGripBlue.complete && imgGripBlue.naturalWidth > 0) {
                    ctx.shadowColor = "#00e5ff";
                    ctx.shadowBlur = 10;
                    ctx.drawImage(imgGripBlue, renderX + shakePedraX - 18, renderY - 10, 36, 20);
                    ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = "#0288d1";
                    ctx.beginPath(); ctx.arc(renderX + shakePedraX, renderY, p.r, 0, Math.PI * 2); ctx.fill();
                }
            } else if (p.tipo === 'brittle') {
                // Agarra Vermelha Rachada
                if (imgGripRed.complete && imgGripRed.naturalWidth > 0) {
                    ctx.drawImage(imgGripRed, renderX + shakePedraX - 14, renderY - 10, 28, 20);
                } else {
                    ctx.fillStyle = "#e74c3c";
                    ctx.beginPath(); ctx.arc(renderX + shakePedraX, renderY, p.r, 0, Math.PI * 2); ctx.fill();
                }
            } else if (p.tipo === 'purple') {
                // Agarra Roxa / Magenta
                if (imgGripPurple.complete && imgGripPurple.naturalWidth > 0) {
                    ctx.drawImage(imgGripPurple, renderX - 14, renderY - 10, 28, 20);
                } else {
                    ctx.fillStyle = "#8e44ad";
                    ctx.beginPath(); ctx.arc(renderX, renderY, p.r, 0, Math.PI * 2); ctx.fill();
                }
            } else {
                // Agarra Verde
                if (imgGripGreen.complete && imgGripGreen.naturalWidth > 0) {
                    ctx.drawImage(imgGripGreen, renderX - 14, renderY - 10, 28, 20);
                } else {
                    ctx.fillStyle = "#27ae60";
                    ctx.beginPath(); ctx.arc(renderX, renderY, p.r, 0, Math.PI * 2); ctx.fill();
                }
            }
        }
    });

    // 4. Desenhar Jogador (Zorp - Sprites Puros de Escalada de Costas, Sem Pedra de Gelo)
    const playerRenderX = escaladaGame.playerX - cameraX;
    const playerRenderY = escaladaGame.playerY - cameraY;
    const isBlinking = (escaladaGame.invulTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0);

    if (!isBlinking) {
        let currentZorpSprite = null;
        let zW = 38, zH = 58;

        if (escaladaGame.invulTimer > 30) {
            currentZorpSprite = imgZorpClimbHit;
            zW = 38; zH = 56;
        } else if (escaladaGame.emPulo) {
            if (escaladaGame.jumpDir < 0) {
                currentZorpSprite = imgZorpClimbJumpL;
                zW = 44; zH = 60;
            } else if (escaladaGame.jumpDir > 0) {
                currentZorpSprite = imgZorpClimbJumpR;
                zW = 44; zH = 60;
            } else {
                currentZorpSprite = imgZorpClimbJumpUp;
                zW = 36; zH = 62;
            }
        } else if (keys.a) {
            currentZorpSprite = imgZorpClimbReachL;
            zW = 40; zH = 58;
        } else if (keys.d) {
            currentZorpSprite = imgZorpClimbReachR;
            zW = 40; zH = 58;
        } else {
            // Segurando firmemente na agarra da montanha (alterna ciclo natural de escalada)
            const climbFrames = [imgZorpClimbIdle0, imgZorpClimbUp0, imgZorpClimbIdle1, imgZorpClimbUp1];
            currentZorpSprite = climbFrames[escaladaGame.climbFrameIndex % climbFrames.length];
            zW = 36; zH = 58;
        }

        if (currentZorpSprite && currentZorpSprite.complete && currentZorpSprite.naturalWidth > 0) {
            ctx.drawImage(
                currentZorpSprite,
                playerRenderX - zW / 2,
                playerRenderY - zH + 12,
                zW, zH
            );
        } else {
            ctx.fillStyle = "#2ecc71";
            ctx.beginPath();
            ctx.arc(playerRenderX, playerRenderY - 12, 14, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 5. Desenhar Projéteis Jogados pelo Mestre (Pedras jogadas, Pedregulhos e Bolas de Neve)
    escaladaGame.objetosCaindo.forEach(obj => {
        const renderX = obj.x - cameraX;
        const renderY = obj.y - cameraY;
        
        if (obj.type === 'snowball') {
            // Bola de Neve Grande
            ctx.fillStyle = "#ffffff";
            ctx.beginPath(); ctx.arc(renderX, renderY, obj.r, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#b0bec5";
            ctx.beginPath(); ctx.arc(renderX - 2, renderY - 2, obj.r * 0.45, 0, Math.PI * 2); ctx.fill();
        } else if (obj.type === 'thrown_stone') {
            // Pedra Arremessada do Mestre
            if (imgHazardStone.complete && imgHazardStone.naturalWidth > 0) {
                ctx.drawImage(imgHazardStone, renderX - 16, renderY - 10, 32, 20);
            } else {
                ctx.fillStyle = "#5d4037";
                ctx.beginPath(); ctx.arc(renderX, renderY, obj.r, 0, Math.PI * 2); ctx.fill();
            }
        } else {
            // Pedregulho Rolante
            ctx.fillStyle = "#4e342e";
            ctx.beginPath(); ctx.arc(renderX, renderY, obj.r, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#8d6e63";
            ctx.beginPath(); ctx.arc(renderX - 2, renderY - 2, obj.r * 0.4, 0, Math.PI * 2); ctx.fill();
        }
    });

    // 6. Efeito de Faísca Amarela de Impacto (Hit Spark Effect)
    escaladaGame.sparksImpacto.forEach(sp => {
        const renderX = sp.x - cameraX;
        const renderY = sp.y - cameraY;
        if (imgHitSparkYellow.complete && imgHitSparkYellow.naturalWidth > 0) {
            ctx.drawImage(imgHitSparkYellow, renderX - 24, renderY - 24, 48, 48);
        } else {
            ctx.fillStyle = "#f1c40f";
            ctx.beginPath(); ctx.arc(renderX, renderY, 16, 0, Math.PI * 2); ctx.fill();
        }
    });

    // 7. Vento Montanhoso
    if (escaladaGame.ventoParticulas.length > 0) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.5;
        escaladaGame.ventoParticulas.forEach(vp => {
            const renderX = vp.x - cameraX;
            ctx.globalAlpha = vp.alpha;
            ctx.beginPath();
            ctx.moveTo(renderX, vp.y);
            ctx.lineTo(renderX + vp.vx * 3, vp.y + vp.vy * 3);
            ctx.stroke();
        });
        ctx.globalAlpha = 1.0;
    }

    // 8. Cume do Monte Zorp (1200m)
    const topoDist = (escaladaGame.alturaTotal - escaladaGame.alturaAtual);
    const topoRenderY = escaladaGame.playerY - topoDist - cameraY;
    if (topoRenderY > -150 && topoRenderY < canvas.height) {
        // Platô do Cume amplo (1500px)
        const platoRenderX = 40 - cameraX;
        ctx.fillStyle = "#eceff1";
        ctx.fillRect(platoRenderX, topoRenderY + 30, escaladaGame.mountainWidth - 80, 26);
        
        // Mastro da Bandeira no centro
        const flagRenderX = 750 - cameraX;
        ctx.fillStyle = "#f1c40f";
        ctx.fillRect(flagRenderX, topoRenderY - 14, 5, 45);
        ctx.fillStyle = "#e74c3c";
        ctx.beginPath();
        ctx.moveTo(flagRenderX + 5, topoRenderY - 14);
        ctx.lineTo(flagRenderX + 34, topoRenderY - 2);
        ctx.lineTo(flagRenderX + 5, topoRenderY + 10);
        ctx.closePath();
        ctx.fill();

        // Mestre da Escalada esperando no topo
        if (imgMestreEscalada.complete) {
            ctx.drawImage(imgMestreEscalada, flagRenderX + 45, topoRenderY - 20, 36, 54);
        }
    }

    ctx.restore(); // Restaura contexto após tremor

    // 9. HUD Superior e Minimapa 2D
    // Minimapa Amplo
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(escaladaGame.minimapaX, escaladaGame.minimapaY, escaladaGame.minimapaLargura, escaladaGame.minimapaAltura);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(escaladaGame.minimapaX, escaladaGame.minimapaY, escaladaGame.minimapaLargura, escaladaGame.minimapaAltura);

    const progressoMini = Math.min(1, escaladaGame.alturaAtual / escaladaGame.alturaTotal);
    const posZorpY = escaladaGame.minimapaY + escaladaGame.minimapaAltura - (progressoMini * escaladaGame.minimapaAltura);
    const posZorpX = escaladaGame.minimapaX + (escaladaGame.playerX / escaladaGame.mountainWidth) * escaladaGame.minimapaLargura;

    // Marcador do Cume
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(escaladaGame.minimapaX - 2, escaladaGame.minimapaY, escaladaGame.minimapaLargura + 4, 3);

    // Marcador do Zorp
    ctx.fillStyle = "#2ecc71";
    ctx.beginPath();
    ctx.arc(posZorpX, posZorpY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Barra Superior
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, 32);

    // Vidas (Corações)
    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 15px monospace";
    let coracoes = "";
    for (let v = 0; v < escaladaGame.maxVida; v++) {
        coracoes += (v < escaladaGame.vida) ? "♥ " : "♡ ";
    }
    ctx.fillText(`VIDAS: ${coracoes}`, 65, 21);

    // Altura Atual
    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 13px monospace";
    ctx.fillText(`ALTITUDE: ${Math.floor(escaladaGame.alturaAtual)}m / ${escaladaGame.alturaTotal}m`, 230, 21);

    // Indicador de Vento
    if (escaladaGame.ventoDuracao > 0) {
        ctx.fillStyle = (Date.now() % 400 < 200) ? "#00e5ff" : "#ffffff";
        ctx.font = "bold 11px monospace";
        let setaVento = escaladaGame.ventoDirecao > 0 ? ">>>" : "<<<";
        ctx.fillText(`VENTO ${setaVento}`, canvas.width - 85, 21);
    }

    // 10. Caixa de Diálogo do Mestre durante a subida
    if (escaladaGame.mensagemTimer > 0) {
        ctx.fillStyle = "rgba(20, 20, 30, 0.9)";
        ctx.fillRect(35, 42, canvas.width - 70, 44);
        ctx.strokeStyle = "#f1c40f";
        ctx.lineWidth = 2;
        ctx.strokeRect(35, 42, canvas.width - 70, 44);
        
        if (imgMestreEscalada.complete) {
            ctx.drawImage(imgMestreEscalada, 40, 45, 26, 38);
        }
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px monospace";
        ctx.fillText(escaladaGame.mensagemAtual, 75, 68);
    }
    
    // 11. Telas de Tutorial e Fim de Jogo
    if (escaladaGame.gameState === 'TUTORIAL') {
        drawOverlayScreen("ESCALADA NO MONTE ZORP", [
            "Chegue ao cume do monte (1200m)!",
            "Use [A / D] para mirar e navegar pela montanha gigante (1500px).",
            "Aperte [ESPAÇO] ou [W] para saltar de agarra em agarra.",
            "CUIDADO: Agarras azuis se movem, agarras vermelhas quebram!",
            "Desvie das pedras e bolas de neve que o Mestre joga do topo!"
        ], "#f1c40f");
    } else if (escaladaGame.gameState === 'GAMEOVER') {
        if (escaladaGame.win) {
            // TELA DE VITÓRIA COM VictoryEscalada.png, ZORP COM A MEDALHA E MESTRE COM POLEGAR
            if (imgVictoryEscalada.complete && imgVictoryEscalada.naturalWidth > 0) {
                // Desenha a arte completa de fundo
                ctx.drawImage(imgVictoryEscalada, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = "rgba(10, 20, 35, 0.92)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // Caixa central da mensagem de vitória limpa e elegante
            ctx.fillStyle = "rgba(15, 25, 40, 0.90)";
            ctx.fillRect(40, 195, canvas.width - 80, 85);
            ctx.strokeStyle = "#f1c40f";
            ctx.lineWidth = 3;
            ctx.strokeRect(40, 195, canvas.width - 80, 85);

            // Textos de Vitória
            ctx.fillStyle = "#f1c40f";
            ctx.font = "bold 15px monospace";
            ctx.textAlign = "center";
            ctx.fillText("★ VOCÊ VENCEU A ESCALADA! ★", canvas.width / 2, 218);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px monospace";
            ctx.fillText("Insígnia da Escalada Conquistada no Cume!", canvas.width / 2, 240);

            ctx.fillStyle = (Date.now() % 600 < 300) ? "#2ecc71" : "#ffffff";
            ctx.font = "bold 12px monospace";
            ctx.fillText("[ESPAÇO] CONTINUAR", canvas.width / 2, 265);
            ctx.textAlign = "left";
        } else {
            drawOverlayScreen("QUEDA NA MONTANHA...", [
                "A montanha é implacável!",
                "Mantenha o ritmo, desvie dos projéteis e tente novamente!"
            ], "#e74c3c");
        }
    }
}

// -------------------------------------------------------------
// MINIGAME DE BOXE (ESTILO PUNCH-OUT / PRIZEFIGHTERS)
// -------------------------------------------------------------
const boxeGame = {
    state: 'VS_SCREEN', // 'VS_SCREEN', 'FIGHTING', 'KNOCKDOWN', 'FINISHER', 'GAMEOVER'
    round: 1,
    maxRounds: 3,
    roundTimer: 60 * 60, // 60s por round
    
    // Jogador: ZORP (Visto de costas em 1º plano)
    player: {
        x: 225,
        y: 282,
        baseX: 225,
        hp: 100,
        maxHp: 100,
        energy: 100,
        maxEnergy: 100,
        hearts: 3,
        state: 'IDLE', // 'IDLE', 'DUCK', 'DODGE_L', 'DODGE_R', 'JAB', 'DIRETO', 'HIT', 'KNOCKDOWN', 'WIN'
        timer: 0,
        animFrame: 0,
        isCounter: false,
        dodgeCooldown: 0, // Mecânica anti-spam de esquiva
        dodgeLag: 0,      // Período de recuperação pós-esquiva (vulnerável a punição)
        punchArm: 'LEFT', // Alternância de braço para animações naturais
        isExhausted: false, // Penalidade se zerar energia por mashing
        exhaustTimer: 0
    },
    
    // Oponente: MESTRE DO BOXE (De frente no centro do ringue)
    mestre: {
        x: 225,
        y: 195,
        baseX: 225,
        hp: 120,
        maxHp: 120,
        energy: 100,
        maxEnergy: 100,
        hearts: 3,
        state: 'IDLE', // 'IDLE', 'GUARD', 'TELEGRAPH', 'PUNCHING', 'SPECIAL_WINDUP', 'SPECIAL_CHARGE', 'SPECIAL_PUNCH', 'WHIFFED', 'HIT', 'KNOCKDOWN', 'WIN'
        timer: 0,
        animFrame: 0,
        punchType: 'JAB',
        aiCooldown: 40,
        isGuarding: false,
        specialCooldown: 150, // Temporizador para o super soco carregado
        specialPhase: 0,
        specialSideX: 310,    // Destino lateral do passo/deslocamento
        specialCountdown: 3,  // Contagem regressiva 3.. 2.. 1.. 0!
        wasDodged: false      // Sinaliza esquiva com sucesso para abertura de contragolpe
    },
    
    refereeCount: 0,
    refereeTimer: 0,
    knockdownTarget: '',
    
    announcement: 'ROUND 1',
    announcementTimer: 90,
    announcementColor: '#f1c40f',
    
    sparks: [],     // Partículas de impacto, explosões e exclamação '!'
    reactions: [],  // Balões de emojis animados
    shakeTimer: 0,
    win: false,

    // Golpe Final Cinematográfico (Último Round)
    finisher: {
        phase: 0, // 0: Prep / Carregamento, 1: Salto, 2: Impacto Explosivo, 3: Mestre Voando no teto, 4: Queda e Nocaute
        timer: 0,
        mestreX: 225,
        mestreY: 195
    }
};

function triggerEmoji(target, img, duration = 90) {
    boxeGame.reactions = boxeGame.reactions.filter(r => r.target !== target);
    let rx = (target === 'PLAYER') ? boxeGame.player.x - 35 : boxeGame.mestre.x + 35;
    let ry = (target === 'PLAYER') ? boxeGame.player.y - 105 : boxeGame.mestre.y - 110;
    boxeGame.reactions.push({
        target: target,
        img: img,
        x: rx,
        y: ry,
        timer: duration,
        maxTimer: duration
    });
}

function spawnBoxeImpact(x, y, type = 'HIT', isCounter = false) {
    boxeGame.sparks.push({
        x: x,
        y: y,
        type: type, // 'HIT', 'EXPLOSION', 'STARS', 'EXCLAMATION'
        life: 18,
        maxLife: 18,
        isCounter: isCounter,
        vx: (Math.random() - 0.5) * 2,
        vy: -1 - Math.random() * 2
    });
}

function resetBoxe() {
    boxeGame.state = 'VS_SCREEN';
    boxeGame.round = 1;
    boxeGame.roundTimer = 60 * 60;
    
    boxeGame.player.x = 225;
    boxeGame.player.y = 282;
    boxeGame.player.baseX = 225;
    boxeGame.player.hp = 100;
    boxeGame.player.energy = 100;
    boxeGame.player.hearts = 3;
    boxeGame.player.state = 'IDLE';
    boxeGame.player.timer = 0;
    boxeGame.player.animFrame = 0;
    boxeGame.player.isCounter = false;
    boxeGame.player.dodgeCooldown = 0;
    boxeGame.player.dodgeLag = 0;
    boxeGame.player.punchArm = 'LEFT';
    boxeGame.player.isExhausted = false;
    boxeGame.player.exhaustTimer = 0;
    
    boxeGame.mestre.x = 225;
    boxeGame.mestre.y = 195;
    boxeGame.mestre.baseX = 225;
    boxeGame.mestre.hp = 120;
    boxeGame.mestre.energy = 100;
    boxeGame.mestre.hearts = 3;
    boxeGame.mestre.state = 'IDLE';
    boxeGame.mestre.timer = 0;
    boxeGame.mestre.animFrame = 0;
    boxeGame.mestre.punchType = 'JAB';
    boxeGame.mestre.aiCooldown = 45;
    boxeGame.mestre.isGuarding = false;
    boxeGame.mestre.specialCooldown = 150;
    boxeGame.mestre.specialPhase = 0;
    boxeGame.mestre.specialSideX = 310;
    boxeGame.mestre.specialCountdown = 3;
    boxeGame.mestre.wasDodged = false;
    
    boxeGame.refereeCount = 0;
    boxeGame.refereeTimer = 0;
    boxeGame.knockdownTarget = '';
    
    boxeGame.announcement = 'ROUND 1';
    boxeGame.announcementTimer = 90;
    boxeGame.announcementColor = '#f1c40f';
    
    boxeGame.sparks = [];
    boxeGame.reactions = [];
    boxeGame.shakeTimer = 0;
    boxeGame.win = false;

    boxeGame.finisher.phase = 0;
    boxeGame.finisher.timer = 0;
    boxeGame.finisher.mestreX = 225;
    boxeGame.finisher.mestreY = 195;
}

function updateBoxeGame() {
    // 1. Tela de VS (Apresentação Inicial)
    if (boxeGame.state === 'VS_SCREEN') {
        hintText.innerText = "[ESPAÇO] PARA ENTRAR NO RINGUE E LUTAR!";
        if (keys.space) {
            boxeGame.state = 'FIGHTING';
            keys.space = false;
            triggerEmoji('MESTRE', imgEmojiMestreSmirk, 75);
            triggerEmoji('PLAYER', imgEmojiZorpGuard, 75);
        }
        return;
    }

    // 2. Tela de Fim de Jogo (Vitória ou Derrota)
    if (boxeGame.state === 'GAMEOVER') {
        hintText.innerText = "[ESPAÇO] RETORNAR AO CLUBE DE BOXE";
        if (keys.space) {
            currentScene = "ILHA_ESQUI";
            keys.space = false;
            dialogBox.classList.add("show");
        }
        return;
    }

    // Tremor de tela
    if (boxeGame.shakeTimer > 0) boxeGame.shakeTimer--;
    
    // Anúncios na tela
    if (boxeGame.announcementTimer > 0) boxeGame.announcementTimer--;

    // Partículas de faíscas e efeitos
    for (let i = boxeGame.sparks.length - 1; i >= 0; i--) {
        const sp = boxeGame.sparks[i];
        sp.life--;
        sp.x += sp.vx;
        sp.y += sp.vy;
        if (sp.life <= 0) boxeGame.sparks.splice(i, 1);
    }

    // Atualização de Emojis de Reação
    for (let i = boxeGame.reactions.length - 1; i >= 0; i--) {
        const rx = boxeGame.reactions[i];
        rx.timer--;
        if (rx.timer <= 0) boxeGame.reactions.splice(i, 1);
    }

    // -------------------------------------------------------------
    // 3. CINEMÁTICA DO GOLPE FINAL (SUPER GANCHO QUE FAZ O MESTRE VOAR)
    // -------------------------------------------------------------
    if (boxeGame.state === 'FINISHER') {
        const f = boxeGame.finisher;
        f.timer++;

        // Fase 0: Preparação / Windup com fogo azul (45 frames)
        if (f.phase === 0) {
            boxeGame.player.state = 'FINISHER_PREP';
            boxeGame.mestre.state = 'HIT';
            hintText.innerText = "★ GOLPE FINAL! ZORP CONCENTRA TODA A ENERGIA! ★";
            if (f.timer % 6 === 0) {
                spawnBoxeImpact(boxeGame.player.x - 10, boxeGame.player.y - 45, 'HIT', true);
            }
            if (f.timer >= 45) {
                f.phase = 1;
                f.timer = 0;
            }
        }
        // Fase 1: Salto e Lançamento do Gancho com Pilar de Fogo Azul (25 frames)
        else if (f.phase === 1) {
            boxeGame.player.state = 'FINISHER_LAUNCH';
            boxeGame.shakeTimer = 6;
            if (f.timer >= 25) {
                f.phase = 2;
                f.timer = 0;
                boxeGame.shakeTimer = 18;
                spawnBoxeImpact(225, 170, 'EXPLOSION', true);
                spawnBoxeImpact(225, 150, 'EXCLAMATION', true);
                spawnBoxeImpact(225, 180, 'STARS', false);
                triggerEmoji('MESTRE', imgEmojiMestreShock, 90);
                triggerEmoji('PLAYER', imgEmojiZorpStars, 90);
            }
        }
        // Fase 2: Impacto Estelar Explosivo Devastador (30 frames)
        else if (f.phase === 2) {
            boxeGame.player.state = 'FINISHER_IMPACT';
            if (f.timer % 4 === 0) {
                spawnBoxeImpact(225 + (Math.random() - 0.5) * 40, 160 + (Math.random() - 0.5) * 30, 'STARS', true);
            }
            if (f.timer >= 30) {
                f.phase = 3;
                f.timer = 0;
                f.mestreX = 225;
                f.mestreY = 195;
            }
        }
        // Fase 3: Mestre Voando Alto pelo Teto da Arena em Giro (100 frames)
        else if (f.phase === 3) {
            boxeGame.player.state = 'FINISHER_POSE';
            const progress = f.timer / 100;
            // Trajetória parabólica que voa até o topo da arena e cai
            f.mestreY = 195 - Math.sin(progress * Math.PI) * 230;
            f.mestreX = 225 + Math.sin(progress * Math.PI * 2) * 50;

            if (f.timer % 6 === 0) {
                spawnBoxeImpact(f.mestreX, f.mestreY, 'HIT', true);
            }

            if (f.timer >= 100) {
                f.phase = 4;
                f.timer = 0;
                f.mestreX = 225;
                f.mestreY = 210;
                boxeGame.shakeTimer = 16;
                spawnBoxeImpact(225, 210, 'EXPLOSION', false);
                spawnBoxeImpact(225, 195, 'STARS', false);
                triggerEmoji('MESTRE', imgEmojiMestreDizzy, 180);
                triggerEmoji('PLAYER', imgEmojiZorpStars, 180);
                boxeGame.announcement = '★ K.O. TOTAL! ★';
                boxeGame.announcementTimer = 120;
                boxeGame.announcementColor = '#f1c40f';
            }
        }
        // Fase 4: Mestre esparramado no chão nocauteado & Vitória Total (110 frames)
        else if (f.phase === 4) {
            boxeGame.player.state = 'WIN';
            if (f.timer % 15 === 0) {
                spawnBoxeImpact(225 + (Math.random() - 0.5) * 30, 190, 'STARS', false);
            }
            if (f.timer >= 110) {
                boxeGame.state = 'GAMEOVER';
                boxeGame.win = true;
                insignias.boxe = true;
                insignias.esqui = true;
                dialogText.innerHTML = "> MESTRE DO BOXE: (Zonzo na lona) Que... super gancho lendário... Você fez o Mestre voar! O cinturão galáctico é seu, Zorp!";
            }
        }
        return;
    }

    // -------------------------------------------------------------
    // 4. CONTAGEM DE NOCAUTE (KNOCKDOWN COMUM NOS ROUNDS 1 E 2)
    // -------------------------------------------------------------
    if (boxeGame.state === 'KNOCKDOWN') {
        boxeGame.refereeTimer++;
        if (boxeGame.refereeTimer >= 38) {
            boxeGame.refereeTimer = 0;
            boxeGame.refereeCount++;
            boxeGame.announcement = `${boxeGame.refereeCount}!`;
            boxeGame.announcementTimer = 30;
            boxeGame.announcementColor = '#f1c40f';

            if (boxeGame.knockdownTarget === 'MESTRE') {
                if (boxeGame.refereeCount >= 8 && boxeGame.mestre.hearts > 1) {
                    // Mestre levanta
                    boxeGame.mestre.hearts--;
                    boxeGame.mestre.hp = Math.floor(boxeGame.mestre.maxHp * 0.55);
                    boxeGame.mestre.state = 'IDLE';
                    boxeGame.state = 'FIGHTING';
                    boxeGame.announcement = 'FIGHT!';
                    boxeGame.announcementTimer = 45;
                    triggerEmoji('MESTRE', imgEmojiMestreCocky, 75);
                } else if (boxeGame.refereeCount >= 10 || boxeGame.mestre.hearts <= 1) {
                    boxeGame.state = 'GAMEOVER';
                    boxeGame.win = true;
                    boxeGame.player.state = 'WIN';
                    insignias.boxe = true;
                    insignias.esqui = true;
                    dialogText.innerHTML = "> MESTRE DO BOXE: Nocaute indiscutível! Você provou seu valor no ringue!";
                }
            } else if (boxeGame.knockdownTarget === 'PLAYER') {
                if (boxeGame.refereeCount >= 8 && boxeGame.player.hearts > 1) {
                    // Zorp levanta
                    boxeGame.player.hearts--;
                    boxeGame.player.hp = Math.floor(boxeGame.player.maxHp * 0.55);
                    boxeGame.player.state = 'IDLE';
                    boxeGame.state = 'FIGHTING';
                    boxeGame.announcement = 'FIGHT!';
                    boxeGame.announcementTimer = 45;
                    triggerEmoji('PLAYER', imgEmojiZorpAngry, 75);
                } else if (boxeGame.refereeCount >= 10 || boxeGame.player.hearts <= 1) {
                    // Derrota
                    boxeGame.state = 'GAMEOVER';
                    boxeGame.win = false;
                    boxeGame.mestre.state = 'WIN';
                    dialogText.innerHTML = "> MESTRE DO BOXE: Bom combate, Zorp! Preste atenção no ritmo dos meus socos: pendule com [A] ou [D] para esquivar. Quando eu errar o golpe, essa é sua chance de contra-atacar com [J]!";
                }
            }
        }
        return;
    }

    // -------------------------------------------------------------
    // 5. COMBATE EM TEMPO REAL (FIGHTING)
    // -------------------------------------------------------------
    hintText.innerText = "[A/D] PENDULAR / ESQUIVAR | [J] SOCO (CONTRA-ATAQUE NA ABERTURA!)";

    // Cronômetro do Round
    boxeGame.roundTimer--;
    if (boxeGame.roundTimer <= 0) {
        boxeGame.round++;
        if (boxeGame.round > boxeGame.maxRounds) {
            // Decisão por pontos
            if (boxeGame.player.hp >= boxeGame.mestre.hp) {
                boxeGame.state = 'GAMEOVER';
                boxeGame.win = true;
                insignias.boxe = true;
                insignias.esqui = true;
                dialogText.innerHTML = "> ÁRBITRO: Vitória por decisão unânime! Zorp é o grande campeão!";
            } else {
                boxeGame.state = 'GAMEOVER';
                boxeGame.win = false;
                dialogText.innerHTML = "> ÁRBITRO: Vitória do Mestre por pontos! Continue treinando suas esquivas com [A/D] e contra-ataque na abertura com [J]!";
            }
            return;
        } else {
            boxeGame.roundTimer = 60 * 60;
            boxeGame.announcement = (boxeGame.round === 3) ? '★ ROUND FINAL ★' : `ROUND ${boxeGame.round}`;
            boxeGame.announcementTimer = 85;
            triggerEmoji('MESTRE', imgEmojiMestreSmirk, 70);
            triggerEmoji('PLAYER', imgEmojiZorpGuard, 70);
        }
    }

    const p = boxeGame.player;
    const m = boxeGame.mestre;

    // Atualização de Cooldowns e Recuperação (Anti-Spam)
    if (p.dodgeCooldown > 0) p.dodgeCooldown--;
    if (p.dodgeLag > 0) p.dodgeLag--;
    if (m.specialCooldown > 0) m.specialCooldown--;

    // Gerenciamento de Exaustão do Jogador (Penalidade por mashing sem timing)
    if (p.isExhausted) {
        if (p.exhaustTimer > 0) p.exhaustTimer--;
        p.energy = Math.min(p.maxEnergy, p.energy + 0.35);
        if (p.energy >= 40 && p.exhaustTimer <= 0) {
            p.isExhausted = false;
            boxeGame.announcement = 'RECUPERADO!';
            boxeGame.announcementTimer = 22;
            boxeGame.announcementColor = '#2ecc71';
        }
    } else {
        // Regeneração normal de Estamina / Energia
        if (p.energy < p.maxEnergy && p.state !== 'JAB' && p.state !== 'DIRETO') {
            p.energy = Math.min(p.maxEnergy, p.energy + 0.85);
        }
    }

    if (m.energy < m.maxEnergy) {
        m.energy = Math.min(m.maxEnergy, m.energy + 0.85);
    }

    // Animação de ginga (Idle bounce)
    p.animFrame = Math.floor(Date.now() / 150) % 3;
    m.animFrame = Math.floor(Date.now() / 150) % 3;

    // Limpar teclas de socos antigos que foram consolidadas em [J]
    keys.k = false; keys.x = false; keys.u = false; keys.c = false; keys.i = false; keys.v = false;

    // -------------------------------------------------------------
    // CONTROLES DE ESQUIVA E ATAQUE DO ZORP (COSTAS)
    // -------------------------------------------------------------
    if (p.state === 'IDLE') {
        // Checagem de Exaustão ao tentar agir
        if (p.isExhausted) {
            if (keys.w || keys.a || keys.d || keys.j || keys.z || keys.space) {
                if (boxeGame.announcementTimer <= 0) {
                    boxeGame.announcement = 'EXAUSTO! AGUARDE!';
                    boxeGame.announcementTimer = 20;
                    boxeGame.announcementColor = '#e74c3c';
                }
                keys.w = false; keys.a = false; keys.d = false;
                keys.j = false; keys.z = false; keys.space = false;
            }
        }
        // TENTATIVA DE ESQUIVA APENAS COM [A] OU [D] (SEM [W])
        else if (keys.a || keys.d) {
            keys.w = false;
            if (p.dodgeCooldown > 0 || p.dodgeLag > 0) {
                // Spam de esquiva bloqueado! Perde fôlego
                if (p.energy >= 4) p.energy -= 4;
                if (boxeGame.announcementTimer <= 0) {
                    boxeGame.announcement = 'RECUPERANDO!';
                    boxeGame.announcementTimer = 18;
                    boxeGame.announcementColor = '#e67e22';
                }
                keys.a = false; keys.d = false;
            } else if (p.energy >= 14) {
                p.energy -= 14;
                p.dodgeCooldown = 28; // Cooldown total para nova esquiva

                if (keys.a) {
                    p.state = 'DODGE_L';
                    p.timer = 16;
                    p.x = Math.max(170, p.x - 26);
                    keys.a = false;
                    triggerEmoji('PLAYER', imgEmojiZorpAlert, 35);
                } else if (keys.d) {
                    p.state = 'DODGE_R';
                    p.timer = 16;
                    p.x = Math.min(280, p.x + 26);
                    keys.d = false;
                    triggerEmoji('PLAYER', imgEmojiZorpAlert, 35);
                }
            } else {
                boxeGame.announcement = 'SEM ESTAMINA!';
                boxeGame.announcementTimer = 18;
                boxeGame.announcementColor = '#e67e22';
                keys.a = false; keys.d = false;
            }
        }
        // BOTÃO ÚNICO DE SOCO: [J] (ou [ESPAÇO] durante a luta)
        else if (keys.j || keys.z || keys.space) {
            keys.j = false; keys.z = false; keys.space = false;
            keys.w = false;
            if (p.energy < 8) {
                boxeGame.announcement = 'RECUPERANDO!';
                boxeGame.announcementTimer = 18;
                boxeGame.announcementColor = '#e67e22';
            } else {
                p.energy -= 8;
                p.punchArm = (p.punchArm === 'LEFT') ? 'RIGHT' : 'LEFT';
                p.state = (p.punchArm === 'LEFT') ? 'JAB' : 'DIRETO';
                p.timer = 12;
            }
        }
    } else {
        p.timer--;

        // Conexão do Impacto do Golpe do Zorp no Mestre (Frame ativo do soco)
        const isHitFrame = (p.state === 'JAB' || p.state === 'DIRETO') && p.timer === 6;

        if (isHitFrame) {
            const hitX = m.x;
            const hitY = m.y - 50;

            // 1. CHECAGEM DE DISTÂNCIA (Ex: Mestre preparando especial afastado no ringue)
            if (m.state === 'SPECIAL_CHARGE' && Math.abs(p.x - m.x) > 65) {
                boxeGame.announcement = 'FORA DE ALCANCE!';
                boxeGame.announcementTimer = 22;
                boxeGame.announcementColor = '#f39c12';
                spawnBoxeImpact(p.x, p.y - 70, 'STARS', false);
            }
            // 2. MESTRE EM ABERTURA DEPOIS DE ERRAR O GOLPE (WHIFFED) -> CONTRAGOLPE CRÍTICO!
            else if (m.state === 'WHIFFED') {
                const isSpecialWhiff = (m.specialPhase > 0);
                const counterDmg = isSpecialWhiff ? 34 : 18;
                m.hp = Math.max(0, m.hp - counterDmg);
                m.state = 'HIT';
                m.timer = 22;
                p.energy = Math.min(p.maxEnergy, p.energy + 14); // Recompensa de estamina por contragolpe
                boxeGame.shakeTimer = isSpecialWhiff ? 16 : 10;
                spawnBoxeImpact(hitX, hitY, 'EXPLOSION', true);
                spawnBoxeImpact(hitX, hitY - 20, 'EXCLAMATION', true);
                spawnBoxeImpact(hitX, hitY, 'STARS', false);
                boxeGame.announcement = isSpecialWhiff ? '★ SUPER CONTRAGOLPE 3X! ★' : '★ CONTRAGOLPE! ★';
                boxeGame.announcementTimer = 45;
                boxeGame.announcementColor = isSpecialWhiff ? '#00e5ff' : '#2ecc71';
                triggerEmoji('MESTRE', imgEmojiMestreDizzy, 60);
                triggerEmoji('PLAYER', imgEmojiZorpStars, 60);
                m.specialPhase = 0;
            } 
            // 3. MESTRE TELEGRAFANDO GOLPE NORMAL -> INTERRUPÇÃO
            else if (m.state === 'TELEGRAPH') {
                const counterDmg = 16;
                m.hp = Math.max(0, m.hp - counterDmg);
                m.state = 'HIT';
                m.timer = 18;
                boxeGame.shakeTimer = 10;
                spawnBoxeImpact(hitX, hitY, 'EXPLOSION', true);
                spawnBoxeImpact(hitX, hitY - 20, 'EXCLAMATION', true);
                boxeGame.announcement = '★ INTERRUPÇÃO! ★';
                boxeGame.announcementTimer = 35;
                boxeGame.announcementColor = '#00e5ff';
                triggerEmoji('MESTRE', imgEmojiMestreDizzy, 50);
            }
            // 4. MESTRE NO ESPECIAL -> SUPER ARMADURA! NÃO CANCELA NEM CONGELA O ESPECIAL!
            else if (m.state === 'SPECIAL_WINDUP' || m.state === 'SPECIAL_CHARGE' || m.state === 'SPECIAL_PUNCH') {
                spawnBoxeImpact(hitX, hitY, 'HIT', false);
                p.energy = Math.max(0, p.energy - 10);
                boxeGame.announcement = 'SUPER ARMADURA! ESQUIVE!';
                boxeGame.announcementTimer = 25;
                boxeGame.announcementColor = '#e74c3c';
            }
            // 5. MESTRE EM IDLE OU GUARDA -> BLOQUEIA TOTALMENTE O ATAQUE! (Anti-Mashing)
            else {
                // Mestre ergue a guarda instantaneamente e anula o golpe
                m.isGuarding = true;
                m.state = 'GUARD';
                m.timer = 16;
                spawnBoxeImpact(hitX, hitY, 'HIT', false);
                
                // Penalidade severa de estamina por bater sem abertura
                p.energy = Math.max(0, p.energy - 12);
                boxeGame.announcement = 'BLOQUEADO!';
                boxeGame.announcementTimer = 22;
                boxeGame.announcementColor = '#e74c3c';

                // Se a energia do Zorp zerar -> EXAUSTO!
                if (p.energy <= 0) {
                    p.isExhausted = true;
                    p.exhaustTimer = 90; // 1.5 segundos sem conseguir bater ou esquivar
                    boxeGame.announcement = 'EXAUSTO! SEM ENERGIA!';
                    boxeGame.announcementTimer = 45;
                    boxeGame.announcementColor = '#e74c3c';
                    triggerEmoji('PLAYER', imgEmojiZorpDizzy, 75);
                    triggerEmoji('MESTRE', imgEmojiMestreSmirk, 75);
                }
            }

            // Checar se o Mestre foi derrotado
            if (m.hp <= 0) {
                // NO ÚLTIMO ROUND: DISPARA O GOLPE FINAL CINEMATOGRÁFICO DO GANCHO!
                if (boxeGame.round >= boxeGame.maxRounds || m.hearts <= 1) {
                    boxeGame.state = 'FINISHER';
                    boxeGame.finisher.phase = 0;
                    boxeGame.finisher.timer = 0;
                    boxeGame.finisher.mestreX = m.x;
                    boxeGame.finisher.mestreY = m.y;
                    boxeGame.announcement = '★ GOLPE FINAL! ★';
                    boxeGame.announcementTimer = 90;
                    boxeGame.announcementColor = '#f1c40f';
                    triggerEmoji('PLAYER', imgEmojiZorpStars, 90);
                    triggerEmoji('MESTRE', imgEmojiMestreShock, 90);
                } else {
                    // Knockdown comum em rounds anteriores
                    m.state = 'KNOCKDOWN';
                    boxeGame.state = 'KNOCKDOWN';
                    boxeGame.knockdownTarget = 'MESTRE';
                    boxeGame.refereeCount = 0;
                    boxeGame.refereeTimer = 0;
                    boxeGame.announcement = 'KNOCKDOWN!';
                    boxeGame.announcementTimer = 45;
                    boxeGame.announcementColor = '#e74c3c';
                    triggerEmoji('MESTRE', imgEmojiMestreDizzy, 90);
                    triggerEmoji('PLAYER', imgEmojiZorpStars, 90);
                }
            }
        }

        if (p.timer <= 0) {
            // Se estava esquivando, entra na janela de lag pós-esquiva (anti-spam)
            if (p.state === 'DODGE_L' || p.state === 'DODGE_R') {
                p.dodgeLag = 14;
            }
            p.state = 'IDLE';
            // Retorna suavemente para a posição central após esquivas
            if (p.x !== p.baseX) p.x += (p.baseX - p.x) * 0.35;
        }
    }

    // -------------------------------------------------------------
    // INTELIGÊNCIA ARTIFICIAL DO MESTRE (FRENTE)
    // -------------------------------------------------------------
    if (m.state === 'IDLE') {
        m.aiCooldown--;

        if (m.aiCooldown <= 0) {
            // Checar se ativa o NOVO GOLPE ESPECIAL CARREGADO (Estilo Punch-Out)
            const canSpecial = m.specialCooldown <= 0 && (boxeGame.round >= 2 || m.hp < 90 || Math.random() < 0.40);

            if (canSpecial) {
                // FASE 1 DO ESPECIAL: WINDUP (Aviso telegrafado no centro)
                m.state = 'SPECIAL_WINDUP';
                m.specialPhase = 1;
                m.timer = 24;
                m.wasDodged = false;
                m.specialCooldown = 260 + Math.floor(Math.random() * 80);
                // Escolhe lado para onde vai se deslocar carregando o soco fora de alcance
                m.specialSideX = (Math.random() < 0.5) ? 140 : 310;
                m.specialCountdown = 3;
                boxeGame.announcement = '★ CUIDADO! ESPECIAL CARREGANDO! ★';
                boxeGame.announcementTimer = 35;
                boxeGame.announcementColor = '#e74c3c';
                boxeGame.shakeTimer = 6;
                triggerEmoji('MESTRE', imgEmojiMestreSmirk, 45);
            } else {
                const rnd = Math.random();
                if (rnd < 0.35) {
                    // Jab rápido telegrafado
                    m.state = 'TELEGRAPH';
                    m.punchType = 'JAB';
                    m.timer = 15;
                    m.wasDodged = false;
                    m.aiCooldown = 35 + Math.floor(Math.random() * 20);
                    triggerEmoji('MESTRE', imgEmojiMestreSmirk, 25);
                } else if (rnd < 0.85) {
                    // Golpe pesado telegrafado (Direto, Gancho ou Uppercut) com aviso '!'
                    m.state = 'TELEGRAPH';
                    m.punchType = (rnd < 0.55) ? 'DIRETO' : (rnd < 0.70 ? 'HOOK' : 'UPPERCUT');
                    m.timer = 22;
                    m.wasDodged = false;
                    m.aiCooldown = 40 + Math.floor(Math.random() * 25);
                    triggerEmoji('MESTRE', imgEmojiMestreSmirk, 35);
                } else {
                    // Guarda defensiva temporária com timer
                    m.state = 'GUARD';
                    m.isGuarding = true;
                    m.timer = 20;
                }
            }
        }
    } 
    // ESTADO DE GUARDA / BLOQUEIO DO MESTRE (TEMPORÁRIO)
    else if (m.state === 'GUARD') {
        m.timer--;
        if (m.timer <= 0) {
            m.state = 'IDLE';
            m.isGuarding = false;
            m.aiCooldown = 25 + Math.floor(Math.random() * 20);
        }
    }
    // GOLPE ESPECIAL DO MESTRE: FASE 1 (WINDUP)
    else if (m.state === 'SPECIAL_WINDUP') {
        m.timer--;
        if (m.timer <= 0) {
            // Transição para a FASE 2: DESLOCAMENTO LATERAL CARREGANDO COM CONTAGEM REGRESSIVA
            m.state = 'SPECIAL_CHARGE';
            m.specialPhase = 2;
            m.timer = 90; // 90 frames = 1.5 segundos de contagem 3.. 2.. 1.. 0!
            m.specialCountdown = 3;
            m.wasDodged = false;
            spawnBoxeImpact(m.x, m.y - 35, 'STARS', true);
        }
    }
    // GOLPE ESPECIAL DO MESTRE: FASE 2 (CARGA LATERAL & CONTAGEM 3, 2, 1, 0!)
    else if (m.state === 'SPECIAL_CHARGE') {
        m.timer--;
        // Deslocamento suave para o lado (ganhando distância do player)
        m.x += (m.specialSideX - m.x) * 0.08;

        // Atualização da contagem regressiva
        if (m.timer > 60) {
            m.specialCountdown = 3;
        } else if (m.timer > 30) {
            m.specialCountdown = 2;
        } else if (m.timer > 0) {
            m.specialCountdown = 1;
        } else {
            m.specialCountdown = 0;
        }

        // Exibir contagem no anúncio a cada virada de número
        if (m.timer === 89 || m.timer === 59 || m.timer === 29) {
            boxeGame.announcement = `★ ESPECIAL EM: ${m.specialCountdown}... ★`;
            boxeGame.announcementTimer = 28;
            boxeGame.announcementColor = '#f1c40f';
            spawnBoxeImpact(m.x, m.y - 35, 'STARS', true);
        }

        if (m.timer % 6 === 0) {
            spawnBoxeImpact(m.x + (Math.random() - 0.5) * 25, m.y - 35, 'HIT', true);
        }

        if (m.timer <= 0) {
            // Transição para a FASE 3: DISPARO DO SUPER SOCO ARRASADOR
            m.state = 'SPECIAL_PUNCH';
            m.specialPhase = 3;
            m.timer = 20;
            m.wasDodged = false;
            boxeGame.announcement = '★ 0! SOCO DEVASTADOR! ★';
            boxeGame.announcementTimer = 25;
            boxeGame.announcementColor = '#e74c3c';
            boxeGame.shakeTimer = 10;
        }
    }
    // GOLPE ESPECIAL DO MESTRE: FASE 3 (DISPARO DO SOCO COM SPEEDLINES)
    else if (m.state === 'SPECIAL_PUNCH') {
        m.timer--;
        // Retorna ao centro rapidamente no disparo do golpe
        m.x += (m.baseX - m.x) * 0.35;

        // Registra esquiva ativa do jogador durante o ataque especial
        if (p.state === 'DODGE_L' || p.state === 'DODGE_R') {
            m.wasDodged = true;
        }

        if (m.timer === 10) {
            const isDodging = m.wasDodged || ((p.state === 'DODGE_L' || p.state === 'DODGE_R') && p.timer > 0);
            if (isDodging) {
                // ESQUIVA COM SUCESSO! O Mestre erra e fica vulnerável para contragolpe!
                m.state = 'WHIFFED';
                m.timer = 60; // Enorme janela de vulnerabilidade (3x counter!)
                m.x = m.baseX;
                m.specialPhase = 1;
                m.wasDodged = false;
                boxeGame.announcement = '★ ESQUIVA PERFEITA! CONTRA-ATAQUE COM [J]! ★';
                boxeGame.announcementTimer = 55;
                boxeGame.announcementColor = '#00e5ff';
                spawnBoxeImpact(p.x, p.y - 70, 'STARS', false);
                triggerEmoji('PLAYER', imgEmojiZorpStars, 65);
                triggerEmoji('MESTRE', imgEmojiMestreShock, 65);
            } else {
                // TOMOU O ESPECIAL EM CHEIO! Dano maciço arrasador (48 HP!)
                m.x = m.baseX;
                m.specialPhase = 0;
                p.hp = Math.max(0, p.hp - 48);
                p.state = 'HIT';
                p.timer = 18;
                boxeGame.shakeTimer = 24;
                spawnBoxeImpact(p.x, p.y - 65, 'EXPLOSION', true);
                spawnBoxeImpact(p.x, p.y - 85, 'EXCLAMATION', true);
                triggerEmoji('PLAYER', imgEmojiZorpDizzy, 90);
                triggerEmoji('MESTRE', imgEmojiMestreCocky, 90);

                if (p.hp <= 0) {
                    p.state = 'KNOCKDOWN';
                    boxeGame.state = 'KNOCKDOWN';
                    boxeGame.knockdownTarget = 'PLAYER';
                    boxeGame.refereeCount = 0;
                    boxeGame.refereeTimer = 0;
                    boxeGame.announcement = 'KNOCKDOWN!';
                    boxeGame.announcementTimer = 45;
                    boxeGame.announcementColor = '#e74c3c';
                    triggerEmoji('PLAYER', imgEmojiZorpSwirl, 90);
                    triggerEmoji('MESTRE', imgEmojiMestreCocky, 90);
                }
            }
        }
        if (m.timer <= 0) {
            m.state = 'IDLE';
            m.specialPhase = 0;
            m.x = m.baseX;
            m.wasDodged = false;
            m.aiCooldown = 35 + Math.floor(Math.random() * 25);
        }
    }
    // GOLPE COMUM TELEGRAFADO
    else if (m.state === 'TELEGRAPH') {
        m.timer--;
        if (p.state === 'DODGE_L' || p.state === 'DODGE_R') {
            m.wasDodged = true;
        }
        if (m.timer <= 0) {
            const isDodging = m.wasDodged || ((p.state === 'DODGE_L' || p.state === 'DODGE_R') && p.timer > 0);
            if (isDodging) {
                // Esquivou do golpe telegrafado com sucesso! Mestre fica vulnerável para contragolpe
                m.state = 'WHIFFED';
                m.timer = 48; // Janela aberta para o jogador punir com [J]
                m.wasDodged = false;
                boxeGame.announcement = '★ ESQUIVOU! CONTRA-ATAQUE COM [J]! ★';
                boxeGame.announcementTimer = 40;
                boxeGame.announcementColor = '#2ecc71';
                spawnBoxeImpact(p.x, p.y - 70, 'STARS', false);
                triggerEmoji('PLAYER', imgEmojiZorpStars, 45);
                triggerEmoji('MESTRE', imgEmojiMestreShock, 45);
            } else {
                m.state = 'PUNCHING';
                m.timer = 14;
                m.wasDodged = false;
            }
        }
    } 
    // GOLPE COMUM EM EXECUÇÃO
    else if (m.state === 'PUNCHING') {
        m.timer--;
        if (p.state === 'DODGE_L' || p.state === 'DODGE_R') {
            m.wasDodged = true;
        }
        if (m.timer === 7) {
            const isDodging = m.wasDodged || ((p.state === 'DODGE_L' || p.state === 'DODGE_R') && p.timer > 0);
            if (isDodging) {
                // Esquivou no frame do soco! Mestre erra e fica aberto para contragolpe
                m.state = 'WHIFFED';
                m.timer = 48;
                m.wasDodged = false;
                boxeGame.announcement = '★ ESQUIVOU! CONTRA-ATAQUE COM [J]! ★';
                boxeGame.announcementTimer = 40;
                boxeGame.announcementColor = '#2ecc71';
                spawnBoxeImpact(p.x, p.y - 70, 'STARS', false);
                triggerEmoji('PLAYER', imgEmojiZorpStars, 45);
                triggerEmoji('MESTRE', imgEmojiMestreShock, 45);
            } else {
                let mDmg = (m.punchType === 'JAB') ? 10 : (m.punchType === 'DIRETO' ? 18 : 26);

                // Se o Zorp estava no lag de recuperação pós-esquiva -> PUNISH / CONTRAGOLPE!
                if (p.dodgeLag > 0) {
                    mDmg = Math.floor(mDmg * 1.5);
                    boxeGame.announcement = 'PUNISH! CONTRAGOLPE!';
                    boxeGame.announcementTimer = 30;
                    boxeGame.announcementColor = '#e74c3c';
                }

                p.hp = Math.max(0, p.hp - mDmg);
                p.state = 'HIT';
                p.timer = 14;
                boxeGame.shakeTimer = 10;
                spawnBoxeImpact(p.x, p.y - 65, 'HIT', false);
                spawnBoxeImpact(p.x, p.y - 85, 'EXCLAMATION', false);
                triggerEmoji('PLAYER', imgEmojiZorpDizzy, 60);

                if (p.hp <= 0) {
                    p.state = 'KNOCKDOWN';
                    boxeGame.state = 'KNOCKDOWN';
                    boxeGame.knockdownTarget = 'PLAYER';
                    boxeGame.refereeCount = 0;
                    boxeGame.refereeTimer = 0;
                    boxeGame.announcement = 'KNOCKDOWN!';
                    boxeGame.announcementTimer = 45;
                    boxeGame.announcementColor = '#e74c3c';
                    triggerEmoji('PLAYER', imgEmojiZorpSwirl, 90);
                    triggerEmoji('MESTRE', imgEmojiMestreCocky, 90);
                }
            }
        }
        if (m.timer <= 0) {
            m.state = 'IDLE';
            m.isGuarding = false;
            m.wasDodged = false;
            m.aiCooldown = 25 + Math.floor(Math.random() * 20);
        }
    } else if (m.state === 'WHIFFED') {
        m.timer--;
        if (m.timer <= 0) {
            m.state = 'IDLE';
            m.specialPhase = 0;
            m.x = m.baseX;
            m.wasDodged = false;
            m.aiCooldown = 30 + Math.floor(Math.random() * 20);
        }
    } else if (m.state === 'HIT') {
        m.timer--;
        if (m.timer <= 0) {
            m.state = 'IDLE';
            m.specialPhase = 0;
            m.x = m.baseX;
            m.wasDodged = false;
            m.aiCooldown = 25 + Math.floor(Math.random() * 20);
        }
    }
}

function drawBoxeGame() {
    let shakeX = 0, shakeY = 0;
    if (boxeGame.shakeTimer > 0) {
        shakeX = (Math.random() - 0.5) * 8;
        shakeY = (Math.random() - 0.5) * 8;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // 1. TELA DE VS (Apresentação Inicial)
    if (boxeGame.state === 'VS_SCREEN') {
        if (imgBoxeTelaVs.complete && imgBoxeTelaVs.naturalWidth > 0) {
            ctx.drawImage(imgBoxeTelaVs, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = "#0c1b33";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.fillStyle = "rgba(10, 15, 30, 0.88)";
        ctx.fillRect(35, 210, canvas.width - 70, 70);
        ctx.strokeStyle = "#f1c40f";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(35, 210, canvas.width - 70, 70);

        ctx.fillStyle = "#f1c40f";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.fillText("★ DISPUTA DO CINTURÃO GALÁCTICO ★", canvas.width / 2, 233);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 9px monospace";
        ctx.fillText("ESTILO PUNCH-OUT: DESVIE COM [A/D] E CONTRA-ATAQUE COM [J] NA ABERTURA!", canvas.width / 2, 250);

        ctx.fillStyle = (Date.now() % 600 < 300) ? "#2ecc71" : "#ffffff";
        ctx.font = "bold 11px monospace";
        ctx.fillText("[ESPAÇO] ENTRAR NO RINGUE E LUTAR!", canvas.width / 2, 270);
        ctx.textAlign = "left";
        ctx.restore();
        return;
    }

    // 2. Fundo da Nova Arena de Boxe Espaçosa (Arena_Boxe.png)
    if (imgBoxeArenaBg.complete && imgBoxeArenaBg.naturalWidth > 0) {
        ctx.drawImage(imgBoxeArenaBg, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = "#101820";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#1e3799";
        ctx.fillRect(40, 130, 370, 150);
    }

    // -------------------------------------------------------------
    // 3. DESENHO DO OPONENTE: MESTRE DO BOXE (FRENTE / CENTRO DO RINGUE)
    // -------------------------------------------------------------
    const m = boxeGame.mestre;
    let mestreImg = imgMestreBoxeFrontIdle0;
    const mFrames = [imgMestreBoxeFrontIdle0, imgMestreBoxeFrontIdle1, imgMestreBoxeFrontIdle2];

    if (boxeGame.state === 'FINISHER') {
        const f = boxeGame.finisher;
        if (f.phase === 0 || f.phase === 1 || f.phase === 2) {
            mestreImg = imgMestreBoxeFrontHit;
        } else if (f.phase === 3) {
            mestreImg = (Math.floor(f.timer / 8) % 2 === 0) ? imgMestreFinisherFly0 : imgMestreFinisherFly1;
        } else if (f.phase === 4) {
            mestreImg = imgMestreFinisherCrash;
        }
    } else if (boxeGame.state === 'KNOCKDOWN' && boxeGame.knockdownTarget === 'MESTRE') {
        // Sequência dramática de queda e levantamento sincronizada com a contagem do árbitro (1 a 10)
        // (mestre_boxe_front_mat.png removido, tempos redistribuídos nos sprites limpos)
        if (boxeGame.refereeCount <= 5) {
            mestreImg = imgMestreBoxeFrontKnockdown; // Sentado na lona atordoado
        } else if (boxeGame.refereeCount <= 8) {
            mestreImg = imgMestreBoxeFrontGetup; // De joelhos empurrando o chão com as luvas
        } else {
            mestreImg = imgMestreBoxeFrontRise; // Se erguendo de pé
        }
    } else {
        if (m.state === 'IDLE' || m.state === 'TELEGRAPH') {
            mestreImg = m.isGuarding ? imgMestreBoxeFrontGuard : mFrames[m.animFrame % mFrames.length];
        } else if (m.state === 'GUARD') {
            mestreImg = imgMestreBoxeFrontGuard;
        } else if (m.state === 'SPECIAL_WINDUP') {
            mestreImg = imgMestreBoxeSpecialWindup;
        } else if (m.state === 'SPECIAL_CHARGE') {
            // Animação de passo lateral ativo:
            // Alterna entre passada lateral com luva em guarda e a postura de carga do soco!
            const stepToggle = Math.floor(m.timer / 7) % 2 === 0;
            if (stepToggle) {
                mestreImg = (m.specialSideX > m.baseX) ? imgMestreBoxeFrontDodgeR : imgMestreBoxeFrontDodgeL;
            } else {
                mestreImg = imgMestreBoxeSpecialCharge;
            }
        } else if (m.state === 'SPECIAL_PUNCH') {
            mestreImg = imgMestreBoxeSpecialPunch;
        } else if (m.state === 'WHIFFED') {
            mestreImg = imgMestreBoxeFrontHit;
        } else if (m.state === 'PUNCHING') {
            mestreImg = (m.punchType === 'JAB') ? imgMestreBoxeFrontJab : imgMestreBoxeFrontHeavy;
        } else if (m.state === 'HIT') {
            mestreImg = imgMestreBoxeFrontHit;
        } else if (m.state === 'KNOCKDOWN') {
            mestreImg = imgMestreBoxeFrontKnockdown;
        } else if (m.state === 'WIN') {
            mestreImg = imgMestreBoxeFrontWin;
        }
    }

    let mW = 70;
    let mH = 110;
    if (boxeGame.state === 'FINISHER' && boxeGame.finisher.phase === 4) {
        mW = 100; mH = 45;
    } else if (mestreImg === imgMestreBoxeFrontGuard) {
        mW = 76; mH = 110;
    } else if (mestreImg === imgMestreBoxeFrontKnockdown) {
        mW = 85; mH = 100;
    } else if (mestreImg === imgMestreBoxeFrontGetup) {
        mW = 80; mH = 95;
    } else if (mestreImg === imgMestreBoxeFrontRise) {
        mW = 76; mH = 108;
    } else if (mestreImg === imgMestreBoxeSpecialCharge) {
        mW = 72; mH = 105;
    } else if (mestreImg === imgMestreBoxeSpecialPunch) {
        mW = 76; mH = 118;
    } else if (mestreImg === imgMestreBoxeFrontDodgeL || mestreImg === imgMestreBoxeFrontDodgeR) {
        mW = 76; mH = 110;
    } else if (mestreImg === imgMestreBoxeFrontWin) {
        mW = 74; mH = 120;
    }

    const drawMx = (boxeGame.state === 'FINISHER') ? boxeGame.finisher.mestreX : m.x;
    const drawMy = (boxeGame.state === 'FINISHER') ? boxeGame.finisher.mestreY : m.y;

    if (mestreImg && mestreImg.complete && mestreImg.naturalWidth > 0) {
        // Sombra no tablado
        if (boxeGame.state !== 'FINISHER' || boxeGame.finisher.phase < 3 || boxeGame.finisher.phase === 4) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.beginPath();
            const shadowRadius = (mestreImg === imgMestreBoxeFrontKnockdown) ? 32 : 26;
            ctx.ellipse(drawMx, drawMy + 2, shadowRadius, 7, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // AURA E CONTAGEM REGRESSIVA DO SOCO ESPECIAL (3... 2... 1... 0!)
        if ((m.state === 'SPECIAL_WINDUP' || m.state === 'SPECIAL_CHARGE') && boxeGame.state !== 'FINISHER') {
            const auraColor = (Date.now() % 160 < 80) ? "rgba(231, 76, 60, 0.45)" : "rgba(241, 196, 15, 0.45)";
            ctx.fillStyle = auraColor;
            ctx.beginPath();
            ctx.ellipse(drawMx, drawMy - mH / 2, mW * 0.7, mH * 0.65, 0, 0, Math.PI * 2);
            ctx.fill();

            // Indicador de Contagem Estilo Punch-Out acima do Mestre
            if (m.state === 'SPECIAL_CHARGE') {
                ctx.fillStyle = (m.specialCountdown === 1) ? "#e74c3c" : "#f1c40f";
                ctx.font = "bold 26px monospace";
                ctx.textAlign = "center";
                ctx.fillText(`${m.specialCountdown}`, drawMx, drawMy - mH - 14);
                
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 9px monospace";
                ctx.fillText("ESQUIVE!", drawMx, drawMy - mH - 2);
                ctx.textAlign = "left";
            } else {
                ctx.fillStyle = (Date.now() % 160 < 80) ? "#f1c40f" : "#e74c3c";
                ctx.font = "bold 26px monospace";
                ctx.textAlign = "center";
                ctx.fillText("!", drawMx, drawMy - mH - 12);
                ctx.textAlign = "left";
            }
        }

        // Alerta visual de Telegraph normal ('!' aviso para esquivar)
        if (m.state === 'TELEGRAPH' && boxeGame.state !== 'FINISHER') {
            ctx.fillStyle = (Date.now() % 200 < 100) ? "#f1c40f" : "#e74c3c";
            ctx.font = "bold 24px monospace";
            ctx.textAlign = "center";
            ctx.fillText("!", drawMx, drawMy - mH - 10);
            ctx.textAlign = "left";
        }

        // Estrelas de atordoado se errou o golpe (WHIFFED)
        if (m.state === 'WHIFFED' && boxeGame.state !== 'FINISHER') {
            ctx.fillStyle = "#f1c40f";
            ctx.font = "bold 15px monospace";
            ctx.textAlign = "center";
            ctx.fillText("★ ★ ★", drawMx, drawMy - mH - 6);
            ctx.textAlign = "left";
        }

        ctx.drawImage(mestreImg, drawMx - mW / 2, drawMy - mH, mW, mH);

        // Speedline de fogo atravessando a tela no disparo do soco especial
        if (m.state === 'SPECIAL_PUNCH' && imgBoxeFxSpeedline.complete && imgBoxeFxSpeedline.naturalWidth > 0) {
            ctx.drawImage(imgBoxeFxSpeedline, drawMx - 75, drawMy - mH + 25, 150, 45);
        }
    }

    // -------------------------------------------------------------
    // 4. DESENHO DO JOGADOR: ZORP (COSTAS / 1º PLANO PUNCH-OUT)
    // -------------------------------------------------------------
    const p = boxeGame.player;
    let zorpImg = imgZorpBoxeBackIdle0;
    const zFrames = [imgZorpBoxeBackIdle0, imgZorpBoxeBackIdle1, imgZorpBoxeBackIdle2];

    if (boxeGame.state === 'FINISHER') {
        const f = boxeGame.finisher;
        if (f.phase === 0) {
            zorpImg = imgZorpFinisherPrep;
        } else if (f.phase === 1) {
            zorpImg = (f.timer < 12) ? imgZorpFinisherLaunch : imgZorpFinisherLaunchArc;
        } else if (f.phase === 2) {
            zorpImg = imgZorpFinisherImpact;
        } else {
            zorpImg = (f.phase === 4) ? imgZorpBoxeBackWin : imgZorpFinisherPose;
        }
    } else if (boxeGame.state === 'KNOCKDOWN' && boxeGame.knockdownTarget === 'PLAYER') {
        // Animação dramática do Zorp caído e se erguendo na contagem
        if (boxeGame.refereeCount === 0) {
            zorpImg = (boxeGame.refereeTimer < 20) ? imgZorpBoxeBackFall : imgZorpBoxeBackDizzyKnees;
        } else if (boxeGame.refereeCount <= 4) {
            zorpImg = imgZorpBoxeBackKnockdown; // Estirado na lona
        } else if (boxeGame.refereeCount <= 6) {
            zorpImg = imgZorpBoxeBackSitup; // Empurrando com as mãos para sentar
        } else if (boxeGame.refereeCount <= 8) {
            zorpImg = imgZorpBoxeBackPant; // De joelhos ofegante recuperando o fôlego
        } else {
            zorpImg = imgZorpBoxeBackIdle0; // Levantando de volta
        }
    } else {
        if (p.state === 'IDLE') {
            zorpImg = zFrames[p.animFrame % zFrames.length];
        } else if (p.state === 'DUCK') {
            zorpImg = imgZorpBoxeBackDuck;
        } else if (p.state === 'DODGE_L') {
            zorpImg = imgZorpBoxeBackDodgeL;
        } else if (p.state === 'DODGE_R') {
            zorpImg = imgZorpBoxeBackDodgeR;
        } else if (p.state === 'JAB') {
            zorpImg = imgZorpBoxeBackJab;
        } else if (p.state === 'DIRETO') {
            zorpImg = imgZorpBoxeBackDireto;
        } else if (p.state === 'HOOK') {
            zorpImg = imgZorpBoxeBackHook;
        } else if (p.state === 'UPPERCUT') {
            zorpImg = imgZorpBoxeBackUppercut;
        } else if (p.state === 'HIT') {
            zorpImg = imgZorpBoxeBackHit;
        } else if (p.state === 'KNOCKDOWN') {
            zorpImg = imgZorpBoxeBackKnockdown;
        } else if (p.state === 'WIN') {
            zorpImg = imgZorpBoxeBackWin;
        }
    }

    let zW = 75;
    let zH = 110;
    if (boxeGame.state === 'FINISHER' && boxeGame.finisher.phase === 2) {
        zW = 115; zH = 125;
    } else if (zorpImg === imgZorpBoxeBackKnockdown) {
        zW = 105; zH = 75;
    } else if (zorpImg === imgZorpBoxeBackSitup) {
        zW = 72; zH = 85;
    } else if (zorpImg === imgZorpBoxeBackPant) {
        zW = 76; zH = 90;
    } else if (zorpImg === imgZorpBoxeBackDizzyKnees) {
        zW = 82; zH = 95;
    } else if (zorpImg === imgZorpBoxeBackFall) {
        zW = 80; zH = 100;
    }

    const drawZx = p.x;
    const drawZy = p.y;

    if (zorpImg && zorpImg.complete && zorpImg.naturalWidth > 0) {
        // Sombra de Zorp
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.beginPath();
        const zShadowRadius = (zorpImg === imgZorpBoxeBackKnockdown) ? 36 : 28;
        ctx.ellipse(drawZx, drawZy - 2, zShadowRadius, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Indicador visual de recuperação pós-esquiva (Lag / Vulnerável a contragolpe)
        if (p.dodgeLag > 0 && boxeGame.state === 'FIGHTING') {
            ctx.fillStyle = "rgba(230, 126, 34, 0.35)";
            ctx.beginPath();
            ctx.ellipse(drawZx, drawZy - zH / 2, zW * 0.6, zH * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // Indicador visual de exaustão de Zorp (Sem energia / Bloqueado por mashing)
        if (p.isExhausted && boxeGame.state === 'FIGHTING') {
            ctx.fillStyle = (Date.now() % 300 < 150) ? "rgba(231, 76, 60, 0.4)" : "rgba(52, 73, 94, 0.4)";
            ctx.beginPath();
            ctx.ellipse(drawZx, drawZy - zH / 2, zW * 0.6, zH * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#e74c3c";
            ctx.font = "bold 10px monospace";
            ctx.textAlign = "center";
            ctx.fillText("EXAUSTO!", drawZx, drawZy - zH - 6);
            ctx.textAlign = "left";
        }

        ctx.drawImage(zorpImg, drawZx - zW / 2, drawZy - zH, zW, zH);
    }

    // -------------------------------------------------------------
    // 4.5 ÁRBITRO NO RINGUE COM BALÃO DE FALA (DURANTE A CONTAGEM DE NOCAUTE)
    // -------------------------------------------------------------
    if (boxeGame.state === 'KNOCKDOWN') {
        const refTarget = boxeGame.knockdownTarget;
        const refX = (refTarget === 'PLAYER') ? 335 : 325;
        const refY = (refTarget === 'PLAYER') ? 275 : 205;
        const refW = 46;
        const refH = 88;

        // Sombra sob os pés do árbitro
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.ellipse(refX, refY + 2, 18, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Desenho do Árbitro Oficial
        if (imgNpcArbitroBoxe.complete && imgNpcArbitroBoxe.naturalWidth > 0) {
            const countBob = (boxeGame.refereeTimer < 10) ? -3 : 0;
            ctx.drawImage(imgNpcArbitroBoxe, refX - refW / 2, refY - refH + countBob, refW, refH);
        }

        // BALÃO DE FALA ESTILO QUADRINHOS COM A CONTAGEM
        const bw = 74;
        const bh = 32;
        const bx = refX - 37;
        const by = refY - refH - 42;

        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(bx, by, bw, bh, 8);
        } else {
            ctx.rect(bx, by, bw, bh);
        }
        ctx.fill();
        ctx.stroke();

        // Rabicho apontando para a cabeça do árbitro
        ctx.beginPath();
        ctx.moveTo(refX - 6, by + bh);
        ctx.lineTo(refX - 2, by + bh + 9);
        ctx.lineTo(refX + 6, by + bh);
        ctx.closePath();
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.stroke();

        // Texto da contagem oficial no balão
        const isKnockout = (boxeGame.refereeCount >= 10);
        ctx.fillStyle = isKnockout ? "#e74c3c" : "#111827";
        ctx.font = isKnockout ? "bold 11px monospace" : "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const countBalloonText = isKnockout ? "NOCAUTE!" : `${boxeGame.refereeCount}!`;
        ctx.fillText(countBalloonText, bx + bw / 2, by + bh / 2);
        ctx.restore();
    }

    // -------------------------------------------------------------
    // 5. EFEITOS DE IMPACTO, FAÍSCAS E EXCLAMAÇÕES
    // -------------------------------------------------------------
    boxeGame.sparks.forEach(sp => {
        let fxImg = imgBoxeFxHitspark;
        if (sp.type === 'EXPLOSION') fxImg = imgBoxeFxExplosion;
        else if (sp.type === 'STARS') fxImg = imgBoxeFxStars;
        else if (sp.type === 'EXCLAMATION') fxImg = imgBoxeFxExclamation;

        if (fxImg.complete && fxImg.naturalWidth > 0) {
            const fw = (sp.type === 'EXCLAMATION') ? 22 : (sp.type === 'EXPLOSION' ? 55 : 40);
            const fh = (sp.type === 'EXCLAMATION') ? 45 : (sp.type === 'EXPLOSION' ? 55 : 40);
            ctx.drawImage(fxImg, sp.x - fw / 2, sp.y - fh / 2, fw, fh);
        } else {
            ctx.fillStyle = sp.isCounter ? "#00e5ff" : "#f1c40f";
            ctx.beginPath(); ctx.arc(sp.x, sp.y, 14, 0, Math.PI * 2); ctx.fill();
        }
    });

    // -------------------------------------------------------------
    // 6. BALÕES DE EMOJIS DE REAÇÃO (PRÉ-PROGRAMADOS)
    // -------------------------------------------------------------
    boxeGame.reactions.forEach(rx => {
        if (rx.img && rx.img.complete && rx.img.naturalWidth > 0) {
            const scale = Math.min(1.0, (rx.maxTimer - rx.timer) / 8);
            const alpha = Math.min(1.0, rx.timer / 15);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(rx.x, rx.y);
            ctx.scale(scale, scale);

            // Balão de fala estilo HQ
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(0, 0, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#111827";
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Rabicho do balão
            ctx.beginPath();
            ctx.moveTo(rx.target === 'PLAYER' ? 8 : -8, 16);
            ctx.lineTo(rx.target === 'PLAYER' ? 14 : -14, 26);
            ctx.lineTo(rx.target === 'PLAYER' ? -2 : 2, 20);
            ctx.closePath();
            ctx.fillStyle = "#ffffff";
            ctx.fill();
            ctx.stroke();

            // Emoji dentro do balão
            ctx.drawImage(rx.img, -16, -16, 32, 32);
            ctx.restore();
        }
    });

    // -------------------------------------------------------------
    // 7. HUD ESTILO PUNCH-OUT / PRIZEFIGHTERS (VIDAS, ENERGIA E ROUND)
    // -------------------------------------------------------------
    // Banner / Anúncio Estilo Quadrinhos (Compacto, no topo, sem poluir o centro)
    if (boxeGame.announcementTimer > 0) {
        ctx.save();
        ctx.font = "bold 11px monospace";
        const textW = ctx.measureText(boxeGame.announcement).width;
        const badgeW = Math.max(120, textW + 24);
        const badgeH = 22;
        const badgeX = canvas.width / 2 - badgeW / 2;
        const badgeY = 48; // Posicionado no topo abaixo do relógio, fora do centro da luta

        // Efeito sutil de impacto pop-in estilo HQ
        const popScale = (boxeGame.announcementTimer > 35) ? 1.05 : 1.0;
        ctx.translate(canvas.width / 2, badgeY + badgeH / 2);
        ctx.scale(popScale, popScale);
        ctx.translate(-canvas.width / 2, -(badgeY + badgeH / 2));

        // Sombra sólida preta estilo gibi
        ctx.fillStyle = "#111827";
        if (ctx.roundRect) {
            ctx.beginPath(); ctx.roundRect(badgeX + 2.5, badgeY + 2.5, badgeW, badgeH, 5); ctx.fill();
        } else {
            ctx.fillRect(badgeX + 2.5, badgeY + 2.5, badgeW, badgeH);
        }

        // Fundo do balão estilo HQ
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#111827";
        ctx.lineWidth = 2.2;
        if (ctx.roundRect) {
            ctx.beginPath(); ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 5); ctx.fill(); ctx.stroke();
        } else {
            ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
            ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);
        }

        // Faixa de cor da ação na lateral esquerda do selo
        ctx.fillStyle = boxeGame.announcementColor;
        if (ctx.roundRect) {
            ctx.beginPath(); ctx.roundRect(badgeX + 2, badgeY + 2, 5, badgeH - 4, [3, 0, 0, 3]); ctx.fill();
        } else {
            ctx.fillRect(badgeX + 2, badgeY + 2, 5, badgeH - 4);
        }

        // Texto com tipografia de quadrinhos
        ctx.fillStyle = "#111827";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(boxeGame.announcement, canvas.width / 2 + 3, badgeY + badgeH / 2);
        ctx.restore();
    }

    // Cronômetro Central Superior
    ctx.fillStyle = "rgba(15, 25, 45, 0.9)";
    ctx.fillRect(190, 8, 70, 28);
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(190, 8, 70, 28);

    const seconds = Math.floor(boxeGame.roundTimer / 60);
    ctx.fillStyle = (seconds <= 10 && seconds % 2 === 0) ? "#e74c3c" : "#ffffff";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`0:${seconds < 10 ? '0' : ''}${seconds}`, 225, 27);

    // Indicador do Round
    ctx.fillStyle = (boxeGame.round === 3) ? "#f1c40f" : "#bdc3c7";
    ctx.font = "bold 8px monospace";
    ctx.fillText((boxeGame.round === 3) ? "FINAL" : `RND ${boxeGame.round}`, 225, 46);
    ctx.textAlign = "left";

    // --- HUD ESQUERDA: ZORP ---
    // Retrato Zorp
    if (imgEmojiZorpGuard.complete && imgEmojiZorpGuard.naturalWidth > 0) {
        ctx.drawImage(imgEmojiZorpGuard, 8, 8, 32, 32);
    }
    ctx.fillStyle = "#3498db";
    ctx.font = "bold 9px monospace";
    ctx.fillText("ZORP", 46, 17);

    // Barra de Vida Zorp
    ctx.fillStyle = "#1e272c";
    ctx.fillRect(46, 21, 120, 10);
    const zHPRatio = Math.max(0, p.hp / p.maxHp);
    ctx.fillStyle = zHPRatio > 0.35 ? "#2ecc71" : "#e74c3c";
    ctx.fillRect(46, 21, 120 * zHPRatio, 10);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 21, 120, 10);

    // Barra de Estamina Zorp
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(46, 33, 85, 5);
    ctx.fillStyle = p.isExhausted ? ((Date.now() % 200 < 100) ? "#e74c3c" : "#ffffff") : "#f1c40f";
    ctx.fillRect(46, 33, 85 * (p.energy / p.maxEnergy), 5);

    // Corações Zorp
    ctx.fillStyle = "#e74c3c";
    ctx.font = "10px monospace";
    let zHearts = "";
    for (let h = 0; h < 3; h++) zHearts += (h < p.hearts) ? "♥ " : "♡ ";
    ctx.fillText(zHearts, 46, 48);

    // --- HUD DIREITA: MESTRE ---
    // Retrato Mestre
    if (imgEmojiMestreSmirk.complete && imgEmojiMestreSmirk.naturalWidth > 0) {
        ctx.drawImage(imgEmojiMestreSmirk, canvas.width - 40, 8, 32, 32);
    }
    ctx.fillStyle = "#e74c3c";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "right";
    ctx.fillText("MESTRE", canvas.width - 46, 17);

    // Barra de Vida Mestre
    const mStartX = canvas.width - 46 - 120;
    ctx.fillStyle = "#1e272c";
    ctx.fillRect(mStartX, 21, 120, 10);
    const mHPRatio = Math.max(0, m.hp / m.maxHp);
    ctx.fillStyle = mHPRatio > 0.35 ? "#e74c3c" : "#f39c12";
    ctx.fillRect(mStartX + 120 * (1 - mHPRatio), 21, 120 * mHPRatio, 10);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(mStartX, 21, 120, 10);

    // Barra de Estamina Mestre
    const mEngStartX = canvas.width - 46 - 85;
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(mEngStartX, 33, 85, 5);
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(mEngStartX + 85 * (1 - (m.energy / m.maxEnergy)), 33, 85 * (m.energy / m.maxEnergy), 5);

    // Corações Mestre
    ctx.fillStyle = "#e74c3c";
    ctx.font = "10px monospace";
    let mHearts = "";
    for (let h = 0; h < 3; h++) mHearts += (h < m.hearts) ? "♥ " : "♡ ";
    ctx.fillText(mHearts, canvas.width - 46, 48);
    ctx.textAlign = "left";

    // 8. Tela de Vitória / Resultado
    if (boxeGame.state === 'GAMEOVER') {
        if (boxeGame.win) {
            if (imgBoxeTelaVitoria.complete && imgBoxeTelaVitoria.naturalWidth > 0) {
                ctx.drawImage(imgBoxeTelaVitoria, 85, 55, 280, 190);
            }
            ctx.fillStyle = "rgba(10, 20, 35, 0.92)";
            ctx.fillRect(40, 205, canvas.width - 80, 75);
            ctx.strokeStyle = "#f1c40f";
            ctx.lineWidth = 3;
            ctx.strokeRect(40, 205, canvas.width - 80, 75);

            ctx.fillStyle = "#f1c40f";
            ctx.font = "bold 14px monospace";
            ctx.textAlign = "center";
            ctx.fillText("★ VOCÊ VENCEU O COMBATE! ★", canvas.width / 2, 228);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 11px monospace";
            ctx.fillText("Insígnia do Boxe Galáctico Conquistada!", canvas.width / 2, 248);

            ctx.fillStyle = (Date.now() % 600 < 300) ? "#2ecc71" : "#ffffff";
            ctx.font = "bold 11px monospace";
            ctx.fillText("[ESPAÇO] CONTINUAR", canvas.width / 2, 268);
            ctx.textAlign = "left";
        } else {
            drawOverlayScreen("DERROTA NO RINGUE...", [
                "O Mestre do Boxe é um pugilista formidável!",
                "Pendule e esquive no tempo certo com [A] ou [D]!",
                "Ao esquivar dos golpes ou do especial, o Mestre fica aberto:",
                "Aproveite a abertura e contra-ataque imediatamente com [J]!",
                "Aperte [ESPAÇO] para tentar novamente!"
            ], "#e74c3c");
        }
    }

    ctx.restore();
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
        // Ringue Central (Cordas e Postes)
        { x: 130, y: 55, w: 190, h: 8, solid: true }, // Corda Norte
        { x: 130, y: 165, w: 75, h: 8, solid: true }, // Corda Sul (lado esquerdo)
        { x: 245, y: 165, w: 75, h: 8, solid: true }, // Corda Sul (lado direito - vão central da escada livre)
        { x: 130, y: 55, w: 8, h: 115, solid: true }, // Corda Oeste
        { x: 312, y: 55, w: 8, h: 115, solid: true }, // Corda Leste
        
        // Área de Treino com Sacos de Pancada
        { x: 45, y: 65, w: 28, h: 42, type: 'punching_bag', solid: true },
        { x: 45, y: 135, w: 28, h: 42, type: 'punching_bag', solid: true },
        { x: 50, y: 205, w: 35, h: 22, type: 'bench_press', solid: true },

        // Mesa de Arbitragem & Oficiais
        { x: 350, y: 70, w: 45, h: 30, type: 'judges_table', solid: true },
        { x: 360, y: 155, w: 30, h: 25, type: 'corner_stool', solid: true }
    ],
    ILHA_PINGPONG: [
        { x: 320, y: 50, w: 60, h: 40, type: 'scoreboard', solid: true }
    ]
};

const npcs = [
    { scene: "HUB", x: 180, y: 180, img: imgTurista, tamanho: 48, msg: "> TURISTA: O arquipélago tem diversas modalidades esportivas!" },
    { scene: "HUB", x: 270, y: 130, img: imgGuia, tamanho: 48, msg: "> GUIA: Explore os caminhos ao Norte, Sul, Leste e Oeste." },

    // NPCs da Ilha de Boxe (Arena dos Campeões)
    { scene: "ILHA_ESQUI", x: 225, y: 110, img: imgNpcMestreBoxe, tamanho: 50, msg: "> MESTRE DO BOXE: Bem-vindo ao meu ringue, Zorp! Prove sua pegada e aguente até o round final!", isMaster: "JOGO_BOXE" },
    { scene: "ILHA_ESQUI", x: 130, y: 190, img: imgNpcTreinadorBoxe, tamanho: 50, msg: "> TREINADOR PUNCH: Os socos do Mestre quebram qualquer guarda! Pendule com [A/D] para esquivar e mande um contragolpe com [J] na abertura!" },
    { scene: "ILHA_ESQUI", x: 345, y: 110, img: imgNpcArbitroBoxe, tamanho: 50, msg: "> ÁRBITRO: Regras oficiais de Punch-Out! Luta limpa e toquem as luvas quando soar o sino!" },
    { scene: "ILHA_ESQUI", x: 80, y: 175, img: imgNpcBoxeador, tamanho: 50, msg: "> PUGILISTA: Cuidado com o soco especial carregado do Mestre! Não spameie esquiva ou tomará contragolpe!" },

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
                } else if (jogo === "JOGO_BOXE") {
                    currentScene = "JOGO_BOXE";
                    resetBoxe();
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
    } else if (currentScene === "JOGO_BOXE") {
        updateBoxeGame();
    }
}

// -------------------------------------------------------------
// 5. MINIGAME PING PONG
// -------------------------------------------------------------
function resetPingPong(fullReset = false) {
    if (fullReset) {
        pingPong.playerScore = 0;
        pingPong.opponentScore = 0;
        pingPong.power = 0;
        pingPong.mestrePower = 0;
        pingPong.playerX = 50;
        pingPong.playerY = 140;
        pingPong.opponentX = 370;
        pingPong.opponentY = 140;
        pingPong.gameState = 'TUTORIAL';
        pingPong.win = false;
        pingPong.server = 'PLAYER';
    }
    
    pingPong.playerHitTimer = 0;
    pingPong.opponentHitTimer = 0;
    pingPong.isPowerActive = false;
    pingPong.isMestreSpecial = false;
    pingPong.mestreBannerTimer = 0;
    pingPong.rallyHits = 0;
    pingPong.lastHitter = null;
    pingPong.playerBounces = 0;
    pingPong.opponentBounces = 0;
    pingPong.bounceEffects = [];

    if (pingPong.server === 'PLAYER') {
        pingPong.ballX = 100;
        pingPong.ballY = pingPong.playerY + 20;
        pingPong.ballZ = 22;
        let targetX = 250;
        let targetY = 145;
        pingPong.ballSpeedX = 4.0;
        let t = (targetX - pingPong.ballX) / pingPong.ballSpeedX;
        pingPong.ballSpeedY = (targetY - pingPong.ballY) / t;
        pingPong.ballSpeedZ = 0.5 * pingPong.gravity * t - pingPong.ballZ / t + 0.5;
        pingPong.lastHitter = 'PLAYER';
        pingPong.server = 'OPPONENT';
    } else {
        pingPong.ballX = 350;
        pingPong.ballY = pingPong.opponentY + 20;
        pingPong.ballZ = 22;
        let targetX = 200;
        let targetY = 145;
        pingPong.ballSpeedX = -4.0;
        let t = (targetX - pingPong.ballX) / pingPong.ballSpeedX;
        pingPong.ballSpeedY = (targetY - pingPong.ballY) / t;
        pingPong.ballSpeedZ = 0.5 * pingPong.gravity * t - pingPong.ballZ / t + 0.5;
        pingPong.lastHitter = 'OPPONENT';
        pingPong.server = 'PLAYER';
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

    pingPong.playerX = Math.max(30, Math.min(150, pingPong.playerX + pMoveX));
    pingPong.playerY = Math.max(80, Math.min(210, pingPong.playerY + pMoveY));

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

    // Movimentacao da IA do Mestre (alinha o centro do sprite 36x48 com a bola)
    const targetY = pingPong.ballY - 20;
    let mestreSpeed = Math.min(4.8, 2.5 + pingPong.rallyHits * 0.18);
    if (pingPong.opponentY < targetY - 6) {
        pingPong.opponentY += mestreSpeed;
        pingPong.opponentAction = "MOVE_DOWN";
    } else if (pingPong.opponentY > targetY + 6) {
        pingPong.opponentY -= mestreSpeed;
        pingPong.opponentAction = "MOVE_UP";
    } else {
        pingPong.opponentAction = "IDLE";
    }
    pingPong.opponentY = Math.max(80, Math.min(210, pingPong.opponentY));

    if (pingPong.opponentHitTimer > 0) {
        pingPong.opponentAction = "HIT";
        pingPong.opponentHitTimer--;
    }

    // ---------------------------------------------------------
    // FÍSICA DA BOLA (3D: Gravity, Arc & Table Bounces)
    // ---------------------------------------------------------
    let prevX = pingPong.ballX;
    let prevZ = pingPong.ballZ;

    pingPong.ballSpeedZ -= pingPong.gravity;
    pingPong.ballX += pingPong.ballSpeedX;
    pingPong.ballY += pingPong.ballSpeedY;
    pingPong.ballZ += pingPong.ballSpeedZ;

    // 1. Rede da Mesa (Rede em X=225, altura 14px)
    const NET_X = 225;
    if ((prevX < NET_X && pingPong.ballX >= NET_X) || (prevX > NET_X && pingPong.ballX <= NET_X)) {
        if (pingPong.ballZ < 14) {
            pingPong.ballSpeedX *= -0.3;
            pingPong.ballSpeedZ = 0.8;
            pingPong.bounceEffects.push({ x: NET_X, y: pingPong.ballY, radius: 2, maxRadius: 12, alpha: 1.0, color: '#ffeb3b' });
        }
    }

    // 2. Colisão / Quique na Superfície da Mesa / Chão (Z <= 0)
    const TABLE_MIN_X = 160;
    const TABLE_MAX_X = 290;
    const TABLE_MIN_Y = 105;
    const TABLE_MAX_Y = 185;

    if (prevZ >= 0 && pingPong.ballZ <= 0) {
        pingPong.ballZ = 0;
        // Quique contínuo sem pontuar por 2 quiques ou saídas laterais!
        if (pingPong.ballX >= TABLE_MIN_X && pingPong.ballX <= TABLE_MAX_X &&
            pingPong.ballY >= TABLE_MIN_Y && pingPong.ballY <= TABLE_MAX_Y) {
            pingPong.ballSpeedZ = -pingPong.ballSpeedZ * 0.72;
        } else {
            pingPong.ballSpeedZ = -pingPong.ballSpeedZ * 0.65;
        }
        if (Math.abs(pingPong.ballSpeedZ) < 0.5) pingPong.ballSpeedZ = 0;

        let bounceColor = pingPong.isMestreSpecial ? '#e74c3c' : (pingPong.isPowerActive ? '#ff9800' : '#ffffff');
        pingPong.bounceEffects.push({ x: pingPong.ballX, y: pingPong.ballY, radius: 2, maxRadius: 11, alpha: 1.0, color: bounceColor });
    }

    // 3. Rebatida do Jogador Zorp (Hitbox 100% fiel ao sprite 36x48)
    if (pingPong.ballSpeedX < 0) {
        let zLeft = pingPong.playerX + 2;
        let zRight = pingPong.playerX + 38;
        let zTopY = pingPong.playerY - 4;
        let zBottomY = pingPong.playerY + 52;

        if (pingPong.ballX >= zLeft && pingPong.ballX <= zRight &&
            pingPong.ballY >= zTopY && pingPong.ballY <= zBottomY &&
            pingPong.ballZ >= -5 && pingPong.ballZ <= 45) {
            
            pingPong.playerHitTimer = 12;
            pingPong.lastHitter = 'PLAYER';
            pingPong.rallyHits++;

            let baseSpeed = Math.min(8.5, 4.2 + pingPong.rallyHits * 0.35);
            let targetX = 255;

            if (pingPong.isPowerActive) {
                baseSpeed = Math.max(7.5, baseSpeed + 2.5);
                targetX = 280;
                pingPong.power = 0;
                pingPong.isPowerActive = false;
            } else {
                pingPong.power = Math.min(pingPong.maxPower, pingPong.power + 25);
            }

            pingPong.ballSpeedX = baseSpeed;

            let aimY = 0;
            if (keys.w) aimY -= 25;
            if (keys.s) aimY += 25;
            let paddleOffset = (pingPong.ballY - (pingPong.playerY + 24)) * 0.7;
            let randomAngle = (Math.random() - 0.5) * 18;
            let targetY = Math.max(108, Math.min(182, pingPong.ballY + aimY + paddleOffset + randomAngle));

            let t = (targetX - pingPong.ballX) / pingPong.ballSpeedX;
            pingPong.ballSpeedY = (targetY - pingPong.ballY) / t;
            pingPong.ballSpeedZ = 0.5 * pingPong.gravity * t - pingPong.ballZ / t + 0.6;
            if (pingPong.ballSpeedZ < 2.0) pingPong.ballSpeedZ = 2.0;

            pingPong.mestrePower = Math.min(100, pingPong.mestrePower + 35);
        }
    }

    // 4. Rebatida do Mestre (Hitbox 100% fiel ao sprite 36x48)
    if (pingPong.ballSpeedX > 0) {
        let mLeft = pingPong.opponentX - 6;
        let mRight = pingPong.opponentX + 30;
        let mTopY = pingPong.opponentY - 4;
        let mBottomY = pingPong.opponentY + 52;

        if (pingPong.ballX >= mLeft && pingPong.ballX <= mRight &&
            pingPong.ballY >= mTopY && pingPong.ballY <= mBottomY &&
            pingPong.ballZ >= -5 && pingPong.ballZ <= 45) {

            pingPong.opponentHitTimer = 12;
            pingPong.lastHitter = 'OPPONENT';
            pingPong.rallyHits++;

            let isMestreSmash = false;
            if (pingPong.mestrePower >= 100 || (pingPong.rallyHits >= 3 && Math.random() < 0.35)) {
                isMestreSmash = true;
                pingPong.mestrePower = 0;
                pingPong.isMestreSpecial = true;
                pingPong.mestreBannerTimer = 45;
                pingPong.opponentHitTimer = 20;
            } else {
                pingPong.isMestreSpecial = false;
            }

            let baseSpeed = Math.min(8.5, 4.0 + pingPong.rallyHits * 0.35);
            if (isMestreSmash) {
                baseSpeed = Math.max(8.0, baseSpeed + 3.0);
            }

            pingPong.ballSpeedX = -baseSpeed;

            let targetY;
            let rndChoice = Math.random();
            if (isMestreSmash) {
                targetY = (pingPong.playerY < 140) ? 178 : 112;
            } else if (rndChoice < 0.45) {
                targetY = (pingPong.playerY < 140) ? (150 + Math.random() * 28) : (108 + Math.random() * 28);
            } else if (rndChoice < 0.8) {
                targetY = Math.max(108, Math.min(182, pingPong.opponentY + 24 + (Math.random() - 0.5) * 45));
            } else {
                targetY = 145 + (Math.random() - 0.5) * 20;
            }

            let targetX = isMestreSmash ? 168 : (175 + Math.random() * 30);

            let t = (targetX - pingPong.ballX) / pingPong.ballSpeedX;
            pingPong.ballSpeedY = (targetY - pingPong.ballY) / t;
            pingPong.ballSpeedZ = 0.5 * pingPong.gravity * t - pingPong.ballZ / t + 0.6;
            if (pingPong.ballSpeedZ < 2.0) pingPong.ballSpeedZ = 2.0;

            if (isMestreSmash) {
                pingPong.bounceEffects.push({ x: pingPong.opponentX, y: pingPong.opponentY + 20, radius: 4, maxRadius: 18, alpha: 1.0, color: '#e74c3c' });
            }
        }
    }

    // 5. Efeitos Visuais de Quique
    for (let i = pingPong.bounceEffects.length - 1; i >= 0; i--) {
        let b = pingPong.bounceEffects[i];
        b.radius += 0.8;
        b.alpha -= 0.08;
        if (b.alpha <= 0) pingPong.bounceEffects.splice(i, 1);
    }

    // 6. REGRA DE PONTUAÇÃO ÚNICA: A bola passou pelo Zorp ou pelo Mestre sem eles encostarem!
    if (pingPong.ballX < pingPong.playerX - 15) {
        // Bola passou pelo Zorp (esquerda) sem ele conseguir rebater -> Ponto do Mestre!
        pingPong.opponentScore++;
        resetPingPong(false);
        return;
    } else if (pingPong.ballX > pingPong.opponentX + 30) {
        // Bola passou pelo Mestre (direita) sem ele conseguir rebater -> Ponto do Zorp!
        pingPong.playerScore++;
        resetPingPong(false);
        return;
    }

    // 7. Fim de Jogo
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
            case 'punching_bag':
                if (imgBoxeSacoPancada.complete && imgBoxeSacoPancada.naturalWidth > 0) {
                    ctx.drawImage(imgBoxeSacoPancada, obs.x, obs.y, obs.w, obs.h);
                } else {
                    ctx.fillStyle = '#c0392b'; ctx.fillRect(obs.x + 4, obs.y + 8, obs.w - 8, obs.h - 12);
                }
                break;
            case 'bench_press':
                ctx.fillStyle = '#2c3e50'; ctx.fillRect(obs.x, obs.y + 10, obs.w, 10);
                ctx.fillStyle = '#7f8c8d'; ctx.fillRect(obs.x + 5, obs.y, 4, 15); ctx.fillRect(obs.x + obs.w - 9, obs.y, 4, 15);
                ctx.fillStyle = '#bdc3c7'; ctx.fillRect(obs.x + 2, obs.y + 2, obs.w - 4, 3);
                ctx.fillStyle = '#111111'; ctx.fillRect(obs.x, obs.y - 2, 4, 10); ctx.fillRect(obs.x + obs.w - 4, obs.y - 2, 4, 10);
                break;
            case 'judges_table':
                ctx.fillStyle = '#34495e'; ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
                ctx.fillStyle = '#2c3e50'; ctx.fillRect(obs.x + 2, obs.y + 2, obs.w - 4, obs.h - 4);
                ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.arc(obs.x + 10, obs.y + 10, 5, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#ffffff'; ctx.fillRect(obs.x + 22, obs.y + 6, 16, 12);
                break;
            case 'corner_stool':
                ctx.fillStyle = '#e74c3c'; ctx.fillRect(obs.x + 4, obs.y + 6, obs.w - 8, 8);
                ctx.fillStyle = '#ffffff'; ctx.fillRect(obs.x + 6, obs.y + 2, 10, 6);
                ctx.fillStyle = '#3498db'; ctx.fillRect(obs.x + 20, obs.y + 2, 5, 10);
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
    
    // 1. Base da Ilha (Estádio de Boxe com bordas atléticas)
    ctx.fillStyle = "#1e272c";
    ctx.fillRect(15, 15, 420, 270);
    
    // Piso de borracha atlética
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(25, 25, 400, 250);
    
    // Pistas laterais emborrachadas vermelhas (Setores de Aquecimento e Oficiais)
    ctx.fillStyle = "#782828";
    ctx.fillRect(30, 30, 75, 240);
    ctx.fillRect(345, 30, 75, 240);

    // Linhas demarcatórias da arena
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 390, 240);

    // 2. Banner do Topo (Portal de Entrada dos Campeões)
    ctx.fillStyle = "#111827";
    ctx.fillRect(90, 18, 270, 22);
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 2;
    ctx.strokeRect(90, 18, 270, 22);
    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("★ ARENA DE BOXE - CLUBE DOS CAMPEÕES ★", 225, 33);
    ctx.textAlign = "left";

    // 3. Ringue Central de Boxe Elevado (3D Isométrico Pixel Art)
    const rx = 130, ry = 55, rw = 190, rh = 115;
    
    // Sombra do ringue
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(rx + 6, ry + 6, rw, rh + 6);

    // Plataforma de madeira do ringue (apron)
    ctx.fillStyle = "#212f3d";
    ctx.fillRect(rx, ry, rw, rh);
    ctx.fillStyle = "#17202a";
    ctx.fillRect(rx, ry + rh, rw, 6);

    // Lona azul do ringue de combate
    ctx.fillStyle = "#1f4068";
    ctx.fillRect(rx + 10, ry + 10, rw - 20, rh - 20);

    // Círculo central da lona com estrela
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx + 18, ry + 18, rw - 36, rh - 36);
    ctx.beginPath();
    ctx.arc(rx + rw / 2, ry + rh / 2, 22, 0, Math.PI * 2);
    ctx.stroke();
    
    // Logo central "GALAXY BOXE"
    ctx.fillStyle = "#f1c40f";
    ctx.font = "bold 8px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GALAXY BOXE", rx + rw / 2, ry + rh / 2 + 3);
    ctx.textAlign = "left";

    // Degraus / Escada de Acesso ao Ringue (Sul)
    ctx.fillStyle = "#566573";
    ctx.fillRect(205, ry + rh, 40, 8);
    ctx.fillStyle = "#808b96";
    ctx.fillRect(208, ry + rh + 2, 34, 4);

    // Cordas do Ringue (Vermelha, Branca, Azul)
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 2;
    ctx.strokeRect(rx + 4, ry + 4, rw - 8, rh - 8);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(rx + 6, ry + 6, rw - 12, rh - 12);

    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 2;
    ctx.strokeRect(rx + 8, ry + 8, rw - 16, rh - 16);

    // Vão da escada no sul (cordas abertas para o lutador entrar no ringue)
    ctx.fillStyle = "#1f4068";
    ctx.fillRect(205, ry + rh - 10, 40, 10);

    // 4 Postes de Canto (Turnbuckles)
    ctx.fillStyle = "#c0392b"; ctx.fillRect(rx, ry - 4, 8, 14); // Canto Vermelho
    ctx.fillStyle = "#ecf0f1"; ctx.fillRect(rx + rw - 8, ry - 4, 8, 14); // Neutro
    ctx.fillStyle = "#ecf0f1"; ctx.fillRect(rx, ry + rh - 10, 8, 14); // Neutro
    ctx.fillStyle = "#2980b9"; ctx.fillRect(rx + rw - 8, ry + rh - 10, 8, 14); // Canto Azul

    // Holofotes de Estádio (Luz suave projetada no ringue)
    ctx.fillStyle = "rgba(255, 241, 118, 0.08)";
    ctx.beginPath();
    ctx.moveTo(rx - 20, 0);
    ctx.lineTo(rx + rw + 20, 0);
    ctx.lineTo(rx + rw - 10, ry + rh);
    ctx.lineTo(rx + 10, ry + rh);
    ctx.closePath();
    ctx.fill();

    // 4. Setor de Treinamento (Oeste)
    ctx.fillStyle = "#1b2631";
    ctx.fillRect(38, 55, 60, 195);
    ctx.strokeStyle = "#f39c12";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(38, 55, 60, 195);

    // Suporte dos Sacos de Pancada (Viga de ferro)
    ctx.fillStyle = "#7f8c8d";
    ctx.fillRect(40, 58, 56, 4);

    // 5. Setor de Oficiais e Troféus (Leste)
    ctx.fillStyle = "#1b2631";
    ctx.fillRect(352, 55, 60, 195);
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(352, 55, 60, 195);

    // Pedestal do Troféu da Luva de Ouro
    ctx.fillStyle = "#34495e";
    ctx.fillRect(367, 195, 30, 20);
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(382, 190, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(379, 196, 6, 8);

    // Caminho de saída ao Sul (volta para o HUB)
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

    // Efeitos Visuais de Quique na Mesa / Rede
    if (pingPong.bounceEffects) {
        pingPong.bounceEffects.forEach(b => {
            ctx.strokeStyle = b.color || "#ffffff";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(b.x, b.y, b.radius * 1.5, b.radius * 0.7, 0, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    // Sombra 3D da Bolinha na Mesa/Chão
    let shadowRadius = Math.max(1, pingPong.ballRadius * (1 - pingPong.ballZ / 90));
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(pingPong.ballX, pingPong.ballY, shadowRadius * 1.4, shadowRadius * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bolinha em Posição 3D (Y_draw = Y - Z)
    let ballDrawY = pingPong.ballY - pingPong.ballZ;

    if (pingPong.isMestreSpecial || pingPong.ballSpeedX < -7.0) {
        ctx.fillStyle = "#e74c3c"; ctx.shadowBlur = 12; ctx.shadowColor = "#ff0055";
    } else if (Math.abs(pingPong.ballSpeedX) > 6 || pingPong.isPowerActive) {
        ctx.fillStyle = "#ff5722"; ctx.shadowBlur = 10; ctx.shadowColor = "#ffeb3b";
    } else {
        ctx.fillStyle = "#ffffff"; ctx.shadowBlur = 0;
    }

    ctx.beginPath(); ctx.arc(pingPong.ballX, ballDrawY, pingPong.ballRadius, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Banner de Aviso: SMASH DO MESTRE!
    if (pingPong.mestreBannerTimer > 0) {
        ctx.fillStyle = (Date.now() % 200 < 100) ? "#e74c3c" : "#f39c12";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.fillText("⚡ SUPER SMASH DO MESTRE! ⚡", canvas.width / 2, 58);
        ctx.textAlign = "left";
        pingPong.mestreBannerTimer--;
    }

    // HUD / Placar
    ctx.fillStyle = "#ffffff"; ctx.font = "bold 16px monospace";
    ctx.fillText(`ZORP: ${pingPong.playerScore}`, 80, 30);
    ctx.fillText(`MESTRE: ${pingPong.opponentScore}`, 270, 30);

    if (pingPong.rallyHits > 0) {
        ctx.fillStyle = "#ffeb3b"; ctx.font = "bold 11px monospace";
        ctx.fillText(`RALI: ${pingPong.rallyHits}x VELOCIDADE`, 160, 20);
    }

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
            "Use W A S D para mover e direcionar tiros.",
            "Cada rebatida acelera a velocidade do rali!",
            "Aperte ESPAÇO para seu Smash Especial!",
            "Atenção ao Super Smash do Mestre!"
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
    else if (currentScene === "JOGO_BOXE") drawBoxeGame();
    
    if (!currentScene.startsWith("JOGO_")) {
        drawSceneObstacles();
        for (let npc of npcs) {
            if (npc.scene === currentScene) drawNPC(npc);
        }
        drawPlayer();
    }
    
    if (currentScene !== "JOGO_ARCO" && currentScene !== "JOGO_BASQUETE" && currentScene !== "JOGO_ESCALADA" && currentScene !== "JOGO_BOXE") {
        drawHUD();
    }
}

function gameLoop() { 
    update(); 
    draw(); 
    requestAnimationFrame(gameLoop); 
}

gameLoop();