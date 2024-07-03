const attackDiceNumber = document.getElementById('attackDiceNumber')
const defenseDiceNumber = document.getElementById('defenseDiceNumber')
const weaponSelectEl = document.getElementById('weaponSelect')
const enemySelectEl = document.getElementById('enemySelect')
const baseEnemiesToggle = document.getElementById('baseEnemies')
const arenaEnemiesToggle = document.getElementById('arenaEnemies')
const attackDiceContainer = document.getElementById('attackDiceContainer')
const defenseDiceContainer = document.getElementById('defenseDiceContainer')
const rollButton = document.getElementById('rollButton')
const damageHeader = document.getElementById('damageHeader')
const enemyStatsDisplay = document.getElementById('enemyStatsDisplay')
const enemyAttackSpan = document.getElementById('enemyAttackSpan')
const enemyPhyDefSpan = document.getElementById('enemyPhyDefSpan')
const enemyMagDefSpan = document.getElementById('enemyMagDefSpan')

let currentWeapon = null
let currentEnemy = null

/* -------- Weapon List -----------------------------=-------------------- */
const weapons = {
  'club': {
    name: 'Club',
    type: 'physical'
  },
  crossbow: {
    name: 'Crossbow',
    type: 'physical'
  },
  dagger: {
    name: 'Dagger',
    type: 'physical'
  },
  magicDrain: {
    name: 'Magic Drain',
    type: 'magic'
  },
  lightningStrike: {
    name: 'Lightning Strike',
    type: 'magic'
  },
  sword: {
    name: 'Sword',
    type: 'physical'
  },
  spear: {
    name: 'Spear',
    type: 'physical'
  },
  magicStaff: {
    name: 'Magic Staff',
    type: 'magic'
  },
}

/* -------- Base Enemy List ---------------------=----------------------- */
const arenaEnemies = {
  brutusTheBashful: {
    name: 'Brutus the Bashful',
    attack: 2,
    armor: {
      physical: 2,
      magic: 1
    }
  },
  silasTheSlow: {
    name: 'Silas the Slow',
    attack: 2,
    armor: {
      physical: 2,
      magic: 1
    }
  },
  lenaTheLowly: {
    name: 'Lena the Lowly',
    attack: 2,
    armor: {
      physical: 2,
      magic: 1
    }
  },
  rolfTheMeek: {
    name: 'Rolf the Meek',
    attack: 2,
    armor: {
      physical: 2,
      magic: 1
    }
  },
  fionaTheFierce: {
    name: 'Fiona the Fierce',
    attack: 2,
    armor: {
      physical: 3,
      magic: 4
    }
  },
  garrickTheGallant: {
    name: 'Garrick the Gallant',
    attack: 2,
    armor: {
      physical: 3,
      magic: 4
    }
  },
  elaraTheSwift: {
    name: 'Elara the Swift',
    attack: 2,
    armor: {
      physical: 3,
      magic: 4
    }
  },
  dariusTheDominator: {
    name: 'Darius the Dominator',
    attack: 3,
    armor: {
      physical: 4,
      magic: 4
    }
  },
  vesperTheValiant: {
    name: 'Vesper the Valiant',
    attack: 3,
    armor: {
      physical: 4,
      magic: 4
    }
  },
  championCraig: {
    name: 'Champion Craig',
    attack: 4,
    armor: {
      physical: 4,
      magic: 4
    }
  } 
}

/* -------- Arena Enemy List =------------------------------------------- */
const baseEnemies = {
  phytank: {
    name: 'Phytank',
    attack: 1,
    armor: {
      physical: 4,
      magic: 0
    }
  },	
  magtank: {
    name: 'Magtank',
    attack: 1,
    armor: {
      physical: 0,
      magic: 4
    }
  },	
  defguy: {
    name: 'Defguy',
    attack: 2,
    armor: {
      physical: 3,
      magic: 3
    }
  },	
  bigpow: {
    name: 'Bigpow',
    attack: 4,
    armor: {
      physical: 1,
      magic: 1
    }
  },	
  normal: {
    name: 'Normal',
    attack: 3,
    armor: {
      physical: 2,
      magic: 2
    }
  },	
  jailer: {
    name: 'Jailer',
    attack: 1,
    armor: {
      physical: 6,
      magic: 6
    }
  },	
}

/* -------- Populate List of enemies ------------------------------------ */
function populateEnemyList(enemies) {
  enemySelectEl.innerHTML = '<option selected>Select</option>'

  Object.keys(enemies).forEach(key => {
    const enemy = enemies[key];
    const option = document.createElement('option');
    option.value = key;
    option.textContent = enemy.name;
    enemySelectEl.appendChild(option);
  });
}

/* -------- Single Die Roll --------------------------------------------- */
function rollDie(number) {
  const roll = {
    value: Math.ceil(Math.random() * number),
    match: false,
    crit: false
  }
  return roll
}

