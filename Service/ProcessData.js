const Route = require('../Controller/Route')
const maintainConnection = require('./CollectData')
const month = require('../Cron/Timing')
const BUG = "bug"  
const FISH  = "fish" 
const bank = require('../FlashData/Bank')


let respondToTwitch = (Twitch_Payload) =>{
    maintainConnection.publicConnection.action(Twitch_Payload.channel, Twitch_Payload.message)
}

exports.CBJoinChannel = (username) => {
    maintainConnection.publicConnection.join(username)
}

exports.sendMessageToTwitchUponInvite = (username) => {
    respondToTwitch({channel: `#${username.toLowerCase()}`, message : `${username}, you have added CrossingBot to your channel! Head back to the CrossingBot website on your browser! ${addFlower()}`})
}

exports.applyNewCrossingBotSettingForUsers = (callback) => {
    bank.supplyBankWithAddedUsers(callback)
}
 
exports.setCBForUser = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username, "added" : Twitch_Data.added } 
    let Twitch_Payload = (response) => { 
        let CBAS_Data = null
        let message = ""
        if (Twitch_Data.added == true){
            message = `${Twitch_Data.username}, you have added crossingbot_ to your channel! ${addFlower()}` 
        }else if (Twitch_Data.added == false){
            message = `${Twitch_Data.username}, you have queued to remove crossingbot_ to your channel. It will be gone from your channel within 10 minutes or less ${addFlower()}` 
        }else
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
    Route.mutateAddCBforUser(CBAS_Payload, Twitch_Payload)
}

exports.bellsRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username } 
    let Twitch_Payload = (response) => { 
        let CBAS_Data = null
        let message = ""
        if (response != null){
            CBAS_Data = response.getUser
            message = `${CBAS_Data.username}, you have ${CBAS_Data.bells} bells! ${addFlower()}` 
        }else
            message = `${Twitch_Data.username}, try !bug or !fish first. ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
    Route.queryUserBells(CBAS_Payload, Twitch_Payload)
}

exports.turnipsStatsRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username} 
    let Twitch_Payload = (response) => { 
        let CBAS_Data = null
        let message = ""
        if (response != null){
            CBAS_Data = response.getUser.liveTurnips
            let turnipsPlural = (CBAS_Data.quantity > 1 || CBAS_Data.quantity == 0) ? "turnips" : "turnip"
            if(CBAS_Data.quantity != 0){
                let change = ""
                if(CBAS_Data.netGainLossAsBells == 0) change = `haven't changed in value`
                else if (CBAS_Data.netGainLossAsBells > 0) change = `increased in value by ${CBAS_Data.netGainLossAsBells} bells at a rate of ${CBAS_Data.netGainLossAsPercentage}%` 
                else change = `decreased in value by ${CBAS_Data.netGainLossAsBells} bells at a rate of ${CBAS_Data.netGainLossAsPercentage}%`
                message = `${Twitch_Data.username}, you have ${CBAS_Data.quantity} ${turnipsPlural}! So far your ${turnipsPlural} have ${change} ${addFlower()}` 
            }else{
                message = `${Twitch_Data.username}, you have 0 ${turnipsPlural}! ${addFlower()}` 
            }
        }else
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
    Route.queryTurnipStatsRequest(CBAS_Payload, Twitch_Payload)
}

