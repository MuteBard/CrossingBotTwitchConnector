const Route = require('../Controller/Route')

var bugBank = []
var fishBank = []
var usernames = []
var invited = []
var pendingTurnipTransactionDictionary = {}


let supplyPendingTurnipTransactionDictionary = (data) => {
    pendingTurnipTransactionDictionary = Object.assign(pendingTurnipTransactionDictionary, data)
}

let retrivePendingTurnipTransactionDictionary = () =>{
    return pendingTurnipTransactionDictionary
}


let deleteUserFromPendingTransactionDictionary = (username) => {
    delete pendingTurnipTransactionDictionary[username]
}

let updateUserInPendingTransactionDictionary = (username, marketPrice, totalBells) => {
    let data = pendingTurnipTransactionDictionary[username]   
    data["marketPrice"] = marketPrice
    data["totalBells"] = totalBells
    let authorizedTurnipTransaction = {}
    authorizedTurnipTransaction[username] = data
    deleteUserFromPendingTransactionDictionary(username)
    supplyPendingTurnipTransactionDictionary(authorizedTurnipTransaction)
}


let supplyBankWithCreatures = () => {
    
    let supplyBankWithBugs = () => {
        let CBTC_DataBank = (response) => {
            try{
                bugBank = response.getAllBugs
                console.log(`Obtained ${bugBank.length} bugs`)
                module.exports.bugBank = bugBank
                supplyBankWithFishes()
            }catch(e){
                console.log(`Obtained 0 bugs, Check GraphQL for issues`)
            }

        }
        Route.queryAllBugs(CBTC_DataBank)
    }
    
    
    let supplyBankWithFishes = () => {
        let CBTC_DataBank = (response) => {
            try{
                fishBank = response.getAllFishes
                console.log(`Obtained ${fishBank.length} fishes`)
                module.exports.fishBank = fishBank            
            }catch(e){
                console.log(`Obtained 0 fishes, Check GraphQL for issues`)
            }

            
        }
        Route.queryAllFishes(CBTC_DataBank)
    }

    supplyBankWithBugs()
} 

let supplyBankWithAddedUsers = (callback) => {
    let CBTC_DataBank = (response) => {
        try{
            usernames = response.getUsersWithCBAdded.map(user => `#${user.username}`)
            console.log(`Obtained ${usernames.length} users with crossingbot added on their channel`)
            module.exports.usernames = usernames 
            if(callback != null){
                callback()
            }
        }catch(e){
            console.log("Something went wrong in getting users: "+e)
        }
    }
    Route.queryAllAddedUsers(CBTC_DataBank)
}

let addInvitedUser = (username) => {
    invited.push(username)
}
let removeInvitedUser = (username) => {
    invited = invited.filter(invitedUser => invitedUser != username)
}
let getInvitedList = () => {
    return invited
}

let hasInvitedUser = (username) => {
    let list = invited.filter(invitedUser => invitedUser == username)
    if (list === undefined || list.length == 0){
        return false
    }else{
        return true
    }
}



module.exports.supplyPendingTurnipTransactionDictionary = supplyPendingTurnipTransactionDictionary
module.exports.retrivePendingTurnipTransactionDictionary = retrivePendingTurnipTransactionDictionary
module.exports.deleteUserFromPendingTransactionDictionary = deleteUserFromPendingTransactionDictionary
module.exports.updateUserInPendingTransactionDictionary = updateUserInPendingTransactionDictionary
module.exports.supplyBankWithCreatures = supplyBankWithCreatures
module.exports.supplyBankWithAddedUsers = supplyBankWithAddedUsers
module.exports.addInvitedUser = addInvitedUser
module.exports.removeInvitedUser = removeInvitedUser
module.exports.getInvitedList = getInvitedList
module.exports.hasInvitedUser = hasInvitedUser
