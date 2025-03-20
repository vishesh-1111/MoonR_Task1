const express = require('express');
const mongoose = require('mongoose');
const requestIp = require('request-ip');
const {Contact} = require('./contactSchema')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestIp.mw());

mongoose.connect('mongodb://localhost:27017/identityDB', {
});

app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;
  const clientIp = req.clientIp;

  try {
      const existingContacts = await Contact.find({
          $or: [{ email }, { phoneNumber }, { ipAddress: clientIp }],
      });

      let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary') || null;
      const matchedByIp = false && existingContacts.some(contact => contact.ipAddress === clientIp);

      if (matchedByIp) {
          if (!primaryContact) {
              const newContact = new Contact({
                  email,
                  phoneNumber,
                  ipAddress: clientIp,
                  linkPrecedence: 'primary',
              });

              await newContact.save();

              return res.status(200).json({
                  primaryContactId: newContact._id,
                  emails: [newContact.email].filter(Boolean),
                  phoneNumbers: [newContact.phoneNumber].filter(Boolean),
                  secondaryContactIds: [],
              });
          }

          const newContact = new Contact({
              email,
              phoneNumber,
              ipAddress: clientIp,
              linkPrecedence: 'secondary',
              linkedId: primaryContact._id,
          });

          await newContact.save();
      } else {
          if (primaryContact) {
              await Contact.updateOne(
                  { _id: primaryContact._id },
                  { $set: { linkPrecedence: 'secondary', linkedId: primaryContact._id, updatedAt: new Date() } }
              );
          }

          const newContact = new Contact({
              email,
              phoneNumber,
              ipAddress: clientIp,
              linkPrecedence: 'primary',
          });

          await newContact.save();

          await Contact.updateMany(
              { linkedId: primaryContact ? primaryContact._id : null },
              { $set: { linkedId: newContact._id, updatedAt: new Date() } }
          );

          primaryContact = newContact;
      }

      const relatedContacts = await Contact.find({
          $or: [{ _id: primaryContact._id }, { linkedId: primaryContact._id }],
      });

      const emails = [...new Set(relatedContacts.map(contact => contact.email).filter(Boolean))];
      const phoneNumbers = [...new Set(relatedContacts.map(contact => contact.phoneNumber).filter(Boolean))];
      const secondaryContactIds = relatedContacts
          .filter(contact => contact.linkPrecedence === 'secondary')
          .map(contact => contact._id);

      res.status(200).json({
          primaryContactId: primaryContact._id,
          emails,
          phoneNumbers,
          secondaryContactIds,
      });
  } catch (error) {
      console.error('Error processing /identify request:', error);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
