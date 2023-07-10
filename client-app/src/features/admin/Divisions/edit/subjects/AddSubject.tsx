import { ErrorMessage, Formik } from "formik";
import * as Yup from 'yup';
import { useStore } from "../../../../../app/stores/store";
import { useState, useEffect } from "react";
import { DivisionSubject2 } from "../../../../../app/stores/divisionSubjectsStore";
import { Division } from "../../../../../app/models/division";
import { Form } from "react-router-dom";
import { Button, Header } from "semantic-ui-react";
import MySelectInput from "../../../../../app/common/form/MySelectInput";
import ValidationError from "../../../../teacher/ValidationError";

interface Props {
    division: Division,
    assignedSubjectsId: string[]
}

export default function AddSubject({division, assignedSubjectsId}: Props) {
    const {teacherStore, subjectStore, modalStore, divisionSubjectStore} = useStore();
    const {teachers} = teacherStore;
    const {subjects} = subjectStore;
    const {addDivisionSubject} = divisionSubjectStore;

    const [teachersList, setTeachersList] = useState<{text: string, value: string}[]>([]);
    const [notAssignedSubjects, setNotAsignedSubjects] = useState<{text: string, value: string}[]>([]);

    useEffect(() => {
        const tempTeachers: {text: string, value: string}[] = [];
        const tempSubjects: {text: string, value: string}[] = [];
        teachers.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname));
        subjects.sort((a, b) => a.name.localeCompare(b.name));
        teachers.forEach(t => tempTeachers.push({text: t.name + " " + t.surname, value: t.id}));
        subjects.forEach(s => {
            if(!assignedSubjectsId.includes(s.id.toUpperCase())) tempSubjects.push({text: s.name, value: s.id})
        });
        setTeachersList(tempTeachers);
        setNotAsignedSubjects(tempSubjects)
    }, [teachersList.length, assignedSubjectsId, notAssignedSubjects, subjectStore, subjects, teachers, teachersList])    

    const commit = (values: {subjectId: string, teacherId: string, error: null}) => {
        const ds: DivisionSubject2 = {
            id: '',
            subjectId: values.subjectId,
            subjectName: notAssignedSubjects.filter(x => x.value === values.subjectId).at(0)?.text!,
            teacherName: teachersList.filter(x => x.value === values.teacherId).at(0)?.text!,
            teacherId: values.teacherId,
            divisionId: division.id
        }
       addDivisionSubject(ds)
    }

    return (
        <Formik 
            initialValues={{subjectId: '', teacherId: '', error: null}}
            onSubmit={(values, {setErrors}) => {commit(values); modalStore.closeModal()}}
            validationSchema={Yup.object({
                subjectId: Yup.string().required("Nauczyciel wymagany"),
                teacherId: Yup.string().required("Przedmiot wymagany")
            })}
        >
            {({handleSubmit, isSubmitting, isValid, dirty, errors}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h3' content='Dodaj przedmiot' textAlign="center"/>
                    <MySelectInput placeholder='Nauczyciel' name='teacherId' options={teachersList} />
                    <MySelectInput placeholder='Przedmiot' name='subjectId' options={notAssignedSubjects} />
                    <ErrorMessage
                        name='error'
                        render={() => <ValidationError errors={errors.error}/>}
                    />
                    <Button disabled={!isValid || !dirty || isSubmitting} content='Dodaj ' type='submit' fluid color="blue"/>
                </Form>
            )}
        </Formik>
    )
}