-- QUERY used in poke-search page, returns list of pokemon names and ids that satsify certain conditions
SELECT * from pokemon NATURAL JOIN(
-- Find pokemon_id based on lower-bounded stats
SELECT pokemon_id FROM (SELECT * FROM pokemon_stats 
WHERE (stat_name="hp" AND base_stat >= 20)
    OR (stat_name="attack" AND base_stat >= 20)
    OR (stat_name="defense" AND base_stat >= 20)
    OR (stat_name="special-attack" AND base_stat >= 20)
    OR (stat_name="special-defense" AND base_stat >= 20)
    OR (stat_name="speed" AND base_stat >= 20))
GROUP BY pokemon_id HAVING count(pokemon_id) > 5

-- Find pokemon_id based on type combination
INTERSECT SELECT pokemon_id FROM pokemon_types WHERE type LIKE "grass"
INTERSECT SELECT pokemon_id FROM pokemon_types WHERE type LIKE "%"

-- Find pokemon_id based on name
INTERSECT SELECT pokemon_id FROM pokemon WHERE pokemon_name LIKE "%a%");