let HEXTILES_DOODLE = new Image(); //Image du doodle.
let HEXTILES_BCK = new Image(); //Image de background.
let HEXTILES_PLATEFORM = new Image(); //Image des plateformes. 
  
let HEXTILES_GAME_OVER = new Image(); //Image du game over.
 
let HEXTILES_THE_END = new Image(); //Image de victoire. 

let CANVA_WIDTH = 350 //Constante qui défini la largeur du canva. 
let CANVA_HEIGHT = 500 //Constante qui défini la hauteur du canva. 

let HAUTEUR_DOODLE = 70; //Définit la hauteur du doodle. 
let LARGEUR_DOODLE = 70; //Définit la largeur du doodle. 
let MARGE_TROMPE = 20; //Définit la marge que nous devons avoir pour ne pas prendre en compte la trompe du doodle.
let LONGUEUR_PLATEFORM = 57; //Définit la longeur de la plateforme. 


HEXTILES_DOODLE.src = '../../tiles/lik-right@2x.png'; //Définit le chemin vers l'image du doodle. 
HEXTILES_BCK.src = '../../tiles/bck@2x.png'; //Défini le chemin vers l'image du background. 
HEXTILES_PLATEFORM.src = '../../tiles/game-tiles.png'; //Définit le chemin vers l'image contenant les plateformes. 

HEXTILES_GAME_OVER.src = '../../tiles/game-over.png'; //Définit le chemin vers l'image de game over. 
 
HEXTILES_THE_END.src = '../../tiles/game-tiles.png'; //Définit le chemin vers l'image contenant l'écran de victoire. 

Promise.all([
    new Promise( (resolve) => {HEXTILES_PLATEFORM.addEventListener('load', () => { resolve();}); }), //Attend la chargement de l'image des plateformes. 
    new Promise( (resolve) => {HEXTILES_BCK.addEventListener('load', () => { resolve();}); }), //Attend la chargement de l'image du background. 
    new Promise( (resolve) => {HEXTILES_DOODLE.addEventListener('load', () => { resolve();}); }), //Attend la chargement de l'image du doodle. 
    
    new Promise( (resolve) => {HEXTILES_GAME_OVER.addEventListener('load', () => { resolve();}); }), //Attend la chargement de l'image de game over. 
    
    new Promise( (resolve) => {HEXTILES_THE_END.addEventListener('load', () => { resolve();}); }) //Attend la chargement de l'image de fin. 
])
.then(() => {
        const app = new Controller();
        app.Update();
    });

