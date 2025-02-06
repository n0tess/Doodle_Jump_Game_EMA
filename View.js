class View {


    constructor(w, h) {
        this._canvas = document.getElementById('my_canvas');
        this.ctx = this._canvas.getContext('2d');
        this._hold_right = false;
        this._hold_left = false;
        this.Grid;
        this._grid;
        this._cellSize = 20;

        this.initCanva();
        this.Events();
        this.padding_heigth = 5;
        
    }

    BindSetDirection(callback) {
        this.b_SetDirection = callback;
    }

    //La méthode Event() affiche le doodle regardant à gauche ou à droite selon qu'elle touche est utilisée. 
    Events() {
        document.addEventListener('keydown', (evt) => {                
            if (evt.key == 'ArrowLeft' || evt.key == 'ArrowRight') {
                switch (evt.key) {
                    case 'ArrowLeft': //Affiche le doodle regardant à gauche.
                        HEXTILES_DOODLE.src = '../../tiles/lik-left@2x.png';
                        this._hold_left = true;
                        this.b_SetDirection(-1);
                        break;
                    case 'ArrowRight': //Affiche le doodle regardant à droite.
                        HEXTILES_DOODLE.src = '../../tiles/lik-right@2x.png';
                        this._hold_right = true;
                        this.b_SetDirection(1);
                        break;
                }
            }
        });

        document.addEventListener('keyup', (evt) => {
            switch (evt.key) {
                case 'ArrowLeft': //Affiche le doodle regardant à gauche.
                    if (!this._hold_right) {
                        this.b_SetDirection(0);
                    }
                    this._hold_left = false;
                    break;
                case 'ArrowRight': //Affiche le doodle regardant à droite.
                    if (!this._hold_left) {
                        this.b_SetDirection(0);
                    }
                    this._hold_right = false;
                    break;
            }
        });
    }

    Display(position) {
        //Dessine l'écran de background. 
        this.ctx.drawImage(
            HEXTILES_BCK,     //image de reference
            1, 1, 500, 1000,//position, taille dans l'image de reference
            1, 1, CANVA_WIDTH, CANVA_HEIGHT
        );
        
        //Dessine le doodle. 
        this.ctx.drawImage(
            HEXTILES_DOODLE,          //image de reference
            1, 1, 200, 200,   //position, taille dans l'image de reference
            position.x, position.y, HAUTEUR_DOODLE, LARGEUR_DOODLE  //position, taille final dans le canva
        );
        

        let dx, dy, plateform;
        
        this._grid = this.Grid();

        this._grid.forEach(plateform => {

            dx = plateform.getX();
            dy = plateform.getY();

            //Utilisation d'un switch pour dessiner la bonne plateforme. 
            switch (plateform.getType()) {
                case "verte":
                    this.ctx.drawImage(
                        HEXTILES_PLATEFORM,          //image de reference.
                        1, 1, 57, 15,   //position, taille dans l'image de reference.
                        dx, dy, 57, 15  //position, taille finale dans le canva.
                    );
                    break;

                case "bleue":
                    this.ctx.drawImage(
                        HEXTILES_PLATEFORM,         //image de reference. 
                        1, 19, 57, 15,  //position, taille dans l'image de reference.
                        dx, dy, 57, 15  //position, taille finale dans le canva.
                    );
                    break;

                case "blanche":
                    this.ctx.drawImage(
                        HEXTILES_PLATEFORM,         //image de reference. 
                        1, 55, 57, 15,  //position, taille dans l'image de reference.
                        dx, dy, 57, 15  //position, taille finale dans le canva.
                    );
                    break;
            }
        });
            
    }
    
    //NEW
    //Cette méthode dessine le score de jeu en cours. 
    DisplayScore(score) {
        this.ctx.fillStyle = "black";  
        this.ctx.font = "20px 'Fredoka One', Helvetica"; 
        this.ctx.textAlign = "left"; 
        this.ctx.fillText("Score : " + score, 10, 30); 
    }

    //NEW
    //Cette méthode dessine l'écran de fin en cas de défaite.
    DisplayGameOver() 
    {
        this.ctx.clearRect(0,0, CANVA_WIDTH, CANVA_HEIGHT); //Clear le canva en cas de défaite. 
        //Dessine l'écran de game over. 
        this.ctx.drawImage( 
            HEXTILES_GAME_OVER,
            1, 130, 400, 450,
            1, 1, CANVA_WIDTH, CANVA_HEIGHT
        );   
    }

    //NEW
    //Cette méthode dessine l'écran de fin en cas de victoire.
    DisplayTheEnd() 
    {
        this.ctx.clearRect(0,0, CANVA_WIDTH, CANVA_HEIGHT); //Clear le canva en cas de victoire. 
        //Dessine l'écran de fin. 
        this.ctx.drawImage( 
            HEXTILES_THE_END,
            600, 250, 290, 260,
            1, 1, CANVA_WIDTH, CANVA_HEIGHT
        );

    }

    getGrid(callback)
    {
        this.Grid = callback;
    };

    initCanva()
    {
       
        this._canvas = document.getElementById('my_canvas'); // Récupération d'une balise HTML par son ID.
        this._canvas.width = CANVA_WIDTH;
        this._canvas.height = CANVA_HEIGHT;
        this.ctx = this._canvas.getContext('2d'); // Récupération de la surface de dessin.
        // this.Display({x: 0, y:0});
    }
    
}
