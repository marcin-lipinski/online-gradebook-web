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
    studentId: string;
    studentName: string;
    studentSurname: string;
    divisionId: string;
}

export default function EditStudent(props: Props) {
    const { modalStore, studentsStore, divisionStore } = useStore();
    const mappedDivisions = divisionStore.divisions.map((division) => ({
        text: division.name,
        value: division.id,
    }));
    const currentDivisionName = divisionStore.getDivisionName(props.divisionId);

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
                id: props.studentId,
                name: props.studentName,
                surname: props.studentSurname,
                divisionId: props.divisionId,
                error: null,
            }}
            onSubmit={(values, { setErrors }) => {
                studentsStore
                    .editStudent(values)
                    .catch((error) => setErrors({ error }));
                modalStore.closeModal();
            }}
            validationSchema={Yup.object({
                name: Yup.string().required().min(2, 'Imię niepoprawne!'),
                surname: Yup.string()
                    .required()
                    .min(2, 'Nazwisko niepoprawne!'),
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
                        content="Edytyj dane ucznia"
                        textAlign="center" 
                    />
                    <Table style={{border: "none"}}>
                        <Table.Row>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" content={`Obecne imię: `}/>
                            </Table.Cell>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" style={{fontWeight: "normal"}} content={`${props.studentName}`}/>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" content={`Obecne nazwisko: `}/>
                            </Table.Cell>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" style={{fontWeight: "normal"}} content={`${props.studentSurname}`}/>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" content={`Obecna klasa: `}/>
                            </Table.Cell>
                            <Table.Cell style={{border: "none"}}>
                                <Header as="h3" style={{fontWeight: "normal"}} content={`${currentDivisionName}`}/>
                            </Table.Cell>
                        </Table.Row>
                    </Table>

                    <MyTextInput placeholder="Nazwa" name="name" />
                    <MyTextInput placeholder="Nazwisko" name="surname" />
                    <MySelectInput
                        placeholder={currentDivisionName}
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
                        content="Edytuj"
                        type="submit"
                        fluid
                    />
                </Form>
            )}
        </Formik>
    );
}
