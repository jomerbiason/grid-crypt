import Phaser from 'phaser';

export function spawnExplosion(scene: Phaser.Scene, x: number, y: number, color = 0xffaa4a): void {
    for (let i = 0; i < 8; i += 1) {
        const angle = (Math.PI * 2 * i) / 8;
        const particle = scene.add.circle(x, y, 2.5, color);

        scene.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * 26,
            y: y + Math.sin(angle) * 26,
            alpha: 0,
            duration: 260,
            ease: 'Cubic.Out',
            onComplete: () => particle.destroy(),
        });
    }
}
