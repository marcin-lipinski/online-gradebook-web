import { Formik, Form, ErrorMessage } from 'formik';
import { Button, Header, Table } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import MySelectInput from '../../app/common/form/MySelectInput';
import { gradeType, gradeWeight} from '../../app/common/options/gradeTypesAndWeights';
import MyTextArea from '../../app/common/form/MyTextArea';
import { Student } from '../../app/models/student';
import * as Yup from 'yup';
import ValidationError from './ValidationError';
import { Grade } from '../../app/models/grade';

interface Props {
    studentList: Student[];
    subjectName: string;
    subjectId: string;
}

export default observer(function NewGradeSerialForm({
    studentList,
    subjectName,
    subjectId,
}: Props) {
    const { gradesStore, userStore, modalStore } = useStore();

    type s = {
        gradeWeight: number;
        description: string;
        subject: string;
        teacher: string;
        error: null;
        grades: { student: Student; grade: number }[];
    };

    const valuesStart: s = {
        gradeWeight: 0,
        description: '',
        subject: subjectId,
        teacher: userStore.user!.id,
        error: null,
        grades: probka(),
    };

    function probka() {
        const temp: { student: Student; grade: number }[] = [];
        studentList.map((s) => temp.push({ student: s, grade: 0 }));
        return temp;
    }

    function mapToListOfStudents(values: typeof valuesStart) {
        var result: Grade[] = [];
        values.grades.forEach((pair) => {
            const temp = {
                id: '',
                gradeWeight: values.gradeWeight,
                studentId: pair.student.id,
                description: values.description,
                subject: values.subject,
                teacher: values.teacher,
                gradeType: pair.grade,
            };
            result.push(temp);
        });

        return result;
    }

    return (
        <Formik
            initialValues={valuesStart}
            onSubmit={(values, { setErrors }) => {
                gradesStore
                    .addManyGrades(mapToListOfStudents(values))
                    .catch((error) => setErrors({ error }));
                modalStore.closeModal();
            }}
            validationSchema={Yup.object({
                description: Yup.string().min(15).required(),
                gradeWeight: Yup.number().min(1).max(6),
                grades: Yup.array()
                    .of(
                        Yup.object().shape({
                            student: Yup.mixed(),
                            grade: Yup.number().min(100).max(600),
                        })
                    )
                    .required('Required'),
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
                        content="Dodaj oceny"
                        textAlign="center"
                    />
                    <Table style={{border: "none"}}>
                        <Table.Body>
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
                        placeholder="Waga"
                        name="gradeWeight"
                        options={gradeWeight}
                    />
                    <MyTextArea
                        placeholder="Opis"
                        name="description"
                        rows={3}
                    />

                    {valuesStart.grades.map((el, index) => (
                        <Table columns={2} key={index}>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={12}>
                                        <Header as="h4">
                                            {el.student.name + ' ' + el.student.surname}
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell width={2}>
                                        <MySelectInput
                                            placeholder="Ocena"
                                            name={`grades[${index}].grade`}
                                            options={gradeType}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    ))}

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
