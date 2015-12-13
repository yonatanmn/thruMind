import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList
} from 'graphql/type';

var Video = require('../models/video');
//var util = require('util');

/**
 * generate projection object for mongoose
 * @param  {Object} fieldASTs
 * @return {Object}
 */
function getProjection (fieldASTs) {
  if(fieldASTs.length > 1){
    console.warn('length of fieldASTs > 1'); //still figuring out XXX
  }
  try {
    return fieldASTs[0].selectionSet.selections.reduce((projections, selection) => {
      projections[selection.name.value] = 1;
      return projections;
    }, {});
  }
  catch (err){
    console.error(err);
    return {};
  }

}

var typeVideo = new GraphQLObjectType({
  name: 'Video',
  fields: () => ({
    name: {
      type: GraphQLString
    },
    url: {
      type: GraphQLString
    }
  })
});

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {

      hello: {
        type: GraphQLString,
        resolve: function() {
          return 'world';
        }
      },

      video: {
        type: typeVideo,
        args: {
          name: {
            name: 'name',
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: async (root, {name}, source) => {
          var projections = getProjection(source.fieldASTs);
          //console.warn(projections)

          return await Video.findOne({name}, projections);
        }
      },
      videos:{
        type: new GraphQLList(typeVideo),

        resolve: async (root, args, source) => {
          var projections = getProjection(source.fieldASTs);
          //projections._id = 0;
          //console.log(util.inspect(source.fieldASTs[0], false, null));
          return await Video.find({}, projections);
        }
      }

    }
  })
});

export default schema;
