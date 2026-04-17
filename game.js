let honey = 0;

let critChance = 0.1;
let critLevel = 0;
let critMax = 10;
let critCost = 250;

const beesArr = [];

/* SPRITES */
const beeImages = {
  stinger:"https://i.imgur.com/xJWc95Q.png",
  sword:"https://i.imgur.com/TiWHLiF.png",
  jouster:"https://i.imgur.com/lSAAT9W.png",
  samurai:"https://i.imgur.com/oxEFciK.png",
  giant:"https://i.imgur.com/zdiy5OB.png", // 👈 MOVED POSITION
  lightsword:"https://i.imgur.com/MwAWDqF.png",
  king:"https://i.imgur.com/cp2Uw5i.png",

  archer:"https://i.imgur.com/pN0vhfZ.png",
  ninja:"https://i.imgur.com/ghWPUE1.png",
  wizard:"https://i.imgur.com/0AhIMIp.png",
  pistol:"https://i.imgur.com/ETUF9Nb.png",
  rifle:"https://i.imgur.com/vjsOwmM.png",
  bazooka:"https://i.imgur.com/KrPgaUn.png",
  queen:"https://i.imgur.com/8NzL8rj.png"
};

const projectiles = {
  archer:"https://i.imgur.com/aHbflNX.png",
  ninja:"https://i.imgur.com/Zayahc2.png",
  wizard:"https://i.imgur.com/DbDCX3O.png",
  pistol:"https://i.imgur.com/ZSY3UQQ.png",
  rifle:"https://i.imgur.com/ZSY3UQQ.png",
  bazooka:"https://i.imgur.com/lbmO40Q.png",
  queen:"https://i.imgur.com/DbDCX3O.png"
};

/* BEES (ORDER FIXED HERE) */
const beeTypes = {
  stinger:{img:beeImages.stinger,power:1,speed:1300,cost:10,zone:"melee"},
  sword:{img:beeImages.sword,power:2,speed:1200,cost:25,zone:"melee"},
  jouster:{img:beeImages.jouster,power:5,speed:1100,cost:50,zone:"melee"},
  samurai:{img:beeImages.samurai,power:7,speed:1000,cost:100,zone:"melee"},
  giant:{img:beeImages.giant,power:10,speed:2500,cost:150,zone:"melee"}, // 👈 HERE
  lightsword:{img:beeImages.lightsword,power:4,speed:800,cost:250,zone:"melee"},
  king:{img:beeImages.king,power:20,speed:1500,cost:450,zone:"melee"},

  archer:{img:beeImages.archer,projectile:"archer",power:2,speed:1300,cost:20,zone:"ranged"},
  ninja:{img:beeImages.ninja,projectile:"ninja",power:3,speed:900,cost:75,zone:"ranged"},
  wizard:{img:beeImages.wizard,projectile:"wizard",power:5,speed:1100,cost:150,zone:"ranged"},
  pistol:{img:beeImages.pistol,projectile:"pistol",power:8,speed:800,cost:200,zone:"ranged"},
  rifle:{img:beeImages.rifle,projectile:"rifle",power:5,speed:600,cost:250,zone:"ranged"},
  bazooka:{img:beeImages.bazooka,projectile:"bazooka",power:18,speed:2000,cost:350,zone:"ranged"},
  queen:{img:beeImages.queen,projectile:"queen",power:25,speed:1500,cost:550,zone:"ranged"}
};

/* CLICK */
function manualClick(){
  let dmg = 1;

  if(Math.random() < critChance){
    dmg *= 3;
    showCrit();
  }

  honey += dmg;
  updateUI();
}

/* CRIT */
function showCrit(){
  const c = document.createElement("div");
  c.className = "critPopup";
  c.innerText = "CRIT!";
  c.style.left = window.innerWidth/2 + "px";
  c.style.top = "120px";
  document.body.appendChild(c);
  setTimeout(()=>c.remove(),800);
}

