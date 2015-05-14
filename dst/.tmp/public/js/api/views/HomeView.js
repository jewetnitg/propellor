/**
 * Created by RikHoffbauer on 11/05/15.
 */
import View from '../../lib/entities/View';
import _ from 'lodash';

class HomeView extends View {

  static instanceProperties() {
    return {

      name: 'view-home', /* reference to a webcomponent */
      holder: 'body', /* DOM selector or element in which the webcomponent will be placed  */

      /* default attributes */
      defaults: {
        owner: 'Rik'
      },

      /* Backbone.View like events */
      events: {
        'save': 'handleSave',
        'drop': 'handleDrop'
      }

    };
  }

  initialize() {
    _.bindAll(this,
      'handleSave',
      'handleDrop'
    );
  }

  handleSave(data) {
    _.extend(this.attributes.user, data);

    app.server.User.update(this.attributes.user);
  }

  handleDrop(data) {
    app.upload({
        file: data
      })
      .then(
        (data) => {
          console.log('Upload successful', data);
        },
        (data) => {
          console.error('Upload failed', data);
        }
      );
  }



}

export default HomeView;
