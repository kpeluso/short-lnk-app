import React from 'react';
import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {Session} from 'meteor/session';
import FlipMove from 'react-flip-move';

import {Links} from '../api/links';
import LinksListItem from './LinksListItem';

export default class LinkList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: []
    };
  }
  componentDidMount() {
    this.linksTracker = Tracker.autorun(() => {
      Meteor.subscribe('links');
      const links = Links.find({
        visible: Session.get('showVisible')
      }).fetch();
      this.setState({links});
    });
  }
  componentWillUnmount() {
    this.linksTracker.stop(); // we don't want to set the state every time the page is loaded
  }
  renderLinksListItems() {
    if (this.state.links.length === 0) {
      return (
        <div className='item'>
          <p className='item__status-message'>No Links Found</p>
        </div>
      );
    }
    return this.state.links.map((link) => {
      const shortUrl = Meteor.absoluteUrl(link._id);
      return <LinksListItem key={link._id} shortUrl={shortUrl} {...link}/>;
      // return <p key={link._id}>{link.url}</p>
    });
  }
  render() {
    return (
      <div>
        <FlipMove maintainContainerHeight={true}>
          {this.renderLinksListItems()}
        </FlipMove>
      </div>
    );
  }
}

