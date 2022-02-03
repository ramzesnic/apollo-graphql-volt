export class ModelUtil {
  static makeAttributes(fields: string[], relations: any): string[] {
    return fields.filter((field) => !Object.keys(relations).includes(field));
  }

  static makeRelations(fields: string[], relations: any): any[] {
    return Object.keys(relations)
      .filter((relation) => fields.includes(relation))
      .map((relation) => relations[relation]);
  }
}
