require('dotenv').config();
// Modules
const path = require('path')
const express = require('express');
const Database = require('better-sqlite3');

// Initializing application
const PORT = process.env.PORT || 3000;
const app = express();
const db = new Database(path.join(__dirname,'db','pokemon.db'), { readonly: true })

// Express middleware
app.set("views");
app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (_,res) =>{ res.render('index') });
app.get('/poke-search', (_,res) =>{ res.render('poke-search') });

app.get('/pokemon', (req,res) =>{
    if(req.query){
        let binding = {
            name: req.query.name? `%${req.query.name}%`:'%',
            type1: req.query.type1? req.query.type1:'%',
            type2: req.query.type2? req.query.type2:'%',
            hp: req.query.hp? req.query.hp:1,
            attack: req.query.attack? req.query.attack:1,
            defense: req.query.defense? req.query.defense:1,
            spAttack: req.query["sp-attack"]? req.query["sp-attack"]:1,
            spDefense: req.query["sp-defense"]? req.query["sp-defense"]:1,
            speed: req.query.speed? req.query.speed:1
        };
        const query = db.prepare(`SELECT * FROM pokemon NATURAL JOIN
        (SELECT pokemon_id FROM (SELECT * FROM pokemon_stats 
        WHERE (stat_name='hp' AND base_stat >= :hp)
            OR (stat_name='attack' AND base_stat >= :attack)
            OR (stat_name='defense' AND base_stat >= :defense)
            OR (stat_name='special-attack' AND base_stat >= :spAttack)
            OR (stat_name='special-defense' AND base_stat >= :spDefense)
            OR (stat_name='speed' AND base_stat >= :speed))
        GROUP BY pokemon_id HAVING count(pokemon_id) > 5
        INTERSECT SELECT pokemon_id FROM pokemon_types WHERE type LIKE :type1
        INTERSECT SELECT pokemon_id FROM pokemon_types WHERE type LIKE :type2
        INTERSECT SELECT pokemon_id FROM pokemon WHERE pokemon_name LIKE :name)`);
        const pokemon = query.all(binding);
        return res.render(path.join("partials","poke-search-results"),{results:pokemon});
    }
    const query = db.prepare('SELECT * FROM pokemon');
    const pokemon = query.all();
    res.render(path.join("partials","poke-search-results"),{results:pokemon});
});

app.get('/pokemon/:id', (req,res) =>{
    const query = db.prepare('SELECT * FROM pokemon WHERE pokemon_id=?');
    const pokemon = query.get(req.params.id);
    res.send(pokemon);
});
app.get('/pokemon/:id/stats', (req,res) =>{
    const query = db.prepare('SELECT stat_name,base_stat FROM pokemon NATURAL JOIN pokemon_stats WHERE pokemon_id=?');
    const pokemon = query.all(req.params.id);
    res.send(pokemon);
});


app.listen(PORT, ()=> console.log(`Server running - http://localhost:${PORT}`))

// Close database connection
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));