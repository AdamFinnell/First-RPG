const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    canvas.width = 640;
    canvas.height = 480;

    const keys = {};
    let mouseClicked = false;
    let attackCooldown = 0;

    document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
    document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
    document.addEventListener("mousedown", () => mouseClicked = true);
    document.addEventListener("mouseup", () => mouseClicked = false);

    const backgroundImages = {
      'Green Plains': new Image(),
      'Slime Woods': new Image(),
      'House Interior': new Image()
    };

    backgroundImages['Green Plains'].src = "resources/sprites/tilesets/grass.png";
    backgroundImages['Slime Woods'].src = "resources/sprites/tilesets/plains.png";
    backgroundImages['House Interior'].src = "resources/sprites/tilesets/floor.png";

    const tileImages = {
      fence: new Image(),
      wall: new Image(),
      floor: new Image(),
      chest: new Image(),
      rock: new Image()
    };
    tileImages.fence.src = "resources/sprites/tilesets/fence.png";
    tileImages.wall.src = "resources/sprites/tilesets/walls/walls.png";
    tileImages.floor.src = "resources/sprites/tilesets/floor.png";
    tileImages.chest.src = "resources/sprites/objects/chest.png";
    tileImages.rock.src = "resources/sprites/objects/rock_in_water_01.png";


    let currentArea = 'Green Plains';

    const playerWalking = new Image();
    playerWalking.src = "resources/sprites/characters/Walking.png";

    const playerAtt = new Image();
    playerAtt.src = "resources/sprites/characters/Attacking.png";

    const playerIdle = new Image();
    playerIdle.src = "resources/sprites/characters/mainChar.png";

    const slimeImage = new Image();
    slimeImage.src = "resources/sprites/characters/slime.png";

    const player = {
      x: 100,
      y: 100,
      width: 40,
      height: 50,
      frameX: 0,
      frameY: 0,
      speed: 2,
      moving: false,
      direction: "down",
      state: "idle",
      hp: 100,
      maxHp: 100,
      level: 1,
      exp: 0,
      attack: 10,
      strength: 10,
      armor: "None",
      weapon: "Fists",
      potions: 1,
      frameTick: 0,
      deathTick: 0
    };

    let enemies = [
      { x: 300, y: 300, width: 30, height: 40, hp: 30, alive: true, frameX: 0, frameTick: 0, frameY: 0, state: 'idle' }
    ];

    const npcs = [
      { x: 400, y: 200, width: 32, height: 32, message: "Welcome to our village, hero!" }
    ];

    const chests = [
      { x: 160, y: 160, width: 32, height: 32, opened: false, item: 'potion' }
    ];

    function drawVillage() {
      if (currentArea !== 'Green Plains') return;

      for (let x = 64; x <= 576; x += 32) {
        ctx.drawImage(tileImages.fence, x, 64, 32, 32);
        ctx.drawImage(tileImages.fence, x, 384, 32, 32);
      }
      for (let y = 96; y <= 352; y += 32) {
        ctx.drawImage(tileImages.fence, 64, y, 32, 32);
        ctx.drawImage(tileImages.fence, 576, y, 32, 32);
      }

      ctx.clearRect(320, 384, 32, 32);

      for (let y = 96; y <= 352; y += 32) {
        for (let x = 96; x <= 544; x += 32) {
          ctx.drawImage(tileImages.floor, x, y, 32, 32);
        }
      }

      ctx.drawImage(tileImages.wall, 128, 128, 32, 32);
      ctx.drawImage(tileImages.wall, 160, 128, 32, 32);
      ctx.drawImage(tileImages.rock, 192, 192, 32, 32);

      chests.forEach(chest => {
        if (!chest.opened) ctx.drawImage(tileImages.chest, chest.x, chest.y, chest.width, chest.height);
      });
    }

    function drawBackground() {
      const img = backgroundImages[currentArea];
      for (let y = 0; y < canvas.height; y += 32) {
        for (let x = 0; x < canvas.width; x += 32) {
          ctx.drawImage(img, 0, 0, 16, 16, x, y, 32, 32);
        }
      }
      drawVillage();
    }

    function checkChestInteraction() {
      chests.forEach(chest => {
        if (!chest.opened &&
          player.x < chest.x + chest.width &&
          player.x + player.width > chest.x &&
          player.y < chest.y + chest.height &&
          player.y + player.height > chest.y
        ) {
          chest.opened = true;
          if (chest.item === 'potion') {
            player.potions++;
            updateHUD();
          }
        }
      });
    }

    function enterHouse() {
      if (currentArea === 'Green Plains' && player.x > 120 && player.x < 190 && player.y > 90 && player.y < 160) {
        currentArea = 'House Interior';
        player.x = 100;
        player.y = 300;
        updateHUD();
      }
    }

    function exitHouse() {
      if (currentArea === 'House Interior' && player.y < 100) {
        currentArea = 'Green Plains';
        player.x = 150;
        player.y = 160;
        updateHUD();
      }
    }

    function updateHUD() {
      document.getElementById("areaName").textContent = `Area: ${currentArea}`;
      document.getElementById("level").textContent = `Level: ${player.level}`;
      document.getElementById("exp").textContent = `EXP: ${player.exp} / 100`;
      document.getElementById("strength").textContent = `Strength: ${player.strength}`;
      document.getElementById("armor").textContent = `Armor: ${player.armor}`;
      document.getElementById("weapon").textContent = `Weapon: ${player.weapon}`;
      document.getElementById("potions").textContent = `Potions: ${player.potions}`;
    }

    function movePlayer() {
      player.moving = false;

      if (keys['w']) {
        player.y -= player.speed;
        player.frameY = 2;
        player.moving = true;
        player.direction = 'up';
      } else if (keys['s']) {
        player.y += player.speed;
        player.frameY = 0;
        player.moving = true;
        player.direction = 'down';
      } else if (keys['a']) {
        player.x -= player.speed;
        player.frameY = 3;
        player.moving = true;
        player.direction = 'left';
      } else if (keys['d']) {
        player.x += player.speed;
        player.frameY = 1;
        player.moving = true;
        player.direction = 'right';
      }
    }

    function updateSpriteFrame() {
      player.frameTick++;
      if (player.hp <= 0) return;

      if (player.moving) {
        if (player.frameTick % 10 === 0) {
          player.frameX = (player.frameX + 1) % 3;
        }
      } else {
        const dirY = { down: 0, right: 1, up: 2, left: 3 };
        player.frameY = dirY[player.direction];
        
      }
    }




    function drawEnemies() {
      enemies.forEach(enemy => {
        if (!enemy.alive) return;

        ctx.drawImage(
          slimeImage,
          enemy.frameX * enemy.width,
          enemy.frameY * enemy.height,
          enemy.width,
          enemy.height,
          enemy.x,
          enemy.y,
          enemy.width,
          enemy.height
        );

        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
        ctx.fillStyle = "lime";
        ctx.fillRect(enemy.x, enemy.y - 10, (enemy.hp / 30) * enemy.width, 5);

        enemy.frameTick++;
        if (enemy.frameTick % 15 === 0) {
          enemy.frameX = (enemy.frameX + 1) % 3;
        }
      });
    }

    function drawPlayer() {
      let spriteSheet = playerIdle;
      if (player.attacking) {
        spriteSheet = playerAtt;
      } else if (player.moving) {
        spriteSheet = playerWalking;
      }


      ctx.drawImage(
        spriteSheet,
        player.frameX * player.width,
        player.frameY * player.height,
        player.width,
        player.height,
        player.x,
        player.y,
        player.width,
        player.height
      );

      ctx.fillStyle = "red";
      ctx.fillRect(player.x, player.y - 10, player.width, 5);
      ctx.fillStyle = "lime";
      ctx.fillRect(player.x, player.y - 10, (player.hp / player.maxHp) * player.width, 5);
    }

    function talkToNPCs() {
      npcs.forEach(npc => {
        if (
          player.x < npc.x + npc.width &&
          player.x + player.width > npc.x &&
          player.y < npc.y + npc.height &&
          player.y + player.height > npc.y
        ) {
          ctx.fillStyle = "white";
          ctx.fillText(npc.message, npc.x - 30, npc.y - 10);
        }
      });
    }

    function switchArea(areaName) {
      currentArea = areaName;
      updateHUD();
      if (areaName === 'Slime Woods') {
        enemies = [];
        for (let i = 0; i < 5; i++) {
          enemies.push({ x: 100 + i * 80, y: 300, width: 30, height: 40, hp: 30, alive: true, frameX: 0, frameTick: 0, frameY: 0 });
        }
      }
    }

    function updateHUD() {
      document.getElementById("areaName").textContent = `Area: ${currentArea}`;
      document.getElementById("level").textContent = `Level: ${player.level}`;
      document.getElementById("exp").textContent = `EXP: ${player.exp} / 100`;
      document.getElementById("strength").textContent = `Strength: ${player.strength}`;
      document.getElementById("armor").textContent = `Armor: ${player.armor}`;
      document.getElementById("weapon").textContent = `Weapon: ${player.weapon}`;
    }

    function drawBackground() {
      const img = backgroundImages[currentArea];
      for (let y = 0; y < canvas.height; y += 32) {
        for (let x = 0; x < canvas.width; x += 32) {
          ctx.drawImage(img, 0, 0, 16, 16, x, y, 32, 32);
        }
      }
    }


    //   function attack() {
    //   if (attackCooldown > 0 || player.hp <= 0) return;
    //   if (keys[' '] || mouseClicked) {
    //     attackCooldown = 20;
    //     player.attacking = true;
    //     setTimeout(() => player.attacking = false, 300);
    //   }
    // }

    function attack() {
      if (attackCooldown > 0 || player.hp <= 0) return;
      if (keys[' '] || mouseClicked) {
        attackCooldown = 20;
        player.attacking = true;
        player.frameX = 1; // start attack animation at frame 1

        // Play 3-frame attack animation over 300ms (100ms per frame)
        let attackFrame = 1;
        const attackAnim = setInterval(() => {
          player.frameX = attackFrame;
          attackFrame++;
          if (attackFrame > 4) {
            clearInterval(attackAnim);
            player.attacking = false;
          }
        }, 100);


        // setTimeout(() => {
        //   player.attacking = false;
        // }, 300); // Reset attack sprite after 300ms

        enemies.forEach(enemy => {
          if (
            enemy.alive &&
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
          ) {
            enemy.hp -= player.attack;
            if (enemy.hp <= 0) {
              enemy.alive = false;
              player.exp += 10;
              if (player.exp >= 100) {
                player.level++;
                player.exp = 0;
                player.maxHp += 20;
                player.hp = player.maxHp;
                player.attack += 5;
                player.strength += 5;
              }
              updateHUD();
            }
          }
        });
      }
    }



    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();
      movePlayer();
      updateSpriteFrame();
      drawEnemies();
      drawPlayer();
      talkToNPCs();
      attack();
      if (attackCooldown > 0) attackCooldown--;

      if (player.x > 600 && currentArea === 'Green Plains') {
        player.x = 10;
        switchArea('Slime Woods');
      } else if (player.x < 0 && currentArea === 'Slime Woods') {
        player.x = 600;
        switchArea('Green Plains');
      }

      requestAnimationFrame(gameLoop);
    }

    playerIdle.onload = () => {
      updateHUD();
      gameLoop();
    }