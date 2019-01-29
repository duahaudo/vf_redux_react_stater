import {
	account,
	job,
	jobAllocation,
	jobTag,
	resource,
	serviceAgreementLineItem,
	serviceItem,
	location,
	address,
	relationship
} from "./fields";
import store from "../../store";
import {keyBy, pick} from 'lodash'
import {ACTION_SHOW_LOADING} from "../duck/type";

const showLoading = () => store.dispatch({
	type: ACTION_SHOW_LOADING,
	show: true
});
const hideLoading = () => store.dispatch({
	type: ACTION_SHOW_LOADING,
	show: false
});

// Query
export const fetchDataById = (objectName, id, mapping = {}) => {
	return new Promise((resolve, reject) => {
		const {forceConn} = store.getState().reducer;
		showLoading(forceConn);
		forceConn.sobject(objectName).retrieve(id, (err, result) => {
			hideLoading(forceConn);
			if (err) {
				reject(err);
			} else {
				let formatResult = Object.keys(result).reduce((res, key) => ({...res, [mapping[key] || key]: result[key]}), {});
				resolve(formatResult)
			}
		});
	})
};

export const fetchData = (objName, filter, withFieldsObj) => {
	return new Promise((resolve, reject) => {
		let records = [];
		const {forceConn} = store.getState().reducer;
		const withFields = Object.keys(withFieldsObj);
		const queryStr = `Select ${withFields} from ${objName} where ${filter}`;

		showLoading(forceConn);

		let query = forceConn.query(queryStr)
			.on("record", function(record) {
				delete record.attributes;
				records.push(record);
			})
			.on("end", function() {
				// console.log('Query: %c ' + objName, "color: red;");
				// console.log("total in database : " + query.totalSize);
				// console.log("total fetched : " + query.totalFetched);
				// console.log();

				// console.log(query);
				// console.log(records);
				let formatResult = records.map(item => Object.keys(item).reduce((res, key) => ({...res, [withFieldsObj[key] || key]: item[key]}), {}));
				hideLoading(forceConn);
				resolve(formatResult)
			})
			.on("error", function(err) {
				console.error(err);
				hideLoading(forceConn);
				reject(err)
			})
			.run({ autoFetch : true, maxFetch : 4000 }); // synonym of Query#execute();
	})
};

export const fetchPicklistByObjName = async (objName) => {
	const {forceConn} = store.getState().reducer;
	const jobMetadata = await forceConn.sobject(objName).describe();
	const picklistFields = jobMetadata.fields.filter(item => item.type === "picklist");
	return picklistFields.reduce((result, item) => ({...result, [item.name]: item.picklistValues}), {});
};

export const fetchJob = async (jobId) => {
	let [jobs, followupJobs, jobTags] = await Promise.all([
		fetchData('sked__Job__c', `Id = '${jobId}'`, job),
		fetchData('sked__Job__c', `sked__Parent__c = '${jobId}'`, job),
		fetchData('sked__Job_Tag__c', `sked__Job__c = '${jobId}'`, jobTag)
	]);

	let currentJob = jobs[0];
	let relatedObjPromises = [];

	if (currentJob.AccountId) {
		relatedObjPromises.push(fetchData('Account', `Id = '${currentJob.AccountId}'`, account))
	} else {
		relatedObjPromises.push(Promise.resolve([]))
	}

	if (currentJob.ServiceAgreementLineItemId) {
		relatedObjPromises.push(fetchData('Service_Agreement_Line_Item__c', `Id = '${currentJob.ServiceAgreementLineItemId}'`, serviceAgreementLineItem))
	} else {
		relatedObjPromises.push(Promise.resolve([]))
	}

	if (currentJob.ServiceItemId) {
		relatedObjPromises.push(fetchData('Service_Item__c', `Id = '${currentJob.ServiceItemId}'`, serviceItem))
	} else {
		relatedObjPromises.push(Promise.resolve([]))
	}

	const [accounts, serviceAgreementLineItems, serviceItems] = await Promise.all(relatedObjPromises);

	followupJobs = followupJobs.filter((option) => option.JobStatus !== 'Cancelled');

	return {...currentJob,
		Followups: followupJobs ? followupJobs[0] : null,
		JobTags: [...jobTags],
		Account: accounts[0],
		ServiceAgreementLineItem: serviceAgreementLineItems[0],
		ServiceItem: serviceItems[0]
	}
};

export const fetchJobOnly = (jobId) => fetchDataById('sked__Job__c', jobId, job);

export const fetJobPicklist = () => fetchPicklistByObjName('sked__Job__c');

export const fetchJobAllocation = async (jobId, resourceId) => {
	const jobAllocations = await fetchData('sked__Job_Allocation__c', `sked__Job__c = '${jobId}' and sked__Status__c != 'Deleted'`, jobAllocation);
	return jobAllocations[0];
};

export const fetchResourceByUser = async (userId) => {
	let resources = await fetchData('sked__Resource__c', `sked__User__c = '${userId}'`, resource);
	resources = resources.map(item => ({
		Timezone: item.sked__Primary_Region__r ? item.sked__Primary_Region__r.sked__Timezone__c : '',
		Id: item.Id,
		Name: item.Name
	}));
	return resources[0];
};

export const fetchLocations = async () => {
	return await fetchData('sked__Location__c', `sked__Type__c = 'Clinic' AND sked__Address__c != ''`, location);
};

export const fetchRelationships = async (accountId) => {
	const relationships = await fetchData('Relationship__c', `Client__c = '${accountId}' AND Inactive__c = false AND Primary_Contact__c = true`, relationship);
	const relationshipItem = relationships[0];

	if (!relationshipItem) {
		return null
	}

	const accounts = await  fetchData('Account', `Id = '${relationshipItem.RelatedClientId}'`, account)
	return {...relationshipItem,
		RelatedClient: accounts[0]
	}
};

export const fetchAddresses = async (accountId) => {
	return await fetchData('Address__c', `Client__c = '${accountId}' AND Inactive__c = false`, address);
};

// Update & Insert
export const createUpdate = (objName, params, mapping) => {
	const mappingToSf = Object.keys(mapping).reduce((result, key) => ({...result, [mapping[key]]: key}), {});
	const paramsToSf = Object.keys(params).reduce((result, key) => {
		if (mappingToSf[key]) {
			return {...result, [mappingToSf[key]]: params[key]}
		}

		return {...result, [key]: params[key]}
	}, {});

	// console.log(paramsToSf);

	const {forceConn} = store.getState().reducer;
	return new Promise((resolve, reject) => {
		showLoading(forceConn);
		// Single record creation
		forceConn.sobject(objName)[paramsToSf.Id ? 'update' : 'create'](paramsToSf, (err, ret) => {
			hideLoading(forceConn);
			if (err || !ret.success) {
				reject(err, ret);
			} else {
				forceConn.sobject(objName).retrieve(ret.id, (err, data) => {
					if (err) {
						reject(err);
					} else {
						const formatData = Object.keys(data).reduce((res, key) => ({...res, [mapping[key] || key]: data[key]}), {});
						resolve(formatData)
					}
				})
			}
		});
	})
};

export const createUpdateJob = jobData => createUpdate('sked__Job__c', jobData, job);

export const createUpdateJobAllocation = jobAllocData => createUpdate('sked__Job_Allocation__c', jobAllocData, jobAllocation);
