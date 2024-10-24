import { Property } from '../../types';
import { capitalize, singular, wordSpace } from '../../utils/word';

export function generateDetailsPage(
  tableName: string,
  properties: Property[]
): string {
  const fieldViews = properties
    .map(
      (prop) =>
        `<FieldView label='${capitalize(wordSpace(prop.name))}'>{item.${
          prop.name
        }}</FieldView>`
    )
    .join('\n        ');

  return `import {
  DetailsView,
  DetailsViewHeader,
  FieldView,
  DetailsViewBody,
} from 'adease';
import { notFound } from 'next/navigation';
import { delete${capitalize(singular(tableName))}, get${capitalize(
    singular(tableName)
  )} } from '../actions';

type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const item = await get${capitalize(singular(tableName))}(Number(id));
  if (!item) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        id={Number(id)}
        title={item.id.toString()}  
        handleDelete={delete${capitalize(singular(tableName))}}
      />
      <DetailsViewBody>
        ${fieldViews}
      </DetailsViewBody>
    </DetailsView>
  );
}`;
}
