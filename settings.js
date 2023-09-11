//make a sheetdb.io account
//click create new
//copy api key 
//paste it below inside of the SHEETDB_API_KEY
// this is not secure any one can use this api key and add any value to the sheet with this api key
const SHEETDB_API_KEY="n4nkpul3wanp1";

//in the top row of your new spreadsheet api put in cell A1 "name" and in cell B1 "score"

//create a new sheet 
//put the name of the Sheet below i.e.
//const SHEETDB_LEADERBOARD_SHEET="Sheet2";

const SHEETDB_LEADERBOARD_SHEET="Sheet2";

//in the top row of your second spreadsheet put in cell A1 "email" and in cell B1 "high"
//high is for the high score of that particular user
//email is for the name of that user
//write some function or make a pivot table to get the high scores of between the top 5 till top 30 high scores
//then take that data and put it into the Leader board sheet show that it can auto update


// setting for haw many seconds till the high scores cache gets updated
//please not this is per user so the leader board can look very different for different users
//it caches it because SheetDB has a limit for free accounts per month so depending on how often this is used or if you have a payed account you can change this to be real time
//to see changes user must refresh page
const MINUTES = 1000 * 60;
const HOURS = MINUTES * 60;
const SECONDS_TILL_NEXT_REFRESH_SCORE=HOURS*24 //default 24 hours