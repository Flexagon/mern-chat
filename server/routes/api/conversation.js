const express = require('express');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: './public/files/',
  filename(req, file, cb) {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return cb(err);

      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  },
});

const upload = multer({ storage });

const ChatController = require('../../controllers/conversation');

const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/', requireAuth, ChatController.getConversations);

router.get('/:conversationId', requireAuth, ChatController.getConversation);

router.post('/:conversationId', requireAuth, ChatController.sendMessage);

router.post('/:conversationId/upload', requireAuth, upload.single('file'), ChatController.sendFile);

router.get('/download/:fileName', requireAuth, ChatController.downLoadFile);

router.post('/new/:recipient', requireAuth, ChatController.newConversation);

module.exports = router;
