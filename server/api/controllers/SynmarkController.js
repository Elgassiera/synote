/**
 * SynmarkController
 *
 * @description :: Server-side logic for managing Synmarks
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var S = require('string');
var si = require('search-index');
var randomstring = require("randomstring");
var async= require('async');
var _=require('underscore');

module.exports = {
    /**
     *
     * @param title
     * @param content
     * @param tags
     * @param permission
     * @param mfst
     * @param mfet
     * @param timeformat
     * @param mfx
     * @param mfy
     * @param mfw
     * @param mfh
     * @param xywhunit
     */
	create:function(req,res){

        //TODO: check permission first, maybe write a policy for it

        var synmark = {};

        if(req.body.title){
            synmark.title = S(req.body.title).trim().s;
        }

        if(req.body.content){
            synmark.content = S(req.body.content).trim().s;
        }

        if(req.body.permission){
            synmark.permission = S(req.body.permission).trim().s;
        }

        if(req.body.tags){
            var tags = req.body.tags.split(',');

            synmark.tags = [];
            for(var i=0;i<tags.length;i++){
                var tag = S(tags[i]).trim().s;
                if(tag) {
                    synmark.tags.push({text: S(tags[i]).trim().s, owner: req.session.user.id, rsid: randomstring.generate(), ind:i+1});
                }
            }

        }

        synmark.mfst = parseInt(req.body.mfst);

        if(req.body.mfet){
            if(!isNaN(parseInt(req.body.mfet))){
                synmark.mfet = parseInt(req.body.mfet);
            }
            else
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfet" )));
        }

        if(req.body.timeformat){
            synmark.timeformat = S(req.body.timeformat).trim().s;
        }

        //xywh must present together
        if((req.body.mfx && req.body.mfy && req.body.mfw && req.body.mfh)){
            if(!isNaN(parseInt(req.body.mfx))){
                synmark.mfx = parseInt(req.body.mfx);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfx" )));
            }

            if(!isNaN(parseInt(req.body.mfy))){
                synmark.mfy = parseInt(req.body.mfy);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfy" )));
            }

            if(!isNaN(parseInt(req.body.mfw))){
                synmark.mfw = parseInt(req.body.mfw);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfw" )));
            }

            if(!isNaN(parseInt(req.body.mfh))){
                synmark.mfh = parseInt(req.body.mfh);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfh" )));
            }
        }

        if(req.body.xywhunit){
            synmark.xywhunit = S(req.body.xywhunit).trim().s;
        }

        synmark.annotates = req.session.multimedia.id;
        synmark.owner = req.session.user.id;
        synmark.rsid = randomstring.generate();

        Synmark.create(synmark).exec(function(err, newsynmark){
            if(err) return res.serverError(err);

            return res.json({success:true, message:sails.__("%s has been successfully created", "Synmark"), synmarkid:newsynmark.id, synmark:newsynmark});
        })
    },

    get:function(req,res){
        var synmarkid = req.params.synmarkid;
        Synmark.findOne({id:synmarkid}).then(function(synmark){
            return res.json(synmark);
        });
    },

    save:function(req,res){
        var oldsynmark = req.session.synmark;

        var synmark = oldsynmark;
        synmark.annotates = oldsynmark.annotates.id;
        synmark.owner = oldsynmark.owner.id;

        if(req.body.title){
            synmark.title = S(req.body.title).trim().s;
        }

        if(req.body.content){
            synmark.content = S(req.body.content).trim().s;
        }

        if(req.body.permission){
            synmark.permission = S(req.body.permission).trim().s;
        }

        var updateTags = false;

        if(req.body.tags){
            //deal with tags
            var tags = req.body.tags.split(',');
            var oldtags = _.sortBy(oldsynmark.tags,function(tag){
                return tag.ind;
            }).map(function(tag){
                return tag.text;
            });

            if(!_.isEqual(oldtags,tags)){
                synmark.tags = [];
                for(var i=0;i<tags.length;i++){
                    var tag = S(tags[i]).trim().s;
                    if(tag) {
                        synmark.tags.push({text: S(tags[i]).trim().s, owner: req.session.user.id, rsid: randomstring.generate(), ind:i+1});
                    }
                }
                updateTags = true;
            }
        }

        synmark.mfst = parseInt(req.body.mfst);

        if(req.body.mfet){
            if(!isNaN(parseInt(req.body.mfet))){
                synmark.mfet = parseInt(req.body.mfet);
            }
            else
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfet" )));
        }

        if(req.body.timeformat){
            synmark.timeformat = S(req.body.timeformat).trim().s;
        }

        //xywh must present together
        if((req.body.mfx && req.body.mfy && req.body.mfw && req.body.mfh)){
            if(!isNaN(parseInt(req.body.mfx))){
                synmark.mfx = parseInt(req.body.mfx);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfx" )));
            }

            if(!isNaN(parseInt(req.body.mfy))){
                synmark.mfy = parseInt(req.body.mfy);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfy" )));
            }

            if(!isNaN(parseInt(req.body.mfw))){
                synmark.mfw = parseInt(req.body.mfw);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfw" )));
            }

            if(!isNaN(parseInt(req.body.mfh))){
                synmark.mfh = parseInt(req.body.mfh);
            }
            else{
                return res.badRequest((sails.__("Parameter %s is not valid.", "mfh" )));
            }
        }

        if(req.body.xywhunit){
            synmark.xywhunit = S(req.body.xywhunit).trim().s;
        }

        var tagsPromise = UtilsService.emptyPromise();
        if(updateTags === true){
            tagsPromise = Tag.destroy({ownersynmark:synmark.id});
        }

        tagsPromise.then(function(){
            Synmark.update({id:oldsynmark.id},synmark).then(function(newsynmarks){
                return res.json({success:true, message:sails.__("%s has been successfully updated", "Synmark"), synmarkid:newsynmarks[0].id, synmark:newsynmarks[0]});
            },function(err){
                return res.serverError(err);
            });
        }, function(destroyErr){
            return res.serverError(destroyErr);
        });
    },
    delete:function(req,res){
        var synmark = req.session.synmark;
        Synmark.destroy({id:synmark.id}).exec(function(err){
            if(err){
                return res.serverError(err);
            }

            return res.json({success:true, message:sails.__("%s has been successfully deleted", "Synmark")})
        })
    },
    listByOwner:function(req,res){
        var owner = req.session.user;

        var skip = 0;
        if(typeof req.query.skip !== "undefined" && !isNaN(parseInt(req.query.skip))){
            skip = parseInt(req.query.skip);
        }

        var limit = 10;
        if(typeof req.query.limit !== "undefined" && !isNaN(parseInt(req.query.limit))){
            limit = parseInt(req.query.limit);
        }

        var sortby = "createdAt";
        if(typeof req.query.sortby !== "undefined"){
            sortby = req.query.sortby;
        }

        var order = "DESC";
        if(req.query.order === "ASC"){
            order="ASC";
        }

        var sort = sortby + " "+order;


        //do the count first...
        if(typeof req.query.q ==="undefined" || S(req.query.q).trim().s.length === 0) {
            var criteria = {owner:owner.id};
            Synmark.count(criteria).then(function (synCount) {
                Synmark.find({
                    where: criteria,
                    skip: skip,
                    limit: limit,
                    sort: sort
                }).populate('tags').populate('owner').then(function (synmarks) {
                    return res.json({
                        success: true,
                        count: synCount,
                        start: skip + 1,
                        end: ((skip + limit)>synCount)?synCount:(skip+limit),
                        synmarks: synmarks
                    });
                }, function (err) {
                    return res.serverError(err);
                });
            });
        }
        else{ //get tags first
            var q = S(req.query.q).trim().s
            var criteria = {owner:owner.id,ownersynmark:{'!':null}, text:q};
            var synmarks=[];
            Tag.count(criteria).then(function(tagCount){
                Tag.find({
                    where: criteria,
                    skip:skip,
                    limit: limit,
                    sort:sort
                }).then(function(tags){
                    async.each(tags, function(tag, tagCallback){
                        Synmark.findOne({id:tag.ownersynmark}).populate('tags').then(
                            function(synmark){
                                synmarks.push(synmark);
                                tagCallback();
                            }
                        )
                    },function(err){
                        if(err)
                            return res.serverError(err);

                        return res.json({
                            success: true,
                            count: tagCount,
                            start: skip + 1,
                            end: ((skip + limit)>tagCount)?tagCount:(skip+limit),
                            synmarks: _.sortBy(synmarks,'createdAt')
                        });
                    })
                },function(tagsErr){
                    return res.serverError(tagsErr);
                });
            }, function(countErr){
                return res.serverError(countErr);
            });
        }

    }
};

