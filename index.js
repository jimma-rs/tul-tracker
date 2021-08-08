const express = require('express')
const {google} = require('googleapis');
var favicon = require('serve-favicon');

const TOTAL_ROW = 1;
const WANDS_ROW = 3;
const LEATHER_ROW = 4;
const AMULET_ROW = 5;
const ESCAPE_ROW = 6;

const TOTAL_COLUMN = 1;
const PERCENTAGE_COLUMN = 2;
const ODDS_COLUMN = 3;

//initialize express
const app = express()
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(favicon(__dirname + '/public/images/favicon.ico'));
//set up template engine to render html files
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// index route
app.get('/', async (request, response) => {

    const auth = new google.auth.GoogleAuth({
        keyFile: "google-credentials.json", //the key file
        //url to spreadsheets API
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //Auth client Object
    const authClientObject = await auth.getClient();

    //Google sheets instance
    const googleSheetsInstance = google.sheets({version: "v4", auth: authClientObject});

    // spreadsheet id
    const spreadsheetId = "1UOqY3svsaCnVSdmIZjUyPTvK1vwF7N9qky_QXizFGPo";

    // Get metadata about spreadsheet
    const sheetInfo = await googleSheetsInstance.spreadsheets.get({
        auth,
        spreadsheetId,
    });

    //Read from the spreadsheet
    const readData = await googleSheetsInstance.spreadsheets.values.get({
        auth, //auth object
        spreadsheetId, // spreadsheet id
        range: "Sheet2!A:D", //range of cells to read from.
    });
    let spreadsheetValues = readData.data.values;

    let totalStones = spreadsheetValues[TOTAL_ROW][TOTAL_COLUMN];
    let wands = {total:spreadsheetValues[WANDS_ROW][TOTAL_COLUMN], percent:spreadsheetValues[WANDS_ROW][PERCENTAGE_COLUMN], odds:spreadsheetValues[WANDS_ROW][ODDS_COLUMN]};
    let amulet = {total:spreadsheetValues[LEATHER_ROW][TOTAL_COLUMN], percent:spreadsheetValues[LEATHER_ROW][PERCENTAGE_COLUMN], odds:spreadsheetValues[LEATHER_ROW][ODDS_COLUMN]};
    let leather = {total:spreadsheetValues[AMULET_ROW][TOTAL_COLUMN], percent:spreadsheetValues[AMULET_ROW][PERCENTAGE_COLUMN], odds:spreadsheetValues[AMULET_ROW][ODDS_COLUMN]};
    let escape = {total:spreadsheetValues[ESCAPE_ROW][TOTAL_COLUMN], percent:spreadsheetValues[ESCAPE_ROW][PERCENTAGE_COLUMN], odds:spreadsheetValues[ESCAPE_ROW][ODDS_COLUMN]};
    response.render('index', {totalStones: totalStones, wands:wands, leather:leather, amulet:amulet, escape:escape});
})

const PORT = process.env.PORT || 5000;

//start server
const server = app.listen(PORT, () => {
    console.log(`Server started on port localhost:${PORT}`);
});