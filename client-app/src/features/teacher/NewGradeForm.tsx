import { Formik, Form, ErrorMessage } from 'formik';
import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import MySelectInput from '../../app/common/form/MySelectInput';
import { gradeType, gradeWeight } from '../../app/common/options/gradeTypesAndWeights';
import MyTextArea from '../../app/common/form/MyTextArea';
import { Student } from '../../app/models/student';
import * as Yup from 'yup';
import ValidationError from './ValidationError';

interface Props {
    student: Student;
    subjectName: string;
    subjectId: string;
}

export default observer(function NewGradeForm({
    student,
    subjectName,
    subjectId,
}: Props) {
    const { gradesStore, userStore, modalStore } = useStore();

    return (
        <Formik
            initialValues={{
                id: '',
                gradeType: 0,
                description: '',
                gradeWeight: 0,
                studentId: student.id,
                subject: subjectId,
                teacher: userStore.user!.id,
                error: null,
            }}
            onSubmit={(values, { setErrors }) => {
                const teacherName =
                    userStore.user!.name + ' ' + userStore.user!.surname;
                gradesStore
                    .addGrade(values, teacherName)
                    .catch((error) => setErrors({ error }));
                modalStore.closeModal();
            }}
            validationSchema={Yup.object({
                gradeType: Yup.number().min(100).max(600),
                description: Yup.string().min(15).required(),
                gradeWeight: Yup.number().min(1).max(6),
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
                        content="Dodaj ocenę"
                        textAlign="center"
                    />

                    <Table style={{border: "none"}}>
                        <Table.Body>
                            <Table.Row >
                                <Table.Cell style={{border: "none"}}>
                                    <Header as="h3"  content={`Uczeń: `}/>
                                </Table.Cell>
                                <Table.Cell style={{border: "none"}}>
                                    <Header as="h3" style={{fontWeight: "normal"}}  content={`${ student.name + ' ' + student.surname}`}/>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell style={{border: "none"}}>
                                    <Header as="h3"  content={`Przedmiot: `}/>
                                </Table.Cell>
                                <Table.Cell style={{border: "none"}}>
                                    <Header as="h3" style={{fontWeight: "normal"}}  content={`${subjectName}`}/>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                    <MySelectInput
                        placeholder="Ocena"
                        name="gradeType"
                        options={gradeType}
                    />
                    <MySelectInput
                        placeholder="Waga"
                        name="gradeWeight"
                        options={gradeWeight}
                    />
                    <MyTextArea
                        placeholder="Opis"
                        name="description"
                        rows={3}
                    />
                    <ErrorMessage
                        name="error"
                        render={() => <ValidationError errors={errors.error} />}
                    />
                    <Button inverted color='green'
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
});
