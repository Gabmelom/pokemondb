document.body.onload = () =>{
    document.getElementById("search").addEventListener('click',pokeSearch);
}

function pokeSearch(event){
    event.stopPropagation();
    // Build query string
    const fields = ["name","type1","type2","hp","speed","attack","defense","sp-attack","sp-defense"];
    let query = {};
    let queryString = "";
    for (let field of fields){
        const value = document.getElementById(field).value;
        if(value) query[field] = value;
    }
    query.shiny = document.getElementById("shiny").checked
    for (const [key,value] of Object.entries(query)){
        if (!queryString) queryString += "?"
        queryString += `${key}=${value}&`
    }
    queryString = queryString.slice(0,queryString.length-1);
    
    // Send AJAX request
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.readyState==XMLHttpRequest.DONE &&this.status==200){
            const container = document.getElementById("results");
            container.innerHTML = this.responseText;
            container.style = "display:block";
        }
    }
    xhr.open("GET",`/pokemon${queryString}`);
    xhr.setRequestHeader("Accept","text/html");
    xhr.send();
}