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
  name: "fog" | "lake" | "factory" | "fields" | "sheeps" | "chickens";
  value: number;
}

export interface worldImpactsType {
  fog: impactType;
  lake: impactType;
  factory: impactType;

  fields: impactType;
  chickens: impactType;
  sheeps: impactType;
}
