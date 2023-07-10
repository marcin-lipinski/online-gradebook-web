import { Header, Label, Popup, Table } from 'semantic-ui-react';
import { Grade } from '../../app/models/grade';
import { useStore } from '../../app/stores/store';

interface Props {
    grade: Grade;
}

export default function GradePopup({ grade }: Props) {
    const { gradesStore } = useStore();
    const { gradeTypeToNumber, gradeWeightToNumber } = gradesStore;

    return (
        <Popup
            className="gradepopup"
            trigger={
                <Label
                    size="big"
                    style={{
                        backgroundColor: gradeWeightToNumber(grade.gradeWeight),
                    }}
                    circular
                    content={gradeTypeToNumber(grade.gradeType)}
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
                                {gradeTypeToNumber(grade.gradeType)}
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
        </Popup>
    );
}
