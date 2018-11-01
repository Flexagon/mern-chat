import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Rooms extends Component {
  static propTypes = {
    goToRoom: PropTypes.func.isRequired,
    createNewRoom: PropTypes.func.isRequired,
    rooms: PropTypes.instanceOf(Array).isRequired,
  }

  state = {
    isShowCreateRoom: false,
    inputValue: '',
  }

  toggleCreateRoom = () => this.setState({
    isShowCreateRoom: !this.state.isShowCreateRoom,
  });

  onChangeInput = e => this.setState({ inputValue: e.target.value })

  handleCreateRoom = () => {
    const { createNewRoom } = this.props;
    const { inputValue } = this.state;

    createNewRoom(inputValue, () => this.setState({ inputValue: '' }));
  }

  render() {
    const { isShowCreateRoom, inputValue } = this.state;
    const { rooms, goToRoom } = this.props;

    return (
      <div className="Chat-rooms">
        <ul className="Chat-rooms-list">
          <li className="Chat-rooms-item">
            <div className="Chat-rooms-create" onClick={this.toggleCreateRoom}>
              <div className="Chat-rooms-createIcon" /> Create Room
            </div>
            {isShowCreateRoom && (
              <div className="Chat-rooms-createWrap">
                <input
                  className="Chat-rooms-createInput"
                  type="text"
                  placeholder="Room name"
                  onChange={this.onChangeInput}
                  value={inputValue}
                />
                <input
                  className="Chat-rooms-createButton"
                  type="button"
                  value="Add"
                  onClick={this.handleCreateRoom}
                  disabled={!Boolean(inputValue)}
                />
              </div>
            )}
          </li>
          {rooms.length > 0 && rooms.map(room => (
            <li
              key={room.conversationId}
              className="Chat-rooms-item"
              onClick={() => goToRoom(room.conversationId)}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
