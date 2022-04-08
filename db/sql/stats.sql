PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE stats(
    stat_name text NOT NULL PRIMARY KEY
);
INSERT INTO stats VALUES('hp');
INSERT INTO stats VALUES('attack');
INSERT INTO stats VALUES('defense');
INSERT INTO stats VALUES('special-attack');
INSERT INTO stats VALUES('special-defense');
INSERT INTO stats VALUES('speed');
INSERT INTO stats VALUES('accuracy');
INSERT INTO stats VALUES('evasion');
COMMIT;
