PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE regions(
    region_name text NOT NULL PRIMARY KEY
);
INSERT INTO regions VALUES('kanto');
INSERT INTO regions VALUES('johto');
INSERT INTO regions VALUES('hoenn');
INSERT INTO regions VALUES('sinnoh');
INSERT INTO regions VALUES('unova');
INSERT INTO regions VALUES('kalos');
INSERT INTO regions VALUES('alola');
INSERT INTO regions VALUES('galar');
COMMIT;
