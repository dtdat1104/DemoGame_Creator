const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {
    @property
    pickRadius = 0;
    game;
    getPlayerDistance () {
        var playerPos = this.game.player.getPosition();
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    }

    onPicked () {
        this.game.spawnNewStar();
        this.game.gainScore();
        this.node.destroy();
    }

    update (dt) {
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return;
        }
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
}
