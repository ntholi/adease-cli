import { Property } from '../../types';
import { capitalize, singular, wordSpace } from '../../utils/word';

export function generateDetailsPage(
  tableName: string,
  properties: Property[]
): string {
  const typeName = capitalize(singular(tableName));
  const fieldViews = properties
    .map(
      (prop) =>
        `<FieldView label='${capitalize(wordSpace(prop.name))}'>{${singular(
          tableName
        )}.${prop.name}}</FieldView>`
    )
    .join('\n        ');

  return `import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from 'adease';
import { notFound } from 'next/navigation';
import { get${typeName}, delete${typeName} } from '../actions';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const ${singular(tableName)} = await get${typeName}(Number(id));
  if (!${singular(tableName)}) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        id={Number(id)}
        title={'${capitalize(wordSpace(singular(tableName)))}'}
        handleDelete={delete${typeName}}
      />
      <DetailsViewBody>
        ${fieldViews}
      </DetailsViewBody>
    </DetailsView>
  );
}`;
}
