import { ErrorMessage, Formik } from 'formik';
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { Form } from 'react-router-dom';
import { Button, Header, Table } from 'semantic-ui-react';
import ValidationError from '../../teacher/ValidationError';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { useEffect, useState } from 'react';

interface Props {
    subjectId: string;
    subjectName: string;
}

export default function EditSubject(props: Props) {
    const { subjectStore, modalStore } = useStore();
    const [taken, setTaken] = useState<string[]>();

    useEffect(
        () => setTaken(subjectStore.subjects.map((x) => x.name)),
        [subjectStore.subjects]
    );

    return (
        <Formik
            initialValues={{
                id: props.subjectId,
                name: props.subjectName,
                error: null,
            }}
            onSubmit={(values, { setErrors }) => {
                subjectStore
                    .editSubject(values)
                    .catch((error) => setErrors({ error }));
                modalStore.closeModal();
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .required()
                    .notOneOf(
                        taken || [],
                        'Nazwa zajęta lub taka sama jak obecna.'
                    ),
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
                        content="Edytyj przedmiot"
                        textAlign="center"
                    />
                    
                    <Table style={{border: "none"}}>
                        <Table.Row>
                            <Table.Cell>
                                <Header as="h3" content={`Obecna nazwa: `}/>
                            </Table.Cell>
                            <Table.Cell>
                                <Header as="h3" style={{fontWeight: "normal"}} content={`${props.subjectName}`}/>
                            </Table.Cell>
                        </Table.Row>
                    </Table>
                    <MyTextInput placeholder="Nazwa" name="name" />
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
