class Model {
    static GRAVITY = 20;
    static JUMP_FORCE = 700;
    static SPEED = 200;

    constructor() {
        this._lastdirection = 0; //dernière direction de _direction avant qu'il soit revenu en surplace
        this._direction = 0; //1: droite ; -1: gauche ; 0: surplace  
        this._position = { x: CANVA_WIDTH/2, y: 530 };
        this._ecart = 70; //ecart maximal entre deux plateform : gère la difficulté
        this._currentY = this._position.y;
        
        this._score = 0;

        this._floorY = null; //le sol le plus proche dans la trajection de la chute
        this._gravitySpeed = -Model.JUMP_FORCE;
        this._nbLines = Math.floor(CANVA_HEIGHT / 15) - 1; //nomber de position Y dans le canva où des plateformes peuvent être placées

        this._grid = []; //liste des plateformes
        this.initGrid(); //initialisation des plateformes de la grid au départ
    }

    initGrid() {
        let higher = 0;
        this.generatePlateform(this._nbLines-1, false); //generation d'une première plateforme de start
        for (let ligne = this._nbLines - 2; ligne > 0; ligne--) { //initialisation des prochaines plateformes
            this.generatePlateform(ligne, true);
        }
    }

    generatePlateform(ligne, VoidCase) {  //ligne : numéro de la ligne dans l'axe Y où la placer    ;   VoidCase : selectionne si la ligne doit avoir une probabilité d'être vide ou si on impose de poser uen plateforme
        let higher = CANVA_HEIGHT;  //position Y du sol le plus haut
        if (this._grid.length > 0) { //si la grid n'est pas vide, la plus haute sera la dernière push dans la grid
            higher = this._grid[this._grid.length - 1].getY();
        }
        switch (this.rdm(VoidCase)) { //pioche aléatoir d'une des plateformes ou de vide si VoidCase est true
            case 1:
                this._grid.push(new PlateformVerte(this.rdmCoord(), ligne * 15));
                break;
            case 2:
                this._grid.push(new PlateformBleue(this.rdmCoord(), ligne * 15));
                break;
            case 3:
                this._grid.push(new PlateformBlanche(this.rdmCoord(), ligne * 15));
                break;
            default:    //dans le cas où où pose du vide à cette ligne, si l'écart pour jump serait trop grand alors on impose de poser une plateforme à cette ligne
                if (higher - (ligne + 1) * 15 > 150) {
                    this._grid.push(new PlateformVerte(this.rdmCoord(), ligne * 15));
                    break;
                }
        }
    }


    DisplayGrid() { //affichage de debug de la grid
        for (let i = 0; i < this._nbLines; i++) {
            console.log(this._grid[i].getType(), " ", this._grid[i].getX(), " ", this._grid[i].getY());
        }
    }

    get position() { return this._position; }

    get direction() { return this._direction; }
    set direction(value) {
        if (this._direction != 0) {
            this._lastdirection = this._direction;
        }
        this._direction = value;
    }

    BindDisplay(callback) { //fonction bind pour lancer l'affichage à jour dans View via le Controller
        this.b_Display = callback;
    }

    
    BindDisplayScore(callback) { //fonction bind pour lancer l'affichage (à jour) du score dans View via le Controller
        this.b_DisplayScore = callback;
    }

    
    BindDisplayGameOver(callback) { //fonction bind pour lancer l'affichage du Game Over dans View via le Controller
        this.b_DisplayGameOver = callback;
    }

    
    BindDisplayTheEnd(callback) { //fonction bind pour lancer l'affichage de la fin dans View via le Controller
        this.b_DisplayTheEnd = callback;
    }

    Move(fps) { //mise à jour des positions des entités

        this.updateGrid(); //update des plateformes de la grid (ajoute plateformes au fur est à mesure des sauts)
        this._gravitySpeed += Model.GRAVITY;

        if (this._currentY > 275) //si le doodle n'est pas hors de la limite
        {
            this._position.y = this._currentY; //alors la position réel Y est celle affiché
        } else if (this._gravitySpeed <= 0) //sinon, ce sont les plateformes qui bougent et la position Y du Doodle est bloqué, ça position réel n'est plsu affiché mais continue à être stocké dans currentY
        {
            this._currentY = 275;

            this.updatePlateforms(Math.abs(this._gravitySpeed / fps)); //update des positions Y des plateformes lors de leur animation quand le Doodle est hors de la limite

            //Cette condition permet d'afficher l'écran de fin si le score est supérieur à 10000.
            if (this._score > 1000) {
                this.b_DisplayTheEnd();
                return;
            }
        }

        this._currentY += this._gravitySpeed / fps; //update de la position Y réel du Doodle
        this._position.x += this._direction * Model.SPEED / fps; //update de la position X du Doodle

        //Si le doodle monte alors nous regardons si celui-ci est sur une plateforme. Si c'est le cas, il saute. 
        if (this._gravitySpeed > 0) {
            this._floorY = this.checkCollision();
            if (this._floorY != null) {
                this._Jump();
            } else {
                //Cette condition permet d'afficher l'écran de game over si le doodle tombe hors du canva 
                if (this._currentY > CANVA_HEIGHT - HAUTEUR_DOODLE) {
                    this.b_DisplayGameOver();
                    return;
                }
            }
        }

        //La condition suivante permet au doodle d'ếtre téléporté d'un côté à un autre s'il dépasse la limite horizontale. 
        //Si sa position x est supérieure à la largeur du canva alors nous "téléportons" le doodle de l'autre côté. 
        if (this._position.x > CANVA_WIDTH) { //Si nous dépassons la limite droite du canva. 
            this._position = { x: -50, y: this._position.y }
        } else if (this._position.x < -75) { //Si nous dépassons la limite gauche du canva. 
            this._position = { x: CANVA_WIDTH, y: this._position.y }
        }

        this.updateMovingPlatforms(); //update les animations des plateforms bleues
        this.b_Display(this._position); //appel l'affichage à jour sur View (via le Controller)

    }

