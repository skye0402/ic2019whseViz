// Here we define our node.js-provided OData v4 services
using { whseViz } from '../db/data-model';

// Provide storage bin data
service warehouseService {
	entity Bins @readonly as projection on whseViz.warehouseBins.binTable;
	entity BinTypes @readonly as projection on whseViz.warehouseBins.binType;
};

// Provide resource and location data
service resourceService {
	entity Resource @readonly as projection on whseViz.whseResources.resourceData;
};