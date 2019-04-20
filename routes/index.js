'use strict';

const express = require('express');
const router = express.Router();
const maxmind = require('maxmind');
const ResourceRepository = require('../lib/ResourceRepository');

router.get('/resources/:name', async (req, res) => {
  const name = req.params.name;
  const ip = req.query.ip;

  if (name.length < 2 || name.length > 10) {
    return res.status(403).send('Resource name must be between 2 to 10 characters long.');
  }

  if (!ip || !maxmind.validate(ip)) {
    return res.status(403).send('ip must be provided as a query string parameter.');
  }

  try {
    const resources = await ResourceRepository.getResources(name, ip);

    if (resources.length === 0) {
      return res.status(404).send('No context found.');
    }

    res.status(200).send(resources[0].context);
  } catch (error) {
    res.status(500).send('Server error occurred.');
  }
});

router.post('/resources', async (req, res) => {
  const { name, context, ipRange, location } = req.body;

  if (name.length < 2 || name.length > 10) {
    return res.status(400).send('Resource name must be between 2 to 10 characters long.');
  }

  if (context.length < 2 || context.length > 10) {
    return res.status(400).send('Resource context must be between 2 to 10 characters long.');
  }

  if (!ipRange && !location) {
    return res.status(403).send('Either ipRange or location must be specified.');
  }

  if (Array.isArray(ipRange)) {
    const isValidLength = ipRange.length === 2;
    const bothIpsValid = ipRange.reduce((isValid, ip) => isValid && maxmind.validate(ip), true);

    if (!isValidLength || !bothIpsValid) {
      return res.status(400).send('Given range contains invalid ip/s.');
    }
  }

  const allowedLocations = ['CI', 'GH', 'ET']; // !!!Validation sample, a real time zones list is much longer.

  if (allowedLocations.indexOf(location) === -1) {
    return res.status(400).send(`Location ${location} is invalid.`);
  }

  try {
    const existingResources = await ResourceRepository.getResourcesByName(name);

    if (existingResources.length !== 0) {
      return res.status(409).send(`Resource ${name} already exists.`);
    }

    await ResourceRepository.createResource({ name, context, ipRange, location });
    res.status(201).send(`Resource ${name} was created successfully.`);
  } catch (error) {
    res.status(500).send('Server error occurred.');
  }
});

module.exports = router;
