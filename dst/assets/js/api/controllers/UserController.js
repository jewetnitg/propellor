/**
 * Created by RikHoffbauer on 24/04/15.
 */
"use strict";
import Controller from '../../lib/entities/Controller';

class UserController extends Controller {

  home(req, res) {
    app.server.User
      .findOne({
        firstName: "Rik"
      })
      .then((user) => {
        res.send({
          user,
          testText: 'Hello View, I\'m a Controller, and this is my data!'
        });
      });

  }
}

export default UserController;
