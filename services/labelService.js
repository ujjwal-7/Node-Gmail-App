// labelService.js
const { google } = require('googleapis');

const listLabels = async (auth) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.labels.list({ userId: 'me' });
  return res.data.labels || [];
}

const createLabel = async (auth, labelName) => {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: labelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show',
    },
  });
  return res.data.id;
}

const createLabelIfNeeded = async (auth, labelName) => {
    const existingLabels = await listLabels(auth);
    const existingLabel = existingLabels.find((label) => label.name === labelName);
  
    if (existingLabel) {
      return existingLabel.id;
    }
  
    return await createLabel(auth, labelName);
  }

module.exports = {
  listLabels,
  createLabel,
  createLabelIfNeeded
};
