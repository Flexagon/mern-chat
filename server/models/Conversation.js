const mongoose = require('mongoose');

const { Schema } = mongoose;

const ConversationSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Conversation', ConversationSchema);
