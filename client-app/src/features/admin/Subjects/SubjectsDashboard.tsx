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
import { Subject } from '../../../app/models/subject';
import { ChangeEvent, useEffect, useState } from 'react';
import NewSubjectForm from './NewSubjectForm';
import { observer } from 'mobx-react-lite';
import DeleteSubject from './DeleteSubject';
import EditSubject from './EditSubject';

export default observer(function SubjectsDashboard() {
    const { subjectStore, modalStore } = useStore();
    const [displayedSubjects, setDisplayedSubjects] = useState<Subject[][]>([]);
    const [inputValue, setInputValue] = useState('');
    const { subjects } = subjectStore;

    useEffect(() => sliceTryptyk(), [subjects.length]);

    if (subjectStore.loading) return <LoadingComponent content="Ładowanie przedmiotów..." />;

    function sliceTryptyk() {
        subjects.sort((a, b) => a.name.localeCompare(b.name));
        const result: Subject[][] = [];
        for (let i = 0; i < subjects.length; i += 3) {
            result.push(subjects.slice(i, i + 3));
        }
        setDisplayedSubjects(result);
    }

    const filterSubjects = (input: ChangeEvent<HTMLInputElement>) => {
        const value = input.target.value;
        setInputValue(value);
        if (input.target.value.length === 0) sliceTryptyk();
        else {
            const filteredSubjects: Subject[] = subjects.filter((x) =>
                x.name.includes(value)
            );
            const result: Subject[][] = [];
            for (let i = 0; i < filteredSubjects.length; i += 3) {
                result.push(filteredSubjects.slice(i, i + 3));
            }
            setDisplayedSubjects(result); 
        }
    };

    if(subjectStore.loading) return <LoadingComponent content='Ładowanie listy przedmiotów...'/>

    return ( 
        <Container>
            <Grid columns={2}>
                <GridColumn>
                    <Button className='grade-button'
                        content="Dodaj nowy przedmiot" 
                        onClick={() => modalStore.openModal(<NewSubjectForm />)}>                        
                    </Button>
                </GridColumn>
                <GridColumn textAlign='right'>
                    <FormInput
                        placeholder="Wyszukaj"
                        value={inputValue}
                        onChange={filterSubjects}
                    />
                </GridColumn>
            </Grid>
            <Grid columns={3}>
                {displayedSubjects?.map((subgroup, index) => (
                    <Grid.Row key={index}>
                        {subgroup.map((subject, index) => (
                            <Grid.Column key={index}>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>
                                            {subject.name}
                                        </Card.Header>
                                        <Card.Description>
                                            {subject.id}
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Table style={{border: "none"}}>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='edit-button'
                                                            onClick={() => modalStore.openModal( <EditSubject subjectId={subject.id} subjectName={subject.name}/>)}
                                                            content="Edytuj"
                                                        />
                                                    </Table.Cell>
                                                    <Table.Cell width={2}></Table.Cell>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='remove-button'
                                                            onClick={() => modalStore.openModal( <DeleteSubject subjectId={subject.id }/>)}
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
