import { Button, Card, Container, FormInput, Grid, GridColumn, Image, Table} from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { ChangeEvent, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Student } from '../../../app/models/student';
import DeleteStudent from './DeleteStudent';
import EditStudent from './EditStudent';
import NewStudentForm from './NewStudentForm';
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default observer(function StudentsDashboard() {
    const { modalStore, studentsStore, divisionStore } = useStore();
    const [displayedStudents, setDisplayedStudents] = useState<Student[][]>([]);
    const [inputValue, setInputValue] = useState('');
    const { students} = studentsStore;

    useEffect(() => {
        sliceTryptyk();
    }, [students.length]);

    function sliceTryptyk() {
        students.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname))
        const result: Student[][] = []; 
        for (let i = 0; i < students.length; i += 2) {
            result.push(students.slice(i, i + 2));
        }
        setDisplayedStudents(result);
    }

    const filterStudents = (input: ChangeEvent<HTMLInputElement>) => {
        const value = input.target.value;
        setInputValue(value);
        if (input.target.value.length === 0) sliceTryptyk();
        else {
            const filteredStudents: Student[] = students.filter(
                (x) => x.name?.includes(value) || x.surname?.includes(value)
            );
            const result: Student[][] = [];
            for (let i = 0; i < filteredStudents.length; i += 2) {
                result.push(filteredStudents.slice(i, i + 2));
            }
            setDisplayedStudents(result);
        }
    };

    if(studentsStore.loading) return <LoadingComponent content='Ładowanie listy uczniów...'/>

    return (
        <Container>
            <Grid columns={2}>
                <GridColumn>
                    <Button className='grade-button'
                        content="Dodaj nowego ucznia" 
                        onClick={() => modalStore.openModal(<NewStudentForm />)}>                        
                    </Button>
                </GridColumn>
                <GridColumn textAlign='right'>
                    <FormInput
                        placeholder="Wyszukaj"
                        value={inputValue}
                        onChange={filterStudents}
                    />
                </GridColumn>
            </Grid>
            <Grid columns={2}>
                {displayedStudents?.map((subgroup, index) => (
                    <Grid.Row key={index}>
                        {subgroup.map((student, index) => (
                            <Grid.Column key={index}>
                                <Card fluid >
                                    <Card.Content>
                                        <Image
                                            floated="right"
                                            size="tiny"
                                            src={studentsStore.parentDashboardIcon(
                                                student.name
                                            )}
                                        />
                                        <Card.Header>
                                            {student.name} {student.surname}
                                        </Card.Header>
                                        <Card.Meta>
                                            Klasa:{' '}
                                            {divisionStore.getDivisionName(
                                                student.divisionId
                                            )}
                                        </Card.Meta>
                                        <Card.Meta>Id: {student.id}</Card.Meta>
                                    </Card.Content>
                                    <Card.Content extra >                                        
                                        <Table style={{border: "none"}} >
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='edit-button'
                                                            onClick={() => modalStore.openModal( <EditStudent studentId={student.id} studentName={student.name}
                                                                                                            studentSurname={student.surname} divisionId={student.divisionId}/>)}
                                                            content="Edytuj"
                                                        />
                                                    </Table.Cell>
                                                    <Table.Cell width={2}></Table.Cell>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='remove-button'
                                                            onClick={() => modalStore.openModal( <DeleteStudent studentId={ student.id}/>)}
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
