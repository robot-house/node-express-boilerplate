const mongoose = require('mongoose');

/** This model describes a user object */
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dob: Date,
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    meta: {
      whenCreated: {
        type: Date,
        default: Date.now,
      },
      whenModified: {
        type: Date,
        default: Date.now,
      },
    },
    profileImage: {
      url: String,
      s3Bucket: String,
      key: String,
      uploaded: {
        type: Date,
      },
    },
  },

  {
    toObject: { virtuals: true },
    toObject: { getters: true },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.id;
      },
    },
  }
);

/** Include full name virtual field */
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = model = mongoose.model('User', UserSchema);
