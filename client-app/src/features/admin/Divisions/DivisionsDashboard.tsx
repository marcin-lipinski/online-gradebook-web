import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Container, FormInput, Grid, GridColumn, Table } from "semantic-ui-react";
import { Division } from "../../../app/models/division";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import NewDivisionForm from "./NewDivisionForm";
import EditDivision from "./edit/EditDivision";
import DeleteDivision from "./DeleteDivision";
import { observer } from "mobx-react-lite";

export default observer(function DivisionsDashboard() {
  const {subjectStore, modalStore, divisionStore} = useStore();
  const [displayedDivisions, setDisplayedDivisions] = useState<Division[][]>([]);
  const [inputValue, setInputValue] = useState('');
  const {divisions} = divisionStore;
  const [selectedDivision, setSelectedDivision] = useState<Division | null>()
  const [doCreating, setDoCreating] = useState<boolean>(false)

  useEffect(() => {
    divisions.sort((a, b) => a.name.localeCompare(b.name));
    sliceTryptyk()
    },[divisions.length, selectedDivision, doCreating]);

  if(subjectStore.loading) return <LoadingComponent content="Ładowanie klas..."/>


  function sliceTryptyk () {
      const result: Division[][] = [];
      for(let i = 0; i < divisions.length; i+=3) {
          result.push(divisions.slice(i, i + 3));
      }
      setDisplayedDivisions(result);
  }

  const filterSubjects = (input: ChangeEvent<HTMLInputElement>) => {
    const value = input.target.value;
    setInputValue(value);
    if(input.target.value.length === 0) sliceTryptyk();
    else {
          const filteredSubjects: Division[] = divisions.filter((x) => x.name.includes(value));
          filteredSubjects.sort((a, b) => a.name.localeCompare(b.name));
          const result: Division[][] = [];
          for(let i = 0; i < filteredSubjects.length; i+=3) {
              result.push(filteredSubjects.slice(i, i + 3));
          }
          setDisplayedDivisions(result);
      }
    }

    const changeBoard = (subgroupIndex: number, divisionIndex: number) => {
      setSelectedDivision(displayedDivisions[subgroupIndex][divisionIndex]);
    }

    return (
      <>
        {selectedDivision != null ? <EditDivision division={selectedDivision} returnFunction={setSelectedDivision}/> :
            (doCreating ? <NewDivisionForm returnFunction={setDoCreating}/> :  
        <Container>
            <Grid columns={2}>
                <GridColumn >
                    <Button className='grade-button'
                        content="Dodaj nową klasę" 
                        onClick={() => setDoCreating(true)}>                        
                    </Button>
                </GridColumn>
                <GridColumn textAlign='right'>
                    <FormInput placeholder="Wyszukaj" value={inputValue} onChange={filterSubjects}/>
                </GridColumn>
            </Grid>
            <Grid columns={3}>
                {displayedDivisions?.map((subgroup, subgroupIndex) => (
                    <Grid.Row key={subgroupIndex}>
                        {subgroup.map((division, divisionIndex) =>
                            <Grid.Column key={divisionIndex}>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>{division.name}</Card.Header>
                                        <Card.Description>{division.id}</Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Table style={{border: "none"}}>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='edit-button'
                                                            onClick={() => changeBoard(subgroupIndex, divisionIndex)}
                                                            content="Edytuj"
                                                        />
                                                    </Table.Cell>
                                                    <Table.Cell width={2}></Table.Cell>
                                                    <Table.Cell width={7}>
                                                        <Button
                                                            className='remove-button'
                                                            onClick={() => modalStore.openModal(<DeleteDivision division={division}/>)}
                                                            content="Usuń"
                                                        />
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        )}
                    </Grid.Row>                        
                ))}
            </Grid>
        </Container>
        )}
      </>
  )
})