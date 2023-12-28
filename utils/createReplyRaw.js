const createReplyRaw = async (from, to, subject) => {
    const emailContent = `From: ${from}\nTo: ${to}\nSubject: ${subject}\n\nI am unavailable right now.`;
    const base64EncodedEmail = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  
    return base64EncodedEmail;
  }

module.exports = createReplyRaw;