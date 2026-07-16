export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.moveSpeed = 150;
        this.velocityX = 0;
        this.sprite = scene.add.rectangle(x, y, 20, 32, 0x1a472a);
    }

    update(inputState) {
        this.velocityX *= 0.85;

        if (inputState.isLeft) {
            this.velocityX = -this.moveSpeed;
            this.sprite.setScale(-1, 1);
        } else if (inputState.isRight) {
            this.velocityX = this.moveSpeed;
            this.sprite.setScale(1, 1);
        }

        this.sprite.x += this.velocityX * 0.016;

        const minX = 16, maxX = this.scene.game.config.width - 16;
        if (this.sprite.x < minX) this.sprite.x = minX;
        if (this.sprite.x > maxX) this.sprite.x = maxX;
    }
}
