const express = require('express');
const router = express.Router();

router.get('', (req, res) => {
    let html = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Homepage</title>
        </head>
        <body>
            <ul>
                <li><a href="/calendar">Calendar</a></li>
                <li><a href="/diet">Diet Management</a></li>
            </ul>
        </body>
        </html>    
    `;
    res.send(html);
});

module.exports = router;