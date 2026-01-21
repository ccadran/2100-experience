interface UserConfigItem {
  weight: number;
  percentage: number;
}

export interface UserConfigType {
  plane: UserConfigItem;
  dailyTransport: UserConfigItem;
  food: UserConfigItem;
  energy: UserConfigItem;
  consumption: UserConfigItem;
}

interface impactType {
  name: "fog" | "waterLevel" | "factory" | "rocks" | "fields";
  value: number;
}

export interface worldImpactsType {
  fog: impactType;
  waterLevel: impactType;
  factory: impactType;
  rocks: impactType;
  fields: impactType;
}
