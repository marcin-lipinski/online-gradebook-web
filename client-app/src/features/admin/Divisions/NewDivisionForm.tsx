import { ErrorMessage, Form, Formik } from "formik";
import { Button, Grid, Header, Icon, Segment, Table } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MySelectInput from "../../../app/common/form/MySelectInput";
import ValidationError from "../../teacher/ValidationError";
import * as Yup from 'yup';
import { useStore } from "../../../app/stores/store";
import {useState, useEffect} from 'react';

interface Props {
    returnFunction: (value: boolean) => void
}

export interface NewDivision {
    id: string,
    name: string,
    supervisingTeacherId: string,
    supervisingTeacherName: string,
    subjects: {subjectId: string, teacherId: string}[],
}

export default function NewDivisionForm({returnFunction}: Props) {
    const {divisionStore, teacherStore, subjectStore} = useStore();
    const [newDivisionObject] = useState<NewDivision>({id: '', name: '', supervisingTeacherId: '', subjects: [], supervisingTeacherName: ''});
    const {teachers} = teacherStore;
    const {subjects} = subjectStore;
    const [teachersList, setTeachersList] = useState<{text: string, value: string}[]>([]);
    const [supervisingList, setSupervisingList] = useState<{text: string, value: string}[]>([]);
    const [subjectList, setSubjectList] = useState<{text: string, value: string}[]>([]);
    const [submitAddSubject, setSubmitAddSubject] = useState<boolean>(true);

    useEffect( () => {
        if(teachers.length > 0) createOpitons();
    }, [teachers.length, newDivisionObject, subjects]);

    function createOpitons(){
        const tempTeachers: {text: string, value: string}[] = [];
        teachers.forEach(t => tempTeachers.push({text: t.name + " " + t.surname, value: t.id}));
        tempTeachers.sort((a, b) => a.text.localeCompare(b.text));
        setTeachersList(tempTeachers);
        setSupervisingList(tempTeachers);

        const tempSubjects: {text: string, value: string}[] = [];
        subjects.forEach(s => tempSubjects.push({text: s.name, value: s.id}));
        tempSubjects.sort((a, b) => a.text.localeCompare(b.text));
        setSubjectList(tempSubjects);
    }

    function addSubjectToList (values: {teacherId: string, subjectId: string}) {
        newDivisionObject?.subjects.push(values);
        var tempSubjects = subjectList.filter(x => x.value !== values.subjectId)
        tempSubjects.sort((a, b) => a.text.localeCompare(b.text));
        setSubjectList(tempSubjects);
        setSubmitAddSubject(true);
    };

    function deleteSubjectFromList (subjectId: string, teacherId: string) {
        const tempSubject = subjects.find(s => s.id === subjectId);
        newDivisionObject!.subjects = newDivisionObject!.subjects.filter(x => x.subjectId !== subjectId);
        subjectList.push({text: tempSubject!.name, value: tempSubject!.id})
        subjectList.sort((a, b) => a.text.localeCompare(b.text));
        setSubjectList([...subjectList])
    };

    return (
        <>
            <Header onClick={() => returnFunction(false)} style={{cursor: 'pointer', color: "rgb(64, 95, 194)"}} content="Powrót"/>
            <Header content="Lista przedmiotów" textAlign="center"/>  
                <Formik
                    initialValues={{ teacherId: '', subjectId: ''}}
                    onSubmit={values => {addSubjectToList(values); }}
                    validationSchema={Yup.object({
                        teacherId: Yup.string().required("Pole wymagane"),
                        subjectId: Yup.string().required("Pole wymagane")
                    })}>
                    {({ handleSubmit, isValid, dirty, errors }) => (
                        <Form className="ui form" onSubmit={handleSubmit} autoComplete="off" >
                            <Grid columns={2}>
                                <Grid.Row>
                                    <Grid.Column width={1} />
                                    <Grid.Column width={14} style={{paddingTop: "0px", margin: "0px"}}>
                                        <MySelectInput
                                            placeholder="Przedmiot"
                                            options={subjectList}
                                            name="subjectId"
                                            submit={submitAddSubject}
                                            setSubmit={setSubmitAddSubject}
                                        />
                                        <MySelectInput
                                            placeholder="Nauczyciel"
                                            options={teachersList}
                                            name="teacherId"
                                            submit={submitAddSubject}
                                            setSubmit={setSubmitAddSubject}
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={1} style={{padding: "5px 0px 0px 0px"}} >
                                        <Button disabled={!isValid || !dirty} type="submit" style={{padding: "10px", height: "100%"}} color="green">
                                                <Icon name="add" style={{padding: "0px", margin: "0px"}} inverted/>
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={1}/>
                                    <Grid.Column width={14}>
                                    {newDivisionObject.subjects.length > 0 ? 
                                        <Segment basic style={{border: "none", padding: "0px", margin: "0px"}}>
                                            {newDivisionObject?.subjects.map(x => (
                                                <Table >
                                                    <Table.Row >
                                                        <Table.Cell width={4}>
                                                            <Header as='h4' content="Nauczyciel: "/>
                                                            {teachers.find(t => t.id === x.teacherId)?.name + " " + teachers.find(t => t.id === x.teacherId)?.surname}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="left">
                                                            <Header as='h4' content="Przedmiot: " textAlign="left"/>
                                                            {subjects.find(t => t.id === x.subjectId)?.name}
                                                        </Table.Cell>
                                                        <Table.Cell textAlign="right">
                                                            <Button onClick={() => deleteSubjectFromList(x.subjectId, x.teacherId)} style={{padding: "10px", backgroundColor: "rgb(238, 81, 81)"}} circular >
                                                                <Icon name="trash alternate" style={{padding: "0px", margin: "0px"}} inverted/>
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table>
                                            ))}
                                        </Segment>
                                        : <></>}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>)}
                </Formik>
                
            <Header as="h3" content="Szczegóły klasy" color="black" textAlign="center" />
            <Formik initialValues={{ id: '', name: '', supervisingTeacherId: '', studentId: '', error: null, }}
                onSubmit={(values, { setErrors }) => { 
                    newDivisionObject.name = values.name;
                    newDivisionObject.supervisingTeacherId = values.supervisingTeacherId;
                    const teacher = teachers.find(t => t.id === values.supervisingTeacherId);
                    newDivisionObject.supervisingTeacherName = teacher?.name + " " + teacher?.surname;
                    divisionStore.addDivision(newDivisionObject).catch((error) => setErrors({ error }));
                    returnFunction(false);
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required().min(2, 'Nazwa zbyt krótka!'),
                    supervisingTeacherId: Yup.string().required("Podaj wychowawcę!")
                })}>
            {({ handleSubmit, isSubmitting, isValid, dirty, errors }) => (
                <Form className="ui form" onSubmit={handleSubmit} autoComplete="off" >
                    <Grid columns={14} centered>
                        <Grid.Row>
                            <Grid.Column width={14}>
                            <MyTextInput placeholder="Nazwa" name="name" />
                            <MySelectInput placeholder="Wychowawca" name="supervisingTeacherId" options={supervisingList} />                                 
                            <ErrorMessage name="error" render={() => <ValidationError errors={errors.error} />} />
                            <Button color="green"
                                disabled={!isValid || !dirty || isSubmitting}
                                content="Dodaj " type="submit" fluid 
                            />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    
                </Form>
            )}
            </Formik>
            
        </>
    )
}