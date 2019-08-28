namespace whseViz;

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
type X_CORD : Integer; // X Coordinate
type Y_CORD : Integer; // Y Coordinate
type Z_CORD : Integer; // Z Coordinate
type MAX_LENGTH : Integer; // Length
type MAX_WIDTH : Integer; // Width
type MAX_HEIGHT : Integer; // Height

@OData.publish : true
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
    }

    entity binType {
        key whseNo    : LGNUM;
        key binType   : LPTYP;
            maxLength : MAX_LENGTH;
            maxWidth  : MAX_WIDTH;
            maxHeight : MAX_HEIGHT;
    }
    
};