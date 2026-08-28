import { playerStore } from '../stores';

const MESSAGE_TYPES = {
    MASTER_READY: 'MASTER_READY',
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

                case MESSAGE_TYPES.MASTER_READY:
                    this.handleMasterReady();
                    break;
            }
        };
    }

    announceMaster() {
        playerChannel.postMessage({ type: MESSAGE_TYPES.MASTER_READY });
    }

    handleMasterReady() {
        const state = playerStore.getState();
        if (state.isMaster) return;

        const openViews = {
            ...(state.isMediaOpen && { isMediaOpen: true }),
            ...(state.isPlanOpen && { isPlanOpen: true }),
            ...(state.isTableOpen && { isTableOpen: true }),
        };
        if (Object.keys(openViews).length > 0) this.requestState(openViews);
    }

    handleRequestState(payload) {
        const state = playerStore.getState();
        if (!state.isMaster) return;

        this.setLocalState(payload);

        this.stateUpdate({
            currentTime: state.currentTime,
            duration: state.duration,
            mediaId: state.mediaId,
            missionId: state.missionId,
            playing: state.playing,
            segmentOffset: state.segmentOffset,
            treatmentId: state.treatmentId,
        });
    }

    requestState(payload) {
        this.setLocalState(payload);
        playerChannel.postMessage({
            payload,
            type: MESSAGE_TYPES.REQUEST_STATE,
        });
    }

    sync(payload) {
        this.stateUpdate(payload);
        this.setLocalState(payload);
    }

    stateUpdate(payload) {
        playerChannel.postMessage({
            payload,
            type: MESSAGE_TYPES.STATE_UPDATE,
        });
    }

    setLocalState(payload) {
        playerStore.setState(payload);
    }
}

export const playerService = new PlayerService();