function showCritAtBee(el){
  const rect = el.getBoundingClientRect();

  const c = document.createElement("div");
  c.className = "critPopup";
  c.innerText = "CRIT!";
  c.style.left = rect.left + "px";
  c.style.top = rect.top + "px";

  document.body.appendChild(c);
  setTimeout(()=>c.remove(),800);
}

/* SPAWN (HIGHER AREA FIX) */
function spawnBeeType(type){
  const d = beeTypes[type];
  if(!d || honey < d.cost) return;

  honey -= d.cost;
  d.cost = Math.floor(d.cost * 1.5);

  updateUI();
  renderShop();

  const bee = document.createElement("div");
  bee.className = "bee";
  bee.style.backgroundImage = `url(${d.img})`;
  document.getElementById("beeArea").appendChild(bee);

  const area = document.getElementById("beeArea");
  const w = area.clientWidth;
  const h = area.clientHeight;

  let x, y;

  const topPad = h * 0.05;
  const usableHeight = h * 0.55;

  if(d.zone === "melee"){
    x = w * 0.45 + Math.random() * (w * 0.40);
  } else {
    x = w * 0.05 + Math.random() * (w * 0.30);
  }

  y = topPad + Math.random() * usableHeight;

  bee.style.left = x + "px";
  bee.style.top = y + "px";

  beesArr.push({el:bee,data:d,cd:0});
}

/* LOOP (CRIT ADDED) */
setInterval(()=>{
  beesArr.forEach(b=>{
    b.cd -= 100;

    if(b.cd <= 0){
      if(!b.data.projectile){

        b.el.classList.add("jump");
        setTimeout(()=>b.el.classList.remove("jump"),120);

        let dmg = b.data.power;

        if(Math.random() < critChance){
          dmg *= 3;
          showCritAtBee(b.el);
        }

        honey += dmg;
        updateUI();

      } else {
        fireProjectile(b.el,b.data);
      }

      b.cd = b.data.speed;
    }
  });
},100);

/* PROJECTILES WITH CRIT */
function fireProjectile(el,d){
  const p = document.createElement("img");
  p.className = "projectile";
  p.src = projectiles[d.projectile];
  document.body.appendChild(p);

  const r = el.getBoundingClientRect();

  let x = r.left;
  let y = r.top;

  const tx = innerWidth/2;
  const ty = innerHeight/2;

  const move = setInterval(()=>{
    x += (tx-x)*0.12;
    y += (ty-y)*0.12;

    p.style.left = x+"px";
    p.style.top = y+"px";

    if(Math.hypot(x-tx,y-ty)<25){
      p.remove();
      clearInterval(move);

      let dmg = d.power;

      if(Math.random() < critChance){
        dmg *= 3;
        showCritAtBee(el);
      }

      honey += dmg;
      updateUI();
    }
  },16);
}

/* UI + SHOP */
function updateUI(){
  document.getElementById("honey").innerText = "Honey: " + honey + " 🍯";
  document.getElementById("critUI").innerText = `Critical Stings: ${critLevel}/${critMax}`;
}

function renderShop(){
  const u = document.getElementById("upgradeShop");
  const m = document.getElementById("meleeShop");
  const r = document.getElementById("rangedShop");

  u.innerHTML = "";
  m.innerHTML = "";
  r.innerHTML = "";

  const critBtn = document.createElement("button");
  critBtn.innerText = `Critical Stings (${critLevel}/${critMax}) - ${critCost}🍯`;
  critBtn.onclick = buyCritUpgrade;
  u.appendChild(critBtn);

  Object.keys(beeTypes).forEach(t=>{
    const btn = document.createElement("button");
    btn.innerText = `${t} (${beeTypes[t].cost}🍯)`;
    btn.onclick = ()=>spawnBeeType(t);

    if(beeTypes[t].zone === "melee") m.appendChild(btn);
    else r.appendChild(btn);
  });
}

function buyCritUpgrade(){
  if(critLevel >= critMax || honey < critCost) return;

  honey -= critCost;
  critLevel++;
  critChance += 0.075;
  critCost = Math.floor(critCost * 1.6);

  updateUI();
  renderShop();
}

renderShop();
