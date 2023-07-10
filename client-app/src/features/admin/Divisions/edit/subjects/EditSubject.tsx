import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';
import { Form } from 'react-router-dom';
import { Button, Header, Table } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { DivisionSubject2 } from '../../../../../app/stores/divisionSubjectsStore';
import { useStore } from '../../../../../app/stores/store';
import MySelectInput from '../../../../../app/common/form/MySelectInput';
import ValidationError from '../../../../teacher/ValidationError';
import { observer } from 'mobx-react-lite';

interface Props {
    subject: DivisionSubject2
}

export default observer(function EditSubject({subject}: Props) {
    const { subjectStore, modalStore, teacherStore, divisionSubjectStore } = useStore();
    const [taken, setTaken] = useState<string | undefined>();
    const {teachers} = teacherStore;
    const {editDivisonSubject} = divisionSubjectStore;
    const [teachersList, setTeachersList] = useState<{text: string, value: string}[]>([]);

    useEffect( () =>
        createOptions()
        ,[subjectStore.subjects]
    );

    function createOptions () {
        setTaken(subject.teacherName);
        const tempTeachers: {text: string, value: string}[] = [];
        teachers.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname));
        teachers.forEach(t => tempTeachers.push({text: t.name + " " + t.surname, value: t.id}));
        setTeachersList(tempTeachers);
    }

    function editSubject(values: { teacherId: string, error: null,}) {
        const edited: DivisionSubject2 = {
            id: subject.id,
            subjectId: subject.subjectId,
            subjectName: subject.subjectName,
            teacherName: teachersList.find(x => x.value == values.teacherId)?.text!,
            teacherId: values.teacherId,
            divisionId: subject.divisionId
        }   
        editDivisonSubject(edited)
        window.location.reload();
    }

    return (
        <Formik
            initialValues={{
                teacherId: subject.teacherName,
                error: null,
            }}
            onSubmit={(values, { setErrors }) => {
                editSubject(values);
                modalStore.closeModal();
            }}
            validationSchema={Yup.object({
                teacherId: Yup.string()
                    .required()
                    .notOneOf(
                        [taken],
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
                                <Header as="h3"  content={`Obecny nauczyciel: `} />
                            </Table.Cell>
                            <Table.Cell>
                                <Header as="h3" style={{fontWeight: "normal"}}  content={`${subject.teacherName}`} /> 
                            </Table.Cell>
                        </Table.Row>
                    </Table>
                    <MySelectInput placeholder="Nauczyciel" name="teacherId" options={teachersList}/>
                    <ErrorMessage
                        name="error"
                        render={() => <ValidationError errors={errors.error} />}
                    />
                    <Button
                        color="blue"
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting}
                        content="Zmień nauczyciela "
                        type="submit"
                        fluid
                    />
                </Form>
            )}
        </Formik>
    );
})
