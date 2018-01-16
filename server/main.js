import { Meteor } from 'meteor/meteor';
import {WebApp} from 'meteor/webapp';

import '../imports/api/users';
import {Links} from '../imports/api/links';

Meteor.startup(() => {
  WebApp.connectHandlers.use((req, res, next) => {
    const _id = req.url.slice(1); // strip initial '/'
    const link = Links.findOne({_id});

    if (link) {
      res.statusCode = 302; // meaning that target resource is under different domain
      res.setHeader('Location', link.url); // key-value pair
      res.end();
      Meteor.call('links.trackVisit', _id);
    } else {
      next();
    }
  });
});

