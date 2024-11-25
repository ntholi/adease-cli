import { ZodObject, ZodTypeAny } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Stack, StackProps } from '@mantine/core';
import React, { useState } from 'react';
import FormHeader from './FormHeader';

export type FormProps<T> = {
  children: React.ReactNode;
  action: (values: T) => Promise<T>;
  schema?: ZodObject<{ [K in any]: ZodTypeAny }>;
  defaultValues?: T;
  title?: string;
  onSuccess?: (values: T) => void;
  onError?: (error: Error) => void;
} & StackProps;

export function Form<T extends Record<string, any>>({
  schema,
  defaultValues,
  action,
  title,
  children,
  onSuccess,
  onError,
  ...props
}: FormProps<T>) {
  const [pending, setPending] = useState(false);
  const form = useForm<T>({
    validate: schema && zodResolver(schema),
    initialValues: defaultValues,
  });

  async function handleSubmit(values: T) {
    try {
      setPending(true);
      const result = await action(values);
      onSuccess?.(result);
    } catch (err) {
      console.error(err);
      notifications.show({
        title: 'Error',
        message:
          err instanceof Error ? err.message : 'An unexpected error occurred',
        color: 'red',
      });
      onError?.(err as Error);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormHeader title={title} isLoading={pending} />
      <Stack p={'xl'} {...props}>
        {React.Children.map(children, (child) => addFormProps(child, form))}
      </Stack>
    </form>
  );
}

function addFormProps(child: React.ReactNode, form: any): React.ReactNode {
  if (!React.isValidElement(child)) return child;

  const childElement = child as React.ReactElement;
  const newProps = { ...childElement.props };

  if (childElement.props.name) {
    Object.assign(newProps, form.getInputProps(childElement.props.name));
  }

  if (childElement.props.children) {
    newProps.children = React.Children.map(
      childElement.props.children,
      (grandChild) => addFormProps(grandChild, form)
    );
  }

  return React.cloneElement(childElement, newProps);
}
