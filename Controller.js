class Controller {
    constructor() {
        this._model = new Model();
        this._view = new View();
        
        this._startTime     = Date.now();
        this._lag           = 0;
        this._fps           = 60; // Frame rate.
        this._frameDuration = 1000 / this._fps; // Avec 60 frame par seconde, la frame va durer 16.7ms.
        
        this._win;

        this._model.BindDisplay(this.Display.bind(this));
        this._view.BindSetDirection(this.SetDirection.bind(this));
        
        this._model.BindDisplayGameOver(this.DisplayGameOver.bind(this)); //Permet de lier l'affichage du game over. 
         
        this._model.BindDisplayTheEnd(this.DisplayTheEnd.bind(this)); //Permet de lier l'affichage de l'écran de fin.
        this._view.getGrid(this.bindGetGrid.bind(this)); //.bind(this) précise à View de ne pas chercher dans sa propre classe la méthode bindGetGrid() mais celle de controller
    
    }

    bindGetGrid()
    {
        return this._model.getGrid();
    }

    //La méthode Display() affiche les différents éléments du jeu. 
    Display(position, decalagePlateform) {
        this._view.Display(position, decalagePlateform);
    }

    
    //La méthode DisplayGameOver() affiche l'écran Game Over en cas de défaite et arrête l'animation du jeu.
    DisplayGameOver() {        
        this._view.DisplayGameOver();
        cancelAnimationFrame(this.Update.bind(this)); 
    }

    
    //La méthode DisplayTheEnd() affiche l'écran de fin en cas de victoire. 
    DisplayTheEnd() {
        this._win = true; //La variable _win nous permettra d'arrêter le fonctionnement du jeu si la fonction DisplayTheEnd() est appelée. 
        this._view.DisplayTheEnd();
    }

    //Permet de changer la direction du doodle. 
    SetDirection(newDirection) {
        this._model.direction = newDirection;
    }
    
    Update() {
        /* Calcul du deltaTime */
        let currentTime = Date.now();
        let deltaTime   = currentTime - this._startTime; // La durée entre deux appels (entre 2 frames).
        
        this._lag += deltaTime;
        this._startTime = currentTime;
        /* Mettre à jour la logique si la variable _lag est supérieure ou égale à la durée d'une frame */
        while (this._lag >= this._frameDuration) {
            /* Mise à jour de la logique */
            this._model.Move(this._fps);
            /* Réduire la variable _lag par la durée d'une frame */
            this._lag -= this._frameDuration;
        }
        
        //Cette condition permet d'arrêter le jeu si le joueur est arrivé à la fin. Si non, nous le jeu fonctionne et le score est incrémenté. 
        if (this._win == true) {
            this._view.DisplayScore(this._model.getScore());
            cancelAnimationFrame(this.Update.bind(this));
        } else {
        
        this._view.DisplayScore(this._model.getScore());
        requestAnimationFrame(this.Update.bind(this)); // La fonction de rappel est généralement appelée 60 fois par seconde.
    }
    }
}
