const {google} = require('googleapis');
require('dotenv').config();

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Get all the events between two dates
const getEvents = async (dateTimeStart, dateTimeEnd) => {

    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Asia/Ho_Chi_Minh'
        });
    
        let items = response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents --> ${error}`);
        return 0;
    }
};

// Async function fetch rate weights
async function fetchRate(link) {
    let response = await fetch(link);
    let data = await response.text();
    let matchResult = data.match(/Rating weight:\s+(\d+\.\d+)/);
    if (matchResult) {
        let ratingWeight = matchResult[1];
        return ratingWeight;
    } else {
        return 'Rating weight not found';
    }
}

// Async function get contents
async function getContents() {
    // Take two dates between in this month
    let dTime = new Date();
    let month = dTime.getMonth()+1;
    if (month < 10) {
        month = `0${month}`;
    }
    let start = `${dTime.getFullYear()}-${month}-01T00:00:00.000Z`;
    let today = new Date();
    let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    let end = `${dTime.getFullYear()}-${month}-${lastDayOfMonth}T00:00:00.000Z`;

    // get Events from calendar
    var res = await getEvents(start, end)
    var contents = "";

    for (let obj of res) {
        // Name
        let nameCTF = obj["summary"];
        // Rating weight
        let ratingWeight = await fetchRate(obj["description"].split("?q=")[1].split("&")[0]);
        // Time start 
        let hStart = obj["start"]["dateTime"].split('T')[1].split('+')[0];
        let dStart = obj["start"]["dateTime"].split('T')[0].split('-')[2];
        let mStart = obj["start"]["dateTime"].split('T')[0].split('-')[1];
        let yStart = obj["start"]["dateTime"].split('T')[0].split('-')[0];

        //Time end
        let hEnd = obj["end"]["dateTime"].split('T')[1].split('+')[0];
        let dEnd = obj["end"]["dateTime"].split('T')[0].split('-')[2];
        let mEnd = obj["end"]["dateTime"].split('T')[0].split('-')[1];
        let yEnd = obj["end"]["dateTime"].split('T')[0].split('-')[0];

        // console.log(obj["summary"]);
        // console.log(`Thời gian: ${hStart}, Ngày ${dStart} Tháng ${mStart} Năm ${yStart} Đến ${hEnd}, Ngày ${dEnd} Tháng ${mEnd} Năm ${yEnd}`);

        contents += `\n**${nameCTF}**\n**Rating weight:** ${ratingWeight}\n**Thời gian:** ${hStart}, Ngày ${dStart} Tháng ${mStart} Năm ${yStart} \n\t\t  **Đến:** ${hEnd}, Ngày ${dEnd} Tháng ${mEnd} Năm ${yEnd}\n`
    }
    return contents;
}


module.exports = {
    name: "alert",
    description: "Thông báo lịch!",

    run: async (client, interaction) => {
            await interaction.reply('Waiting few minutes!');
            const result = await getContents();
            await interaction.editReply(result);
    }
}