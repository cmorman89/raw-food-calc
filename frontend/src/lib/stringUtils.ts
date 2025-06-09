export const parseComponentName = (componentName: string) => {
  switch (componentName) {
    case "MuscleMeat":
      return "Muscle Meat";
    case "BoneyMeat":
      return "Boney Meat";
    case "OrganMeat":
      return "Organ Meat";
    default:
      return componentName;
  }
};
