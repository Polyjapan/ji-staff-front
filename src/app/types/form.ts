class FormField {
  key: string;
  label: string;
  helpText: string;
  required: boolean;
  order: number;
  additionalData: object;
  validators: BasicValidator[];
}

class BasicValidator {
  type: string;
  message: string;
}

class FormPage {
  pageNumber: number;
  minorOnly: boolean;
  title: string;
  fields: FormField[];
}
