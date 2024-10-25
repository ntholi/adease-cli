import { Property } from '../../types';
import { capitalize, singular, wordSpace } from '../../utils/word';

export function generateDetailsPage(
  tableName: string,
  properties: Property[]
): string {
  const service = `${singular(tableName)}Service`;
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
import { ${service} } from '@/server/${tableName}/service';


type Props = {
  params: {
    id: string;
  };
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const ${singular(tableName)} = await ${service}.get(Number(id));
  if (!${singular(tableName)}) {
    return notFound();
  }

  return (
    <DetailsView>
      <DetailsViewHeader
        id={Number(id)}
        title={'${capitalize(wordSpace(singular(tableName)))}'}
        handleDelete={${service}.delete}
      />
      <DetailsViewBody>
        ${fieldViews}
      </DetailsViewBody>
    </DetailsView>
  );
}`;
}
