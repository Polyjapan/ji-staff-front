/**
 * This class represents a Japan Impact edition
 */
class Edition {
  applicationsStart: number;
  applicationsEnd: number;
  year: string;
  conventionStart: number;
  formData: FormPage[];

  get active(): boolean {
    const current = Date.now()

    return current > this.applicationsStart && current < this.applicationsEnd
  }
}
