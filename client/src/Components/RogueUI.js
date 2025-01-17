import {useState, useEffect} from 'react'
import roguepic from '../Images/rogue-pic.png'
import roguedead from '../Images/rogue-pic-dead.png'
import rogueac from '../Images/rogue-armor.png'
import roguebless from '../Images/rogue-pic-bless.png'
import roguestun from '../Images/rogue-pic-stun.png'
import healingpotion from '../Images/healing-potion.png'
import potionused from '../Images/healing-potion-used.png'
import iris from '../Images/rogue-name.png'
import { ProgressBar } from 'react-bootstrap'
import { OverlayTrigger } from 'react-bootstrap'
import { Tooltip } from 'react-bootstrap'
import press from '../Music/button-press.mp3'
import potionSound from '../Music/potion-use.mp3'
import phantomSound from '../Music/phantom-sound.wav'
import missSound from '../Music/miss-sound.mp3'



function RogueUI ({
    rogStunStatus,
    battleLog,
    setBattleLog,
    setRogueHealth,
    enemyArmorClass,
    phantomCD,
    setPhantomCD,
    blessStatus,
    setPoisonStatus,
    updateBattleLog, 
    rogTurn, 
    setRogTurn, 
    rogueHealth, 
    enemyHealth, 
    setEnemyHealth,
    setFloatingDamage,
    rogPopup,
    setRogPopup,
    setActionAnimate}) {
        
        const [potionAmount, setPotionAmount] = useState(3)
        const [potionCD, setPotionCD] = useState(true)
        const [restorePopup, setRestorePopup] = useState(0)

    useEffect(() => {
        let popup = document.createElement("h3");
        let element = document.getElementById('popup-box-rog')
        
        if (rogPopup > 0) {
            
            popup.className = "damage-float"
            popup.textContent = `-${rogPopup}`
        }
        if (rogPopup === 'Miss') {
            popup.className = "enemy-missed"
            popup.textContent = `${rogPopup}`
        }
        element.appendChild(popup)
        setTimeout(() => {
            popup.remove()
        }, 1900)
        setRogPopup(0)
        
    }, [rogPopup, setRogPopup])

    useEffect(() => {
        let popup = document.createElement("h3");
        let element = document.getElementById('popup-box-rog')
        if (restorePopup !== 0) {
            popup.className = "heal-float"
            popup.textContent = `+${restorePopup}`
        }
        element.appendChild(popup)
        setTimeout(() => {
            popup.remove()
        }, 1900)
        setRestorePopup(0)
        
    }, [restorePopup, setRestorePopup])

// Sound effects for clicking abilities, potions, and missing signature actions.
    function pressAudio() {
        const audio = new Audio(press);
        audio.volume = 0.3
        audio.play()
    }
    
    function potionAudio() {
        const audio = new Audio(potionSound);
        audio.volume = 0.3
        audio.play()
    }
    
    function phantomAudio() {
        const audio = new Audio(phantomSound);
        audio.volume = 0.3
        audio.play()
    }
    
    function missAudio() {
        const audio = new Audio(missSound);
        audio.volume = 0.3
        audio.play()
    }

// Setting up accuracy rolling for Rogue. Uses a d20 (20 sided die) to determine if attack is successful
// Paladin's Bless ability adds a d4 (4 sided die) to the d20 value with total of both the d4 and d20.
    const blessRoll = (Math.floor(Math.random() * 4 + 1))
    const d20Roll = (Math.floor(Math.random() * 20 + 1))

    const diceRoll = 
        blessStatus > 0 
        ? d20Roll + (blessRoll)
        : d20Roll

// Rogue attacks have a +6 to the base hit die(dice).
// Ex: Rogue rolls a 13 on the (d20). 13 + 6 = 19 total roll. 
    function rogueDiceRoll() {
        return (diceRoll) + 6
    }
    
    const rogueRoll = rogueDiceRoll()

// Damage modification for Rogue basic Attack.
// Rolls 2d6 (Two 6 sided dice) with a +7 to the base damage.
    function rogueDamageModifier() {
        return (Math.floor(Math.random() * 11 + 1) + 8)
    }

// Made the rogueAttack variable to keep the value of the damage modifier consistent with the damage it does and the message sent to the battle log
    const rogueAttack = rogueDamageModifier()

// This function rolls against the enemy armor class determined in Battle# Components then records the damage done as well as
// setting enemy hp to the difference of the attack value and its current hp. 
// Also resets potion to true if it was used and continues the turn order.
    function rogAttack() {
        let damage = enemyHealth
    // Critcal Attacks occur when a d20 roll equals 20 and doubles the amount of dice rolled.
        const critAttack = (rogueAttack + (Math.floor(Math.random() * 11 + 1) + 1))
        if (d20Roll === 20) {
            damage = (enemyHealth) - (critAttack)
        } else {
            damage = (enemyHealth) - (rogueAttack)
        }
        if (rogueRoll >= enemyArmorClass) {
            if (d20Roll === 20) {
                updateBattleLog(
                    `Iris rolled a natural 🎲(20) against the enemy!`,
                    `Iris crtically struck the enemy for ${critAttack} damage!!! `)
                setFloatingDamage(critAttack)
            } else if (rogueAttack >= 13 && d20Roll !== 20){
                updateBattleLog(
                    `Iris rolled 🎲(${diceRoll}) + 6 against the enemy.`,
                    `Iris mutilated the target for ${rogueAttack} damage!!`)
                setFloatingDamage(rogueAttack)
            } else {
                updateBattleLog(
                    `Iris rolled 🎲(${diceRoll}) + 6 against the enemy.`,
                    `Iris slashed the enemy for ${rogueAttack} damage! `)
                setFloatingDamage(rogueAttack)
            }
            setActionAnimate('Attack')
            setEnemyHealth(damage)
            
            
        } else {
            updateBattleLog(
                `Iris rolled 🎲(${diceRoll}) + 6 against the enemy.`,
                'Iris missed the target.')
            setFloatingDamage('Miss')
        }
        setPotionCD(true)
        setRogTurn(2)
        pressAudio()
        
    }
    
// Damage modificataion
// Rolls 1d6(One 6 sided die) with a +3 to the base damage.
    function rogueVenomStrikeModifier() {
        return (Math.floor(Math.random() * 6 + 1) + 3)
    }

    const venomAttack = rogueVenomStrikeModifier()

// This function rolls against the enemy armor class determined in Battle# Components then records the damage done as well as
// setting enemy hp to the difference of the attack value and its current hp. 
// Resets potion to true if it was used and continues the turn order.
// Also sets poisonStatus to 3 which is lowered each round via the Battle# Component. Damage value can be seen in Battle# components.
    function rogVenomStrike() {
        let damage = enemyHealth
        const critAttack = (venomAttack + Math.floor(Math.random() * 6 + 1))
        if (d20Roll === 20) {
            damage = (enemyHealth) - (critAttack)
        } else {
            damage = (enemyHealth) - (venomAttack)
        }
        if (rogueRoll >= enemyArmorClass) {
            if (d20Roll === 20) {
                updateBattleLog(
                    `Iris rolled a natural 🎲(20) against the enemy!`,
                    `Iris dealt ${critAttack} critical damage and poisoned the enemy!!!`)
                setFloatingDamage(critAttack)

            } else {
                updateBattleLog(
                    `Iris rolled 🎲(${diceRoll}) + 6 against the enemy.`,
                    `Iris dealt ${venomAttack} damage and poisoned the enemy!`)
                setFloatingDamage(venomAttack)
            }
            setActionAnimate('Venomous Strike')
            setEnemyHealth(damage)
            setPoisonStatus(3)
        } else {
            updateBattleLog(
                `Iris rolled 🎲(${diceRoll}) + 6 against the enemy.`,
                'Iris missed the target.')
            setFloatingDamage('Miss')
        }
        setPotionCD(true)
        setRogTurn(2)
        pressAudio()
    }

// Damage Modification
// Rolls 3d6(Three 6 sided dice) with a +18 to the base damage.
    function roguePhantomAssultModifier() {
        return (Math.floor(Math.random() * 16 + 1) + 20)
    }

    const phantomAttack = roguePhantomAssultModifier()

// Phantom Attack (Signature Attack) has a higher base hit than regular attacks.
    function phantomDiceRoll() {
        return (diceRoll) + 11
    }

    const phantomRoll = phantomDiceRoll()


// This function rolls against the enemy armor class determined in Battle# Components then records the damage done as well as
// setting enemy hp to the difference of the attack value and its current hp. 
// Resets potion to true if it was used and continues the turn order.
// Sets Phantom Assault cooldown to 0 upon use. Phantom Assault cooldown value goes increments by 1 each round, determined in Battle# components. 
// Phantom Assault usable again at the value of 4.
    function rogPhantomAssault() {
        let damage = enemyHealth
        const critAttack = (phantomAttack + (Math.floor(Math.random() * 16 + 1) + 2))
        if (d20Roll === 20) {
            damage = (enemyHealth) - (critAttack)
        } else {
            damage = (enemyHealth) - (phantomAttack)
        }
        if (phantomRoll >= enemyArmorClass) {
            if (d20Roll === 20) {
                updateBattleLog(
                    `Iris rolled a natural 🎲(20) against the enemy!`,
                    `Iris critically slaughtered the enemy for ${critAttack} damage!!! `)
                setFloatingDamage(critAttack)
            } else {
                updateBattleLog(
                    `Iris rolled 🎲(${diceRoll}) + 11 against the enemy.`,
                    `Iris eviscerated the enemy for ${phantomAttack} damage! `)
                setFloatingDamage(phantomAttack)
            }
            setActionAnimate('Phantom Assault')
            setEnemyHealth(damage)
            phantomAudio()
        } else {
            updateBattleLog(
                `Iris rolled 🎲(${diceRoll}) + 11 against the enemy.`,
                'Iris lamentably missed the mark.')
            setFloatingDamage('Miss')
            missAudio()
        }
        setPotionCD(true)
        setRogTurn(2)
        setPhantomCD(0)
        
    }

// Potion Modification
// Rolls 1d6(One 6 sided die) with a +14 to the base.
function potionRestoreModifier () {
    return (Math.floor(Math.random() * 6 + 1) + 14)
}

const potionRestore = potionRestoreModifier()

// Allows Rogue/player to use potion if it's ready, the Rogue's Turn, and if the Rogue is alive.
// Reduce the potionAmount and sets it to false allowing only 1 potion to be used per turn.
// Records the information into the Battle Log.
function drinkPotion() {
    const restore = (rogueHealth) + (potionRestore)
    if (potionCD === true && rogTurn === 1 && potionAmount > 0 && rogueHealth > 0) {
        potionAudio()
        setRestorePopup(potionRestore)
        setRogueHealth(restore)
        setPotionAmount(potionAmount - 1)
        setPotionCD(false)
        setBattleLog([...battleLog, `Iris restored ${potionRestore} health.`])
    } 
}

// Changes the UI element of the potion from red to greyscale based on availability 
function potionStatus() {
    if (potionCD && rogTurn === 1 && potionAmount > 0) {
        return healingpotion
    } else {
        return potionused
    }
}

// Prevents Rogue's health from going above its max and lower than 0.
    if (rogueHealth < 0) {
        setRogueHealth(0)
    } else if (rogueHealth > 41) {
        setRogueHealth(41)
    }

// To make the progress bar display a percentage of the health/cooldown value.
    const healthBar = ((rogueHealth / 41) * 100)

    const cooldownBar = ((phantomCD/4) * 100)

// Changes the color of the progress bar based on the percentage of the Rogue's remaining Health. 
    function progressBarClass () {
        if (healthBar < 100 && healthBar >= 50) {
            return "success"
        } else if (healthBar < 50 && healthBar >= 25) {
            return "warning"
        } else if (healthBar < 25) {
            return "danger"
        } else {
            return ""
        }

    } 

// Determines the icon used to display Rogue's status based on truthy values buffs/debuffs.
    function rogueStatus() {
        if (rogueHealth > 0 && blessStatus === 0) {
            if (rogStunStatus) {
                return roguestun
            } else {
                return roguepic
            }
        } else if (blessStatus && rogueHealth > 0) {
            if (rogStunStatus) {
                return roguestun
            } else {
                return roguebless
            }
        } else {
            return roguedead
        }
    }


// Renders a button when it's the character's turn and displays a tooltip of the action.
    function overlayTooltipAndAction(action, skillName, id, description) {
        return (
            <OverlayTrigger
                placement="top"
                delay={{show: 500, hide: 10}}
                overlay={
                    <Tooltip id="button-tooltip">
                    {description} 
                    </Tooltip>
            }
            >
                <button 
                    className='attack-turn'
                    id={id}
                    onClick={action}>
                        {skillName} 
                </button>
            </OverlayTrigger>
        )
    }

// Conditionally renders based on the availability of Phantom Assault. phantomCD is state that increments by 1 within the Battle# Component.
// phantomCD updates at the end of each Round and becomes available for use at 4.
    function phantomAvailable() {
        if (phantomCD === 4 ) {
            return (
            overlayTooltipAndAction(rogPhantomAssault, 'Phantom Assault', 'phantom-assault', 'Deals 21-36 damage. \n Cooldown: 4 Rounds \n Hit Bonus: +11')
            )
        } else {
            return <button
            className='attack'
            id='third-action'>
                Phantom Assault
        </button>
        }
    }
    

// Conditionally renders the Rogue UI for when it is or not the Rogue's turn.
    function renderActions() {
        if (rogTurn === 1) {
            return (
                <div className='attack-box' >
                {overlayTooltipAndAction(rogAttack,'Attack','', 'Deals 9-19 damage. \n Hit Bonus: +6')}
                {overlayTooltipAndAction(rogVenomStrike, 'Venomous Strike', 'venom-strike', 'Deals 4-9 damage. \n Applies Poison for 3 Rounds. (5-8 damage at the end of each Round) \n Hit Bonus: +6')}
                {phantomAvailable()}
                </div>
               
                )
        } else {
            return (
                <div>
                <button 
                    className='attack'>
                        Attack
                </button>
                <button
                    className='attack'
                    id='second-action'>
                        Venomous Strike
                </button>
                <button
                    className='attack'
                    id='third-action'>
                        Phantom Assault
                </button>
                </div>
                )
        }
    }

// Render potion available and tooltip.
    function renderPotionAndTooltip () {
        if (rogTurn === 1) {
            return (
                <OverlayTrigger
                    placement="bottom"
                    delay={{show: 600, hide: 70}}
                    overlay={
                        <Tooltip id="potion-tooltip">
                            {"Restores 15-20 HP. \n Can only be used once per character's turn. \n Does not end Turn."}
                        </Tooltip>
            }
            >
                <img 
                    className='healing-potion-rog'
                    src={potionStatus()}
                    alt='healing-potion'
                    onClick={drinkPotion}
                />
            </OverlayTrigger>
            )
        } else {
            return (
                <img 
                    className='healing-potion-rog'
                    src={potionStatus()}
                    alt='healing-potion'
                    onClick={drinkPotion}
                />
            )
        }
        
    }

// Changes Rogue UI class based on turn value to allow players to use Rogue actions.
// When no longer Rogue's turn, actions go gray and are not usable. 
function className() {
    if (rogTurn === 1) {
        return 'characterUI-turn'
    } else {
        return 'characterUI'
    }
}

    return (
        <div className={className()}>
            
            <img 
            className='character-pics'
            src={rogueStatus()}
            alt='rogue pic'
            />
            {renderPotionAndTooltip()}
            <h1 className='potion-amount-rog'>{potionAmount}</h1>
            <img 
            className='rogue-ac'
            src={rogueac}
            alt='rogue shield'
            />
            <div className='character-hp'>HP: {rogueHealth}/41</div>
            <ProgressBar variant={progressBarClass()} animated id='character-healthbar' now={healthBar} />
            <ProgressBar variant='warning' animated id='phantom-cooldown-bar' now={cooldownBar} />
            {renderActions()}
            <img 
            className='char-name'
            src={iris}
            alt='iris'
            />
            
            <div id='popup-box-rog'></div>
        </div>
    )

}

export default RogueUI