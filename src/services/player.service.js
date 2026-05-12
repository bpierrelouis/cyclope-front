import { usePlayerStore } from '../stores/playerStore';

const MESSAGE_TYPES = {
    REQUEST_STATE: 'REQUEST_STATE',
    STATE_UPDATE: 'STATE_UPDATE',
};

const playerChannel = new BroadcastChannel('player-channel');

class PlayerService {

    constructor() {
        this.init();
    }

    init() {
        playerChannel.onmessage = (event) => {
            const message = event.data;
            switch (message.type) {

                case MESSAGE_TYPES.REQUEST_STATE:
                    this.handleRequestState(message.payload);
                    break;

                case MESSAGE_TYPES.STATE_UPDATE:
                    this.setLocalState(message.payload);
                    break;
            }
        };
    }

    handleRequestState(payload) {
        const state = usePlayerStore.getState();
        if (!state.isMaster) return;

        this.setLocalState(payload);

        this.stateUpdate({
            playing: state.playing,
            currentTime: state.currentTime,
            duration: state.duration,
            media: state.media,
        });
    }

    requestState(payload) {
        playerChannel.postMessage({
            type: MESSAGE_TYPES.REQUEST_STATE,
            payload,
        });
    }

    sync(payload) {
        this.stateUpdate(payload);
        this.setLocalState(payload);
    }

    stateUpdate(payload) {
        playerChannel.postMessage({
            type: MESSAGE_TYPES.STATE_UPDATE,
            payload,
        });
    }

    setLocalState(payload) {
        usePlayerStore
            .getState()
            .setStatePartial(payload);
    }
}

export const playerService = new PlayerService();