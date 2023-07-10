import {
    Button,
    Card,
    Container,
    FormInput,
    Grid,
    GridColumn,
    Image,
    Table,
} from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { ChangeEvent, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Parent } from '../../../app/models/parent';
import NewParentForm from './NewParentForm';
import EditParent from './EditParent';
import DeleteParent from './DeleteParent';

export default observer(function ParentsDashboard() {
    const { parentsStore, modalStore, studentsStore, divisionStore } = useStore();
    const [displayedParents, setDisplayedParents] = useState<Parent[][]>([]);
    const [inputValue, setInputValue] = useState('');
    const { parents } = parentsStore;

    useEffect(() => sliceTryptyk(), [parents.length]);

    function sliceTryptyk() {
        const result: Parent[][] = [];
        parents.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname))
        for (let i = 0; i < parents.length; i += 2) {
            result.push(parents.slice(i, i + 2));
        }
        setDisplayedParents(result);
    }

    const filterParents = (input: ChangeEvent<HTMLInputElement>) => {
        const value = input.target.value;
        setInputValue(value);
        if (input.target.value.length === 0) sliceTryptyk();
        else {
            const filteredParents: Parent[] = parents.filter(
                (x) => x.name?.includes(value) || x.surname?.includes(value)
            );
            const result: Parent[][] = [];
            for (let i = 0; i < filteredParents.length; i += 2) {
                result.push(filteredParents.slice(i, i + 2));
            }
            setDisplayedParents(result);
        }
    };

    if(parentsStore.loading || studentsStore.loading || divisionStore.loading) return <LoadingComponent content='Ładowanie listy rodziców...'/>

    return (
        <Container>
            <Grid columns={2}>
                <GridColumn>
                    <Button className='grade-button'
                        content="Dodaj nowego rodzica" 
                        onClick={() => modalStore.openModal(<NewParentForm />)}>                        
                    </Button>
                </GridColumn>
                <GridColumn textAlign='right'>
                    <FormInput
                        placeholder="Wyszukaj"
                        value={inputValue}
                        onChange={filterParents}
                    />
                </GridColumn>
            </Grid>
            <Grid columns={2}>
                {displayedParents?.map((subgroup, index) => (
                    <Grid.Row key={index}>
                        {subgroup.map((parent, index) => (
                            <Grid.Column key={index}>
                                <Card fluid>
                                    <Card.Content>
                                        <Image
                                            floated="right"
                                            size="tiny"
                                            src={parentsStore.parentDashboardIcon(
                                                parent.name
                                            )}
                                        />
                                        <Card.Header>
                                            {parent.name} {parent.surname}
                                        </Card.Header>
                                        <Card.Meta>
                                            Uczeń:{' '}
                                            {
                                                studentsStore.getStudentById(
                                                    parent.studentId
                                                )?.name
                                            }{' '}
                                            {
                                                studentsStore.getStudentById(
                                                    parent.studentId
                                                )?.surname
                                            }
                                        </Card.Meta>
                                        <Card.Meta>
                                            Klasa:{' '}
                                            {divisionStore.getDivisionName(
                                                studentsStore.getStudentById(
                                                    parent.studentId
                                                )?.divisionId
                                            )}
                                        </Card.Meta>
                                        <Card.Meta>
                                            Id: {parent.id}
                                        </Card.Meta>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Table style={{border: "none"}}>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='edit-button'
                                                            onClick={() => modalStore.openModal( <EditParent parentId={parent.id} parentName={parent.name}
                                                                                                            parentSurname={parent.surname} studentId={parent.studentId}/>)}
                                                            content="Edytuj"
                                                        />
                                                    </Table.Cell>
                                                    <Table.Cell width={2}></Table.Cell>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='remove-button'
                                                            onClick={() => modalStore.openModal( <DeleteParent parentId={parent.id}/>)}
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
