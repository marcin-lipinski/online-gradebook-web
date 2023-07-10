import {
    Button,
    Card,
    Container,
    FormInput,
    Grid,
    GridColumn,
    Table
} from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Teacher } from '../../../app/models/teacher';
import { ChangeEvent, useEffect, useState } from 'react';
import NewTeacherForm from './NewTeacherForm';
import { observer } from 'mobx-react-lite';
import EditTeacher from './EditTeacher';
import DeleteTeacher from './DeleteTeacher';

export default observer(function TeachersDashboard() {
    const { teacherStore, modalStore } = useStore();
    const [displayedTeachers, setDisplayedTeachers] = useState<Teacher[][]>([]);
    const [inputValue, setInputValue] = useState('');
    const { teachers } = teacherStore;

    useEffect(() => sliceTryptyk(), [teachers.length]);

    if (teacherStore.loading)
        return <LoadingComponent content="Ładowanie listy nauczycieli..." />;

    function sliceTryptyk() {
        teachers.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname))
        const result: Teacher[][] = [];
        for (let i = 0; i < teachers.length; i += 2) {
            result.push(teachers.slice(i, i + 2));
        }
        setDisplayedTeachers(result);
    }

    const filterTeachers = (input: ChangeEvent<HTMLInputElement>) => {
        const value = input.target.value;
        setInputValue(value);
        if (input.target.value.length === 0) sliceTryptyk();
        else {
            const filteredTeachers: Teacher[] = teachers.filter(
                (x) => x.name?.includes(value) || x.surname?.includes(value)
            );
            const result: Teacher[][] = [];
            for (let i = 0; i < filteredTeachers.length; i += 2) {
                result.push(filteredTeachers.slice(i, i + 2));
            }
            setDisplayedTeachers(result);
        } 
    };

    if(teacherStore.loading) return <LoadingComponent content='Ładowanie listy nauczycieli...'/>

    return (
        <Container>
            <Grid columns={2}>
                <GridColumn >
                    <Button className='grade-button'
                        content="Dodaj nowego nauczyciela" 
                        onClick={() => modalStore.openModal(<NewTeacherForm />)}>
                        
                    </Button>
                </GridColumn >
                <GridColumn textAlign='right'>
                    <FormInput
                        placeholder="Wyszukaj"
                        value={inputValue}
                        onChange={filterTeachers}
                    />
                </GridColumn>
            </Grid>
            <Grid columns={2}>
                {displayedTeachers?.map((subgroup, index) => (
                    <Grid.Row key={index}>
                        {subgroup.map((teacher, index) => (
                            <Grid.Column key={index}>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>
                                            {teacher.name} {teacher.surname}
                                        </Card.Header>
                                        <Card.Description>
                                            {teacher.id}
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Table style={{border: "none"}}>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='edit-button'
                                                            onClick={() => modalStore.openModal( <EditTeacher teacherId={ teacher.id} teacherName={teacher.name}
                                                                                                            teacherSurname={ teacher.surname}/>)}
                                                            content="Edytuj"
                                                        />
                                                    </Table.Cell>
                                                    <Table.Cell width={2}></Table.Cell>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='remove-button'
                                                            onClick={() => modalStore.openModal(<DeleteTeacher teacherId={ teacher.id }/>)}
                                                            content="Usuń"
                                                        />
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        ))}
                    </Grid.Row>
                ))}
            </Grid>
        </Container>
    );
});