/* -------- Multiple Dice Roll ==---------------------------------------- */
function multiRoll(numberofRolls, diceMax) {
  let rollResults = []
  for (let i = 0; i < numberofRolls; i++) {
    rollResults.push(rollDie(diceMax))
  }
  return rollResults
}
/* -------- Dice roll with defense -------------------------------------- */
function attackVsDefense(attackDice, defenseDice) {
  const attackRollArray = multiRoll(attackDice, 6)
  const defenseRollArray = multiRoll(defenseDice, 6)
  let unblockedRollsArray = attackRollArray.slice()

  for (i = 0; i < defenseRollArray.length; i++) {
    for (j = 0; j < unblockedRollsArray.length; j++) {
      if (defenseRollArray[i].value === unblockedRollsArray[j].value) {
        defenseRollArray[i].match = true
        unblockedRollsArray[j].match = true
        unblockedRollsArray.splice(j, 1)
        break
      }
    }
  }
  return { unblockedRolls: unblockedRollsArray.length, attackRolls: attackRollArray.sort((a, b) => a.value - b.value), defenseRolls: defenseRollArray.sort((a, b) => a.value - b.value), }
}
/* -------- Handle Roll ------------------------------------------------- */
function handleHeroRoll() {
  console.log(currentWeapon)
  console.log(currentWeapon.type)
  const currentEnemyArmor = currentEnemy.armor[currentWeapon.type]

  attackDiceContainer.innerText = ''
  defenseDiceContainer.innerText = ''
  let { unblockedRolls, attackRolls, defenseRolls, } = attackVsDefense(attackDiceNumber.value, currentEnemyArmor)
  let damage = 0

  console.log(unblockedRolls)
  console.log(attackRolls)
  console.log(defenseRolls)

  if (currentWeapon === weapons.club) {
    damage = checkClubHits(attackRolls)
  } else if (currentWeapon === weapons.sword) {
    const swordCrits = checkSixes(attackRolls)
    damage = unblockedRolls + swordCrits
    renderDefenseDice(defenseRolls)
  } else if (currentWeapon === weapons.magicStaff) {
    const staffCrits = checkDoubles(attackRolls)
    damage = unblockedRolls + staffCrits
    renderDefenseDice(defenseRolls)
  } else {
    damage = unblockedRolls
    renderDefenseDice(defenseRolls)
  }
  renderAttackDice(attackRolls)
  damageHeader.innerText = `Damage: ${damage}`

}
/* -------- Render attack dice ------------------------------------------- */
function renderAttackDice(attackRolls) {
  for (const roll of attackRolls) {
    const imgElement = document.createElement('img')
    imgElement.src = `assets/images/red-${roll.value}.png`
    imgElement.className = `img-fluid col-3 m-1 p-1`
    imgElement.alt = `red die ${roll.value}`

    if (currentWeapon === weapons.club) {
      roll.value >= 4 ? imgElement.classList.add('custom-hit') : imgElement.classList.add('opacity-50')
    } else {
      roll.match === true ? imgElement.classList.add('custom-block', 'opacity-50') : imgElement.classList.add('custom-hit')
    }

    if (roll.crit === true) {
      setInterval(function () {
        imgElement.classList.toggle('custom-crit');
      }, 300)
    }

    attackDiceContainer.appendChild(imgElement)
  }
}
/* -------- Render defense dice ------------------------------------------ */
function renderDefenseDice(defenseRolls) {
  for (const roll of defenseRolls) {
    const imgElement = document.createElement('img')
    imgElement.src = `assets/images/blue-${roll.value}.png`
    imgElement.className = `img-fluid col-3 m-1 p-1`
    imgElement.alt = `blue die ${roll.value}`
    if (roll.match === true) {
      imgElement.classList.add('custom-block', 'opacity-50')
    } else {
      imgElement.classList.add('opacity-25')
    }

    defenseDiceContainer.appendChild(imgElement)
  }
}
/* -------- Check for rolls of 4+ -------------------------------------- */
function checkClubHits(rolls) {
  let clubDamage = 0

  for (const roll of rolls) {
    if (roll.value >= 4) {
      clubDamage++
    }
  }

  return clubDamage
}
/* -------- Check for sets of doubles for magic staff ----------------- */
function checkDoubles(rolls) {
  let crits = 0
  for (i = 0; i < rolls.length; i++) {
    const dieOne = rolls[i]
    console.log([dieOne.match, dieOne.crit])
    for (j = 0; j < rolls.length; j++) {
      const dieTwo = rolls[j]
      if (!dieOne.match && !dieOne.crit && !dieTwo.match && !dieTwo.crit && dieOne.value === dieTwo.value && i !== j) {
        dieOne.crit = true
        dieTwo.crit = true
        crits++
      }
    }
  }
  return crits
}

/* -------- Check for sixes for sword roll -------------------------- */
function checkSixes(attackRolls) {
  let crits = 0
  for (const roll of attackRolls) {
    if (roll.match === false && roll.value === 6) {
      crits++
      roll.crit = true
    }
  }
  return crits
}


/* -------------------------------- INIT -------------------------------------------- */
// Begin with base enemies in list
populateEnemyList(baseEnemies)

// Listen for base enemy toggle
baseEnemiesToggle.addEventListener('change', function() {
  if (this.checked) {
      populateEnemyList(baseEnemies);
  }
})

// Listen for arena enemy toggle
arenaEnemiesToggle.addEventListener('change', function() {
  if (this.checked) {
      populateEnemyList(arenaEnemies);
  }
})

enemySelectEl.addEventListener('change', function() {
  const selectedEnemy = this.value;
  if (selectedEnemy === 'Select') {
      currentEnemy = null;
  } else {
      // If base is checked, enemies checks base enemies object; if arena is checked, enemies checks arena enemies object
      const enemies = document.getElementById('baseEnemies').checked ? baseEnemies : arenaEnemies;
      currentEnemy = enemies[selectedEnemy]
      console.log(currentEnemy.attack)
      enemyStatsDisplay.classList.remove('d-none')
      enemyAttackSpan.innerText = `${currentEnemy.attack}`
      enemyPhyDefSpan.innerText = `${currentEnemy.armor.physical}`
      enemyMagDefSpan.innerText = `${currentEnemy.armor.magic}`
  }
  console.log(currentEnemy)
})

weaponSelectEl.addEventListener('change', function() {
  const selectedWeapon = this.value;
  if (selectedWeapon === 'Select') {
      currentWeapon = null;
  } else {
      currentWeapon = weapons[selectedWeapon]
  }
  console.log(currentWeapon)
})

// Listen for roll button click
rollButton.addEventListener('click', handleHeroRoll)

