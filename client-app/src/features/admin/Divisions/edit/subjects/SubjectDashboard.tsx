import { useState, useEffect, ChangeEvent } from "react";
import { useStore } from "../../../../../app/stores/store";
import { Button, Card, FormInput, Grid, Segment, Table } from "semantic-ui-react";
import { Division } from "../../../../../app/models/division";
import { DivisionSubject2 } from "../../../../../app/stores/divisionSubjectsStore";
import { observer } from "mobx-react-lite";
import AddSubject from "./AddSubject";
import LoadingComponent from "../../../../../app/layout/LoadingComponent";
import EditSubject from "./EditSubject";
import DeleteSubject from "./DeleteSubject";

interface Props {
    division: Division
}

export default observer(function SubjectDashboard({division}: Props) {
    const {modalStore, divisionSubjectStore} = useStore();
    const [displayedSubjects, setDisplayedSubjects] = useState<DivisionSubject2[][]>([]);
    const [inputValue, setInputValue] = useState('');
    const {subjectsByDivisionId, loadSubjectsByDivisionId, loading} = divisionSubjectStore;

    useEffect( () => {
        loadSubjectsByDivisionId(division.id);
        sliceTryptyk();
    }, [subjectsByDivisionId.length])

    function sliceTryptyk () {
        const result: DivisionSubject2[][] = [];
        subjectsByDivisionId.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
        for(let i = 0; i < subjectsByDivisionId.length; i+=2) {
            result.push(subjectsByDivisionId.slice(i, i + 2));
        }
        setDisplayedSubjects(result);
    }

    const filterSubjects = (input: ChangeEvent<HTMLInputElement>) => {
        const value = input.target.value
        setInputValue(value);
        if(input.target.value.length === 0) sliceTryptyk();
        else {
            const filteredSubjects: DivisionSubject2[] = subjectsByDivisionId.filter(x => x.subjectName?.toUpperCase().includes(value.toUpperCase()));
            filteredSubjects.sort((a, b) => a.subjectName.localeCompare(b.subjectName));
            const result: DivisionSubject2[][] = [];
            for(let i = 0; i < filteredSubjects.length; i+=2) {
                result.push(filteredSubjects.slice(i, i + 2));
            }
            setDisplayedSubjects(result);
        }
    }

    if(loading) return <LoadingComponent content={`Ładowanie listy przedmiotów klasy ${division.name}`}/>

    return (
        <Segment basic style={{paddingTop: "0px", marginTop: "0px"}}>
            <Grid columns={2}>
                <Grid.Column textAlign="left">
                    <Button className='grade-button'
                        content="Dodaj przedmiot" 
                        onClick={() => modalStore.openModal(<AddSubject division={division} assignedSubjectsId={[...subjectsByDivisionId.map(x => x.subjectId)]}/>)}>                        
                    </Button>
                </Grid.Column>
                <Grid.Column textAlign="right">
                    <FormInput placeholder="Wyszukaj" value={inputValue} onChange={filterSubjects}/>
                </Grid.Column>
            </Grid>
            <Grid columns={2}>
                {displayedSubjects?.map(subgroup => (
                    <Grid.Row>
                        {subgroup.map(subject =>
                            <Grid.Column>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>{subject.subjectName}</Card.Header>
                                        <Card.Description>Id: {subject.id}</Card.Description>
                                        <Card.Description>Nauczyciel: {subject.teacherName}</Card.Description>
                                    </Card.Content>
                                    <Card.Description>
                                        <Card.Content extra>
                                            <Table style={{border: "none"}}>
                                            <Table.Row>
                                                <Table.Cell width={7}>
                                                    <Button
                                                        className='edit-button'
                                                        onClick={() => modalStore.openModal(
                                                            <EditSubject subject = {subject}/>)}
                                                        content="Edytuj"
                                                    />
                                                </Table.Cell>
                                                <Table.Cell width={2}></Table.Cell>
                                                <Table.Cell width={7}>
                                                    <Button
                                                        className='remove-button'
                                                        onClick={() => modalStore.openModal(<DeleteSubject subject={subject}/>)}
                                                        content="Usuń"
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table>
                                        </Card.Content>  
                                    </Card.Description>
                                </Card>
                            </Grid.Column>
                        )}
                    </Grid.Row>                        
                ))}
            </Grid>
        </Segment>
    )
})