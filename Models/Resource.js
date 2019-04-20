'use strict';

const { Schema, model } = require('mongoose');
const maxmind = require('maxmind');

const customValidationMessage = 'Either ipRange or location must be presented.';

const ResourceSchema = Schema({
  name: {
    type: String,
    minLength: [2, 'context must meet the minimal length requirement.'],
    maxLength: [10, 'context must meet the maximal length requirement.'],
    required: true,
    validate: {
      validator: name => /^[a-z0-9]+$/i.test(name),
      message: name => `${name.value} is not an alphanumeric value.`
    },
  },

  context: {
    type: String,
    minLength: [2, 'context must meet the minimal length requirement.'],
    maxLength: [10, 'context must meet the maximal length requirement.'],
    required: true
  },

  ipRange: {
    type: [String],
    required: () => [!this.location, customValidationMessage],
    validate: {
      validator: range => {
        const isValidLength = range.length === 2;
        const bothIpsValid = range.reduce((isValid, ip) => isValid && maxmind.validate(ip), true);
        return isValidLength && bothIpsValid;
      },
      message: () => `Given range contains invalid ip/s.`
    }
  },

  location: {
    type: String,
    required: () => [!this.ipRange, customValidationMessage],
    enum: ['CI', 'GH', 'ET'] // !!!Validation sample, a real time zones list is much longer.
  }
});

module.exports = model('Resource', ResourceSchema);
