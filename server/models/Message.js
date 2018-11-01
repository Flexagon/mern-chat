const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  body: {
    type: Object,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Message', MessageSchema);
