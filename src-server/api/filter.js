import { default as config_list } from '../../config/list'
//const config_list = require('../../config/list')
const apiItem = require('./item')

const mongo = require('../mongo')
const db = mongo.getConnection()

export function saveFilter({ user_id, listName, filter }) {
  
  filter.user_id = user_id
  filter.list = listName
  
  let coll = 'filters'
  if (filter._id) {
    
    // update existing filter
    return db.collection(coll).updateOne(
      { _id: filter._id },
      { $set: filter },
      { upsert: true }
    ).then(r => {
      return fetchFilters({ user_id: user_id, listName: listName })
    })
    
  } else {
    
    // create a new filter
    return mongo.getNextId(coll).then(seq => {
      filter._id = seq
      return db.collection(coll).insertOne(filter)
    }).then(r => {
      return fetchFilters({ user_id: user_id, listName: listName })
    })
    
  }
}

export function deleteFilters({ user_id, listName }) {
  return db.collection('filters').deleteMany({
    user_id: user_id,
    list: listName
  }).then(r => {
    return
  })
}

export function deleteFilter({ user_id, listName, filter }) {
  return db.collection('filters').deleteOne({
    user_id: user_id,
    list: listName,
    _id: filter._id
  }).then(r => {
    return fetchFilters({ user_id: user_id, listName: listName })
  })
}

export function fetchFilters({ user_id, listName }) {
  let query = {
    user_id: user_id,
    list: listName
  }
  return db.collection('filters').find(query).toArray()
}

export function copyDefaultFiltersAllLists({ user_id }) {
  return Promise.all(config_list.map(list => {
    return copyDefaultFilters({ user_id: user_id, listName: list.name })
  }))
}

export function copyDefaultFilters({ user_id, listName }) {
  
  let list = config_list.find(list => list.name == listName)
  let coll = 'filters'
  
  let copies = list.defaultFilters.map(filter => {
    return mongo.getNextId(coll).then(seq => {
      return Object.assign({
        _id: seq,
        user_id: user_id,
        list: listName
      }, filter)
    })
  })
  
  return Promise.all(copies).then(copied_filters => {
    console.log('[COPIED FILTERS] ' + listName)
    return db.collection(coll).insertMany(copied_filters)
  }).then(r => {
    return fetchFilters({ user_id: user_id, listName: listName })
  }).catch(e => {
    console.dir(e, {depth: null})
  })
} 

export function fetchFilterTree({ user_id, listName }) {
  
  let list = config_list.find(list => list.name == listName)
  let coll = db.collection(listName + '.' + user_id)
  
  return fetchFilters({ user_id: user_id, listName: listName }).then(filters => {
    
    let facet = {}
    filters.map(filter => {
      
      // each filter
      facet[filter.name] = [
        { $match: apiItem.convertQueries(filter.queries) },
        { $count: 'count' }
      ]
      
      // drilldowns
      if (filter.drilldowns) {
        
        filter.drilldowns.map((field, idx) => {
          
          // match
          let stages = [
            { $match: apiItem.convertQueries(filter.queries) }
          ]
          
          // unwind
          for (let i = 0; i <= idx; i++) {
            let fname = filter.drilldowns[i]
            let fieldType = list.fields.find(f => f.field == fname).type
            if (fieldType == 'array') {
              stages.push({
                $unwind: '$' + fname
              })
            }
          }
          
          // group
          let group_id = {}
          for (let i = 0; i <= idx; i++) {
            let agg_name = filter.drilldowns[i]
            group_id[agg_name.replace(/\./g, '_')] = '$' + agg_name
          }
          stages.push({
            $group: {
              _id: group_id,
              count: { $sum: 1 }
            }
          })
          
          // sort
          stages.push({
            $sort: {
              _id: 1
            }
          })
          
          // facet name
          let facetName = filter.name
          for (let i = 0; i <= idx; i++) {
            facetName += ':' + filter.drilldowns[i]
          }
          facetName = facetName.replace(/\./g, '_')
          
          facet[facetName] = stages
        })
        
      }
    })
    
    //console.dir(facet, { depth: null })
    
    return coll.aggregate([ { $facet: facet } ]).toArray()
    
  }).then(r => {
    
    //console.dir(r, { depth: null })
    
    return fetchFilters({ user_id: user_id, listName: listName }).then(filters => {
      
      let filterTree = []
      
      filters.map(filter => {
        
        let node = {
          name: filter.name,
          count: r[0][filter.name].length ? r[0][filter.name][0].count : 0
        }
        
        if (filter.drilldowns) {
          node.kids = []
          
          for (let i = 0; i < filter.drilldowns.length; i++) {
            
            let facetName = filter.name
            for (let j = 0; j <= i; j++) {
              facetName += ':' + filter.drilldowns[j]
            }
            facetName = facetName.replace(/\./g, '_')
            
            r[0][facetName].map(v => {
              
              if (i == 0) {
                
                node.kids.push({
                  name: v._id[filter.drilldowns[i].replace(/\./g, '_')],
                  count: v.count
                })

              } else {
                
                let currentNode = node
                for (let k = 0; k < i; k++) {
                  let ddField = filter.drilldowns[k].replace(/\./g, '_')
                  currentNode = currentNode.kids.find(kid => kid.name == v._id[ddField])
                }
                
                if (!currentNode.kids) {
                  currentNode.kids = []
                }
                currentNode.kids.push({
                  name: v._id[filter.drilldowns[i].replace(/\./g, '_')],
                  count: v.count
                })
              }
              
            })
            
          }
        }
        
        filterTree.push(node)
      })
      
      return filterTree
    })
  }).catch(e => {
    console.dir(e)
  })
}

export function countFilteredItems(filter) {
  let query = apiItem.convertQueries(filter.queries)
  let coll = db.collection(filter.list + '.' + filter.user_id)
  
  if (filter.drilldowns) {
    
    let agg_id = {}
    filter.drilldowns.map(field => {
      agg_id[field] = '$' + field
    })
    
    return coll.aggregate([
      { $match: query },
      {
        $group: {
          _id: agg_id,
          count: { $sum: 1 }
        }
      }
    ]).toArray()
    
  } else {
    
    return coll.find(query).count().then(count => {
      return {
        name: filter.name,
        count: count
      }
    })
    
  }
}

export function restoreDefaultFilters({ user_id, listName }) {
  let param = {
    user_id: user_id,
    listName: listName
  }
  return deleteFilters(param).then(r => {
    return copyDefaultFilters(param)
  }).then(r => {
    return fetchFilters(param)
  })
}
