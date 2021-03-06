import { makeAutoObservable, runInAction } from "mobx";
import { gameApi } from "shared/api.events";
import { NetLibraryConnectionState, SDKGameProcessState } from "shared/native.enums";
import { onApiMessage, sendApiMessage } from "utils/api";

export const GameState = new class GameState {
  constructor() {
    makeAutoObservable(this);

    onApiMessage(gameApi.ack, (data) => runInAction(() => {
      this.launched = data.gameLaunched;
      this.processState = data.gameProcessState;
      this.connectionState = data.connectionState;
    }));

    onApiMessage(gameApi.gameLaunched, this.setLaunched);
    onApiMessage(gameApi.gameProcessStateChanged, this.setProcessState);
    onApiMessage(gameApi.connectionStateChanged, this.setConnectionState);
  }

  public ack() {
    sendApiMessage(gameApi.ack);
  }

  public launched = false;
  private setLaunched = (launched) => this.launched = launched;

  public processState = SDKGameProcessState.GP_STOPPED;
  private setProcessState = ({ current }) => this.processState = current;

  public connectionState = NetLibraryConnectionState.CS_IDLE;
  private setConnectionState = ({ current }) => this.connectionState = current;
};
