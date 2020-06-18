const CURRENT_MONTH = require('../Cron/Timing').month

let USER_BELLS_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        bells
    }
}`

let USER_EXISTS_REQUEST = (username) => 
`query{
    getDoesUserExist(username:${"\""+username+"\""})
}`

let USER_PW_EXISTS_REQUEST = (username) => 
`query{
    getUser(username:${"\""+username+"\""}){
        encryptedPw 
        id
        avatar
    }
}`

let USER_TURNIP_STATS_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        liveTurnips{
            quantity
            netGainLossAsBells
            netGainLossAsPercentage
        }
    }
}`

let USER_BUG_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        id
        username
        pocket{
            bug{
                name
                bells
            }
        }
    }
}`

let USER_FISH_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        id
        username
        pocket{
            fish{
                name
                bells
            }
        }
    }
}`

let USER_POCKET_REQUEST = (username) =>
`query{
    getUser(username:${"\""+username+"\""}){
        username
        pocket{
            bug{
                name
                bells
            }
            fish{
                name
                bells
            }
        }
    }
}`

const DAY_RECORD =
`query{
    getDayRecords(){
        latestTurnipPrice
        todayHigh
        todayLow
        turnipPriceHistory
    }
}`

const MONTH_RECORD =
`query{
    getMonthRecords(){
        latestTurnipPrice
        todayHigh
        todayLow
        turnipPriceHistory
    }
}`

const TURNIP_PRICES =
`query{
    getTurnipPrices(dummy : true)
}`

let BUG_BY_NAME = (creatureName) =>
`query{
    getBugByName(name : ${"\""+creatureName+"\""}){
        name
        bells
        availability
        rarity
    }
}
`

let FISH_BY_NAME = (creatureName) =>
`query{
    getFishByName(name : ${"\""+creatureName+"\""}){
        name
        bells
        availability
        rarity
    }
}
`

let CREATURE_SUMMARY_BY_NAME = (creatureName) =>
`query{
    getCreatureSummaryByName(name : ${"\""+creatureName+"\""})
}
`

let BUGS_BY_MONTH =
`query{
    getAllBugsByMonth(months : ${CURRENT_MONTH}){
        name
        bells
        rarity
    }
}
`
let FISHES_BY_MONTH =
`query{
    getAllFishesByMonth(months : ${CURRENT_MONTH}){
        name
        bells
        rarity
    }
}
`

let RARE_BUGS_THIS_MONTH =
`query{
    getAllRareBugsByMonth(months: ${CURRENT_MONTH}){
        name
    }
  }
`

let RARE_FISHES_THIS_MONTH =
`query{
    getAllRareFishesByMonth(months : ${CURRENT_MONTH}){
        name
    }
}
`

let VALIDATE_TRANSACTION = (username, business, quantity) =>
`query{
    validatePendingTransaction(username: ${"\""+username+"\""}, business: ${"\""+business+"\""}, quantity: ${quantity}){
        status
        business
        quantity
        marketPrice
        totalBells
    }
}
`


let ALL_BUGS =
`query{
    getAllBugs(){
        name
        species
    }
}
`
let ALL_FISHES =
`query{
    getAllFishes(){
        name
        species
    }
}
`

let ALL_ADDED_USERS =
`query{
	getUsersWithCBAdded(dummy : true){
    username
  }
}  
`

module.exports.USER_BELLS_REQUEST = USER_BELLS_REQUEST
module.exports.USER_TURNIP_STATS_REQUEST = USER_TURNIP_STATS_REQUEST
module.exports.USER_FISH_REQUEST = USER_FISH_REQUEST
module.exports.USER_BUG_REQUEST = USER_BUG_REQUEST
module.exports.USER_POCKET_REQUEST = USER_POCKET_REQUEST
module.exports.DAY_RECORD = DAY_RECORD
module.exports.MONTH_RECORD = MONTH_RECORD
module.exports.TURNIP_PRICES = TURNIP_PRICES
module.exports.BUGS_BY_MONTH = BUGS_BY_MONTH
module.exports.FISHES_BY_MONTH = FISHES_BY_MONTH
module.exports.RARE_BUGS_THIS_MONTH = RARE_BUGS_THIS_MONTH
module.exports.RARE_FISHES_THIS_MONTH = RARE_FISHES_THIS_MONTH
module.exports.VALIDATE_TRANSACTION = VALIDATE_TRANSACTION
module.exports.BUG_BY_NAME = BUG_BY_NAME
module.exports.FISH_BY_NAME = FISH_BY_NAME
module.exports.CREATURE_SUMMARY_BY_NAME = CREATURE_SUMMARY_BY_NAME
module.exports.ALL_BUGS = ALL_BUGS
module.exports.ALL_FISHES = ALL_FISHES
module.exports.ALL_ADDED_USERS = ALL_ADDED_USERS
module.exports.USER_EXISTS_REQUEST = USER_EXISTS_REQUEST
module.exports.USER_PW_EXISTS_REQUEST = USER_PW_EXISTS_REQUEST