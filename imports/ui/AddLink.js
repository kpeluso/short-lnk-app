import {Meteor} from 'meteor/meteor';
import React from 'react';
import Modal from 'react-modal';

export default class AddLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'http://',
      isOpen: false,
      error: ''
    };
  }
  onSubmit(e) {
    const {url} = this.state;
    e.preventDefault(); // prevent page refresh
    Meteor.call('links.insert', url, (err) => {
      if (!err) {
        this.handleModalClose(); //this.refs.url.value = ''; // to clear form input element
      } else {
        this.setState({error: err.reason})
      }
    });
    //Links.insert({url, userId: Meteor.userId()});
  }
  // componentDidMount() {
  //   Modal.setAppElement(this.refs.mod);
  // }
  onChange(e) {
    this.setState({
      url: e.target.value.trim()
    });
  }
  handleModalClose() {
    this.setState({isOpen: false, url: 'http://', error: ''});
  }
  render() {
    return (
      <div>
        <button className='button' onClick={() => this.setState({isOpen: true})}>
          + Add Link
        </button>
        <Modal
          ariaHideApp={false}
          isOpen={this.state.isOpen}
          contentLabel='Add Link'
          onAfterOpen={() => this.refs.url.focus()}
          onRequestClose={this.handleModalClose.bind(this)}
          className='boxed-view__box'
          overlayClassName='boxed-view boxed-view--modal'
          // ^^this allows you to close modal via ESC key or clicking in grey area
        >
          <h1>Add Link</h1>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          <form onSubmit={this.onSubmit.bind(this)} className='boxed-view__form'>
            <input
              type="text"
              placeholder="URL"
              value={this.state.url}
              onChange={this.onChange.bind(this)}
              ref='url'
            />
            <button className='button'>Add Link</button>
            <button type='button' className='button button--secondary' onClick={this.handleModalClose.bind(this)}>
              Cancel
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}

