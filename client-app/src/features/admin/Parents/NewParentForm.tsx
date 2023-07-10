import { ErrorMessage, Formik } from 'formik';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { Form } from 'react-router-dom';
import { Button, Header } from 'semantic-ui-react';
import ValidationError from '../../teacher/ValidationError';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MySelectInput from '../../../app/common/form/MySelectInput';
import {useEffect} from 'react';

export default function NewParentForm() {
    const { modalStore, studentsStore, parentsStore } = useStore();
    const mappedStudents = studentsStore.students
        .filter(st => parentsStore.parents.filter(p => p.studentId === st.id).length === 0)
        .map((student) => ({text: student.name.concat(' ', student.surname), value: student.id}));
    mappedStudents.push({ text: '-', value: '' });
    mappedStudents.sort((a, b) => a.text.localeCompare(b.text))

    return (
        <Formik
            initialValues={{
                id: '',
                name: '',
                surname: '',
                studentId: '',
                email: '',
                error: null
            }}
            onSubmit={(values, { setErrors }) => {
                parentsStore
                    .addParent(values)
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
                        content="Dodaj rodzica"
                        textAlign="center"
                    />
                    <MyTextInput placeholder="Imię" name="name" />
                    <MyTextInput placeholder="Nazwisko" name="surname" />
                    <MyTextInput placeholder="Email" name="email" />
                    <MySelectInput
                        placeholder="Uczeń"
                        name="studentId"
                        options={mappedStudents}
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
