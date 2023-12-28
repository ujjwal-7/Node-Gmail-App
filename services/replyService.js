// replyService.js
const { google } = require('googleapis');

const sendReply = async (auth, raw) => {
  const gmail = google.gmail({ version: 'v1', auth });
  return await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw },
  });
}

module.exports = {
  sendReply
};
