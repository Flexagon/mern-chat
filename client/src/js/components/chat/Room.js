import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Message from './Message';

export default class Room extends Component {
  static propTypes = {
    room: PropTypes.instanceOf(Array).isRequired,
    addNewMessage: PropTypes.func.isRequired,
    addNewFile: PropTypes.func.isRequired,
    downloadFile: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      selectedFile: {},
      fileValue: '',
    };

    this.messagesWindow = React.createRef();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    const scrollDistance = this.messagesWindow.current.scrollHeight;

    this.messagesWindow.current.scroll({
      top: scrollDistance,
      behavior: 'smooth',
    });
  }

  onChangeInput = e => this.setState({ inputValue: e.target.value })

  handleNewMessage = () => {
    const { addNewMessage } = this.props;
    const { inputValue } = this.state;

    addNewMessage(inputValue, () => this.setState({ inputValue: '' }));
  }

  setSelectedFile = e => this.setState({
    selectedFile: e.target.files[0],
    fileValue: e.target.value,
  })

  handleFileUpload = () => {
    const { addNewFile } = this.props;
    const { selectedFile } = this.state;
    const formData = new FormData();

    formData.append('file', selectedFile, selectedFile.name);

    addNewFile(formData, () => this.setState({
      fileValue: '',
      selectedFile: {},
    }));
  }

  render() {
    const { inputValue, fileValue, selectedFile } = this.state;
    const { room, downloadFile } = this.props;

    return (
      <div className="Chat-room">
        <div className="Chat-room-windowWrap" ref={this.messagesWindow}>
          <ul className="Chat-room-window">
            {room.length > 0 && room.map(message => (
              <Message
                key={message.createdAt}
                message={message}
                downloadFile={downloadFile}
              />
            ))}
          </ul>
        </div>
        <div className="Chat-room-panel">
          <div className="Chat-fileSend">
            <label htmlFor="fileInput" className="Chat-fileSend-label">
              {selectedFile.name ? selectedFile.name : 'Choose File'}
              <input
                id="fileInput"
                type="file"
                value={fileValue}
                onChange={this.setSelectedFile}
              />
            </label>
            <input
              type="button"
              value="Send"
              onClick={this.handleFileUpload}
              className="Chat-fileSend-button"
              disabled={!selectedFile.name}
            />
          </div>
          <div className="Chat-messageSend">
            <input
              className="Chat-room-input"
              type="text"
              value={inputValue}
              onChange={this.onChangeInput}
              placeholder="Type message here..."
              onKeyPress={(e) => {
                if (Boolean(inputValue) && e.key === 'Enter') this.handleNewMessage();
              }}
            />
            <input
              className="Chat-room-button"
              type="button"
              value="Send"
              disabled={!Boolean(inputValue)}
              onClick={this.handleNewMessage}
            />
          </div>
        </div>
      </div>
    );
  }
}
