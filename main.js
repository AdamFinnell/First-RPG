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
    // backgroundImages['House Interior'].src = "resources/sprites/tilesets/floor.png";
// ===============================================================================

const tileImages = {
  grass: new Image(),
  dirt: new Image(),
  tree: new Image(),
  fenceTop: new Image(),
  fenceBottom: new Image(),
  fenceLeft: new Image(),
  fenceRight: new Image(),
  fenceUL: new Image(),  // Upper Left
  fenceUR: new Image(),  // Upper Right
  fenceLL: new Image(),  // Lower Left
  fenceLR: new Image(),   // Lower Right
  pathLeft: new Image(),
  pathCenter: new Image(),
  pathTop: new Image(),
  pathRight: new Image(),
  partVertical: new Image(),
  pathDown: new Image(),

};

tileImages.grass.src = "resources/sprites/tilesets/Tiles/Slice 19.png";
tileImages.dirt = new Image();
tileImages.dirt.src = "resources/sprites/tilesets/Tiles/Slice 62.png";
tileImages.tree = new Image();
tileImages.tree.src = "resources/sprites/tilesets/Tiles/Slice 12.png";

tileImages.fenceUR.src = "resources/sprites/tilesets/Tiles/Slice 1.png";
tileImages.fenceTop.src = "resources/sprites/tilesets/Tiles/Slice 2.png";
tileImages.fenceUL.src = "resources/sprites/tilesets/Tiles/Slice 3.png";
tileImages.fenceLeft.src = "resources/sprites/tilesets/Tiles/Slice 4.png";
tileImages.fenceLL.src = "resources/sprites/tilesets/Tiles/Slice 5.png";
tileImages.fenceLR.src = "resources/sprites/tilesets/Tiles/Slice 7.png";
tileImages.fenceRight.src = "resources/sprites/tilesets/Tiles/Slice 4.png"; // Use left for both, unless you split
tileImages.fenceBottom = tileImages.fenceTop; // same image reused
tileImages.pathLeft.src = "resources/sprites/tilesets/Tiles/Slice 14.png";
tileImages.pathRight.src = "resources/sprites/tilesets/Tiles/Slice 16.png";
tileImages.pathTop.src = "resources/sprites/tilesets/Tiles/Slice 27.png";
tileImages.pathCenter.src = "resources/sprites/tilesets/Tiles/Slice 28.png";
tileImages.partVertical.src = "resources/sprites/tilesets/Tiles/Slice 28.png";
tileImages.pathDown.src = "resources/sprites/tilesets/Tiles/Slice 29.png";
// tileImages.pLeftTopCor.src = "resources/sprites/tilesets/Tiles/Slice 30.png";
// tileImages.pleftBtmCor.src = "resources/sprites/tilesets/Tiles/Slice 32.png";
// tileImages.pRightTopCor.src = "resources/sprites/tilesets/Tiles/Slice 36.png";
// tileImages..src = "";
// pRightBtmCor    resources/sprites/tilesets/Tiles/Slice 38.png

