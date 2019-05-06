const {ccclass, property} = cc._decorator;

@ccclass
export default class NewScript extends cc.Component {

    @property
    jumpHeight = 0;
    @property
    jumpDuration = 0;
    @property
    maxMoveSpeed = 0;
    @property
    accel = 0;
    @property({
        type: cc.AudioClip
    })

    //declare variable
    jumpAudio = null;
    accLeft = false;
    accRight = false;
    xSpeed;
    jumpAction;

    // use this for initialization
    onLoad () {
        this.jumpAction = this.setJumpAction();
        this.node.runAction(this.jumpAction);
        this.accLeft = false;
        this.accRight = false;
        this.xSpeed = 0;
        this.setInputControl();
    }

    setInputControl () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:{
                this.accLeft = true;
                break;
            }    
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:{
                this.accRight = true;
                break;
            } 
        }
    }

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:{
                this.accLeft = false;
                break;
            }  
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:{
                this.accRight = false;
                break;
            }    
        }
    }

    setJumpAction () {
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence( jumpUp, jumpDown, callback));
    }

    playJumpSound () {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update (dt) {
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        this.node.x += this.xSpeed * dt;
    }
}
