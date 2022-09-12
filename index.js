const express = require('express');
const {google} = require("googleapis");
require('dotenv').config();

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

app.get("/", (req,res)=> {
    res.render("index");
})

app.post("/", async (req,res) => {

    const {request, name} = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })

    const spreadsheetId = process.env.GSHEET;

    //Create client instance for auth
    const client = await auth.getClient();

    //Instance of Google Sheets API
    const googleSheets = google.sheets({version:"v4", auth: client});

    //Get metadata about spreadsheet
    const metadata = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    })

    //Get rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1"
    })

    //Write row(s) to spreadsheet
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!A:B",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [[request, name]]
        }
    })

    res.send("Successfully Submitted! Thank you!");
});

app.listen(3000, (req,res) => console.log("running on 3000"));