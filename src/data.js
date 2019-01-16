import DataHelper from '../dataHelper'
// import * as mockData from './mock'
import {
  objectToManaged,
  managedItemsToObject
} from '@skedulo/uranium'

if (!global || !global._babelPolyfill) {
  require('babel-polyfill')
}

export default wrapper;

function wrapper(httpLibs, utils) {
  const dataHelper = new DataHelper(httpLibs, utils);

  const objNeedPermissions = ['Jobs', 'Contacts'];
  const [jobCrud, contactCrud] = dataHelper.createCrudArray(objNeedPermissions);


  function fetch(jobIds) {
    return Promise
      .all([
        dataHelper.crudFetchData(jobCrud, `UID IN $1`, [jobIds])
      ])
      .then(([]) => buildDataStruct(jobIds))
      .catch(error => dataHelper.queryErrorHandler(jobIds, error))
  }

  function buildDataStruct(jobIds) {

    const retObj = jobIds
      .map(jobId => {

        const obj = { 
          jobId
        };

        return { [jobId]: obj }
      })
      .reduce((acc, e) => _.assign(acc, e), {});

    return {
      main: retObj,
      common: { }
    }
  }

  function save(data) {
      return saveBulk([data])
  }
  function saveBulk(saveArray) {
    const cleaned = _.compact(saveArray);

    const jobIds = _.uniq(_.flatten(cleaned.map(items => Object.keys(items))));
    //const jobItems = _.compact(_.flatten(_.flatten(cleaned.map(items => _.values(items))).map(i => i.jobs)))

    return saveItems(jobIds)
  }
  
  function saveItems(jobIds) {
    return fetch(jobIds)
      .then(result => _.pick(result, 'main'))
  }

  return { fetch, save, saveBulk };

}
