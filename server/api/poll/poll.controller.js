/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /polls              ->  index
 * POST    /polls              ->  create
 * GET     /polls/:id          ->  show
 * PUT     /polls/:id          ->  update
 * DELETE  /polls/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');

// Get list of polls
exports.index = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.json(200, polls);
  });
};

// Get a single poll
exports.show = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.send(404); }
    return res.json(poll);
  });
};

// Show all polls for a User
exports.showUser = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.json(
      polls.filter(function(item){
        return item.ownerid == req.params.userid;
      })
    );
  });
};

// Show a single post based on a legible URL
exports.showRough = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.json(
      polls.filter(function(item){
        return spinalCase(item.owner) == req.params.user;
      }).filter(function(item){
        return spinalCase(item.title)==req.params.title;
      })[0]
    );
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  Poll.create(req.body, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.json(201, poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.send(404); }
    var updated = _.merge(poll, req.body);
    updated.save(function (err, data) {
      if (err) { return handleError(res, err); }
      return res.json(200, poll);
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.send(404); }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}


function spinalCase(str) {
   var valid="abcdefghijklmnopqrstuvwxyz1234567890";
   var caps="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
   var space="_ -";
   var newStr = "";
   for (var i = 0; i<str.length; i++) {
     if (caps.indexOf(str[i])!==-1) {
       if (i!==0 && newStr[newStr.length-1]!=="-") {
         newStr+="-";
       }
       newStr+=str[i].toLowerCase();
     } else if (valid.indexOf(str[i])==-1) {
       if (str[i]==" " || str[i]=="_" || str[i] == "-") {
         newStr+="-";
       }
     } else { newStr+=str[i]; }
   }
   return newStr;
 }
