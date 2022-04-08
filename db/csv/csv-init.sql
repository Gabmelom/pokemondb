DROP TABLE encounters if EXISTS;
DROP TABLE locations if EXISTS;
DROP TABLE moves if EXISTS;
DROP TABLE pokemon_moves if EXISTS;
DROP TABLE pokemon_stats if EXISTS;
DROP TABLE pokemon_types if EXISTS;
DROP TABLE pokemon if EXISTS;
DROP TABLE regions if EXISTS;
DROP TABLE stats if EXISTS;
DROP TABLE subareas if EXISTS;
DROP TABLE types if EXISTS;


CREATE TABLE IF NOT EXISTS encounters(
    pokemon_id integer NOT NULL references pokemon(pokemon_id),
    location_id integer NOT NULL,
    subarea_name text NOT NULL,
    min_level integer,
    max_level integer,
    PRIMARY KEY (pokemon_id,location_id,subarea_name),
    FOREIGN KEY (location_id,subarea_name) references subareas(location_id,subarea_name)
);

CREATE TABLE IF NOT EXISTS locations(
    location_id integer NOT NULL PRIMARY KEY,
    location_name text NOT NULL,
    region_name text NOT NULL references regions(region_name)
);

CREATE TABLE IF NOT EXISTS subareas(
    location_id integer NOT NULL,
    subarea_name text NOT NULL DEFAULT "",
    PRIMARY KEY (location_id, subarea_name),
    FOREIGN KEY (location_id) references locations(location_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS moves(
    move_id integer PRIMARY KEY NOT NULL,
    move_name text NOT NULL,
    type text NOT NULL references types(type),
    power integer,
    pp integer,
    accuracy integer,
    damage_type text,
    flavor_text text
);

CREATE TABLE IF NOT EXISTS pokemon_moves(
    pokemon_id integer NOT NULL references pokemon(pokemon_id),
    move_id integer NOT NULL references moves(move_id),
    level integer NOT NULL DEFAULT 0,
    method text NOT NULL,
    PRIMARY KEY (pokemon_id, move_id, method)
);

CREATE TABLE IF NOT EXISTS pokemon_stats(
    pokemon_id integer NOT NULL references pokemon(pokemon_id),
    stat_name text NOT NULL references stats(stat_name),
    base_stat integer NOT NULL DEFAULT 0,
    PRIMARY KEY (pokemon_id,stat_name)
);

CREATE TABLE IF NOT EXISTS pokemon_types(
    pokemon_id integer NOT NULL references pokemon(pokemon_id),
    type text NOT NULL references types(type),
    slot integer NOT NULL DEFAULT 1,
    PRIMARY KEY (pokemon_id,type)
);

CREATE TABLE IF NOT EXISTS pokemon(
    pokemon_id integer PRIMARY KEY NOT NULL,
    pokemon_name text NOT NULL
);

CREATE TABLE IF NOT EXISTS regions(
    region_name text NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS stats(
    stat_name text NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS types(
    type text NOT NULL PRIMARY KEY
);

.import encounters.csv encounters
.import locations.csv locations
.import moves.csv moves
.import pokemon_moves.csv pokemon_moves
.import pokemon_stats.csv pokemon_stats
.import pokemon_types.csv pokemon_types
.import pokemon.csv pokemon
.import regions.csv regions
.import stats.csv stats
.import subareas.csv subareas
.import types.csv types









-- QUERIES

-- Example: Find Venusaur stats
-- SELECT stat_name,base_stat FROM stats NATURAL JOIN pokemon_stats natural join pokemon where pokemon_id=3;
