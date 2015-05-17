/**
 * Created by RikHoffbauer on 17/05/15.
 */
export default {

  "User": {

    "males": {
      where: {
        gender: "male"
      }
    },

    "ofLegalAge": {
      filter: (model) => {
        return parseInt(model.age, 10) >= 18;
      }
    }

  }

};
