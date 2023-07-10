import { ErrorMessage, Formik } from 'formik';
import { useStore } from '../../../app/stores/store';
import { Form } from 'react-router-dom';
import { Button, Header, Table } from 'semantic-ui-react';
import ValidationError from '../../teacher/ValidationError';
import MyTextInput from '../../../app/common/form/MyTextInput';

interface Props {
    teacherId: string;
    teacherName: string;
    teacherSurname: string;
}

export default function EditTeacher(props: Props) {
    const { teacherStore, modalStore } = useStore();

    return (
        <Formik
            initialValues={{
                id: props.teacherId,
                name: props.teacherName,
                surname: props.teacherSurname,
                error: null,
            }}
            onSubmit={(values, { setErrors }) => {
                teacherStore
                    .editTeacher(values)
                    .catch((error) => setErrors({ error }));
                modalStore.closeModal();
            }}
        >
            {({ handleSubmit, isSubmitting, isValid, dirty, errors }) => (
                <Form
                    className="ui form"
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <Header
                        as="h3"
                        content="Edytyj dane nauczyciela"
                        textAlign="center"
                    />
                    <Table style={{border: "none"}}>
                        <Table.Row>
                            <Table.Cell style={{border: "none"}} >
                                <Header as="h3" content={`Obecne imię: `}/>
                            </Table.Cell>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" style={{fontWeight: "normal"}} content={`${props.teacherName}`}/>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" content={`Obecne nazwisko: `}/>
                            </Table.Cell>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" style={{fontWeight: "normal"}} content={`${props.teacherSurname}`}/> 
                            </Table.Cell>
                        </Table.Row>
                    </Table>

                    <MyTextInput placeholder="Nazwa" name="name" />
                    <MyTextInput placeholder="Nazwisko" name="surname" />
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