exports.catchRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username, "species" : Twitch_Data.species } 
    if(!Twitch_Data.failure){
        let Twitch_Payload = (response) => { 
            let CBAS_Data = response
            let message = ""
            if(CBAS_Data == "BugOverflow"){
                message = `${Twitch_Data.username}, you already have 10 bugs! Try selling some! ${addFlower()}`
            }else if(CBAS_Data == "FishOverflow"){
                message = `${Twitch_Data.username}, you already have 10 fishes! Try selling some! ${addFlower()}`
            }else if(CBAS_Data.name != null){
                message = `${Twitch_Data.username} caught a ${CBAS_Data.name}, worth ${CBAS_Data.bells} bells! ${appraisal(CBAS_Data.rarity)} ${addFlower()}`
            }else{
                message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
            }
            respondToTwitch({
                "channel" : Twitch_Data.channel, 
                message
            })
        }
        Route.mutateUserPocketCatch(CBAS_Payload, Twitch_Payload)  

    }else{
        let message = `${Twitch_Data.username}, ${Twitch_Data.error} ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }

} 

exports.pocketRequest = (Twitch_Data) => {
    CBAS_Payload = {"username" : Twitch_Data.username}
    let Twitch_Payload = (response) => { 
        let CBAS_Data = null
        let message = ""
        if (response != null){
            CBAS_Data = response.getUser
            var bugList = CBAS_Data.pocket.bug 
            var fishList = CBAS_Data.pocket.fish
            if((bugList.length + fishList.length) > 0){
                pluralBug = bugList.length > 1 ? "bugs" : "bug"
                pluralFish = fishList.length > 1 ? "fishes" : "fish"
                addAlso = bugList.length == 0 ? "" : "Also, "
                messagepart1 = `${CBAS_Data.username}, `
                messagepart2 =  bugList.length > 0 ? `you have ${bugList.length} ${pluralBug}: ${bugList.map(bug => bug.name).join(", ")}. ` : ""
                messagepart3 =  fishList.length > 0 ? `${addAlso}you have ${fishList.length} ${pluralFish}: ${fishList.map(fish => fish.name).join(", ")}. ` : ""
                message = `${messagepart1}${messagepart2}${messagepart3}${addFlower()}`
            }else{
                message = `${CBAS_Data.username}, you dont have anything in your pocket! ${addFlower()}`
            } 
        }else{
            message = `${Twitch_Data.username}, try !bug or !fish first. ${addFlower()}`
        }    
        respondToTwitch({
            "channel" : Twitch_Data.channel, 
            message
        })
    }
    Route.queryUserPocket(CBAS_Payload, Twitch_Payload)  
}

exports.creatureRequest = (Twitch_Data) => {
    if(!Twitch_Data.failure){
        let CBAS_Payload = { "species" : Twitch_Data.species, "creatureName" : Twitch_Data.creatureName } 
        let Twitch_Payload = (response) => { 
            let CBAS_Data = null
            if(Twitch_Data.species == BUG){
                CBAS_Data = response.getBugByName
            }else if(Twitch_Data.species == FISH){
                CBAS_Data = response.getFishByName
            }
            let message = ""
            if (CBAS_Data != null){
                message = `${Twitch_Data.username}, The ${CBAS_Data.name} is worth ${CBAS_Data.bells} bells and it has a rarity of lvl ${CBAS_Data.rarity}. It is available during these following months: ${CBAS_Data.availability.join(" ")}`
            }else{
                message = `${Twitch_Data.username}, Thats neither a known bug or a fish ${addFlower()}`
            }
            respondToTwitch({
                channel : Twitch_Data.channel,
                message
            })
            
        }
        Route.queryCreature(CBAS_Payload, Twitch_Payload)
    }else{
        let message = `${Twitch_Data.username}, ${Twitch_Data.error} ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
}

exports.sellOneRequest = (Twitch_Data) => {
    if(!Twitch_Data.failure){
        console.log("sellOneRequest",Twitch_Data)

        let CBAS_Payload = { "username" : Twitch_Data.username, "species" : Twitch_Data.species, "creatureName" : Twitch_Data.creatureName } 
        let Twitch_Payload = (response) => { 
            let CBAS_Data = null
            let message = ""

            if(response != null){
                CBAS_Data = response.sellOneCreature
                console.log("CHECK", CBAS_Data)
                if(CBAS_Data > 0){
                    message = `${Twitch_Data.username}, you sold the ${Twitch_Data.creatureName} for ${CBAS_Data}! ${addFlower()}`
                }else{
                    message = `${Twitch_Data.username}, you do not have that ${Twitch_Data.species} ${addFlower()}`
                }
            }else{
                message = `${Twitch_Data.username}, try !bug or !fish first. ${addFlower()}`
            }
            respondToTwitch({
                channel : Twitch_Data.channel,
                message
            })
        }
        Route.mutateUserPocketSellOne(CBAS_Payload, Twitch_Payload)
    }else{
        let message = `${Twitch_Data.username}, ${Twitch_Data.error} ${addFlower()}`
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }    
}

exports.sellAllRequest = (Twitch_Data) => {
    let CBAS_Payload = { "username" : Twitch_Data.username }
    let Twitch_Payload = (response) => { 
        let CBAS_Data = null
        let message = ""
        if(response != null){
            CBAS_Data = response.sellAllCreatures
            message = `${Twitch_Data.username}, you sold everything for ${CBAS_Data}! ${addFlower()}`
        }else{
            message = `${Twitch_Data.username}, you do not have anything to sell ${addFlower()}`
        }
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
    }
    Route.mutateUserPocketSellAll(CBAS_Payload, Twitch_Payload)
}


