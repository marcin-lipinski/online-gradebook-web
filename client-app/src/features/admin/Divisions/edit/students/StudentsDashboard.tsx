import { Card, FormInput, Grid, Segment } from "semantic-ui-react";
import { useStore } from "../../../../../app/stores/store";
import { ChangeEvent, useEffect, useState } from "react";
import { Division } from "../../../../../app/models/division";
import { Student } from "../../../../../app/models/student";
import LoadingComponent from "../../../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";

interface Props {
    division: Division
}

export default observer(function StudentDashboard({division}: Props) {
    const {studentsStore} = useStore();
    const [displayedStudents, setDisplayedStudents] = useState<Student[][]>([]);
    const [inputValue, setInputValue] = useState('');
    const {students, loading, loadByDivisionId} = studentsStore;

    useEffect( () => {
        loadByDivisionId(division.id);
        const result: Student[][] = [];
        students.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname));
        for(let i = 0; i < students.length; i+=2) {
            result.push(students.slice(i, i + 2));
        }
        setDisplayedStudents(result);
    }, [division.id, loadByDivisionId, students.length])

    const filterStudents = (input: ChangeEvent<HTMLInputElement>) => {
        const value = input.target.value
        setInputValue(value);
        if(input.target.value.length !== 0) {
            const filteredStudents: Student[] = students.filter((x) => x.name?.toUpperCase().includes(value.toUpperCase()) || x.surname?.toUpperCase().includes(value.toUpperCase()));
            filteredStudents.sort((a, b) => (a.name + a.surname).localeCompare(b.name + b.surname));
            const result: Student[][] = [];
            for(let i = 0; i < filteredStudents.length; i+=2) {
                result.push(filteredStudents.slice(i, i + 2));
            }
            setDisplayedStudents(result);
        }
    }

    if(loading) return <LoadingComponent content={`Ładowanie listy uczniów klasy ${division.name}...`}/>

    return (
        <Segment basic style={{paddingTop: "0px", marginTop: "0px"}}>
            <Grid columns={1} >
                <Grid.Column textAlign="right">
                    <FormInput placeholder="Wyszukaj" value={inputValue} onChange={filterStudents}/>
                </Grid.Column>
            </Grid>
            <Grid columns={2}>
                {displayedStudents?.map(subgroup => (
                    <Grid.Row>
                        {subgroup.map(student =>
                            <Grid.Column>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>{student.name} {student.surname}</Card.Header>
                                        <Card.Description>Id: {student.id}</Card.Description>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        )}
                    </Grid.Row>                        
                ))}
            </Grid>
        </Segment>
    )
})