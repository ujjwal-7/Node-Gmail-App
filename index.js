const { google } = require("googleapis");
require('dotenv').config();

const { clientId, clientSecret, redirectUri, refreshToken } = require("./config.js");
const getRandomInterval = require('./utils/getRandomInterval');
const createReplyRaw = require('./utils/createReplyRaw.js');
const gmailService = require('./services/gmailService.js');
const replyService = require('./services/replyService.js');
const labelService = require('.//services/labelService.js');
  
const oAuth2Client = new google.auth.OAuth2(
    clientId, 
    clientSecret, 
    redirectUri
);

oAuth2Client.setCredentials({ refresh_token: refreshToken });

const checkEmailsAndSendReplies = async () => {
  try {
    const unreadMessages = await gmailService.listUnreadMessages(oAuth2Client);

    for (const message of unreadMessages) {
      const email = await gmailService.getMessageDetails(oAuth2Client, message.id);

      const from = email.data.payload.headers.find((header) => header.name === 'From').value;
      const toHeader = email.data.payload.headers.find((header) => header.name === 'To');
      const toEmail = toHeader.value;
      const subject = email.data.payload.headers.find((header) => header.name === 'Subject').value;

      const thread = await gmailService.getThread(oAuth2Client, message.threadId);
      const replies = thread.data.messages.slice(1);

      if (replies.length === 0) {
        const raw = await createReplyRaw(toEmail, from, subject);
        await replyService.sendReply(oAuth2Client, raw);

        const labelName = 'onVacation';
        const labelId = await labelService.createLabelIfNeeded(oAuth2Client, labelName);
        await gmailService.modifyMessage(oAuth2Client, message.id, { addLabelIds: [labelId] });

        console.log('Sent reply to email:', from);
      }
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}


setInterval(checkEmailsAndSendReplies, getRandomInterval(45, 120) * 1000);


/*************************
 
  Write a detailed spec about the libraries and technologies used

  1. dotenv (^16.3.1):
     This package allows us to load environment variables from a .env file into process.env. This is useful for storing sensitive information like API keys or configuration settings.

  2. googleapis (^129.0.0):
     This package provides the Google API client library for Node.js, allowing to interact with various Google services.

  3. nodemon (^3.0.2):
     Nodemon is a tool that helps in the development process by automatically restarting the Node.js application when file changes are detected. This is particularly useful during development to save you from manually restarting the server after every change.
     
***************************/


/**************************
  Improvements :

  1. User Interface
     Build a simple web interface or command-line interface for better user interaction and control.

  2. Attachments Handling
     Extend the app to handle email attachments.

  3. Performance Optimization
     Optimize the code for better performance, especially if dealing with a large number of emails.


  4. Security Enhancements
     Securely store sensitive information (e.g., API credentials) using encryption.


  5. Email Filtering
     Allow users to define custom filters for determining which emails should trigger auto-replies.

  6. Notifications
     Integrate a notification system to alert users when significant events occur (e.g., successful replies, errors).

  7. Scheduled Out-of-Office
     Allow users to set a schedule for when the auto-reply feature should be active, simulating an out-of-office responder.

****************************/