import { Button, Header, Table } from "semantic-ui-react";
import { Division } from "../../../../../app/models/division";
import {useState, useEffect} from "react";
import MyTextInput from "../../../../../app/common/form/MyTextInput";
import { ErrorMessage, Formik } from "formik";
import * as Yup from 'yup';
import { Form } from "react-router-dom";
import ValidationError from "../../../../teacher/ValidationError";
import { useStore } from "../../../../../app/stores/store";
import MySelectInput from "../../../../../app/common/form/MySelectInput";
import { observer } from "mobx-react-lite";

interface Props {
    division: Division
}

export default observer(function GeneralDashboard({division}: Props) {
    const [supervisingTeacher, setSupervisingTeacher] = useState(division.supervisingTeacherName);
    const {divisionStore, teacherStore} = useStore();
    const mappedTeachers: {text: string, value: string}[] = []

    useEffect(() => {
        teacherStore.teachers.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname));
        teacherStore.teachers.forEach(t => {
            mappedTeachers.push({text: t.name + " " + t.surname, value: t.id})
        })
        let currentSupervisor = mappedTeachers.findIndex(t => t.value === division.supervisingTeacherId);
        mappedTeachers.splice(currentSupervisor, 1);
    }, [teacherStore.teachers.length])

    return (
        <>            
            <Table style={{border: "none"}}>
                <Table.Row>
                    <Table.Cell>
                        <Header as="h3" content="Wychowawca: "></Header>
                    </Table.Cell>
                    <Table.Cell>
                        <Header as="h3" style={{fontWeight: "normal"}} content={supervisingTeacher}></Header>
                    </Table.Cell>
                    <Table.Cell>
                        <Formik 
                            initialValues={{teacherId: '', error: null}}
                            onSubmit={(values, {setErrors}) => {divisionStore.editSupervisor(division, values)}}
                            validationSchema={Yup.object({
                                teacherId: Yup.string().required("Nazwa klasy nie może być pusta").min(2, "Nazwa klasy zbyt krótka")
                            })}
                        >
                            {({handleSubmit, isSubmitting, isValid, dirty, errors}) => (
                                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                    <MySelectInput placeholder='Wychowawca' name='teacherId' options={mappedTeachers} />
                                    <ErrorMessage
                                        name='error'
                                        render={() => <ValidationError errors={errors.error}/>}
                                    />
                                    <Button disabled={!isValid || !dirty || isSubmitting} content='Zmień ' type='submit' fluid color="blue"/>
                                </Form>
                            )}
                        </Formik>
                    </Table.Cell>
                </Table.Row>

                <Table.Row>
                    <Table.Cell width={5} style={{border: "none"}}>
                        <Header as="h3" content="Nazwa klasy: "></Header>
                    </Table.Cell>
                    <Table.Cell style={{border: "none"}}>
                        <Header as="h3" style={{fontWeight: "normal"}} content={division.name}></Header>
                    </Table.Cell>
                    <Table.Cell textAlign="left" style={{border: "none"}}>
                        <Formik 
                            initialValues={{name: '', error: null}}
                            onSubmit={(values, {setErrors}) => {divisionStore.editName(division, values)}}
                            validationSchema={Yup.object({
                                name: Yup.string().required("Nazwa klasy nie może być pusta").min(2, "Nazwa klasy zbyt krótka")
                            })}
                        >
                            {({handleSubmit, isSubmitting, isValid, dirty, errors}) => (
                                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                                    <MyTextInput placeholder='Nazwa' name='name' />
                                    <ErrorMessage
                                        name='error'
                                        render={() => <ValidationError errors={errors.error}/>}
                                    />
                                    <Button disabled={!isValid || !dirty || isSubmitting} content='Zmień ' type='submit' fluid color="blue"/>
                                </Form>
                            )}
                        </Formik>
                    </Table.Cell>
                </Table.Row>
            </Table>
        </>
    )
})