// ============================================
// water starts at slice 67
// ====================================
   


    let currentArea = 'Green Plains';

    // =============== tile sets ==========================================
    const playerWalking = new Image();
    playerWalking.src = "resources/sprites/characters/Walking.png";

    const playerAtt = new Image();
    playerAtt.src = "resources/sprites/characters/Attacking.png";

    const playerIdle = new Image();
    playerIdle.src = "resources/sprites/characters/mainChar.png";


    //========== enemy sprites ========================================
    const slimeImage = new Image();
    slimeImage.src = "resources/sprites/characters/Idle/Slime2_Idle_body.png";

    const slimeAtt = new Image();
    slimeAtt.src = "resources/sprites/characters/Attack/Slime2_Attack_body.png";

    const slimeWalk = new Image();
    slimeWalk.src = "resources/sprites/characters/Death/Slime2_Death_body.png";

    const slimeDie = new Image();
    slimeDie.src = "resources/sprites/characters/Death/Slime2_Death_body.png";

    const slimeHurt = new Image();
    slimeHurtsrc = "resources/sprites/characters/Hurt/Slime2_Hurt_body.png";


    const player = {
      x: 80,
      y: 120,
      width: 40.4,
      height: 50,
      drawWidth: 80,
      drawHeight: 100,
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

    const inventory = {
      items: ["Potion"],
      weapon: ["Bronze Sword"]
    };

    const quests = [
      { id: 1, name: "Kill 10 Slimes", progress: 0, goal: 10, completed: false }
    ];

    let enemies = [
      {
        x: 300,
        y: 300,
        width: 65,
        height: 40,
        hp: 30,
        attack: 2,
        alive: true,
        frameX: 0,
        frameTick: 0,
        frameY: 0,
        state: 'idle',
        frameTick: 0,
        deathTick: 0
      }
    ];

    const npcs = [
      { x: 400, y: 200, width: 32, height: 32, message: "Welcome to our village, hero!" }
    ];

    const chests = [
      { x: 160, y: 160, width: 32, height: 32, opened: false, item: 'potion', weapon: "Bronze Sword" }
    ];

    function drawVillage() {
    //   if (currentArea !== 'Green Plains') return;

    //   for (let x = 64; x <= 576; x += 32) {
    //     ctx.drawImage(tileImages.fence, x, 64, 32, 32);
    //     ctx.drawImage(tileImages.fence, x, 384, 32, 32);
    //   }
    //   for (let y = 96; y <= 352; y += 32) {
    //     ctx.drawImage(tileImages.fence, 64, y, 32, 32);
    //     ctx.drawImage(tileImages.fence, 576, y, 32, 32);
    //   }

    //   ctx.clearRect(320, 384, 32, 32);

    //   for (let y = 96; y <= 352; y += 32) {
    //     for (let x = 96; x <= 544; x += 32) {
    //       ctx.drawImage(tileImages.floor, x, y, 32, 32);
    //     }
    //   }

    //   ctx.drawImage(tileImages.wall, 128, 128, 32, 32);
    //   ctx.drawImage(tileImages.wall, 160, 128, 32, 32);
    //   ctx.drawImage(tileImages.rock, 192, 192, 32, 32);

    //   chests.forEach(chest => {
    //     if (!chest.opened) ctx.drawImage(tileImages.chest, chest.x, chest.y, chest.width, chest.height);
    //   });
    // }

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

    // function enterHouse() {
    //   if (currentArea === 'Green Plains' && player.x > 120 && player.x < 190 && player.y > 90 && player.y < 160) {
    //     currentArea = 'House Interior';
    //     player.x = 100;
    //     player.y = 300;
    //     updateHUD();
    //   }
    // }

    // function exitHouse() {
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
        player.drawWidth,
        player.drawHeight
      );

      ctx.fillStyle = "red";
      ctx.fillRect(player.x, player.y - 10, player.drawWidth, 5);
      ctx.fillStyle = "lime";
      ctx.fillRect(player.x, player.y - 10, (player.hp / player.maxHp) * player.drawWidth, 5);

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
          enemies.push({
            x: 100 + i * 80,
            y: 300,
            width: 65,
            height: 40,
            hp: 30,
            alive: true,
            frameX: 0,
            frameTick: 0,
            frameY: 0
          });
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
      if (currentArea === 'Green Plains') {
        drawMap(townMap);
      } else if (currentArea === 'Slime Woods') {
        drawMap(slimeForestMap);
      } else {
        // Default filler background
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }


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
    // ========================================
    //    AREAS
    // ===========================================
    


    //     const masterTileset = new Image();
    // masterTileset.src = "resources/sprites/tilesets/adventure_tileset.png"; // copy it there
    // const tileMap = {
    //   grass: { x: 0, y: 0 },
    //   dirt: { x: 1, y: 0 },
    //   tree: { x: 5, y: 3 }
    //   // ...
    // };

    // ctx.drawImage(masterTileset,
    //   tileMap.grass.x * 16, tileMap.grass.y * 16, 16, 16,
    //   x, y, 32, 32);



    // Save/Load functionality:

    const tileset = new Image();
    tileset.src = "resources/sprites/tilesets/Adventure Awaits Asset Pack 1.0.png"; // <-- Adjust path if needed
    const TILE_SIZE = 16;     // size in tileset
    const SCALE = 2;          // to make 32×32 on screen
    const RENDER_SIZE = TILE_SIZE * SCALE;

    function drawTile(tileIndex, dx, dy) {
      const tilesPerRow = tileset.width / TILE_SIZE;
      const sx = (tileIndex % tilesPerRow) * TILE_SIZE;
      const sy = Math.floor(tileIndex / tilesPerRow) * TILE_SIZE;

      ctx.drawImage(
        tileset,
        sx, sy, TILE_SIZE, TILE_SIZE,
        dx, dy, RENDER_SIZE, RENDER_SIZE
      );
    }

   function drawMap(map) {
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const tileName = map[row][col];
      const tileImage = tileImages[tileName];

      if (tileImage) {
        ctx.drawImage(tileImage, col * 32, row * 32, 32, 32);
      }
    }
  }
}


   const townMap = [
  ["fenceUL", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceUR"],
  ["fenceLeft", "grass", "grass", "tree", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "dirt", "dirt", "dirt", "grass", "grass", "grass", "tree", "grass", "grass", "grass", "dirt", "dirt", "dirt", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "tree", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "dirt"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLL", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceLR"]
];

    const houseImage = new Image();
    houseImage.src = "resources/sprites/tilesets/Tiles/Slice 9.png"; // Adjust path!

    // Inside drawVillage or gameLoop (after map):
    ctx.drawImage(houseImage, 288, 160, 96, 96);


    const slimeForestMap = [
      ["fenceUL", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceTop", "fenceUR"],
  ["fenceLeft", "grass", "grass", "tree", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "dirt", "dirt", "dirt", "grass", "grass", "grass", "tree", "grass", "grass", "grass", "dirt", "dirt", "dirt", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "tree", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "tree", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "dirt", "dirt"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "dirt", "dirt"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLeft", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass", "fenceRight"],
  ["fenceLL", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceBottom", "fenceLR"]
      
    ];

    tileset.onload = () => {
      updateHUD();
      gameLoop();
    };

    // ======================================================

   function parseMap(stringMap) {
  const baseMap = [];
  const decorMap = [];

  for (let row = 0; row < stringMap.length; row++) {
    baseMap[row] = [];
    decorMap[row] = [];

    for (let col = 0; col < stringMap[row].length; col++) {
      const key = stringMap[row][col];

      baseMap[row][col] = tileIndexMap["grass"]; // Always render grass first

      // Decor objects with layering
      if (key === "grass") {
        decorMap[row][col] = null;
      } else {
        decorMap[row][col] = {
          index: tileIndexMap[key],
          zIndex: ["tree"].includes(key) ? 2 : 1 // Trees go above player
        };
      }
    }
  }

  return { baseMap, decorMap };
}



    // ======================================================
    function saveGame() {
      const data = {
        player,
        inventory,
        quests,
        currentArea
      };

      localStorage.setItem("gameSave", JSON.stringify(data));
      alert("Game saved!");
    }

    function loadGame() {
      const data = JSON.parse(localStorage.getItem("gameSave"));
      if (data) {
        Object.assign(player, data.player);
        Object.assign(inventory, data.inventory);
        Object.assign(quests[0], data.quests[0]);
        currentArea = data.currentArea || 'Green Plains';
        updateHUD();
      }
    }
    function renderInventory() {
      const list = document.getElementById("inventoryItems");
      list.innerHTML = "";
      inventory.items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
    }
    document.addEventListener("keydown", e => {
      if (e.key === "F5") {
        e.preventDefault();
        saveGame();
      }
      if (e.key === "F9") loadGame();
      if (e.key.toLowerCase() === "i") {
        const inv = document.getElementById("inventory");
        inv.style.display = inv.style.display === "none" ? "block" : "none";
        renderInventory();
      }
    });

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
    };