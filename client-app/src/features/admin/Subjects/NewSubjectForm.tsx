import { ErrorMessage, Formik } from 'formik';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { Form } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import ValidationError from '../../teacher/ValidationError';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { useEffect, useState } from 'react';

export default function NewSubjectForm() {
    const { subjectStore, modalStore } = useStore();
    const [taken, setTaken] = useState<string[]>();

    useEffect(
        () => setTaken(subjectStore.subjects.map((x) => x.name)),
        [subjectStore.subjects]
    );

    return (
        <Formik
            initialValues={{ id: '', name: '', error: null }}
            onSubmit={(values, { setErrors }) => {
                subjectStore
                    .addSubject(values)
                    .catch((error) => setErrors({ error }));
                modalStore.closeModal();
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .required()
                    .notOneOf(taken || [], 'Nazwa zajęta!'),
            })}
        >
            {({ handleSubmit, isSubmitting, isValid, dirty, errors }) => (
                <Form
                    className="ui form"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <Header
                        as="h3"
                        content="Dodaj przedmiot"
                        textAlign="center"
                    />
                    <MyTextInput placeholder="Nazwa" name="name" />
                    <ErrorMessage
                        name="error"
                        render={() => <ValidationError errors={errors.error} />}
                    />
                    <Button
                        color="blue"
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting}
                        content="Dodaj "
                        type="submit"
                        fluid
                    />
                </Form>
            )}
        </Formik>
    );
}
