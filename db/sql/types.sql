PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE types(
    type text NOT NULL PRIMARY KEY
);
INSERT INTO types VALUES('normal');
INSERT INTO types VALUES('fighting');
INSERT INTO types VALUES('flying');
INSERT INTO types VALUES('poison');
INSERT INTO types VALUES('ground');
INSERT INTO types VALUES('rock');
INSERT INTO types VALUES('bug');
INSERT INTO types VALUES('ghost');
INSERT INTO types VALUES('steel');
INSERT INTO types VALUES('fire');
INSERT INTO types VALUES('water');
INSERT INTO types VALUES('grass');
INSERT INTO types VALUES('electric');
INSERT INTO types VALUES('psychic');
INSERT INTO types VALUES('ice');
INSERT INTO types VALUES('dragon');
INSERT INTO types VALUES('dark');
INSERT INTO types VALUES('fairy');
INSERT INTO types VALUES('unknown');
INSERT INTO types VALUES('shadow');
COMMIT;
