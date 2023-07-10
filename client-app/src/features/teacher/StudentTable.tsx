import { Button, Header, Label, Popup, Table} from 'semantic-ui-react';
import { DivisionSubject } from '../../app/models/divisonSubject';
import { useEffect } from 'react';
import { useStore } from '../../app/stores/store';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';
import DeleteGrade from './DeleteGrade';
import NewGradeForm from './NewGradeForm';
import NewGradeSerialForm from './NewGradeSerialForm';

interface Props {
    divisionSubject: DivisionSubject | undefined;
    handleItemClick: (s: string) => void;
}

export default observer(function StudentTable({ divisionSubject, handleItemClick}: Props) {
    const { gradesStore, modalStore } = useStore();
    const { loading, loadGradesByDivisionAndSubject } = gradesStore;

    useEffect(() => {
        loadGradesByDivisionAndSubject(divisionSubject!.id);
    }, []);

    if (loading) return  <LoadingComponent content={`Ładuję oceny klasy ${divisionSubject?.divisionName}...`} />        

    return (
        <>
            <Header onClick={() => handleItemClick('divisions')} style={{cursor: 'pointer', color: "rgb(64, 95, 194)"}} content="Powrót"/>
            <Table celled striped>
                <Table.Body>
                    <Table.Row >
                        <Table.Cell textAlign='center' colSpan={2}>
                            <Header content={`${divisionSubject?.subjectName} w klasie ${divisionSubject?.divisionName}`} as="h3"/>
                        </Table.Cell>
                        <Table.Cell textAlign='center' style={{borderLeft: "none"}}>
                            <Button className='grade-button'
                                onClick={() =>
                                    modalStore.openModal(
                                        <NewGradeSerialForm
                                            studentList={
                                                divisionSubject!.studentList
                                            }
                                            subjectName={
                                                divisionSubject!.subjectName
                                            }
                                            subjectId={divisionSubject!.id}
                                        />
                                    )
                                }
                            >
                                Dodaj oceny seryjnie
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                    {divisionSubject?.studentList.map((s) => (
                        <Table.Row key={s.id}>
                            <Table.Cell verticalAlign="middle">
                                <Header
                                    as="h3"
                                    content={`${s.name} ${s.surname}`}
                                    textAlign="center"
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <>
                                    {gradesStore.gradesDivisionSubject.get(s.id) ? (
                                        gradesStore.gradesDivisionSubject.get(s.id)!.map((subgroup, index) => (
                                                <Table columns="10" basic="very" key={index}>
                                                    <Table.Body>
                                                        <Table.Row>
                                                            {subgroup.map((grade) => (
                                                                <Table.Cell textAlign="center" key={ grade.id } style={{border: 'none'}} >
                                                                    <Popup hoverable name={ grade.id} on="hover" pinned 
                                                                        trigger={
                                                                            <Label
                                                                                size="big" style={{ backgroundColor: gradesStore.gradeWeightToNumber(grade.gradeWeight)}}
                                                                                circular content={gradesStore.gradeTypeToNumber( grade.gradeType)}
                                                                            />
                                                                        }
                                                                    >
                                                                        <Header as="h3" textAlign="left">
                                                                            <Table style={{border: "none"}}>
                                                                                <Table.Body>
                                                                                    <Table.Row >
                                                                                        <Table.Cell style={{padding: "2px 20px 5px 0px", border: "none"}}>
                                                                                            Ocena:
                                                                                        </Table.Cell>
                                                                                        <Table.Cell style={{fontWeight: "normal", padding: "0px", border: "none"}}>
                                                                                            {gradesStore.gradeTypeToNumber(grade.gradeType)}
                                                                                        </Table.Cell>
                                                                                    </Table.Row>
                                                                                    <Table.Row >
                                                                                        <Table.Cell style={{padding: "2px 10px 5px 0px", border: "none"}}>
                                                                                            Waga:
                                                                                        </Table.Cell>
                                                                                        <Table.Cell style={{fontWeight: "normal", padding: "0px", border: "none"}}>
                                                                                            {grade.gradeWeight}
                                                                                        </Table.Cell>
                                                                                    </Table.Row>
                                                                                    <Table.Row >
                                                                                        <Table.Cell style={{padding: "2px 10px 5px 0px", border: "none"}}>
                                                                                            Opis:
                                                                                        </Table.Cell>
                                                                                        <Table.Cell style={{fontWeight: "normal", padding: "0px", border: "none"}}>
                                                                                            {grade.description}
                                                                                        </Table.Cell>
                                                                                    </Table.Row>
                                                                                </Table.Body>
                                                                            </Table>
                                                                        </Header>
                                                                        <Header textAlign='center'>
                                                                            <Button color='red' inverted
                                                                                onClick={() => { modalStore.openModal(<DeleteGrade gradeId={grade.id} studentId={s.id}/>);}}
                                                                                content="Usuń"
                                                                                >
                                                                            </Button>
                                                                        </Header>
                                                                    </Popup>
                                                                </Table.Cell>
                                                                )
                                                            )}
                                                            {Array(Math.abs(subgroup.length - 10)).fill(0).map((val, index) => (
                                                                    <Table.Cell style={{ border: 'none'}} key={index}>
                                                                        <Label style={{ backgroundColor: 'transparent'}}/>
                                                                    </Table.Cell>
                                                                ))}
                                                        </Table.Row>
                                                    </Table.Body>
                                                </Table>
                                            ))
                                    ) : (
                                        <></>
                                    )}
                                </>
                            </Table.Cell>
                            <Table.Cell textAlign='center' style={{borderLeft: "none"}}>
                                <Button className='grade-button'
                                    onClick={() =>
                                        modalStore.openModal(
                                            <NewGradeForm
                                                student={s}
                                                subjectName={
                                                    divisionSubject.subjectName
                                                }
                                                subjectId={divisionSubject.id}
                                            />
                                        )
                                    }
                                >
                                    Dodaj ocenę
                                </Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    );
});
