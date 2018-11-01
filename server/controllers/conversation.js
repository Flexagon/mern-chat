const fs = require('fs');

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

exports.getConversations = (req, res) => {
  Conversation
    .find()
    .exec((err, conversations) => {
      if (err) throw err;

      const fullConversations = [];

      conversations.forEach((conversation) => {
        Message
          .find({ conversationId: conversation._id })
          .sort('-createdAt')
          .populate({
            path: 'author',
            select: 'profile.firstName profile.lastName',
          })
          .exec((err, message) => {
            if (err) throw err;

            fullConversations.push({
              conversationId: conversation._id,
              name: conversation.name,
              message,
            });

            if (fullConversations.length === conversations.length)
              return res.status(200).json({ conversations: fullConversations });
          });
      });
    });
};

exports.getConversation = (req, res) => {
  Message
    .find({ conversationId: req.params.conversationId })
    .select('createdAt body author')
    .sort('-createdAt')
    .populate('author')
    .exec((err, messages) => {
      if (err) throw err;

      return res.status(200).json({
        conversation: messages,
        conversationId: req.params.conversationId,
      });
    });
};

exports.newConversation = (req, res) => {
  if (!req.params.recipient)
    return res.status(422).send({ error: 'Please choose a valid recipient for your message.' });

  if (!req.body.conversationName)
    return res.status(422).send({ error: 'Please enter a conversation name.' });

  const conversation = new Conversation({
    participants: [req.user._id, req.params.recipient],
    name: req.body.conversationName,
  });

  conversation.save((err) => {
    if (err) throw err;

    return res.status(200).json({
      message: 'Conversation created',
      conversation: {
        conversationId: conversation._id,
        name: conversation.name,
        message: [],
      },
    });
  });
};

exports.sendMessage = (req, res) => {
  const reply = new Message({
    conversationId: req.params.conversationId,
    body: {
      originalname: req.body.composedMessage,
    },
    author: req.user._id,
  });

  reply.save((err) => {
    if (err) throw err;

    return res.status(200).json({ message: 'Message successfully sent!' });
  });
};

exports.sendFile = (req, res) => {
  const reply = new Message({
    conversationId: req.params.conversationId,
    body: req.file,
    author: req.user._id,
  });

  reply.save((err) => {
    if (err) throw err;

    return res.status(200).json({ message: 'File successfully sent!' });
  });
};

exports.downLoadFile = (req, res) => {
  const fileStream = fs.createReadStream(`${__dirname}/../public/files/${req.params.fileName}`);

  res.setHeader('Content-Disposition', 'attachment;');

  fileStream.pipe(res);

  fileStream.on('finish', () => { fileStream.close(); });
};

exports.deleteConversation = (req, res) => {
  Conversation.findOneAndRemove({
    $and: [
      { _id: req.params.conversationId },
      { participants: req.user._id },
    ],
  }, (err) => {
    if (err) throw err;

    return res.status(200).json({ message: 'Conversation removed!' });
  });
};
