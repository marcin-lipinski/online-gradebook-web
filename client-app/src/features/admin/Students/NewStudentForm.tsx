import { ErrorMessage, Formik } from 'formik';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { Form } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import ValidationError from '../../teacher/ValidationError';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MySelectInput from '../../../app/common/form/MySelectInput';
import {useEffect} from 'react';

export default function NewStudentForm() {
    const { modalStore, studentsStore, divisionStore } = useStore();
    const mappedDivisions = divisionStore.divisions.map((division) => ({
        text: division.name,
        value: division.id,
    }));

    useEffect(() => {
        mappedDivisions.sort((a, b) => {
            const charComparison = a.text.charAt(0).localeCompare(b.text.charAt(0));
            if (charComparison !== 0) return charComparison;
            return a.text.charAt(1).localeCompare(b.text.charAt(1));
        })
    })

    return (
        <Formik
            initialValues={{
                id: '',
                name: '',
                surname: '',
                divisionId: '',
                email: '',
                error: null,
            }}
            onSubmit={(values, { setErrors }) => {
                studentsStore
                    .addStudent(values)
                    .catch((error) => setErrors({ error }));
                modalStore.closeModal();
            }}
            validationSchema={Yup.object({
                name: Yup.string().required('Imię wymagane').min(2, 'Imię zbyt krótkie'),
                surname: Yup.string().required('Imię wymagane').min(2, 'Nazwisko zbyt krótkie'),
                email: Yup.string().email("Niepoprawna forma emaila").required("Mail wymagany w celu wysłania danych do logowania")
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
                        content="Dodaj ucznia"
                        textAlign="center"
                    />
                    <MyTextInput placeholder="Imię" name="name" />
                    <MyTextInput placeholder="Nazwisko" name="surname" />
                    <MyTextInput placeholder="Email" name="email" />
                    <MySelectInput
                        placeholder="Klasa"
                        name="divisionId"
                        options={mappedDivisions}
                    />
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
