import React from 'react';
import PropTypes from 'prop-types';

import correctChatTime from '../../utils/correctChatTime';

const Message = (props) => {
  const { message: { author, body, createdAt }, downloadFile } = props;

  const messageBody = body.fieldname ? (
    <div
      onClick={() => downloadFile(body.filename)}
      className="Chat-message-text Chat-message-text--link"
    >
      File: {body.originalname}
    </div>
  ) :
    <div className="Chat-message-text">{body.originalname}</div>;

  return (
    <li className="Chat-message">
      <div className="Chat-message-authorName">{author.name}</div>
      <div className="Chat-message-body">
        {messageBody}
        <div className="Chat-message-time">{correctChatTime(createdAt)}</div>
      </div>
    </li>
  );
};

Message.propTypes = {
  message: PropTypes.instanceOf(Object).isRequired,
  downloadFile: PropTypes.func.isRequired,
};

export default Message;
