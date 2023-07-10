import { Header, Table } from 'semantic-ui-react';
import { Grade } from '../../app/models/grade';
import { Subject } from '../../app/models/subject';
import GradesTable from '../../app/layout/GradesTable';

interface Props {
    gradesBySubject: Map<string, Grade[][]>;
    subjects: Subject[];
}

export default function SubjectsAndGrades({
    gradesBySubject,
    subjects,
}: Props) {
    return (
        <Table celled striped>
            <Table.Body>
                {subjects.map((s) => (
                    <Table.Row key={s.id}>
                        <Table.Cell verticalAlign="middle">
                            <Header
                                as="h3"
                                content={s.name}
                                textAlign="center"
                            />
                        </Table.Cell>
                        <Table.Cell>
                            <GradesTable grades={gradesBySubject.get(s.name)} />
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
}
