import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import shortid from 'shortid';

export const Links = new Mongo.Collection('links');

if (Meteor.isServer) {
  Meteor.publish('links', function() {
    return Links.find({userId: this.userId});
  });
}

Meteor.methods({
  'links.insert'(url) {
    if (!this.userId) {
      throw new Meteor.error('Not-authorized');
    }

    try {
      new SimpleSchema({
        url: {
          type: String,
          label: 'Your link',
          regEx: SimpleSchema.RegEx.Url
        }
      }).validate({url});
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }

    Links.insert({
      _id: shortid.generate(),
      url,
      userId: this.userId,
      visible: true,
      visitedCount: 0,
      lastVisitedAt: null
    });
  },
  'links.setVisibility'(_id, visible) {
    if (!this.userId) {
      throw new Meteor.error('Not-authorized');
    }

    try {
      new SimpleSchema({
        _id: {
          type: String,
          label: 'Link _id',
          min: 1
        },
        visible: {
          type: Boolean
        }
      }).validate({_id, visible});
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }

    Links.update({
      _id,
      userId: this.userId,
      }, {
        $set: {visible}
      }
    );
  },
  'links.trackVisit'(_id) {
    // user need not be logged in to use this method

    try {
      new SimpleSchema({
        _id: {
          type: String,
          label: 'Link _id',
          min: 1
        }
      }).validate({_id});
    } catch (e) {
      throw new Meteor.Error(400,e.message);
    }

    Links.update({_id},{
      $set: {
        lastVisitedAt: new Date().getTime() // number of miliseconds since 1/1/1970
      },
      $inc: {
        visitedCount: 1
      }
    });
  }
});

