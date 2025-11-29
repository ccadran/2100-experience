interface UserConfigItem {
  weight: number;
  percentage: number;
}

export interface userConfigParams {
  plane: UserConfigItem;
  dailyTransport: UserConfigItem;
  food: UserConfigItem;
  energy: UserConfigItem;
  consumption: UserConfigItem;
}
