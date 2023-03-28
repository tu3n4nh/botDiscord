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

// Your TIMEOFFSET Offset
const TIMEOFFSET = '+07:00';

// Get date-time string for calender
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

// let dateTime = dateTimeForCalander();

// Event for Google Calendar
// let event = {
//     'summary': `This is the summary.`,
//     'description': `This is the description.`,
//     'start': {
//         'dateTime': dateTime['start'],
//         'timeZone': 'Asia/Ho_Chi_Minh'
//     },
//     'end': {
//         'dateTime': dateTime['end'],
//         'timeZone': 'Asia/Ho_Chi_Minh'
//     }
// };

// insertEvent(event)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

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
let dateTime = new Date();
let month = dateTime.getMonth() + 1;
if (month < 10) {
    month = `0${month}`;
}
let start = `${dateTime.getFullYear()}-${month}-00T00:00:00.000Z`;
let end = `${dateTime.getFullYear()}-${month}-31T00:00:00.000Z`;

console.log(end.split('T')[0].split('-')[2]);
console.log(end.split('T')[0].split('-')[2] - dateTime.getDate() > 0 && end.split('T')[0].split('-')[2] - dateTime.getDate() < 2);

// getEvents(start, end)
//     .then((res) => {
//         // res.forEach((obj) => {
//         //     // Time start 
//         //     let hStart = obj["start"]["dateTime"].split('T')[1].split('+')[0];
//         //     let dStart = obj["start"]["dateTime"].split('T')[0].split('-')[2];
//         //     let mStart = obj["start"]["dateTime"].split('T')[0].split('-')[1];
//         //     let yStart = obj["start"]["dateTime"].split('T')[0].split('-')[0];

//         //     //Time end
//         //     let hEnd = obj["end"]["dateTime"].split('T')[1].split('+')[0];
//         //     let dEnd = obj["end"]["dateTime"].split('T')[0].split('-')[2];
//         //     let mEnd = obj["end"]["dateTime"].split('T')[0].split('-')[1];
//         //     let yEnd = obj["end"]["dateTime"].split('T')[0].split('-')[0];
//         //     console.log(obj["summary"]);
//         //     console.log(`Thời gian: ${hStart}, Ngày ${dStart} Tháng ${mStart} Năm ${yStart} Đến ${hEnd}, Ngày ${dEnd} Tháng ${mEnd} Năm ${yEnd}`);
//         // })
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// Delete an event from eventID
const deleteEvent = async (eventId) => {

    try {
        let response = await calendar.events.delete({
            auth: auth,
            calendarId: calendarId,
            eventId: eventId
        });

        if (response.data === '') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at deleteEvent --> ${error}`);
        return 0;
    }
};

// let eventId = 'hkkdmeseuhhpagc862rfg6nvq4';

// deleteEvent(eventId)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err);
//     });