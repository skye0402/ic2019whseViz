namespace whseViz;

//--- General data types
type TEXTURE : String(100); //Texture to be used for rendering
type MODEL3D : String(100); //3D Model to be used
type UOM : String(3); // Unit of measure

//--- Warehouse bin data related data types
type LGNUM : String(4); // Warehouse Number/Warehouse Complex
type LGPLA : String(18); // Storage Bin
type LGTYP : String(4); // Storage Type
type LGBER : String(4); // Storage Section
type LPTYP : String(4); // Storage Bin Type
type SKZUA : String(1); // Block Indicator: For Stock Removals
type SKZUE : String(1); // Block Indicator: For Putaways
type SKZSI : String(1); // Blocking Indicator: Current Inventory (System)
type MAX_CAPA : Decimal(15, 3); // Total Capacity of Storage Bin
type FCAPA : Decimal(15, 3); // Available Capacity in Storage Bin
type KZLER : String(1); //Indicator Whether Storage Bin is Empty
type KZVOL : String(1); //Indicator Whether Storage Bin is Full
type X_CORD : Decimal(15, 2); // X Coordinate
type Y_CORD : Decimal(15, 2); // Y Coordinate
type Z_CORD : Decimal(15, 2); // Z Coordinate
type MAX_LENGTH : Decimal(15, 2); // Length
type MAX_WIDTH : Decimal(15, 2); // Width
type MAX_HEIGHT : Decimal(15, 2); // Height

//--- Resource related data types
type TAGIDENTIFIER : String(4); // Technical tag ID from RTLS
type METRICCOORDINATE : Integer; // Coordidates from RTLS in meters
type QUALITYOFLOCATION : Integer; // Quality indicator of location from 0..100
type RSRC : String(18); // Resource name from EWM
type RSRC_TYPE : String(4); // Resource type from EWM
type TEXTDATA  : String(40); // Resource description

@OData.publish : true
// All around warehouse storage bins
context warehouseBins {
    entity binTable {
        key whseNo   : LGNUM;
        key binNo    : LGPLA;
            stType   : LGTYP;
            stSect   : LGBER;
            binType  : LPTYP;
            remBlk   : SKZUA;
            putBlk   : SKZUE;
            invBlk   : SKZSI;
            maxCap   : MAX_CAPA;
            freeCap  : FCAPA;
            indEmpty : KZLER;
            indFull  : KZVOL;
            xC       : X_CORD;
            yC       : Y_CORD;
            zC       : Z_CORD;
            unit     : UOM;
    }

    entity binType {
        key whseNo    : LGNUM;
        key binType   : LPTYP;
            maxLength : MAX_LENGTH;
            maxWidth  : MAX_WIDTH;
            maxHeight : MAX_HEIGHT;
            unit      : UOM;
            texture   : TEXTURE;
    }
};

// All around warehouse resources
context whseResources {
        // Data coming in from RTLS
        entity rtlsTagData {
            key tagID   : TAGIDENTIFIER;
                x       : METRICCOORDINATE;
                y       : METRICCOORDINATE;
                z       : METRICCOORDINATE;
                quality : QUALITYOFLOCATION;
        };

        // Used from the EWM Data model defining resource characteristics
        entity resourceType {
            key whseNo   : LGNUM;
            key rsrcType : RSRC_TYPE;
            	descr	 : TEXTDATA;
            	model3D	 : MODEL3D;
        };
        
        // The actual resource working (e.g. a specfic worker, forklift etc)
        entity resource {
            key whseNo   : LGNUM;
            key rsrc     : RSRC;
                rsrcType : RSRC_TYPE;
                // Added to standard model
                tagID    : TAGIDENTIFIER;
        };
        
        // Combined view on resource data
        view resourceData as select from 
        	resource as r inner join resourceType as rT 
        		on ( ( r.whseNo = rT.whseNo ) and ( r.rsrcType = rT.rsrcType ) ) 
        	inner join rtlsTagData as rD on (( r.tagID = rD.tagID ))
        	{ 
	        	key r.whseNo, 
	        	key r.rsrc, 
	        	r.tagID, 
	        	rT.descr, 
	        	rT.model3D, 
	        	rD.x / 1000 as x : Decimal(15,2), 
	        	rD.y / 1000 as y : Decimal(15,2), 
	        	rD.z / 1000 as z : Decimal(15,2)
        	};
};