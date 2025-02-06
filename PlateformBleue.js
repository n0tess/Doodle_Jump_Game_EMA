class PlateformBleue {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60; 
        this.height = 10;
        this.speed = 1;
        this.direction = 1;
    }

    update() {
        this.x += this.speed * this.direction;

        //Si nous atteignons les limites du canva alors nous inversons la direction de la plateforme. 
        if (this.x <= 0 || this.x + this.width >= WIDTH) {
            this.direction *= -1;
        }
    }

    //Retourne le type de la plateforme. 
    getType() {
        return "bleue"; 
    }

    //Retourne la position horizontale de la plateforme. 
    getX() {
        return this.x;
    }

    //Définit une nouvelle position horizontale.
    setX(newX) {
        this.x = newX;
    }

    //Définit une nouvelle position verticale. 
    setY(decalage)
    {
        this.y = decalage;
    }

    //Retourne la position verticale de la plateforme. 
    getY() {
        return this.y;
    }

    //Retourne la vitesse de la plateforme. 
    getSpeed() {
        return this.speed;
    }

    //Retourne la largueur de la plateforme. 
    getWidth() {
        return this.width;
    }

    //Retourne la direction de la plateforme. 
    getDirection() {
        return this.direction;
    }

    //Définit la direction de la plateforme. 
    setDirection(newDirection) {
        this.direction = newDirection;
    }
}