import { Label, Table } from 'semantic-ui-react';
import { Grade } from '../../app/models/grade';
import GradePopup from '../../features/students/GradePopup';

interface Props {
    grades: Grade[][] | undefined;
}

export default function GradesTable({ grades }: Props) {
    return (
        <>
            {grades ? (
                grades.map((subgroup, index) => (
                    <Table columns="10" basic="very" key={index}>
                        <Table.Body>
                            <Table.Row>
                                {subgroup.map((grade, index) => (
                                    <Table.Cell
                                        textAlign="center"
                                        style={{ border: 'none' }}
                                        key={index}
                                    >
                                        <GradePopup grade={grade} />
                                    </Table.Cell>
                                ))}
                                {Array(Math.abs(subgroup.length - 10))
                                    .fill(0)
                                    .map((val, index) => (
                                        <Table.Cell style={{ border: 'none' }} key={index}>
                                            <Label
                                                style={{
                                                    backgroundColor:
                                                        'transparent',
                                                }}
                                            />
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
    );
}
