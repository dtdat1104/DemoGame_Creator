const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {
   
    @property({
        type: cc.Prefab
    })
    starPrefab: cc.Prefab = null;

    @property
    maxStarDuration = 0;
    @property
    minStarDuration = 0;

    @property({
        type: cc.Node
    })
    ground: cc.Node = null;
    
    @property({
        type: cc.Node
    })
    player: cc.Node = null;
    @property({
        type: cc.Label
    })
    scoreDisplay: cc.Label = null;
    @property({
        type: cc.AudioClip
    })
    scoreAudio: cc.AudioClip = null;
        
    //Declare variable
    groundY;
    timer;
    starDuration;
    score;

    onLoad () {
        this.groundY = this.ground.y + this.ground.height/2;
        this.timer = 0;
        this.starDuration = 0;
        this.spawnNewStar();
        this.score = 0;
    }

    spawnNewStar () {
        var newStar = cc.instantiate(this.starPrefab);
        this.node.addChild(newStar);
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').game = this;
        this.startTimer();
    }

    startTimer () {
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition () {
        var randX = 0;
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        var maxX = this.node.width/2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX, randY);
    }

    gainScore () {
        this.score += 1;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    update (dt) {
        if (this.timer > this.starDuration) {
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    }

    gameOver () {
       this.player.stopAllActions(); 
       cc.director.loadScene('game');
    }
}