    //La méthode checkCollision() vérifie les collisions entre le doodle et les plateformes. Si la plateforme détéctée est blanche alors nous la supprimons. 
    checkCollision() {
        let removedY;
        for (let i = 0; i < this._grid.length; i++) {
            if (this._position.y >= this._grid[i].getY() - HAUTEUR_DOODLE && this._position.y <= this._grid[i].getY()
                && (
                    (this._lastdirection == 1 && this._grid[i].getX() <= this._position.x + LARGEUR_DOODLE - MARGE_TROMPE && this._grid[i].getX() + LONGUEUR_PLATEFORM >= this._position.x) //direction droite
                    ||
                    (this._lastdirection == -1 && this._grid[i].getX() <= this._position.x + LARGEUR_DOODLE && this._grid[i].getX() + LONGUEUR_PLATEFORM >= this._position.x + MARGE_TROMPE) //direction gauche
                )
            ) {
                removedY = this._grid[i].getY();
                //La condition suivante vérifie si la plateforme touchée est nouvelle par rapport à la dernière plateforme touchée. 
                if (this._lastTouchedPlateform !== this._grid[i]) { 
                    this._lastTouchedPlateform = this._grid[i];  //Si la plateforme n'a jamais été touchée nous incrémentons le score de 50. 
                    this._score += 50; 
                }

                if (this._grid[i].getType() == "blanche") { //Si la plateforme touchée est blanche, on la supprime
                    this._grid.splice(i, 1);
                }
                return removedY;
            }
        }
        return null;
    }   

    //La méthode updatePlateforms() fait descendre les plateformes et remplace celles qui sortent du canva par des nouvelles plateformes. 
    updatePlateforms(decalageY) {
        this._grid.forEach(plateform => {
            plateform.setY(plateform.getY() + decalageY); //calcul de la nouvelle position de la plateforme
            if (plateform.getY() > CANVA_HEIGHT + 15) {
                let index = this._grid.indexOf(plateform);
                this._grid.splice(index, 1); //suppr plateforme hors du canva
            }
        });
      
    }

    updateGrid() {
        if (this._grid[this._grid.length - 1].getY() > this._ecart) {
            this.generatePlateform(0, false); //empile une nouvelle plateforme en haut du canva
        }
    }

    _Jump() {
        this._gravitySpeed = -Model.JUMP_FORCE;
    }

    //Permet de récupérer la grid.
    getGrid() {
        return this._grid;
    }

    //Permet de récupérer le score.     
    getScore() {
        return this._score;
    }

    //La méthode rdmCoord() permet de générer une position X aléatoire tout en restant des les dimensions du canva. 
    rdmCoord() {
        return Math.floor(Math.random() * (CANVA_WIDTH - 57));
    }

    //La méthode rdm() permet de définir une probabilité d'apparation différente pour chaque plateforme selon le score actuel du joueur. Plus le score est élevé, plus il a de chance de rencontrer des plateformes blanches.
    rdm(VoidCase) {
        if (VoidCase) {
            return Math.floor(Math.random() * 15) * Math.floor(Math.random() * 2); //Fait un tirage de 0 à 15 (prend en compte le possibilité de vide)
        } else {
            //return Math.floor(Math.random() * 2) + 1;
            let rand;
            switch (true) {
                case this._score < 300:
                    rand = Math.floor(Math.random() * 5) + 1; // Verte : [0-7] ; Bleue : [8-9] ; Blanche : [10-11]
                    if(rand > 0 && rand < 8) return 1
                    if(rand >= 8 && rand < 10) return 2
                    if(rand >= 10 && rand < 12) return 3

                case this._score >= 500 && this._score <= 800:
                    rand = Math.floor(Math.random() * 7) + 1; // Verte : [0-4] ; Bleue : [5-9] ; Blanche : [10-11]
                    this._ecart = 80; 
                    if(rand > 0 && rand < 5) return 1
                    if(rand >= 5 && rand < 10) return 2
                    if(rand >= 10 && rand < 12) return 3

                case this._score > 800:
                    rand = Math.floor(Math.random() * 10) + 1; // Verte : [0-2] ; Bleue : [2-6] ; Blanche : [7-11]
                    this._ecart = 150; 
                    if(rand > 0 && rand < 3) return 1
                    if(rand >= 3 && rand < 6) return 2
                    if(rand >= 6 && rand < 12) return 3
            }


        }

    }

    //La méthode updateMovingPlatforms() met à jour la position des plateformes bleues dans le but de les faire bouger horizontalement. 
    updateMovingPlatforms() {
        for (let i = 0; i < this._grid.length; i++) {
            if (this._grid[i].getType() == "bleue") {
                let newX = this._grid[i].getX() + this._grid[i].getSpeed() * this._grid[i].getDirection();
                this._grid[i].setX(newX);
                if (this._grid[i].getX() <= 0 || this._grid[i].getX() + this._grid[i].getWidth() >= CANVA_WIDTH) {
                    this._grid[i].setDirection(-this._grid[i].getDirection());
                }
            }
        }
    }
}
