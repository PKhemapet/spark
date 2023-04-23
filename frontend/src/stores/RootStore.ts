import { makeAutoObservable } from "mobx";
import AccountStore, { ISerializedAccountStore } from "@stores/AccountStore";
import SettingsStore, { ISerializedSettingsStore } from "@stores/SettingsStore";
import NotificationStore from "@stores/NotificationStore";
import OrdersStore from "@stores/OrdersStore";
import TradesStore from "@stores/TradesStore";

export interface ISerializedRootStore {
  accountStore?: ISerializedAccountStore;
  settingsStore?: ISerializedSettingsStore;
}

export default class RootStore {
  public accountStore: AccountStore;
  public settingsStore: SettingsStore;
  public notificationStore: NotificationStore;
  public ordersStore: OrdersStore;
  public tradesStore: TradesStore;

  constructor(initState?: ISerializedRootStore) {
    this.accountStore = new AccountStore(this, initState?.accountStore);
    this.settingsStore = new SettingsStore(this);
    this.notificationStore = new NotificationStore(this);
    this.ordersStore = new OrdersStore(this);
    this.tradesStore = new TradesStore(this);
    makeAutoObservable(this);
  }

  serialize = (): ISerializedRootStore => ({
    accountStore: this.accountStore.serialize(),
  });
}
