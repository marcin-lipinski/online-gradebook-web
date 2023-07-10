import { ErrorMessage, Formik } from 'formik';
import { useStore } from '../../../app/stores/store';
import { Form } from 'react-router-dom';
import { Button, Header, Table } from 'semantic-ui-react';
import ValidationError from '../../teacher/ValidationError';
import MyTextInput from '../../../app/common/form/MyTextInput';
import * as Yup from 'yup';
import MySelectInput from '../../../app/common/form/MySelectInput';
import {useEffect} from 'react';

interface Props {
    parentId: string;
    parentName: string;
    parentSurname: string;
    studentId: string;
}

export default function EditParent(props: Props) {
    const { parentsStore, modalStore, studentsStore } = useStore();
    const currentStudent = studentsStore.getStudentById(props.studentId);
    const currentStudentNameSurname = currentStudent
        ? currentStudent.name.concat(' ', currentStudent.surname)
        : '';

    const mappedStudents = studentsStore.students
        .filter(st => parentsStore.parents.filter(p => p.studentId === st.id).length === 0)
        .map((student) => ({
            text: student.name.concat(' ', student.surname),
            value: student.id,
        }));
    mappedStudents.push({ text: '-', value: '' });
    mappedStudents.sort((a, b) => a.text.localeCompare(b.text))

    return (
        <Formik
            initialValues={{
                id: props.parentId,
                name: props.parentName,
                surname: props.parentSurname,
                studentId: props.studentId,
                error: null,
            }}
            onSubmit={(values, { setErrors }) => {
                parentsStore
                    .editParent(values)
                    .catch((error) => setErrors({ error }));
                modalStore.closeModal();
            }}
            validationSchema={Yup.object({
                name: Yup.string().required().min(2, 'Imię niepoprawne!'),
                surname: Yup.string()
                    .required()
                    .min(2, 'Nazwisko niepoprawne!'),
                studentId: Yup.string().nonNullable(),
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
                        content="Edytyj dane rodzica"
                        textAlign="center"
                    />
                    <Table style={{border: "none"}}>
                        <Table.Row>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" content={`Obecne imię: `}/>
                            </Table.Cell>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" style={{fontWeight: "normal"}} content={`${props.parentName}`}/>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" content={`Obecne nazwisko: `}/>
                            </Table.Cell>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" style={{fontWeight: "normal"}} content={`${props.parentSurname}`}/>
                            </Table.Cell>
                        </Table.Row>
                    </Table>

                    <MyTextInput placeholder="Nazwa" name="name" />
                    <MyTextInput placeholder="Nazwisko" name="surname" />
                    <MySelectInput
                        placeholder={currentStudentNameSurname}
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
                        content="Edytuj "
                        type="submit"
                        fluid
                    />
                </Form>
            )}
        </Formik>
    );
}
