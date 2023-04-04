require("dotenv").config();
const {google} = require('googleapis');
const { Client, GatewayIntentBits, Collection} = require("discord.js")
const CHANNEL_ID = '1089570859775172680';
// Define a client
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

// Define command of client likes Object Collection
client.command = new Collection();

// Require handlers
["event", "command"].forEach( file => require(`./handlers/${file}`)(client));


// Login with TOKEN
client.login(process.env.TOKEN);

// Notice CTF

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


let dTime = new Date();
let month = dTime.getMonth() + 1;
if (month < 10) {
    month = `0${month}`;
}
let start = `${dTime.getFullYear()}-${month}-01T00:00:00.000Z`;
let end = `${dTime.getFullYear()}-${month}-31T00:00:00.000Z`;




function sendNotification() {
    getEvents(start, end)
    .then((res) => {
        let contents = "";

        res.forEach((obj) => {
            if(obj["start"]["dateTime"].split('T')[0].split('-')[2] - dTime.getDate() > 0 && obj["start"]["dateTime"].split('T')[0].split('-')[2] - dTime.getDate() < 2) {
                
                // Name
                let nameCTF = obj["summary"];

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

                contents += `\n**${nameCTF}**\n**Thời gian:** ${hStart}, Ngày ${dStart} Tháng ${mStart} Năm ${yStart} \n\t\t Đến: ${hEnd}, Ngày ${dEnd} Tháng ${mEnd} Năm ${yEnd}\n`              
                
            }
        })
        const channel = client.channels.cache.get(CHANNEL_ID);
        if(contents != "") {
            channel.send(`***Nhớ tham gia giải:***${contents}`);
        }
    })
    .catch((err) => {
        console.log(err);
    });
}


client.on('ready', () => {
    setInterval(sendNotification, 24*60*60*1000); // send notification every 24 hour
});



