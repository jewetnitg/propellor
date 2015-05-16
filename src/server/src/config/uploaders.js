/**
 * Created by RikHoffbauer on 13/05/15.
 */

module.exports.uploaders = {

  "default": "file",

  "file": {
    "dir": "files",
    "type": "binary",
    "max_size": 4096 // 4mb
  },

  "code": {
    "type": "text",
    "dir": "code"
  },

  "picture": {
    "dir": "pictures",
    "policies": ["fileUploadIsPicture"],
    "max_size": 4096 // 4mb
  },

  "video": {
    "dir": "videos",
    "policies": ["fileUploadIsVideo"],
    "min_size": 1024, // 1mb
    "max_size": 204800 // 200mb
  }

};
