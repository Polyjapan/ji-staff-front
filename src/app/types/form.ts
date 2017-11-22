class FormField {
  key: string;
  label: string;
  helpText: string;
  required: boolean;
  order: number;
  additionalData: object;
  validators: object[];
}

class FormPage {
  pageNumber: number;
  minorOnly: boolean;
  title: string;
  fields: FormField[];
}