exports.rareCreaturesRequest = (Twitch_Data) => {
    let CBAS_Payload = {"species" : Twitch_Data.species }
    let Twitch_Payload = (response) => { 
        let CBAS_Data = null
        let message = ""
        if(response != null){
            if(CBAS_Payload.species == BUG){
                CBAS_Data = response.getAllRareBugsByMonth
            }else if(CBAS_Payload.species == FISH){
                CBAS_Data = response.getAllRareFishesByMonth
            }
            let pluaralSpecies = CBAS_Payload.species == BUG ? "bugs" : "fishes"
            let messagePart1 = `${Twitch_Data.username}, `
            let messagePart2A = `there are no rare ${pluaralSpecies} in ${month.friendly} ${addFlower()}`
            let messagePart2B = `here are some super rare ${pluaralSpecies} for ${month.friendly} : ${CBAS_Data.map(creature => " "+creature.name )} ${addFlower()}`
            message = `${Twitch_Data.username}, ${CBAS_Data.length == 0 ? messagePart2A : messagePart2B}` 
        }else{
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        }
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
        
    }
    Route.queryRareCreatures(CBAS_Payload, Twitch_Payload)
}


exports.validatingTurnipTransactionRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username, "business" : Twitch_Data.business, "quantity" : Twitch_Data.quantity}
    let Twitch_Payload = (response) => { 
        let message = ""
        if(response != null){
            let CBAS_Data = response.validatePendingTransaction
            let turnipsPlural = Twitch_Data.quantity > 1 ? "turnips" : "turnip"
            let status = CBAS_Data.status.split("-")[0].toLowerCase(0).trim()
            if(status == "authorized"){
                message = `${Twitch_Data.username}, you are ${status} to ${CBAS_Data.business} ${CBAS_Data.quantity} ${turnipsPlural} at a market price of ${CBAS_Data.marketPrice} bells for a total of ${CBAS_Data.totalBells} bells. Please enter !confirm to acknowledge or !cancel ${addFlower()}`
                bank.updateUserInPendingTransactionDictionary(Twitch_Data.username, CBAS_Data.marketPrice, CBAS_Data.totalBells)

            }else if(status == "unauthorized"){
                let reason = CBAS_Data.status.split("-")[1].toLowerCase(0).trim()
                message = `${Twitch_Data.username}, you are ${status} to ${CBAS_Data.business} ${CBAS_Data.quantity} ${turnipsPlural} at a market price of ${CBAS_Data.marketPrice} bells for a total of ${CBAS_Data.totalBells} bells. You have ${reason} ${addFlower()}`
                bank.deleteUserFromPendingTransactionDictionary(Twitch_Data.username)
            }
        }else{
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        }
        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
        
    }
    
    Route.queryUserTurnipTransactionStatus(CBAS_Payload, Twitch_Payload)

}

exports.acknowledgingTurnipTransactionRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username, "business" : Twitch_Data.business, "quantity" : Twitch_Data.quantity,  "marketPrice" : Twitch_Data.marketPrice, "totalBells" : Twitch_Data.totalBells }
    let Twitch_Payload = (response) => { 

        if(response != null){
            let businessPastTense = Twitch_Data.business == "buy" ? "bought"  : "sold"
            let turnipsPlural = Twitch_Data.quantity > 1 ? "turnips" : "turnip"
            message = `${Twitch_Data.username}, you ${businessPastTense} ${Twitch_Data.quantity} ${turnipsPlural}! ${addFlower()}`
        }else{
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        }

        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
        
    }
    
    Route.mutateUserTurnipTransactionStatus(CBAS_Payload, Twitch_Payload)
}


exports.rejectingTurnipTransactionRequest = (Twitch_Data) => {
    respondToTwitch({
        channel : Twitch_Data.channel,
        message : `${Twitch_Data.username}, you have cancelled your transaction`
    })
}

exports.marketPriceRequest = (Twitch_Data) => {
    let CBAS_Payload = {"username" : Twitch_Data.username}
    let Twitch_Payload = (response) => { 
        let message = ""
        if(response != null){
            message = `${Twitch_Data.username}, the market price of a turnip is ${response.getTurnipPrices} bells ${addFlower()}`
        }else{
            message = `Hey ${Twitch_Data.channel.split("#")[1]}, something went wrong with CrossingBot. Please contact MuteBard ${addFlower()}`
        }

        respondToTwitch({
            channel : Twitch_Data.channel,
            message
        })
        
    }

    Route.queryMarketPrice(Twitch_Payload)

}

let toggle = false

let addFlower = () => {
    toggle = !toggle
    if(toggle) return "❀" 
    else return "✿"
} 

let appraisal = (rarity) => {
    if (rarity == 5) return "YOU ARE EXTREMELY LUCKY! OSFrog"
    else if (rarity == 4) return "Nice! That one is very rare!" 
    else if (rarity == 3) return "That one is a bit rare!"
    else return ""
}