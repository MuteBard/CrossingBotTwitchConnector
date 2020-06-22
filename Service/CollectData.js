const tmi = require('tmi.js');

const options = require('../Configurations/Options')
const bank = require('../FlashData/Bank')
const process = require('./processData')
const minutes = require('../Cron/Timing').minutes
const duration = minutes(10)
const BUG = "bug"
const FISH  = "fish"


let startBot = () => {
    bank.supplyBankWithAddedUsers(setOptionsForConnection)
    bank.supplyBankWithCreatures()
}


let setOptionsForConnection = () => {
    options.settings_A["channels"] = bank.usernames
    var publicConnection = new tmi.Client(options.settings_A);  
    module.exports.publicConnection = publicConnection
    connectToTwitch(publicConnection)  
}

let connectToTwitch = (publicConnection) => {
        
    var responseDictionary
    var creatureDictionary = {}
    var pendingTurnipTransactionDictionary = {}
    var timeDictionary = {}

    
    setTimeout(() => {
        publicConnection.disconnect().then(() => {
        console.log("Reconnecting, updating list of users that want CrossingBot added to their channels")
        process.applyNewCrossingBotSettingForUsers(setOptionsForConnection) 
        })  
    }, duration)


    publicConnection.connect().then(() => {
        publicConnection.on('chat', (channel, userstate, message, self) => {
            const CBTC_DataBank = require('../FlashData/Bank')
            
            creatureDictionary = createCreatureDictionary(CBTC_DataBank.bugBank, CBTC_DataBank.fishBank)
        
            let Twitch_Data = {
                channel : channel,
                username : userstate["display-name"],
                isStreamer : channel.substring(1) == userstate["display-name"].toLowerCase(),
                failure : false
            }
    
            let command = message.toLowerCase().trim()
   

            if(command == "!invite" && Twitch_Data["isStreamer"]){
                bank.addInvitedUser(Twitch_Data["username"])
            }
            
            if(command == "+crossingbot"){
                Twitch_Data["added"] = true
                publicConnection.join(username)
                process.setCBForUser(Twitch_Data)
            }
    
            if(command == "-crossingbot"){
                Twitch_Data["added"] = false
                process.setCBForUser(Twitch_Data)
            }
    
            if(command == "!bells"){
                process.bellsRequest(Twitch_Data)
            }
        
            else if(command == "!pocket"){
                process.pocketRequest(Twitch_Data)
            }
        
            else if(command == "!turnips"){
                process.turnipsStatsRequest(Twitch_Data)
            }
        
            else if(command == "!bug"){ 
    
                Twitch_Data["species"] = BUG
                Twitch_Data["time"] =  { bugTime : parseInt(new Date().getTime() / 1000)}
                let username = Twitch_Data["username"]
                
                if(timeDictionary[username] == undefined){
                    timeDictionary[username] = Twitch_Data["time"];
                }else if(timeDictionary[username].bugTime == undefined || Twitch_Data["time"] - timeDictionary[username].bugTime > 60){
                    timeDictionary[username] = Object.assign(timeDictionary[username], Twitch_Data["time"]);
                }else{
                    Twitch_Data["failure"] = true
                    Twitch_Data["error"] = `There is still ${60 - (Twitch_Data["time"].bugTime - timeDictionary[username].bugTime)} seconds until you can catch another bug`
                }
                process.catchRequest(Twitch_Data)
            }
        
            else if(command == "!fish"){
    
                Twitch_Data["species"] = FISH
                Twitch_Data["time"] =  { fishTime : parseInt(new Date().getTime() / 1000)}
                let username = Twitch_Data["username"]
    
                if(timeDictionary[username] == undefined){
                    timeDictionary[username] = Twitch_Data["time"];
                }else if(timeDictionary[username].fishTime == undefined || Twitch_Data["time"] - timeDictionary[username].fishTime > 60){
                    timeDictionary[username] = Object.assign(timeDictionary[username], Twitch_Data["time"]);
                }else{
                    Twitch_Data["failure"] = true
                    Twitch_Data["error"] = `There is still ${60 - (Twitch_Data["time"].fishTime - timeDictionary[username].fishTime)} seconds until you can catch another fish`
                }
    
                process.catchRequest(Twitch_Data)
            }
        
            else if(command == "!rare bugs"){
                Twitch_Data["species"] = BUG 
                process.rareCreaturesRequest(Twitch_Data)
            }
        
            else if(command == "!rare fishes"){
                Twitch_Data["species"] = FISH
                process.rareCreaturesRequest(Twitch_Data)
            }
        
            else if(command.includes("!search")){
                let creatureName = properlyCaseCreatureName(command)
                if(isCreatureNameValid(creatureName, creatureDictionary)){
                    Twitch_Data["creatureName"] = creatureName
                    Twitch_Data["species"] = getCreatureSpecies(creatureName, creatureDictionary)
                }else{
                    Twitch_Data["failure"] = true
                    Twitch_Data["error"] = "Thats neither a known bug or a fish"
                }
                process.creatureRequest(Twitch_Data)
            }
        
            else if((command.includes("!buy") || command.includes("!sell")) && (command.includes("turnip")) || command.includes("turnips")){
                Twitch_Data = validateTurnipTransactionInput(Twitch_Data, command)
                if( Twitch_Data["failure"] == false){
                    pendingTurnipTransactionDictionary[Twitch_Data["username"]] = {"business" : Twitch_Data["business"], "quantity" : Twitch_Data["quantity"]}
                    bank.supplyPendingTurnipTransactionDictionary(pendingTurnipTransactionDictionary)
                }
                module.exports.pendingTurnipTransactionDictionary = pendingTurnipTransactionDictionary
                process.validatingTurnipTransactionRequest(Twitch_Data)
        
            }
        
            else if(command == "!cancel" || command == "!confirm" && bank.retrivePendingTurnipTransactionDictionary().hasOwnProperty(Twitch_Data["username"])){
                if (command == "!confirm"){
                    let authorizedTransaction = bank.retrivePendingTurnipTransactionDictionary()
                    Twitch_Data["business"] = authorizedTransaction[Twitch_Data["username"]]["business"]
                    Twitch_Data["quantity"] = Number(authorizedTransaction[Twitch_Data["username"]]["quantity"])
                    Twitch_Data["marketPrice"] = authorizedTransaction[Twitch_Data["username"]]["marketPrice"]
                    Twitch_Data["totalBells"] = authorizedTransaction[Twitch_Data["username"]]["totalBells"]
                    process.acknowledgingTurnipTransactionRequest(Twitch_Data)
                }else if(command == "!cancel"){
                    process.rejectingTurnipTransactionRequest(Twitch_Data)
                }
                bank.deleteUserFromPendingTransactionDictionary(Twitch_Data["username"])
            }
        
            else if(command == "!market"){
                process.marketPriceRequest(Twitch_Data)
            }
        
            else if(command.includes("!sell") && !command.includes("all")){
                let creatureName = properlyCaseCreatureName(command)
                console.log(creatureName)
                if(isCreatureNameValid(creatureName, creatureDictionary)){
                    Twitch_Data["creatureName"] = creatureName
                    Twitch_Data["species"] = getCreatureSpecies(creatureName, creatureDictionary)
                }else{
                    Twitch_Data["failure"] = true
                    Twitch_Data["error"] = "Thats neither a known bug or a fish"
                }
                process.sellOneRequest(Twitch_Data)
            }
        
            else if(command == "!sell all" ){
                process.sellAllRequest(Twitch_Data)
            }
        });
    })

    
    let properlyCaseCreatureName = (command) => {
        let commandAsListOfWords = command.trim().split(" ").map(word => word.substring(0,1).toUpperCase() + word.substring(1)+" ")
        let creatureNameProperlyCased = commandAsListOfWords.filter((word, idx) => idx > 0).join("").trim()
        let creatureHyphensAddressed = creatureNameProperlyCased.split("-").map( word => word.substring(0,1).toUpperCase() + word.substring(1)).join("-").trim()
        return creatureHyphensAddressed
    }
    
    let createCreatureDictionary = (bugList, fishList) => {
        let creatureList = bugList.concat(fishList)
        let dictionary = {}
        creatureList.map(creature => dictionary[creature.name] = creature.species )
        return dictionary
    }

    let isCreatureNameValid = (creatureName, creatureDictionary ) => {
        return (creatureDictionary[creatureName] == "bug" || creatureDictionary[creatureName] == "fish")
    }

    let getCreatureSpecies = (creatureName, creatureDictionary ) => {
        return creatureDictionary[creatureName]
    }
    
    let validateTurnipTransactionInput = (Twitch_Data, command) => {
        commandAsList = command.trim().split(" ")
        if(commandAsList.length == 3){
    
            if(commandAsList[0] == "!buy" || commandAsList[0] == "!sell"){
                Twitch_Data["business"] = commandAsList[0].split("!")[1]
            }else{
                Twitch_Data["failure"] = true
                Twitch_Data["error"] = "!buy or !sell should be written first"
                return Twitch_Data
            }
    
            if(!isNaN(commandAsList[1])){
                if(commandAsList[1] > 0){
                    Twitch_Data["quantity"] = commandAsList[1]
                }else{
                    Twitch_Data["failure"] = true
                    Twitch_Data["error"] = "Only numbers 1 and greater are allowed"
                    return Twitch_Data
                }
            }else{
                Twitch_Data["failure"] = true
                Twitch_Data["error"] = "You need to enter a number"
            }
    
            if(commandAsList[2] != "turnip" && commandAsList[2] != "turnips"){
                Twitch_Data["failure"] = true
                Twitch_Data["error"] = "Make sure turnip or turnips is spelled correctly"
                return Twitch_Data
            }
    
            return Twitch_Data
        }
    }   
}


module.exports.startBot = startBot


