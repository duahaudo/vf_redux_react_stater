export const job = {
	Id: 'Id',
	Name: 'Name',
	sked__Account__c: 'AccountId',
	Funding_Source__c: 'FundingSource',
	Funding_Type__c: 'FundingType',
	Short_Service__c: 'ShortService',
	Location_Type__c: 'LocationType',
	Location_Telephone__c: 'LocationTelephone',
	Service_Item__c: 'ServiceItemId',
	Service_Agreement_Line_Item__c: 'ServiceAgreementLineItemId',
	Service_Agreement__c: 'ServiceAgreementId',
	Check_Resources_Availibilities__c: 'CheckResourcesAvailabilities',
	Has_Checked_Resources_Availabilities__c: 'HasCheckedResourcesAvailabilities',
	Can_Assign_Resources__c: 'CanAssignResources',
	sked__Parent__c: 'ParentId',
	sked__Job_Status__c: 'JobStatus',
	sked__Start__c: 'Start',
	sked__Finish__c: 'End',
	sked__Duration__c: 'Duration',
	sked__Address__c: 'Address',
	sked__Location__c: 'LocationId',
	sked__Job_Allocation_Count__c: 'JobAllocationCount',
	sked__GeoLocation__c: 'GeoLocation',
	sked__Notes_Comments__c: 'NotesComments',
	sked__Urgency__c: 'Urgency',
	sked__Contact__c: 'ContactId',
	sked__Description__c: 'Description',
	sked__Region__c: 'RegionId',
	sked__Timezone__c: 'Timezone',
	sked__Type__c: 'Type'
};

export const jobTag = {
	Id: 'Id',
	Name: 'Name',
	sked__Tag__c: 'TagId',
	sked__Required__c: 'Required',
	sked__Weighting__c: 'Weighting',
	sked__Job__c: 'JobId'
};

export const account = {
	Id: 'Id',
	Name: 'Name',
	PersonMailingStreet: 'PersonMailingStreet',
	PersonMailingCity: 'PersonMailingCity',
	PersonMailingState: 'PersonMailingState',
	PersonMailingPostalCode: 'PersonMailingPostalCode',
	PersonMailingCountry: 'PersonMailingCountry',
	PersonHomePhone: 'PersonHomePhone',
	PersonMobilePhone: 'PersonMobilePhone',
	PersonEmail: 'PersonEmail'
};

export const serviceAgreementLineItem = {
	Id: 'Id',
	Name: 'Name',
	Can_Book_Appointments__c: 'CanBookAppointments',
	Hours_Outstanding__c: 'HoursOutstanding'
};

export const serviceItem = {
	Id: 'Id',
	Name: 'Name',
	Item_Description_L3__c: 'ServiceItemDescription'
};

export const jobAllocation = {
	Id: 'Id',
	Name: 'Name',
	sked__Job__c: 'JobId',
	sked__Resource__c: 'ResourceId',
	sked__Status__c: 'Status',
	sked__Time_Responded__c: 'TimeResponded'
};

export const resource = {
	Id: 'Id',
	Name: 'Name',
	sked__User__c: 'UserId',
	sked__Primary_Region__c: 'PrimaryRegionId',
	['sked__Primary_Region__r.sked__Timezone__c']: 'Timezone'
};

export const location = {
	Id: 'Id',
	Name: 'Name',
	sked__Address__c: 'Address',
	sked__GeoLocation__c: 'GeoLocation',
	sked__Account__c: 'AccountId',
	sked__Type__c: 'Type'
};

export const relationship = {
	Id: 'Id',
	Name: 'Name',
	Client__c: 'AccountId',
	Inactive__c: 'Inactive',
	Primary_Contact__c: 'PrimaryContact',
	Related_Client__c: 'RelatedClientId'
}

export const address = {
	Id: 'Id',
	Name: 'Name',
	Client__c: 'AccountId',
	Inactive__c: 'Inactive',
	Full_Address__c: 'FullAddress',
	Type__c: 'Type'
}
