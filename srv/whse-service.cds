using { whseViz } from '../db/data-model';

service warehouseService {
  entity Bins @readonly as projection on whseViz.warehouseBins.binTable;
  entity BinTypes @readonly as projection on whseViz.warehouseBins.binType;
}