import Answers from '../../types/Answers';
import { BaseGenerator } from '../BaseGenerator';
import { Field } from '../../types/Field';
import path from 'path';

class Form extends BaseGenerator {
  constructor(tableName: string, fields: Field[], answers: Answers) {
    super(tableName, fields, answers);
  }

  async generate(): Promise<void> {
    const inputFields = this.fields.map((field) => {
      let type = 'TextInput';
      if (field.type.toLowerCase() === 'number') type = 'NumberInput';
      if (field.type.toLowerCase() === 'date') type = 'DateInput';
      if (field.type.toLowerCase() === 'boolean') type = 'Checkbox';
      return { name: field.name, type };
    });

    const imports = this.fields.map((field) => {
      let importType = 'TextInput';
      if (field.type.toLowerCase() === 'number') importType = 'NumberInput';
      if (field.type.toLowerCase() === 'date') importType = 'DateInput';
      if (field.type.toLowerCase() === 'boolean') importType = 'Checkbox';
      return importType;
    });

    const pathname = path.join(
      this.baseDir,
      'app',
      this.adminDir,
      this.tableName
    );

    await this.compile(`Form/${this.database}.form.ejs`, 'Form.tsx', {
      imports: [...new Set(imports)],
      inputFields: inputFields,
      pathname,
    });
  }
}

export default Form;
