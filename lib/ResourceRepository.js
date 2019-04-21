'use strict';

const Resource = require('../Models/Resource');
const maxmind = require('maxmind');

module.exports = class ResourceRepository {
  /**
   * Returns an array of found resources.
   * @param {string} name
   * @param {string} ip
   * @returns {Promise<Resource[]>}
   */
  static getResources(name, ip) {
    return new Promise(async (resolve, reject) => {
      const resources = await Resource.find({ name: name, ipRange: { $in: [ip] } }).exec();

      if (resources.length === 0) {
        return resolve([]);
      }

      return resolve(resources); // Mind the comment below.

      // maxmind.open() causes HTTP request timeout...
      /* maxmind.open('../GeoLite2-City.mmdb', (error, cityLookup) => {
        if (error) {
          return reject(error);
        }

        const city = cityLookup.get(ip);
        // TODO: check:
        // 1. The city exists.
        // 2. City's location is equal to "resource.location"
      }); */
    });
  }

  /**
   * Retrieves resources by name.
   * @param name
   * @returns {Promise|ChildProcess|never|RegExpExecArray}
   */
  static getResourcesByName(name) {
    return Resource
    .find({ name: name })
    .exec();
  }

  /**
   * Creates a new resource.
   * @param {string} payload
   * @returns {Promise<Resource>}
   */
  static createResource(payload) {
    const { name, context, ipRange, location } = payload;
    const resource = new Resource({ name, context, ipRange, location });
    return resource.save();
  }
}
