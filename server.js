require('dotenv').config();
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
app.get('/move-search', (_,res) =>{ res.render('move-search') });

// -------------------- ROUTES RELATED TO POKEMON --------------------
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
        return res.render(path.join("partials","poke-search-results"),{results:pokemon, shiny:req.query.shiny});
    }
    const query = db.prepare('SELECT * FROM pokemon');
    const pokemon = query.all();
    res.render(path.join("partials","poke-search-results"),{results:pokemon, shiny:req.query.shiny});
});

app.get('/pokemon/:id', (req,res) =>{
    // Quite a few queries here, might want to change the amount of data presented in this page?
    const query1 = db.prepare('SELECT type FROM pokemon NATURAL JOIN pokemon_types WHERE pokemon_id=?');
    const query2 = db.prepare('SELECT pokemon_name,stat_name,base_stat FROM pokemon NATURAL JOIN pokemon_stats WHERE pokemon_id=?');
    const query3 = db.prepare('SELECT region_name,location_name,subarea_name,min_level,max_level FROM encounters NATURAL JOIN locations WHERE pokemon_id=?');
    const query4 = db.prepare('SELECT move_id,move_name,type,level,method FROM pokemon_moves NATURAL JOIN moves WHERE pokemon_id=?')
    const types = query1.all(req.params.id);
    if (types.length == 0) return res.render('error',{error:404,message:'Not found'});
    const stats = query2.all(req.params.id);
    const encounters = query3.all(req.params.id);
    const moves = query4.all(req.params.id);
    res.render('pokemon',{name:stats[0].pokemon_name,id:req.params.id,types:types, stats:stats, encounters:encounters, moves:moves});
});

// -------------------- ROUTES RELATED TO MOVES --------------------
app.get('/moves', (req,res) =>{
    if(req.query){
        let binding = {
            name: req.query.name? `%${req.query.name}%`:'%',
            type: req.query.type? req.query.type:'%',
            power: req.query.power? req.query.power:1,
            accuracy: req.query.accuracy? req.query.accuracy:1,
            pp: req.query.pp? req.query.pp:1,
            damage_type: req.query.damage_type?req.query.damage_type:'%'
        }
        const query = db.prepare(`SELECT * FROM moves 
            WHERE move_name LIKE :name
                AND type LIKE :type
                AND power >= :power
                AND accuracy >= :accuracy
                AND pp >= :pp
                AND damage_type LIKE :damage_type`);
        const moves = query.all(binding);
        return res.render(path.join("partials","move-search-results"),{results:moves});
    }
    const query = db.prepare('SELECT * FROM moves');
    const moves = query.all();
    res.render(path.join("partials","move-search-results"),{results:moves});
});
app.get('/moves/:id', (req,res) =>{
    const query1 = db.prepare('SELECT * FROM moves WHERE move_id=?');
    const query2 = db.prepare('SELECT pokemon_id,pokemon_name,level,method FROM pokemon_moves NATURAL JOIN pokemon WHERE move_id=?');
    const move = query1.get(req.params.id);
    if(!move) return res.render('error',{error:404,message:'Not found'});
    const pokemon = query2.all(req.params.id)
    res.render("move",{move:move, pokemon:pokemon});
});

// -------------------- ROUTES RELATED TO LOCATIONS --------------------
app.get('/regions', (_,res) =>{
    const query = db.prepare('SELECT * FROM regions');
    const regions = query.all();
    res.render('regions', {regions});
});

app.get('/regions/:name', (req,res) =>{
    const query = db.prepare('SELECT * FROM locations WHERE region_name=?');
    const locations = query.all(req.params.name);
    if(!locations) return res.render('error',{error:404,message:'Not found'});
    res.render('region', {region:req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1), locations:locations});
});

app.get('/locations/:name/encounters' ,(req,res) =>{
    const query = db.prepare('SELECT * FROM encounters NATURAL JOIN pokemon NATURAL JOIN subareas NATURAL JOIN locations WHERE location_id=?');
    const encounters = query.all(req.params.name);
    res.render('encounters.pug', {encounters:encounters});
});

app.listen(PORT, ()=> console.log(`Server running - http://localhost:${PORT}`))

// Close database connection
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));