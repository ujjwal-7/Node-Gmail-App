// gmailService.js
const { google } = require('googleapis');

const listUnreadMessages = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({ userId: 'me', q: 'is:unread' });
  return res.data.messages || [];
}

const getMessageDetails = async (auth, messageId) => {
  const gmail = google.gmail({ version: 'v1', auth });
  return await gmail.users.messages.get({ userId: 'me', id: messageId });
}

const getThread = async (auth, threadId) => {
  const gmail = google.gmail({ version: 'v1', auth });
  return await gmail.users.threads.get({ userId: 'me', id: threadId });
}

const modifyMessage = async (auth, messageId, requestBody) => {
  const gmail = google.gmail({ version: 'v1', auth });
  return await gmail.users.messages.modify({ userId: 'me', id: messageId, requestBody });
}

module.exports = {
  listUnreadMessages,
  getMessageDetails,
  getThread,
  modifyMessage,
};
