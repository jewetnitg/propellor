/**
 * Created by RikHoffbauer on 11/05/15.
 */
import _          from 'lodash';

export default function (keyStr, value, obj) {
  const split = keyStr.split('.');
  const len   = split.length;

  obj = obj || {};

  let i = 0;
  _.each(split, (key) => {
    if (i === len - 1) {
      obj[key] = value;
    } else {
      obj[key] = obj[key] || {};
      obj = obj[key];
    }
    i++;
  });

  return obj;
}
