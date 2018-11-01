import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import io from 'socket.io-client';

import Rooms from './Rooms';
import Room from './Room';

import { SERVER, API_CHAT_CONVERSATIONS, API_CHAT_NEW_CONVERSATION } from '../../consts/APIRoutes';

export default class Chat extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      inRoom: false,
      rooms: [],
      room: [],
      roomId: '',
    };

    this.socket = io(SERVER);
    this.downloadLinkRef = React.createRef();
  }

  componentDidMount() {
    axios
      .get(API_CHAT_CONVERSATIONS)
      .then(res => this.setState({ rooms: res.data.conversations }))
      .catch(err => console.error(err));

    this.socket.on('refresh messages', () => this.goToRoom(this.state.roomId));
  }

  createNewRoom = (value, callback) => {
    axios
      .post(`${API_CHAT_NEW_CONVERSATION}/${this.props.userId}`, {
        conversationName: value,
      })
      .then((res) => {
        const newRooms = this.state.rooms;

        newRooms.push(res.data.conversation);
        this.setState({ rooms: newRooms });
        callback();
      })
      .catch(err => console.error(err));
  }

  goToRoom = (id) => {
    axios
      .get(`${API_CHAT_CONVERSATIONS}/${id}`)
      .then((res) => {
        this.setState({
          inRoom: true,
          room: res.data.conversation.reverse(),
          roomId: res.data.conversationId,
        });
      })
      .catch(err => console.error(err));
  }

  addNewMessage = (composedMessage, callback) => {
    axios
      .post(`${API_CHAT_CONVERSATIONS}/${this.state.roomId}`, { composedMessage })
      .then(() => {
        this.socket.emit('new message');
        callback();
      })
      .catch(err => console.error(err));
  }

  addNewFile = (composedMessage, callback) => {
    axios
      .post(`${API_CHAT_CONVERSATIONS}/${this.state.roomId}/upload`, composedMessage)
      .then(() => {
        this.socket.emit('new message');
        callback();
      })
      .catch(err => console.error(err));
  }

  downloadFile = (fileName) => {
    axios({
      url: `${API_CHAT_CONVERSATIONS}/download/${fileName}`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((res) => {
        const linkRef = this.downloadLinkRef.current;

        linkRef.href = URL.createObjectURL(new Blob([res.data]));
        linkRef.download = fileName;
        linkRef.click();
      })
      .catch(err => console.error(err));
  }

  render() {
    const {
      inRoom, rooms, room, roomId,
    } = this.state;

    return (
      <div className="Chat">
        <a style={{ display: 'none' }} href='empty' ref={this.downloadLinkRef} />
        <Rooms
          rooms={rooms}
          goToRoom={this.goToRoom}
          createNewRoom={this.createNewRoom}
        />
        {inRoom ? (
          <Room
            room={room}
            roomId={roomId}
            addNewMessage={this.addNewMessage}
            addNewFile={this.addNewFile}
            downloadFile={this.downloadFile}
          />
        ) : (
          <div className="Chat-brief">
            <h3>Please select existing room or create new</h3>
          </div>
        )}
      </div>
    );
  }
}
