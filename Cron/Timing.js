const CronJob = require('cron').CronJob
let minutes = (minutes) => 1000 * 60 * minutes
let hours = (hours) => 1000 * 60 * 60 * hours
let currentMonth = () => {
        let monthNum = (new Date()).getMonth()
        switch(monthNum){
            case 0 : 
                return "JAN";
                break;
            case 1 : 
                return "FEB";
                break;
            case 2 : 
                return "MAR";
                break;
            case 3 : 
                return "APR";
                break;
            case 4 : 
                return "MAY";
                break;
            case 5 : 
                return "JUN";
                break;
            case 6 : 
                return "JUL";
                break;
            case 7 : 
                return "AUG";
                break;
            case 8 : 
                return "SEP";
                break;
            case 9 : 
                return "OCT";
                break;
            case 10 : 
                return "NOV";
                break;
            case 11 : 
                return "DEC";
        }
    }
    
    let userFriendlyMonth = (month) => {
        switch(month){
            case "JAN" : 
                return "January";
                break;
            case "FEB" : 
                return "Feburary";
                break;
            case "MAR" : 
                return "March";
                break;
            case "APR" : 
                return "April";
                break;
            case "MAY" : 
                return "May";
                break;
            case "JUN" : 
                return "June";
                break;
            case "JUL" : 
                return "July";
                break;
            case "AUG" : 
                return "August";
                break;
            case "SEPT" : 
                return "September";
                break;
            case "OCT" : 
                return "October";
                break;
            case "NOV" : 
                return "November";
                break;
            case "DEC" : 
                return "December";
        }
    }
    
    let month = currentMonth()
    let job = new CronJob('0 0 1 * *', () => {
        month = currentMonth()
      }, null, true, 'America/Los_Angeles');
    job.start();

module.exports.minutes = minutes
module.exports.hours = hours
module.exports.friendly =  userFriendlyMonth(month)
module.exports.month = "[\""+month+"\"]"