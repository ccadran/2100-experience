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
  name: "fog" | "waterLevel" | "factory" | "fields" | "sheeps" | "chickens";
  value: number;
}

export interface worldImpactsType {
  fog: impactType;
  waterLevel: impactType;
  factory: impactType;

  fields: impactType;
  chickens: impactType;
  sheeps: impactType;
}
