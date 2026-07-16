export default class Player {
    constructor(scene, x, y) {
        this.moveSpeed = 150;
        this.sprite = scene.add.rectangle(x, y, 20, 32, 0x1a472a);
        this.physics = scene.physics.add.existing(this.sprite);
        this.physics.body.setCollideWorldBounds(true);
        this.physics.body.setBounce(0);
        this.physics.body.setDrag(0.9);
    }

    update(inputState) {
        this.physics.body.setVelocityX(0);

        if (inputState.isLeft) {
            this.physics.body.setVelocityX(-this.moveSpeed);
            this.sprite.setScale(-1, 1);
        } else if (inputState.isRight) {
            this.physics.body.setVelocityX(this.moveSpeed);
            this.sprite.setScale(1, 1);
        }
    }
}
