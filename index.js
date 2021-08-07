const express = require('express')
const {google} = require('googleapis');
var favicon = require('serve-favicon');

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
    let totalStones = spreadsheetValues[1][1];
    let wands = {total:spreadsheetValues[3][1], percent:spreadsheetValues[3][2], odds:spreadsheetValues[3][3]};
    let leather = {total:spreadsheetValues[5][1], percent:spreadsheetValues[5][2], odds:spreadsheetValues[5][3]};
    let amulet = {total:spreadsheetValues[4][1], percent:spreadsheetValues[4][2], odds:spreadsheetValues[4][3]};
    let escape = {total:spreadsheetValues[6][1], percent:spreadsheetValues[6][2], odds:spreadsheetValues[6][3]};
    response.render('index', {totalStones: totalStones, wands:wands, leather:leather, amulet:amulet, escape:escape});
})

const PORT = process.env.PORT || 5000;

//start server
const server = app.listen(PORT, () => {
    console.log(`Server started on port localhost:${PORT}`);
});