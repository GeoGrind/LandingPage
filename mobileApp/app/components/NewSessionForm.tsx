import * as React from 'react';
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form,
  Field,
  FieldProps,
} from 'formik';
import { Button } from 'react-native';

interface MyFormValues {
  firstName: string;
}

export const NewSessionForm: React.FC<{}> = () => {
  const initialValues: MyFormValues = { firstName: '' };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field id="firstName" name="firstName" placeholder="First Name" />
          <Button onPress={() => (console.log("test"))} title='Submit'/>
        </Form>
      </Formik>
    </div>
  );
};